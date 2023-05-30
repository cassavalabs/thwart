"use client";

import {
  Avatar,
  AvatarBadge,
  Button,
  HStack,
  chakra,
  useDisclosure,
  Text,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { getConnection } from "@app/configs";
import { useDesiredChain } from "@app/hooks";
import { useConnectionStore } from "@app/store";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { shortenAddress } from "@app/utils";
import { FaPowerOff } from "react-icons/fa";

const WalletModal = dynamic(() => import("../WalletModal"), {
  ssr: false,
}) as any;

const Web3StatusInner = () => {
  const { account, connector, ENSName } = useWeb3React();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const connectionType = getConnection(connector)!.type;
  const error = useConnectionStore(
    (state) => state.errorByConnectionType[connectionType]
  );

  const setConnector = useConnectionStore((state) => state.setConnector);

  const disconnect = useCallback(() => {
    if (connector && connector.deactivate) {
      connector.deactivate();
    }
    connector.resetState();
    setConnector(undefined);
  }, [connector, setConnector]);

  if (account) {
    return (
      <HStack>
        <ButtonGroup size="md" variant="outline" isAttached>
          <Button>
            <HStack>
              <Avatar size="sm" src="/9001.png">
                <AvatarBadge boxSize="1rem" bg="green.500" />
              </Avatar>
              <Text>{ENSName || (account && shortenAddress(account))}</Text>
            </HStack>
          </Button>
          <IconButton
            aria-label="Disconnect"
            icon={<FaPowerOff />}
            onClick={disconnect}
          />
        </ButtonGroup>
      </HStack>
    );
  } else {
    return (
      <>
        <Button
          variant="outline"
          h="2rem"
          onClick={onOpen}
          leftIcon={
            <chakra.span w="10px" h="10px" borderRadius="50%" bg="red" />
          }
        >
          Connect Wallet
        </Button>
        <WalletModal isOpen={isOpen} onClose={onClose} />
      </>
    );
  }
};

export const Web3Status = () => {
  useDesiredChain();

  return (
    <chakra.div>
      <Web3StatusInner />
    </chakra.div>
  );
};
