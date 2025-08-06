import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Heading,
  useColorMode,
  Select,
  FormControl,
  FormLabel,
  Flex,
  Input,
  Text,
  Spinner,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";

interface DownloadSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (settings: { size: string; margins: number }) => void;
  dashboardContentRef: React.RefObject<HTMLDivElement>;
}

const paperSizes = [
  { label: "A4 (210 x 297 mm)", value: "a4" },
  { label: "A3 (297 x 420 mm)", value: "a3" },
  { label: "Letter (8.5 x 11 in)", value: "letter" },
];

export function DownloadSettingsModal(props: DownloadSettingsModalProps) {
  const { isOpen, onClose, onDownload, dashboardContentRef } = props;
  const { colorMode } = useColorMode();
  const [selectedSize, setSelectedSize] = useState("a4");
  const [margins, setMargins] = useState(10);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // PERBAIKAN: Menggunakan useCallback untuk generatePreview
  const generatePreview = useCallback(async () => {
    if (dashboardContentRef.current) {
      setIsLoadingPreview(true);
      const canvas = await html2canvas(dashboardContentRef.current, { scale: 1 });
      setPreviewImage(canvas.toDataURL("image/png"));
      setIsLoadingPreview(false);
    }
  }, [dashboardContentRef]);

  useEffect(() => {
    if (isOpen) {
      generatePreview();
    }
  }, [isOpen, generatePreview]); // PERBAIKAN: Menambahkan generatePreview ke dependency array

  const handleDownloadClick = () => {
    onDownload({ size: selectedSize, margins });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={colorMode === "light" ? "white" : "gray.800"}>
        <ModalHeader borderBottom="1px" borderColor={colorMode === "light" ? "gray.200" : "gray.600"}>
          <Heading size="md">Pengaturan Unduhan PDF</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            <Box flex={{ base: 1, md: 0.4 }} p={4} borderRadius="md" bg={colorMode === "light" ? "gray.50" : "gray.700"}>
              <FormControl mb={4}>
                <FormLabel>Ukuran Halaman</FormLabel>
                <Select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                  {paperSizes.map((size) => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Margin (mm)</FormLabel>
                <Input
                  type="number"
                  value={margins}
                  onChange={(e) => setMargins(Number(e.target.value))}
                />
              </FormControl>
              <Button onClick={generatePreview} isLoading={isLoadingPreview} colorScheme="blue" size="sm">
                Perbarui Pratinjau
              </Button>
            </Box>
            <Box flex={{ base: 1, md: 0.6 }} p={4} borderRadius="md" borderWidth="1px" borderColor={colorMode === "light" ? "gray.200" : "gray.600"}>
              <Heading size="sm" mb={2}>Pratinjau</Heading>
              <Box height="250px" overflowY="auto" position="relative" bg="white" boxShadow="inner">
                {isLoadingPreview ? (
                  <Flex align="center" justify="center" height="100%">
                    <Spinner size="lg" />
                  </Flex>
                ) : (
                  <img
                    src={previewImage || ""}
                    alt="Pratinjau Dashboard"
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                )}
              </Box>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter borderTop="1px" borderColor={colorMode === "light" ? "gray.200" : "gray.600"}>
          <Button variant="ghost" onClick={onClose} mr={3}>
            Batal
          </Button>
          <Button colorScheme="blue" onClick={handleDownloadClick} isDisabled={isLoadingPreview}>
            Unduh
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}