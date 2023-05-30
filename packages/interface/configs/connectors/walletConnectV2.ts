import { initializeConnector } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

import { ALL_CHAIN_IDS } from "../chains";
import { RPC_URLS } from "../chainInfo";

export const [walletConnectV2, walletConnectV2Hooks] =
  initializeConnector<WalletConnectV2>(
    (actions) =>
      new WalletConnectV2({
        actions,
        options: {
          projectId: String(process.env.walletConnectProjectId),
          chains: ALL_CHAIN_IDS,
          rpcMap: RPC_URLS,
          showQrModal: true,
        },
      })
  );
