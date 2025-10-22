"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";

const theme = extendTheme({});

export default function MyChakraProvider({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
