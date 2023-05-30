export enum ChainId {
  EVMOS = 9001,
  EVMOS_TESTNET = 9000,
}

/**
 * Array of all the supported chain IDs
 */
export const ALL_CHAIN_IDS: ChainId[] = Object.values(ChainId).filter(
  (id) => typeof id === "number"
) as ChainId[];

export const isSupportedChain = (
  chainId: number | null | undefined
): chainId is ChainId => {
  return !!chainId && !!ChainId[chainId];
};
