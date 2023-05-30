"use client";

import { ReactNode } from "react";
import {
  ChakraProvider,
  cookieStorageManagerSSR,
  localStorageManager,
} from "@chakra-ui/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { theme } from "@app/configs/theme";
import { Web3ReactProvider } from "@web3-react/core";
import { connectors } from "@app/configs";
import { useEagerlyConnect } from "@app/hooks";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function Providers({
  children,
  cookie,
}: {
  children: ReactNode;
  cookie?: string;
}) {
  useEagerlyConnect();

  return (
    <CacheProvider>
      <ChakraProvider
        colorModeManager={
          typeof cookie === "string"
            ? cookieStorageManagerSSR(cookie)
            : localStorageManager
        }
        theme={theme}
      >
        <Web3ReactProvider connectors={connectors}>
          {children}
          <ToastContainer />
        </Web3ReactProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
