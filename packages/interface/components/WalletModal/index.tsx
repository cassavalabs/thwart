import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { Connector } from "@web3-react/types";
import { shallow } from "zustand/shallow";
import { useConnectionStore } from "@app/store";
import {
  ChainId,
  getChainInfo,
  getConnection,
  SUPPORTED_WALLETS,
} from "@app/configs";
import { Option } from "./Option";
import { PendingView } from "./PendingView";

const WALLETS_VIEWS = {
  OPTIONS: "options",
  PENDING: "pending",
};

export default function WalletModal(
  props: Pick<ModalProps, "isOpen" | "onClose">
) {
  const { isOpen, onClose } = props;
  const [walletView, setWalletView] = useState(WALLETS_VIEWS.OPTIONS);
  const [pendingConnector, setPendingConnector] = useState<
    Connector | undefined
  >(undefined);

  const [
    errorByConnectionType,
    setErrorByConnectionType,
    setConnector,
    desiredChainId,
  ] = useConnectionStore(
    (state) => [
      state.errorByConnectionType,
      state.setErrorByConnectionType,
      state.setConnector,
      state.desiredChainId,
    ],
    shallow
  );

  const pendingError = pendingConnector
    ? errorByConnectionType[getConnection(pendingConnector)!.type]
    : undefined;

  const tryActivation = useCallback(
    async (connector: Connector) => {
      const connectionType = getConnection(connector)!.type;

      try {
        setPendingConnector(connector);
        setWalletView(WALLETS_VIEWS.PENDING);
        setErrorByConnectionType(connectionType, undefined);

        await connector.activate();
        setConnector(connectionType);
      } catch (error) {
        setErrorByConnectionType(connectionType, (error as any).message);
      }
    },
    [setConnector, setErrorByConnectionType]
  );

  const Options = () => {
    const chainInfo = getChainInfo(desiredChainId);
    return (
      <Flex w="full" gap="8px" flexDirection="column">
        {chainInfo &&
          chainInfo.connectors.map((connectionType) => {
            const wallet = SUPPORTED_WALLETS[connectionType];
            return (
              <Option
                key={connectionType}
                header={wallet.name}
                subheader={wallet.description}
                icon={wallet.icon}
                onClick={() => tryActivation(wallet.connector)}
              />
            );
          })}
      </Flex>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect a wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="1.5rem">
          {walletView === "options" && <Options />}
          {walletView === "pending" && pendingConnector && (
            <PendingView
              connector={pendingConnector}
              tryActivation={() => tryActivation(pendingConnector)}
              openOptions={() => setWalletView(WALLETS_VIEWS.OPTIONS)}
              error={!!pendingError}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
