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
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { ViewSelect } from "./ViewSelect";

interface MainHeaderProps {
  onSettingsClick: () => void;
  onRandomData: () => void;
  currentView: "prompt" | "code" | "dashboard";
  onViewChange: (newView: "prompt" | "code" | "dashboard") => void;
}

export function MainHeader(props: MainHeaderProps) {
  return (
    <Flex
      as="nav"
      bg="brand.primary"
      color="white"
      py={{ base: 2, md: 4 }}
      px={6}
      alignItems="center"
      justifyContent="space-between"
      boxShadow="md"
      width="full"
      minH={{ base: "60px", md: "70px" }}
      flexWrap="wrap"
    >
      {/* Bagian Kiri Header: Logo dan Judul */}
      <Flex alignItems="center" flexWrap="wrap">
        {/* LOGO BPS */}
        <Image
          src="/bps_logo.png"
          alt="Logo BPS"
          height="40px"
          width="auto"
          mr={{ base: 2, md: 3 }}
          flexShrink={0}
        />

        {/* Judul Utama yang statis */}
        <Heading
          as="h1"
          size={{ base: "md", md: "lg" }}
          mr={{ base: 2, md: 4 }}
          flexShrink={0}
        >
          BPS Dashboard Summary
        </Heading>

        {/* Teks "Upload your CSV dataset or try it with random data." */}
        <Text
          fontSize={{ base: "xs", md: "sm" }}
          color="whiteAlpha.800"
          flexShrink={1}
          minW={{ base: "auto", md: "150px" }}
          display={{ base: "none", md: "block" }}
        >
          Upload your CSV dataset or{" "}
          <span
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
            onClick={props.onRandomData}
          >
            try it with random data.
          </span>
        </Text>
      </Flex>

      <Spacer display={{ base: "none", md: "block" }} />

      {/* Bagian Kanan Header: View Select, dan Settings */}
      <Flex
        alignItems="center"
        ml={{ base: 0, md: 4 }}
        flexShrink={0}
        flexGrow={0}
      >
        <ViewSelect value={props.currentView} onChange={props.onViewChange} />

        <IconButton
          icon={<SettingsIcon />}
          aria-label="Settings"
          variant="ghost"
          colorScheme="whiteAlpha"
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
