import { Tooltip as ChakraTooltip } from "@chakra-ui/react";
import { ReactNode } from "react";

export const Tooltip = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <ChakraTooltip
      label={label}
      variant="primary"
      placement="auto"
      bg="gray.600"
      color="white"
      fontSize="12px"
      borderRadius="2xl"
      padding="4px 8px"
      hasArrow
    >
      {children}
    </ChakraTooltip>
  );
};
