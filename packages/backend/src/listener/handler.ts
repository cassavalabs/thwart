import { ApprovalKind, EventStore, FilteredEvent } from 'src/types';

export class DsHandler {
  public static async authzHandler(
    events: FilteredEvent[],
    store: EventStore
  ): Promise<void> {
    for (const { abi, log, subKind } of events) {
      switch (subKind) {
        case 'authorization:allowance-change': {
          const data = abi.parseLog(log);
          const [owner, spender, methods, values] = data.args;

          store.approvals.push({
            approvalKind: ApprovalKind.AUTHORIZATION,
            owner,
            spender,
            methods: methods.map(String),
            values: values.map(String),
            contractAddress: log.address,
            transactionHash: log.transactionHash,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            isUpdated: false,
          });
          break;
        }

        case 'authorization:approval': {
          const data = abi.parseLog(log);
          const [owner, spender, methods, value] = data.args;

          store.approvals.push({
            approvalKind: ApprovalKind.AUTHORIZATION,
            owner,
            spender,
            methods: methods.map(String),
            value: value.toString(),
            contractAddress: log.address,
            transactionHash: log.transactionHash,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            isUpdated: false,
          });
          break;
        }
      }
    }
  }

  public static async genericAuthzHandler(
    events: FilteredEvent[],
    store: EventStore
  ): Promise<void> {
    for (const { abi, log, subKind } of events) {
      switch (subKind) {
        case 'generic-authorization:approval':
        case 'generic-authorization:revocation': {
          const data = abi.parseLog(log);
          const [owner, spender, methods] = data.args;

          store.approvals.push({
            approvalKind: ApprovalKind.GENERIC_AUTH,
            owner,
            spender,
            methods: methods.map(String),
            contractAddress: log.address,
            transactionHash: log.transactionHash,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            isUpdated: false,
          });
          break;
        }
      }
    }
  }

  public static async erc20Handler(
    events: FilteredEvent[],
    store: EventStore
  ): Promise<void> {
    for (const { abi, log, subKind } of events) {
      switch (subKind) {
        case 'erc20:approval': {
          const data = abi.parseLog(log);
          const [owner, spender, value] = data.args;

          store.approvals.push({
            approvalKind: ApprovalKind.ERC20,
            owner,
            spender,
            value: value.toString(),
            contractAddress: log.address,
            transactionHash: log.transactionHash,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            isUpdated: false,
          });
          break;
        }
      }
    }
  }

  public static async nftHandler(
    events: FilteredEvent[],
    store: EventStore
  ): Promise<void> {
    for (const { abi, log, subKind } of events) {
      switch (subKind) {
        case 'erc721/erc1155:approval-for-all': {
          const data = abi.parseLog(log);
          const [owner, spender, approved] = data.args;

          store.approvals.push({
            approvalKind: ApprovalKind.NFT,
            owner,
            spender,
            approved,
            contractAddress: log.address,
            transactionHash: log.transactionHash,
            blockHash: log.blockHash,
            blockNumber: log.blockNumber,
            isUpdated: false,
          });
          break;
        }
      }
    }
  }
}
