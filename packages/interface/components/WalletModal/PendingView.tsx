import {
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Connector } from "@web3-react/types";
import { IoWarningOutline } from "react-icons/io5";

export const PendingView = ({
  connector,
  error = false,
  tryActivation,
  openOptions,
}: {
  connector: Connector;
  error?: boolean;
  tryActivation: (connector: Connector) => Promise<void>;
  openOptions: () => void;
}) => {
  const titleColor = useColorModeValue("black", "white");

  return (
    <Flex
      w="full"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        padding="1rem"
        alignItems="center"
        justifyContent="center"
        borderRadius="1rem"
      >
        <Flex alignItems="center" justifyContent="center">
          {error ? (
            <Flex
              flexDir="column"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Icon
                as={IoWarningOutline}
                boxSize="25%"
                paddingBottom="2rem"
                color="red.300"
              />
              <Box fontSize="20px" color={titleColor} marginBottom="12px">
                Error Connecting
              </Box>
              <Box fontSize="1rem" marginBottom="36px" textAlign="center">
                Failed to connect, please click the try again button to follow
                retry connecting to your wallet.
              </Box>
              <Button
                colorScheme="blue"
                fontSize="20px"
                fontWeight={600}
                w="full"
                h="auto"
                padding="1rem"
                borderRadius="1rem"
                onClick={() => tryActivation(connector)}
              >
                Try Again
              </Button>
              <Text
                fontWeight={700}
                marginTop="1rem"
                color="blue.400"
                cursor="pointer"
                onClick={openOptions}
              >
                Back to wallet options
              </Text>
            </Flex>
          ) : (
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Spinner color="blue.500" boxSize="100px" speed="0.5s" />
              <Text fontSize="20px" fontWeight={600} marginTop="1.5rem">
                Waiting to connect
              </Text>
              <Text>Approve this connection on your wallet to continue</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
