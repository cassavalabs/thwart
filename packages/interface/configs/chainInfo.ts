import { BaseChainInfo, ConnectionType } from "@app/types";
import { ChainId } from "./chains";

export const CHAIN_INFO: { [chainId: number]: BaseChainInfo } = {
  [ChainId.EVMOS_TESTNET]: {
    blockExplorerUrl: "https://testnet.escan.live",
    chainName: "Evmos Testnet",
    iconUrl: "/9001.png",
    rpcUrl: "https://eth.bd.evmos.dev:8545",
    connectors: [
      ConnectionType.COINBASEWALLET,
      ConnectionType.METAMASK,
      ConnectionType.TRUSTWALLET,
      ConnectionType.WALLETCONNECT,
    ],
    nativeCurrency: {
      name: "Evmos",
      symbol: "EVMOS",
      decimals: 18,
    },
  },
};

export const getChainInfo = (chainId: any) => {
  if (chainId) {
    return CHAIN_INFO[chainId] ?? undefined;
  }

  return undefined;
};

export const getAddChainParameters = (chainId: number) => {
  const info = CHAIN_INFO[chainId];

  return {
    chainId,
    chainName: info.chainName,
    rpcUrls: [info.rpcUrl],
    nativeCurrency: info.nativeCurrency,
    blockExplorerUrls: [info.blockExplorerUrl],
  };
};

export const RPC_URLS: { [chainId: number]: string } = Object.keys(
  CHAIN_INFO
).reduce<{
  [chainId: number]: string;
}>((accumulator, chainId) => {
  const validRpcurl: string = CHAIN_INFO[Number(chainId)].rpcUrl;

  if (validRpcurl) {
    accumulator[Number(chainId)] = validRpcurl;
  }

  return accumulator;
}, {});

export const EXPLORER_URLS: { [chainId: number]: string } = Object.keys(
  CHAIN_INFO
).reduce<{
  [chainId: number]: string;
}>((accumulator, chainId) => {
  const validUrl: string = CHAIN_INFO[Number(chainId)].blockExplorerUrl;

  if (validUrl) {
    accumulator[Number(chainId)] = validUrl;
  }

  return accumulator;
}, {});
