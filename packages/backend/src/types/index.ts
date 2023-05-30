import { Interface } from '@ethersproject/abi';
import { Log } from '@ethersproject/providers';
import { Approval } from 'src/approvals/schema';
import { Account } from 'src/accounts/schema';

export type EventKind =
  | 'authorization'
  | 'erc20'
  | 'erc721/erc1155'
  | 'generic-authorization';

export type SubEventKind =
  | 'authorization:approval'
  | 'authorization:allowance-change'
  | 'generic-authorization:approval'
  | 'generic-authorization:revocation'
  | 'erc20:approval'
  | 'erc721/erc1155:approval-for-all';

export enum ApprovalKind {
  AUTHORIZATION = 'AUTHZ',
  ERC20 = 'ERC20',
  NFT = 'NFT',
  GENERIC_AUTH = 'G_AUTHZ',
}

export interface DataSource {
  kind: EventKind;
  subKind: SubEventKind;
  numTopics: number;
  topic: string;
  abi: Interface;
}

export interface FilteredEvent {
  kind: EventKind;
  subKind: SubEventKind;
  log: Log;
  abi: Interface;
}

export interface FilteredEventBatch {
  kind: EventKind;
  data: FilteredEvent[];
}

export interface EventStore {
  approvals: Approval[];
}

export type ApprovalDateUpdate = Pick<Approval, 'blockNumber' | 'dateApproved'>;
export type ERC20UpdateParam = Pick<
  Account,
  'account' | 'decimals' | 'isContract' | 'name' | 'symbol'
>;
