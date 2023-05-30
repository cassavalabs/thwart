import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { Connection, ConnectionType, WalletInfo } from "@app/types";
import { metaMask, metaMaskHooks } from "./metaMask";
import { network, networkHooks } from "./network";
import { walletConnectV2, walletConnectV2Hooks } from "./walletConnectV2";
import { trustWallet, trustWalletHooks } from "./trustWallet";
import { coinbaseWallet, coinbaseWalletHooks } from "./coinbaseWallet";

export const connectors: [Connector, Web3ReactHooks][] = [
  [coinbaseWallet, coinbaseWalletHooks],
  [metaMask, metaMaskHooks],
  [network, networkHooks],
  [trustWallet, trustWalletHooks],
  [walletConnectV2, walletConnectV2Hooks],
];

const coinbaseWalletConn: Connection = {
  connector: coinbaseWallet,
  hooks: coinbaseWalletHooks,
  type: ConnectionType.COINBASEWALLET,
};

const metaMaskConn: Connection = {
  connector: metaMask,
  hooks: metaMaskHooks,
  type: ConnectionType.METAMASK,
};

const networkConn: Connection = {
  connector: network,
  hooks: networkHooks,
  type: ConnectionType.NETWORK,
};

const trustWalletConn: Connection = {
  connector: trustWallet,
  hooks: trustWalletHooks,
  type: ConnectionType.TRUSTWALLET,
};

const walletConnectV2Conn: Connection = {
  connector: walletConnectV2,
  hooks: walletConnectV2Hooks,
  type: ConnectionType.WALLETCONNECT,
};

const WALLET_CONNECTIONS = [
  coinbaseWalletConn,
  metaMaskConn,
  networkConn,
  trustWalletConn,
  walletConnectV2Conn,
];

export const getConnection = (connector: Connector | ConnectionType) => {
  if (connector instanceof Connector) {
    const connection = WALLET_CONNECTIONS.find(
      (connection) => connection.connector === connector
    );

    if (!connection) {
      throw new Error("Unsupported connector");
    }

    return connection;
  } else {
    switch (connector) {
      case ConnectionType.METAMASK:
        return metaMaskConn;
      case ConnectionType.NETWORK:
        return networkConn;
      case ConnectionType.TRUSTWALLET:
        return trustWalletConn;
      case ConnectionType.WALLETCONNECT:
        return walletConnectV2Conn;
    }
  }
};

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  [ConnectionType.COINBASEWALLET]: {
    connector: coinbaseWallet,
    name: "CoinbaseWallet",
    icon: "/coinbaseWalletIcon.svg",
    description: "",
    disabled: false,
  },
  [ConnectionType.METAMASK]: {
    connector: metaMask,
    name: "MetaMask",
    icon: "/metaMaskIcon.svg",
    description: "",
    disabled: false,
  },
  [ConnectionType.NETWORK]: {
    connector: network,
    name: "",
    icon: "",
    description: "",
    disabled: false,
  },
  [ConnectionType.TRUSTWALLET]: {
    connector: trustWallet,
    name: "TrustWallet",
    icon: "/trustWalletIcon.png",
    description: "",
    disabled: false,
  },
  [ConnectionType.WALLETCONNECT]: {
    connector: walletConnectV2,
    name: "WalletConnectV2",
    icon: "/walletConnectIcon.svg",
    description: "",
    disabled: false,
  },
};

export { coinbaseWallet, network, metaMask, trustWallet, walletConnectV2 };
