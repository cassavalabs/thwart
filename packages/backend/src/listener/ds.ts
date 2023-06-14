import { Interface } from '@ethersproject/abi';
import { DataSource } from 'src/types';

export class DsEvents {
  public static authzAllowanceChange: DataSource = {
    kind: 'authorization',
    subKind: 'authorization:allowance-change',
    topic: '0x5a22c7e8af595d94a6d652de8e346a8ecdfe49fc2e0e976f33c9fc9358390ea4',
    numTopics: 3,
    abi: new Interface([
      `event AllowanceChange(
        address indexed owner,
        address indexed spender,
        string[] methods,
        uint256[] values
    )`,
    ]),
  };

  public static authzApproval: DataSource = {
    kind: 'authorization',
    subKind: 'authorization:approval',
    topic: '0xf2638649a77447a76543b3e27c31ee0febe7de7fb20e2b6a781d08207bc7cb8d',
    numTopics: 3,
    abi: new Interface([
      ` event Approval(
            address indexed owner,
            address indexed spender,
            string[] methods,
            uint256 value
        )`,
    ]),
  };

  public static erc20Approval: DataSource = {
    kind: 'erc20',
    subKind: 'erc20:approval',
    topic: '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
    numTopics: 3,
    abi: new Interface([
      `event Approval(
            address indexed owner,
            address indexed spender,
            uint256 value
          )`,
    ]),
  };

  public static nftApproval: DataSource = {
    kind: 'erc721/erc1155',
    subKind: 'erc721/erc1155:approval-for-all',
    topic: '0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31',
    numTopics: 3,
    abi: new Interface([
      `event ApprovalForAll(
            address indexed owner,
            address indexed operator,
            bool approved
          )`,
    ]),
  };
}

export const dataSources = [
  DsEvents.authzAllowanceChange,
  DsEvents.authzApproval,
  DsEvents.erc20Approval,
  DsEvents.nftApproval,
];

export const getDataSources = (filter?: string[]) => {
  if (!filter) return dataSources;

  return dataSources.filter(({ subKind }) =>
    filter.some((e) => subKind.startsWith(e))
  );
};
