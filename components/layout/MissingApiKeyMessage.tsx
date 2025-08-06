import React from "react";
import { Box, Heading, Text, Button, Link, useColorMode } from "@chakra-ui/react";
import { FaRandom } from "react-icons/fa";
import { FaCog } from "react-icons/fa";

interface MissingApiKeyMessageProps {
  onApiKeyClick: () => void;
  onRandomData: () => void;
}

export function MissingApiKeyMessage(props: MissingApiKeyMessageProps) {
  const { onApiKeyClick, onRandomData } = props;
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
        Selamat Datang di BPS VISTA!
      </Heading>
      <Text mb={6}>
        Untuk memulai, Anda perlu memasukkan API key OpenAI Anda. Setelah itu, Anda dapat mengunggah file data atau mencoba menggunakan data contoh.
      </Text>
      <Box display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="center" alignItems="center" gap={4}>
        <Button leftIcon={<FaCog />} onClick={onApiKeyClick} colorScheme="blue">
          Masukkan API Key
        </Button>
        <Button leftIcon={<FaRandom />} onClick={onRandomData} variant="outline" mt={{ base: 4, md: 0 }}>
          Gunakan Data Contoh
        </Button>
      </Box>
    </Box>
  );
}