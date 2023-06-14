import type { Web3ReactHooks } from '@web3-react/core';
import type { Connector } from '@web3-react/types';

export enum ConnectionType {
  COINBASEWALLET = 'COINBASEWALLET',
  METAMASK = 'METAMASK',
  NETWORK = 'NETWORK',
  TRUSTWALLET = 'TRUSTWALLET',
  WALLETCONNECT = 'WALLETCONNECT',
}

export interface BaseChainInfo {
  readonly blockExplorerUrl: string;
  readonly chainName: string;
  readonly iconUrl: string;
  readonly rpcUrl: string;
  readonly connectors: ConnectionType[];
  readonly nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18 | number;
  };
}

export interface WalletInfo {
  connector: Connector;
  name: string;
  icon: string;
  description: string;
  disabled: boolean;
}

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

export enum ApprovalKind {
  AUTHORIZATION = 'AUTHZ',
  ERC20 = 'ERC20',
  NFT = 'NFT',
  GENERIC_AUTH = 'G_AUTHZ',
}

export interface Approval {
  contractAddress: string;
  owner: string;
  spender: string;
  approvalKind: ApprovalKind;
  approved?: boolean;
  blockHash: string;
  blockNumber: number;
  dateApproved?: number;
  methods?: string[];
  transactionHash: string;
  value?: string;
  values?: string[];
  contract?: Account;
  operator?: Account;
}

export interface Account {
  account: string;
  decimals: number;
  isContract: boolean;
  logo?: string;
  name?: string;
  symbol?: string;
}

export interface ApiResponse {
  docs: Approval[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
