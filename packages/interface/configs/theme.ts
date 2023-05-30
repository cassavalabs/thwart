import {
  defineStyleConfig,
  extendTheme,
  type ThemeConfig,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  gray: {
    1000: "#011627",
  },
  blue: {
    1000: "#0784c3",
    2000: "#0670a6",
  },
};

const Button = defineStyleConfig({
  variants: {
    primary: {
      h: "1.6rem",
      bg: "blue.1000",
      color: "white",
      fontSize: "14px",
      _hover: {
        bg: "blue.2000",
        borderColor: "transparent",
      },
    },
    secondary: {
      h: "1.6rem",
      bg: "whiteAlpha.200",
      color: "white",
      fontSize: "14px",
      _hover: {
        bg: "whiteAlpha.300",
      },
      _active: {
        bg: "blue.1000",
        color: "white",
        _hover: {
          bg: "blue.1000",
        },
      },
    },
  },
});

const Text = defineStyleConfig({
  variants: {
    textLink: {
      color: "#0784c3",
      fontWeight: 600,
      cursor: "pointer",
      maxW: "9rem",
      noOfLines: 1,
      display: "block",
      transition: "all 0.25s ease",
      _hover: {
        color: "blue.2000",
      },
    },
  },
});

const components = {
  Button,
  Text,
};

export const theme = extendTheme({ colors, config, components });
