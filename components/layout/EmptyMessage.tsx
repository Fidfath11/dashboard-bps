import React from "react";
import { Box, Heading, Text, Button, useColorMode, Link } from "@chakra-ui/react";
import { FaRandom } from "react-icons/fa";
import { FaRegFileAlt } from "react-icons/fa";
import { UploadDatasetButton } from "./UploadDatasetButton";

interface EmptyMessageProps {
  onRandomData: () => void;
  onUpload: (dataset: string | ArrayBuffer, uploadedFileName: string) => void;
}

export function EmptyMessage(props: EmptyMessageProps) {
  const { onRandomData, onUpload } = props;
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
        Selamat Datang!
      </Heading>
      <Text mb={6}>
        Silakan unggah file data Anda untuk memulai. Anda dapat menggunakan file CSV atau XLSX.
      </Text>
      <Box display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="center" alignItems="center">
        <UploadDatasetButton onUpload={onUpload} />
        <Text display={{ base: "none", md: "block" }} mx={4}>
          atau
        </Text>
        <Button
          leftIcon={<FaRandom />}
          colorScheme="teal"
          variant="outline"
          onClick={onRandomData}
          mt={{ base: 4, md: 0 }}
        >
          Gunakan Data Contoh
        </Button>
      </Box>
    </Box>
  );
}