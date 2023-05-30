import {
  ChainId,
  getAddChainParameters,
  isSupportedChain,
  network,
} from "@app/configs";
import { Connector } from "@web3-react/types";

export const switchChain = async (connector: Connector, chainId: ChainId) => {
  if (!isSupportedChain(chainId)) {
    throw new Error(
      `Chain ${chainId} not supported for connector (${typeof connector})`
    );
  } else if (connector === network) {
    await connector.activate(chainId);
  } else {
    const addChainParameter = getAddChainParameters(chainId);
    await connector.activate(addChainParameter);
  }
};
