// D:\BPS_Dashboard\ai-data-dashboard\components\layout\WelcomeHeader.tsx

// --- Import Komponen React dan Chakra UI ---
import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  Spacer,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

// --- Import Komponen Internal Proyek ---
import { ViewSelect } from "./ViewSelect";

// --- Interface untuk Props Komponen ---
interface WelcomeHeaderProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

// --- Komponen WelcomeHeader ---
export function WelcomeHeader(props: WelcomeHeaderProps) {
  const [currentView, setCurrentView] = useState<
    "prompt" | "code" | "dashboard"
  >("dashboard");

  // Handler ketika tampilan berubah
  const handleViewChange = (newView: "prompt" | "code" | "dashboard") => {
    setCurrentView(newView);
  };

  return (
    <Flex
      as="header"
      bg="brand.primary"
      color="white"
      py={4}
      px={6}
      alignItems="center"
      justifyContent="space-between"
      boxShadow="md"
      width="full" // Memastikan header membentang penuh lebar layar
      minH="70px" // Tinggi minimum untuk header, agar tidak terlalu kecil
    >
      <Box mr={4}></Box>

      {/* Bagian Judul dan Sub-judul */}
      <Flex direction="column" alignItems="flex-start">
        <Heading as="h1" size="lg" flexShrink={0} mr={4}>
          {props.title}
        </Heading>
        {props.subtitle && (
          <Text fontSize="sm" mt={1} color="whiteAlpha.800">
            {props.subtitle}
          </Text>
        )}
      </Flex>

      <Spacer />

      {/* Bagian Kanan Header: View Select dan Settings */}
      <Flex alignItems="center">
        <ViewSelect value={currentView} onChange={handleViewChange} />
        <IconButton
          icon={<SettingsIcon />}
          aria-label="Settings"
          variant="ghost"
          colorScheme="whiteAlpha"
          borderRadius="md"
          size="lg"
          onClick={() => {}}
        />
      </Flex>
    </Flex>
  );
}
