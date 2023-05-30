import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Filter, StaticJsonRpcProvider } from '@ethersproject/providers';
import { ApprovalService } from 'src/approvals/service';
import { MetadataService } from 'src/metadata/service';
import {
  ApprovalDateUpdate,
  ERC20UpdateParam,
  EventKind,
  EventStore,
  FilteredEvent,
  FilteredEventBatch,
} from 'src/types';
import { getDataSources } from './ds';
import { DsHandler } from './handler';
import { ConfigService } from '@nestjs/config';
import { AccountService } from 'src/accounts/service';
import { ERC20__factory } from 'src/abis/types';
import { JsonRpcProvider } from '@ethersproject/providers';

const BLOCK_WAIT_INTERVAL = 50; //50 seconds
const BLOCK_BATCH = 10000;
const SYNC_INTERVAL = 60;
// const EVERY_HOUR = 3600000;

@Injectable()
export class DsProcessorService {
  protected logger = new Logger(DsProcessorService.name);

  private latestBlockHeight: number;
  private latestProcessedHeight: number;
  private batchSize: number;
  private blockNumbers: number[];
  private erc20Contracts: string[];

  constructor(
    private approvalService: ApprovalService,
    private metadataService: MetadataService,
    private accountService: AccountService,
    private config: ConfigService,
  ) {
    this.batchSize = BLOCK_BATCH;
    this.blockNumbers = [];
    this.erc20Contracts = [];
  }

  staticProvider = new StaticJsonRpcProvider(
    { url: this.config.get<string>('HTTP_RPC_URL') },
    {
      chainId: Number(this.config.get<number>('CHAIN_ID')),
      name: this.config.get<string>('CHAIN_NAME'),
    },
  );

  provider = new JsonRpcProvider(this.config.get<string>('HTTP_RPC_URL'), {
    chainId: Number(this.config.get<number>('CHAIN_ID')),
    name: this.config.get<string>('CHAIN_NAME'),
  });

  eventStore(): EventStore {
    return {
      approvals: [],
    };
  }

  getDsHandler(kind: EventKind) {
    const dsHandlers = new Map<
      EventKind,
      (e: FilteredEvent[], d: EventStore) => Promise<void>
    >([
      ['authorization', (e, d) => DsHandler.authzHandler(e, d)],
      ['erc20', (e, d) => DsHandler.erc20Handler(e, d)],
      ['erc721/erc1155', (e, d) => DsHandler.nftHandler(e, d)],
      ['generic-authorization', (e, d) => DsHandler.genericAuthzHandler(e, d)],
    ]);

    return dsHandlers.get(kind);
  }

  async sortEventsByKind(
    events: FilteredEvent[],
  ): Promise<FilteredEventBatch[]> {
    const kindToEvents = new Map<EventKind, FilteredEvent[]>();

    for (const event of events) {
      if (!kindToEvents.has(event.kind)) {
        kindToEvents.set(event.kind, []);
      }

      kindToEvents.get(event.kind).push(event);
    }

    const eventsByKind: FilteredEventBatch[] = [
      {
        kind: 'authorization',
        data: kindToEvents.get('authorization'),
      },
      {
        kind: 'erc20',
        data: kindToEvents.get('erc20'),
      },
      {
        kind: 'erc721/erc1155',
        data: kindToEvents.get('erc721/erc1155'),
      },
      {
        kind: 'generic-authorization',
        data: kindToEvents.get('generic-authorization'),
      },
    ];

    return eventsByKind;
  }

  async processBatch(batch: FilteredEventBatch[]): Promise<EventStore> {
    const eventStore = this.eventStore();

    await Promise.all(
      batch.map(async (event) => {
        if (event.data) {
          const handler = this.getDsHandler(event.kind);
          await handler(event.data, eventStore);
        }
      }),
    );

    return eventStore;
  }

  async persist(store: EventStore) {
    await Promise.all([
      //Persist approvals
      this.approvalService.saveApprovals(store.approvals, true),
    ]);
  }

  async setLatestProcessedBlockHeight() {
    const blockHeightFromDb =
      await this.metadataService.getLatestProcessedBlockHeight('EVMOS');
    this.latestProcessedHeight = blockHeightFromDb;
  }

  async init() {
    this.blockNumbers = await this.approvalService.getNullApprovedDates();
    this.erc20Contracts = await this.approvalService.getFillableContracts();
    await this.getLatestBlockHeight();
    await this.setLatestProcessedBlockHeight();
  }

  nextEndBlockHeight(): number {
    const range = this.latestBlockHeight - this.latestProcessedHeight;

    if (range > this.batchSize) {
      return this.latestProcessedHeight + this.batchSize;
    }
    return this.latestBlockHeight;
  }

  async sync() {
    const toBlock = this.nextEndBlockHeight();
    const fromBlock = this.latestProcessedHeight + 1;
    const dataSources = getDataSources();

    if (fromBlock > toBlock) {
      await this.delay(30);
      return;
    }

    const filter: Filter = {
      fromBlock,
      toBlock,
      topics: [[...new Set(dataSources.map(({ topic }) => topic))]],
    };

    const filteredEvents: FilteredEvent[] = [];

    const logs = await this.staticProvider.getLogs(filter);

    for (const log of logs) {
      const dataSource = dataSources.find(
        ({ numTopics, topic }) =>
          numTopics === log.topics.length && topic === log.topics[0],
      );

      if (dataSource) {
        filteredEvents.push({
          kind: dataSource.kind,
          subKind: dataSource.subKind,
          log,
          abi: dataSource.abi,
        });
      }
    }

    if (filteredEvents.length > 0) {
      this.logger.log(
        `Indexing ${filteredEvents.length} events from ${fromBlock} to ${toBlock}`,
      );

      const eventBatch = await this.sortEventsByKind(filteredEvents);
      const store = await this.processBatch(eventBatch);
      await this.persist(store);
      //Update latest processed height
      await this.metadataService.saveMetadata({
        blockchain: 'EVMOS',
        blockHeight: toBlock,
      });
      this.latestProcessedHeight = toBlock;
    }
  }

