import { Avatar, Box, Button, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";

export const Option = ({
  header,
  subheader,
  icon,
  onClick,
}: {
  header: ReactNode;
  subheader?: ReactNode;
  icon: string;
  onClick: () => Promise<void> | null;
}) => {
  return (
    <Button
      w="full"
      colorScheme="gray"
      userSelect="none"
      padding="1rem"
      onClick={onClick}
      justifyContent="space-between"
      height="auto"
      borderRadius="8px"
    >
      <Flex flexDirection="row" alignItems="center">
        <Avatar
          src={icon}
          name="wallet"
          boxSize="2rem"
          marginRight="0.5rem"
          borderRadius="4px"
          ignoreFallback
        />
        <Flex
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          <Box fontSize="1rem" fontWeight={600}>
            {header}
          </Box>

          {subheader && (
            <Box fontSize="13px" marginTop="2px" color="gray.300">
              {subheader}
            </Box>
          )}
        </Flex>
      </Flex>
    </Button>
  );
};
