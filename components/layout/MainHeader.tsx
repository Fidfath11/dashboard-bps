// D:\BPS_Dashboard\ai-data-dashboard\components\layout\MainHeader.tsx

import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  Spacer,
  Image,
  Button,
  useColorMode, // Import useColorMode
} from "@chakra-ui/react";

import { FaRegFileAlt } from "react-icons/fa";
import { FaRandom } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";

import { SunIcon, MoonIcon } from "@chakra-ui/icons";

interface MainHeaderProps {
  onSettingsClick: () => void;
  onRandomData: () => void;
  currentView: "prompt" | "code" | "dashboard" | "table";
  onViewChange: (newView: "prompt" | "code" | "dashboard" | "table") => void;
  fileName?: string | null;
  onUpload: (dataset: string | ArrayBuffer, uploadedFileName: string) => void;
}

export function MainHeader(props: MainHeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode(); // Dapatkan colorMode dari hook
  const fileNameDisplay = props.fileName
    ? props.fileName
    : "Upload your data to get started! or";

  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const handleUploadFileClick = React.useCallback(() => {
    inputFileRef.current?.click?.();
  }, []);

  const handleUploadFile = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files.length > 0) {
        const inputFile = e.target.files[0];
        const reader = new FileReader();

        const isCSV = inputFile.name.endsWith(".csv");
        const isXLSX =
          inputFile.name.endsWith(".xlsx") ||
          inputFile.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const fileName = inputFile.name;

        reader.onload = function (event) {
          if (isCSV) {
            const text = event?.target?.result as string;
            if (text) {
              props.onUpload?.(text, fileName);
            }
          } else if (isXLSX) {
            const arrayBuffer = event?.target?.result as ArrayBuffer;
            if (arrayBuffer) {
              props.onUpload?.(arrayBuffer, fileName);
            }
          }
        };

        if (isCSV) {
          reader.readAsText(inputFile);
        } else if (isXLSX) {
          reader.readAsArrayBuffer(inputFile);
        }
      }
    },
    [props.onUpload]
  );

  return (
    <Flex
      as="header"
      bg={colorMode === "light" ? "white" : "gray.800"}
      color={colorMode === "light" ? "black" : "white"}
      py={{ base: 1, md: 2 }}
      px={6}
      alignItems="center"
      justifyContent="space-between"
      boxShadow={
        colorMode === "light" ? "md" : "0px 4px 6px rgba(255, 255, 255, 0.1)"
      }
      width="full"
      minH={{ base: "45px", md: "50px" }}
      position="fixed"
      top={0}
      left={0}
      zIndex={999}
    >
      {/* Bagian Kiri Header: Logo BPS dan BPS VISTA */}
      <Flex alignItems="center" flexShrink={0}>
        <Image
          src="/bps_logo.png"
          alt="Logo BPS"
          height="30px"
          width="auto"
          mr={1}
        />
        <Heading
          as="h1"
          size={{ base: "sm", md: "md" }}
          mr={{ base: 2, md: 4 }}
          // --- PENTING: Terapkan className secara kondisional ---
          className={colorMode === "light" ? "bps-vista-gradient-light" : "bps-vista-gradient-dark"}
          // --- END PENTING ---
          fontFamily="heading" // Menggunakan 'heading' dari tema (Roboto)
          // Properti underline sudah dihapus
        >
          BPS VISTA
        </Heading>
      </Flex>
      <Spacer />{" "}
      {/* Bagian Kanan Header: Icon Data, Nama File / Upload Info, Random Data Button, Dark Mode, Settings */}
      <Flex alignItems="center" flexGrow={0}>
        {" "}
        {/* Ikon Data/File untuk Upload */}
        <IconButton
          icon={<FaRegFileAlt />}
          aria-label="Upload Data"
          variant="ghost"
          colorScheme={colorMode === "light" ? "gray" : "white"}
          _hover={{ bg: colorMode === "light" ? "gray.100" : "whiteAlpha.200" }}
          size="md"
          mr={0}
          onClick={handleUploadFileClick}
        />
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color={colorMode === "light" ? "black" : "white"}
          flexShrink={1}
          minW={{ base: "auto", md: "150px" }}
          display={{ base: "none", md: "block" }}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          mr={4}
        >
          {fileNameDisplay}
        </Text>
        {/* Tombol Random Data */}
        <Button
          leftIcon={<FaRandom />}
          size="sm"
          onClick={props.onRandomData}
          ml={4}
          mr={4}
          variant="solid"
          colorScheme={colorMode === "light" ? "gray" : "gray"}
        >
          Random Data
        </Button>
        <input
          ref={inputFileRef}
          hidden
          type="file"
          onChange={handleUploadFile}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
        {/* Ikon Dark Mode / Light Mode */}
        <IconButton
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          aria-label="Toggle color mode"
          variant="ghost"
          colorScheme={colorMode === "light" ? "gray" : "white"}
          _hover={{ bg: colorMode === "light" ? "gray.100" : "whiteAlpha.200" }}
          borderRadius="md"
          size={{ base: "md", md: "lg" }}
          mr={2}
          onClick={toggleColorMode}
        />
        <IconButton
          icon={<IoSettings />}
          aria-label="Settings"
          variant="ghost"
          colorScheme={colorMode === "light" ? "gray" : "white"}
          _hover={{ bg: colorMode === "light" ? "gray.100" : "whiteAlpha.200" }}
          borderRadius="md"
          size={{ base: "md", md: "lg" }}
          ml={{ base: 2, md: 4 }}
          flexShrink={0}
          onClick={props.onSettingsClick}
        />
      </Flex>
    </Flex>
  );
}