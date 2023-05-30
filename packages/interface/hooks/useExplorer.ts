import { CHAIN_INFO, ChainId } from "@app/configs";
import { useConnectionStore } from "@app/store";

export function useExplorer() {
  const chainId = useConnectionStore((state) => state.desiredChainId);

  const getExplorerUrl = (type: "account" | "tx", payload: string) => {
    const blockExplorerUrl = CHAIN_INFO[chainId].blockExplorerUrl;
    const isAccount = type === "account";

    switch (chainId) {
      case ChainId.EVMOS_TESTNET: {
        if (isAccount) {
          return `${blockExplorerUrl}/address/${payload}`;
        }

        return `${blockExplorerUrl}/tx/${payload}`;
      }

      default:
        return "#";
    }
  };

  return { getExplorerUrl };
}
