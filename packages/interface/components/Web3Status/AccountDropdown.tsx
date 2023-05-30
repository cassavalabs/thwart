import {
  HStack,
  Icon,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  chakra,
  Flex,
  IconButton,
  useClipboard,
  Text,
  Tooltip,
  useColorModeValue,
  Box,
  Button,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { getChainInfo } from "@app/configs";
import { useNativeBalance } from "@app/hooks";
import { useConnectionStore } from "@app/store";
import { shortenAddress } from "@app/utils";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { FaExternalLinkAlt, FaPowerOff, FaRegCopy } from "react-icons/fa";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

import { Identicon } from "./Identicon";

const TriggerButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  const { account, ENSName } = useWeb3React();

  return (
    <PopoverAnchor>
      <chakra.span>
        <PopoverTrigger>
          <Button
            display="flex"
            alignItems="center"
            padding="8px"
            marginRight="2px"
            marginLeft="2px"
            h="full"
            borderRadius="full"
            _focus={{ outline: "none" }}
            cursor="pointer"
            userSelect="none"
            _hover={{ border: "sm" }}
            pos="relative"
            onClick={onClick}
          >
            <HStack spacing="4px">
              {account && <Identicon size={24} seed={account} />}
              <Text>{ENSName || (account && shortenAddress(account))}</Text>
              <Icon
                as={isOpen ? IoChevronUpOutline : IoChevronDownOutline}
                boxSize="20px"
              />
            </HStack>
          </Button>
        </PopoverTrigger>
      </chakra.span>
    </PopoverAnchor>
  );
};

export const AccountDropdown = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { account, chainId, connector, ENSName } = useWeb3React();
  const { onCopy, hasCopied } = useClipboard(account || "");
  const { balance } = useNativeBalance();

  const setConnector = useConnectionStore((state) => state.setConnector);

  const disconnect = useCallback(() => {
    if (connector && connector.deactivate) {
      connector.deactivate();
    }
    connector.resetState();
    setConnector(undefined);
  }, [connector, setConnector]);

  const chainInfo = getChainInfo(chainId);
  const formatBalance = balance.toPrecision(3);

  const router = useRouter();

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom-end">
      <TriggerButton isOpen={isOpen} onClick={onToggle} />
      <PopoverContent>
        <PopoverBody padding="1rem" w="20rem">
          <Flex boxSize="full" flexDirection="column">
            <Flex
              w="full"
              marginBottom="0.5rem"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack spacing="4px">
                {account && <Identicon size={24} seed={account} />}
                <Text>{ENSName || (account && shortenAddress(account))}</Text>
              </HStack>
              <HStack spacing="4px" justifyContent="flex-end">
                <Tooltip
                  hasArrow
                  label={hasCopied ? "Copied!" : "Copy"}
                  color={useColorModeValue("gray.300", "white")}
                  bg={useColorModeValue("black", "transparent")}
                >
                  <IconButton
                    color="current"
                    variant="ghost"
                    fontSize="sm"
                    size="sm"
                    ml={{ base: "0", md: "3" }}
                    onClick={onCopy}
                    icon={<FaRegCopy />}
                    aria-label="copy wallet address"
                    borderRadius="50%"
                  />
                </Tooltip>
                <Tooltip
                  hasArrow
                  label="Explore"
                  color={useColorModeValue("gray.300", "white")}
                  bg={useColorModeValue("black", "transparent")}
                >
                  <IconButton
                    color="current"
                    variant="ghost"
                    fontSize="sm"
                    size="sm"
                    ml={{ base: "0", md: "3" }}
                    onClick={onCopy}
                    icon={<FaExternalLinkAlt />}
                    aria-label="view wallet on explorer"
                    borderRadius="50%"
                  />
                </Tooltip>
                <Tooltip
                  hasArrow
                  label="Disconnect"
                  color={useColorModeValue("gray.300", "white")}
                  bg={useColorModeValue("black", "transparent")}
                >
                  <IconButton
                    color="current"
                    variant="ghost"
                    fontSize="sm"
                    size="sm"
                    ml={{ base: "0", md: "3" }}
                    onClick={disconnect}
                    icon={<FaPowerOff />}
                    aria-label="disconnect wallet"
                    borderRadius="50%"
                  />
                </Tooltip>
              </HStack>
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              paddingY="1rem"
              gap="0.5rem"
            >
              <Box fontSize="14px" lineHeight={1}>
                {chainInfo && chainInfo.nativeCurrency.symbol} Balance
              </Box>
              <Box
                fontSize="36px"
                color={useColorModeValue("blackAlpha.800", "white")}
                lineHeight={1}
              >
                {formatBalance} {chainInfo && chainInfo.nativeCurrency.symbol}
              </Box>
            </Flex>
            <Button
              colorScheme="blue"
              fontWeight={600}
              onClick={() => router.push("/my-collections")}
            >
              My Collections
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
