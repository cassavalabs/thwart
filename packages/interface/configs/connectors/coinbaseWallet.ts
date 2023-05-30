import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector } from "@web3-react/core";
import { useConnectionStore } from "@app/store";
import { RPC_URLS } from "../chainInfo";

const desiredChainId = useConnectionStore.getState().desiredChainId;

export const [coinbaseWallet, coinbaseWalletHooks] =
  initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          url: RPC_URLS[desiredChainId],
          appName: "Thwart Protocol",
        },
      })
  );