  @Interval(BLOCK_WAIT_INTERVAL * 1000)
  async getLatestBlockHeight(): Promise<void> {
    try {
      const currentHeight = await this.staticProvider.getBlockNumber();

      if (this.latestBlockHeight !== currentHeight) {
        this.latestBlockHeight = currentHeight;
      }
      this.logger.log(`Latest block height ${currentHeight} fetched`);
    } catch (error) {
      this.logger.error(`Failed to fetch latest block height`, error);
    }
  }

  @Interval(SYNC_INTERVAL * 1000)
  async start() {
    const toBlock = this.nextEndBlockHeight();
    const fromBlock = this.latestProcessedHeight + 1;
    const range = toBlock - fromBlock;

    if (range < 10) return;

    this.logger.log(`Syncing from block ${fromBlock} to ${toBlock}`);

    while (range > 10) {
      await this.syncWithRetry(5);
    }
    await this.resetBatchSize();

    if (this.blockNumbers.length <= 20) {
      this.blockNumbers = await this.approvalService.getNullApprovedDates();
    }

    if (this.erc20Contracts.length <= 20) {
      this.erc20Contracts = await this.approvalService.getFillableContracts();
    }
  }

  @Interval(SYNC_INTERVAL * 1000)
  async resetBatchSize() {
    if (this.batchSize < BLOCK_BATCH) {
      this.logger.log(
        `Resetting batch size from ${this.batchSize} to ${BLOCK_BATCH}`,
      );
      this.batchSize = BLOCK_BATCH;
    }
  }

  async syncWithRetry(maxRetry: number) {
    const run = async (attempt: number) => {
      try {
        await this.sync();
      } catch (error) {
        const err = JSON.parse(error?.body);
        if (
          err &&
          err.error &&
          err.error.code === -32000 &&
          attempt <= maxRetry
        ) {
          this.batchSize = Math.floor(
            (BLOCK_BATCH / 50) * attempt > 0 ? attempt : 1,
          );

          this.logger.warn(
            `Retrying after 2 seconds, tried ${attempt++} times`,
          );

          await this.delay(2);
          await run(attempt++);
        } else {
          throw error;
        }
      }
    };

    await run(1);
  }

  async delay(seconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds * 1000);
    });
  }

  /**
   * Function to fetch blocks and update
   * dateApproved field of the approvals collection
   * Run every 50 seconds
   */
  @Interval(50 * 1000)
  async updateApprovedDate() {
    if (this.blockNumbers.length > 0) {
      const blocksToFetch = this.blockNumbers.splice(0, 100);

      const blocks = await Promise.all(
        blocksToFetch.map(async (blockNumber) => {
          return await this.staticProvider.getBlock(blockNumber);
        }),
      );

      // this.logger.log(`${this.blockNumbers.length} left to fetch`);

      const updates: ApprovalDateUpdate[] = [];

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        if (block) {
          updates.push({
            dateApproved: block.timestamp,
            blockNumber: block.number,
          });
        }
      }

      await this.approvalService.saveApprovalDates(updates);
      this.logger.log(`Approval dates for ${updates.length} blocks updated`);
    }
  }

  @Interval(5 * 1000)
  async updateERC20Info() {
    if (this.erc20Contracts.length === 0) return;

    const batch = this.erc20Contracts.splice(0, 10);
    const accounts = await this.accountService.findAccounts(batch);

    const newContracts = batch.filter((contract) =>
      accounts.some((account) => account.account != contract),
    );

    if (newContracts.length > 0) {
      this.logger.log(`Updating ${newContracts.length} token infos`);
      const updates: ERC20UpdateParam[] = [];

      for (let i = 0; i < newContracts.length; i++) {
        const contractAddress = newContracts[i];
        const contract = ERC20__factory.connect(contractAddress, this.provider);

        try {
          const [name, decimals, symbol] = await Promise.all([
            await contract.name(),
            await contract.decimals(),
            await contract.symbol(),
          ]);

          updates.push({
            account: contractAddress,
            name,
            symbol,
            decimals: parseInt(decimals.toString()),
            isContract: true,
          });
        } catch (error) {
          console.log(error);
          if (
            error.code == 'CALL_EXCEPTION' &&
            error.transaction &&
            error.transaction.data === '0x06fdde03'
          ) {
            await this.approvalService.saveApprovalInfos([
              {
                contractAddress,
                isUpdated: true,
              },
            ]);
          }
        }
      }

      if (updates.length > 0) {
        await this.accountService.saveAccounts(updates, true);

        await this.approvalService.saveApprovalInfos(
          updates.map((update) => ({
            contractAddress: update.account,
            isUpdated: true,
          })),
        );
        this.logger.log(`Updated ${updates.length} token infos`);
      }
    }
  }
}
