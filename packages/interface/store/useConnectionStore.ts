import { ConnectionType } from "@app/types";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface State {
  account: string;
  desiredChainId: number;
  setaccount: (account: string) => void;
  setDesiredChainId: (chainId: number) => void;
  errorByConnectionType: Record<ConnectionType, string | undefined>;
  setErrorByConnectionType: (
    connectionType: ConnectionType,
    error: string | undefined
  ) => void;
  selectedConnector: ConnectionType | undefined;
  setConnector: (connectionType: ConnectionType | undefined) => void;
}

export const useConnectionStore = create<State>()(
  devtools(
    persist(
      (set, get) => ({
        account: "",
        desiredChainId: 9000,
        setaccount: (account) => set({ account: account }),
        setDesiredChainId: (chainId) => set({ desiredChainId: chainId }),
        errorByConnectionType: {
          [ConnectionType.COINBASEWALLET]: undefined,
          [ConnectionType.METAMASK]: undefined,
          [ConnectionType.NETWORK]: undefined,
          [ConnectionType.TRUSTWALLET]: undefined,
          [ConnectionType.WALLETCONNECT]: undefined,
        },
        setErrorByConnectionType: (connectionType, error) =>
          set(() => {
            return {
              errorByConnectionType: {
                ...get().errorByConnectionType,
                [connectionType]: error,
              },
            };
          }),
        selectedConnector: undefined,
        setConnector: (connectionType) =>
          set({ selectedConnector: connectionType }),
      }),
      {
        name: "seven-options-connection-store",
        version: 1,
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
