import { useWeb3React } from "@web3-react/core";
import { getConnection } from "@app/configs";
import { useConnectionStore } from "@app/store";
import { switchChain } from "@app/utils";
import { useCallback, useEffect } from "react";

export function useDesiredChain() {
  const [desiredChainId, setErrorByConnectionType] = useConnectionStore(
    (state) => [state.desiredChainId, state.setErrorByConnectionType]
  );
  const { chainId, connector } = useWeb3React();

  const handleSwitch = useCallback(async () => {
    if (!connector) return;

    if (chainId && desiredChainId !== chainId) {
      const connectionType = getConnection(connector)!.type;

      try {
        setErrorByConnectionType(connectionType, undefined);
        await switchChain(connector, desiredChainId);
      } catch (error) {
        setErrorByConnectionType(connectionType, (error as any).message);
      }
    }
  }, [chainId, connector, desiredChainId, setErrorByConnectionType]);

  useEffect(() => {
    handleSwitch();
  }, [handleSwitch]);
}
