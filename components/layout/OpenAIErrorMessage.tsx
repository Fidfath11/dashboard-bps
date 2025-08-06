import React from "react";
import { Box, Heading, Text, useColorMode } from "@chakra-ui/react";

export function OpenAIErrorMessage({ children }: React.PropsWithChildren<{}>) {
  const { colorMode } = useColorMode();
  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      bg={colorMode === "light" ? "red.50" : "red.900"}
      color={colorMode === "light" ? "red.800" : "red.50"}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading size="md" mb={4}>
        Error!
      </Heading>
      <Text mb={6}>
        {children || "Terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi nanti."}
      </Text>
    </Box>
  );
}