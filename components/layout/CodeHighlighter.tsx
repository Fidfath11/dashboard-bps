import {
  useColorMode,
  Box,
  Heading,
  Flex,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  a11yDark,
  a11yLight,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { LuCopy, LuCheck } from "react-icons/lu";
import { IDashboard } from "../../types";

interface CodeHighlighterProps {
  dashboard: IDashboard;
}

export function CodeHighlighter(props: CodeHighlighterProps) {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [copied, setCopied] = React.useState(false);

  const theme = colorMode === "light" ? a11yLight : a11yDark;

  const codeString = JSON.stringify(props.dashboard, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    toast({
      title: "Kode Berhasil Disalin!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Box
      flexGrow={1}
      bg={colorMode === "light" ? "gray.50" : "gray.900"}
      color={colorMode === "light" ? "black" : "whiteAlpha.900"}
      borderRadius="md"
      p={0}
      overflow="hidden"
      position="relative"
    >
      <Flex
        as="header"
        alignItems="center"
        justifyContent="space-between"
        bg={colorMode === "light" ? "gray.100" : "gray.700"}
        p={3}
        borderBottom="1px"
        borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
      >
        <Heading size="sm">Dashboard Code</Heading>
        <Button
          leftIcon={copied ? <LuCheck /> : <LuCopy />}
          onClick={handleCopy}
          size="sm"
          variant="ghost"
          colorScheme={copied ? "green" : "gray"}
        >
          {copied ? "Disalin!" : "Salin Kode"}
        </Button>
      </Flex>
      <Box
        overflowY="auto"
        height="calc(100% - 50px)" // Tinggi disesuaikan dengan tinggi header
        p={4}
      >
        <SyntaxHighlighter language="json" style={theme}>
          {codeString}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
}