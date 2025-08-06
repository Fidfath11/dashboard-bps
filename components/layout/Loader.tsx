import React from "react";
import { Flex, Spinner, useColorMode } from "@chakra-ui/react";

export function Loader() {
  const { colorMode } = useColorMode();
  return (
    <Flex
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100%"
      color={colorMode === "light" ? "gray.800" : "whiteAlpha.900"}
    >
      <Spinner size="xl" mb={4} thickness="4px" speed="0.65s" />
    </Flex>
  );
}