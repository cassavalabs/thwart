import { Connector } from "@web3-react/types";
import { shallow } from "zustand/shallow";
import { useConnectionStore } from "@app/store";
import { Connection } from "@app/types";
import { getConnection, network } from "@app/configs";
import { useEffect } from "react";

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly();
    } else {
      await connector.activate();
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`);
  }
}

export function useEagerlyConnect() {
  const [selectedConnector, setConnector] = useConnectionStore(
    (state) => [
      state.selectedConnector,
      state.setConnector,
      state.desiredChainId,
    ],
    shallow
  );

  let selectedConnection: Connection | undefined;
  if (selectedConnector) {
    try {
      selectedConnection = getConnection(selectedConnector);
    } catch {
      setConnector(undefined);
    }
  }

  useEffect(() => {
    connect(network);

    if (selectedConnection) {
      connect(selectedConnection.connector);
    } // The dependency list is empty so this is only run once on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
