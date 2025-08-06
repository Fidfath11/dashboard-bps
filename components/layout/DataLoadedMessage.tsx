import React from "react";
import { Box, Heading, Text, Button, useColorMode } from "@chakra-ui/react";

interface DataLoadedMessageProps {
  onAnalyze: () => void;
}

export function DataLoadedMessage(props: DataLoadedMessageProps) {
  const { onAnalyze } = props;
  const { colorMode } = useColorMode();

  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      bg={colorMode === "light" ? "white" : "gray.800"}
      borderRadius="lg"
      boxShadow="lg"
      color={colorMode === "light" ? "gray.800" : "whiteAlpha.900"}
    >
      <Heading size="md" mb={4}>
        Data Anda Telah Diunggah!
      </Heading>
      <Text mb={6}>
        Silakan klik tombol &quot;Analyze&quot; di bawah untuk melihat hasilnya. Anda juga dapat menambahkan konteks tambahan di sidebar sebelah kiri untuk hasil yang lebih akurat.
      </Text>
      <Button colorScheme="green" onClick={onAnalyze}>
        Analyze
      </Button>
    </Box>
  );
}