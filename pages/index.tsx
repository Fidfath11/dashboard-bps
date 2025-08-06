// D:\BPS_Dashboard\ai-data-dashboard\pages\index.tsx

import Head from "next/head";
import React from "react";

import {
  Flex,
  Box,
  Text,
  Button,
  IconButton,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";

// Import ikon dari react-icons
import { MdDashboard } from "react-icons/md";
import { FaTable, FaCode } from "react-icons/fa";
import { TbAnalyze } from "react-icons/tb";
import { TbPrompt } from "react-icons/tb";
import { DeleteIcon } from "@chakra-ui/icons";

import {
  SettingsModal,
  Dashboard,
  CodeHighlighter,
  TextAreaInput,
  OpenAIErrorMessage,
  EmptyMessage,
  DataLoadedMessage,
  MissingApiKeyMessage,
  UploadDatasetButton,
} from "../components";

import { MainHeader } from "../components/layout/MainHeader";
import { Loader } from "../components/layout/Loader";
import { Table } from "../components/layout/Table";

import { generateDashboard, generatePrompt } from "../openai";
import { getRandomDataset } from "../openai/sample";
import { IDashboard, IDataset, ISettings } from "../types";
import { parseData } from "../utils/parseData";
import gtag from "../lib/gtag";

export default function Home() {
  const { colorMode } = useColorMode();
  const [view, setView] = React.useState<
    "prompt" | "code" | "dashboard" | "table"
  >("dashboard");
  const [settings, setSettings] = React.useState<ISettings>({
    apikey: "",
    sampleRows: 10,
    model: "",
  });
  const [loading, setLoading] = React.useState(false);

  const [data, setData] = React.useState<IDataset>();
  const [userContext, setUserContext] = React.useState<string>("");
  const [fileName, setFileName] = React.useState<string | null>(null);

  const [currentSampleIndex, setCurrentSampleIndex] = React.useState(-1);
  const [dashboard, setDashboard] = React.useState<IDashboard | null>();
  const [showSettings, setShowSettings] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const config = localStorage.getItem("analyzer-settings");
    if (config) {
      setSettings(JSON.parse(config) as ISettings);
    }

    const { data, dashboard, context, index } = getRandomDataset(-1);
    setData(parseData(data));
    setDashboard(dashboard);
    setUserContext(context);
    setCurrentSampleIndex(index);
    setView("dashboard");
  }, []);

  const handleAnalyze = React.useCallback(() => {
    if (!settings.apikey) {
      setShowSettings(true);
    } else if (data) {
      setLoading(true);
      setErrorMessage(null);
      generateDashboard(
        data!,
        userContext,
        settings.sampleRows,
        settings.apikey,
        settings.model
      )
        .then((response) => {
          setDashboard(response.dashboard);
          setLoading(false);
          if (response.dashboard) {
            setView("dashboard");
          }
        })
        .catch((err) => {
          setDashboard(null);
          setLoading(false);
          setErrorMessage(
            "Gagal menghasilkan dashboard. Coba periksa koneksi internet atau API key Anda."
          );
        });
    }
  }, [data, userContext, settings, setView]);

  const handleRandomDataset = React.useCallback(() => {
    const { data, dashboard, context, index } =
      getRandomDataset(currentSampleIndex);
    setData(parseData(data));
    setDashboard(dashboard);
    setUserContext(context);
    setCurrentSampleIndex(index);
    setFileName(null);
    setErrorMessage(null);
    setView("dashboard");
  }, [currentSampleIndex, setView]);

  const handleClear = React.useCallback(() => {
    setData(undefined);
    setDashboard(null);
    setUserContext("");
    setFileName(null);
    setErrorMessage(null);
    setView("dashboard");
  }, [setView]);

  const handleSettingsChange = React.useCallback((settings: ISettings) => {
    localStorage.setItem("analyzer-settings", JSON.stringify(settings));
    setSettings(settings);
    setShowSettings(false);
  }, []);

  const handleShowSettings = React.useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = React.useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleDatasetChange = React.useCallback(
    (dataset: string | ArrayBuffer, uploadedFileName: string) => {
      gtag.report("event", "upload_data", {
        event_category: "settings",
        event_label: "uploaded",
      });
      setData(parseData(dataset));
      setDashboard(null);
      setFileName(uploadedFileName);
      setErrorMessage(null);
      setView("table");
    },
    [setView]
  );

  const handleClearContext = React.useCallback(() => {
    setUserContext("");
  }, []);

  const sidebarWidth = "250px";
  const headerHeight = "50px";

  // Konten yang akan dirender di panel kanan berdasarkan 'view' state
  let rightPanelContent: React.ReactNode = null;
  if (loading) {
    rightPanelContent = <Loader />;
  } else if (errorMessage) {
    rightPanelContent = <OpenAIErrorMessage>{errorMessage}</OpenAIErrorMessage>;
  } else if (view === "dashboard") {
    if (dashboard && data) {
      rightPanelContent = <Dashboard dashboard={dashboard!} data={data!} />;
    } else if (!settings.apikey && !data) {
      rightPanelContent = (
        <MissingApiKeyMessage
          onApiKeyClick={handleShowSettings}
          onRandomData={handleRandomDataset}
        />
      );
    } else if (settings.apikey && !data) {
      rightPanelContent = (
        <EmptyMessage
          onRandomData={handleRandomDataset}
          onUpload={handleDatasetChange}
        />
      );
    } else if (settings.apikey && data && !dashboard) {
      rightPanelContent = <DataLoadedMessage onAnalyze={handleAnalyze} />;
    } else {
      rightPanelContent = null;
    }
  } else if (view === "code") {
    rightPanelContent = dashboard && <CodeHighlighter dashboard={dashboard!} />;
  } else if (view === "table") {
    rightPanelContent = (
      <Box flexGrow={1} display="flex" flexDirection="column">
        <Flex justifyContent="space-between" mb={4}>
          <UploadDatasetButton onUpload={handleDatasetChange} />
          <Button
            variant="outline"
            colorScheme="blue"
            leftIcon={<DeleteIcon />}
            disabled={!data}
            onClick={handleClear}
            borderRadius="md"
            flexGrow={1}
            ml={2}
            maxW="120px"
            size="sm"
          >
            Clear
          </Button>
        </Flex>
        <Table
          data={data || []}
          onChange={(newData) => {
            setData(newData);
            setDashboard(null); // Tambahkan ini agar dashboard direset saat tabel diubah
          }}
        />
      </Box>
    );
  } else if (view === "prompt") {
    // Hanya panggil generatePrompt jika data ada
    const generatedPromptValue = data
      ? generatePrompt(data!, userContext, settings.sampleRows, settings.model)
      : "Upload data dan masukkan konteks untuk melihat prompt yang dihasilkan.";

    rightPanelContent = (
      <Box flexGrow={1} display="flex" flexDirection="column">
        <Text mb={4} color={colorMode === "light" ? "black" : "whiteAlpha.900"}>
          You can see the generated prompt code here.
        </Text>
        <TextAreaInput
          disabled
          value={generatedPromptValue}
          minH="490px"
          flexGrow={1}
          placeholder="Generated prompt code will appear here..."
        />
      </Box>
    );
  } else {
    rightPanelContent = null;
  }

  return (
    <>
      <Head>
        <title>BPS AI Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="BPS" />
        <meta name="og:type" content="website" />
        <meta property="og:image" content="" />
        <meta property="og:title" content="BPS AI Dashboard" />
        <meta
          property="og:description"
          content="Visualize data with our tool created using OpenAI's GPT3 technology"
        />
        <meta name="og:url" content="" />
        <meta name="twitter:creator" content="BPS" />
        <meta property="twitter:image" content="" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BPS AI Dashboard" />
        <meta name="twitter:url" content="" />
        <meta
          property="twitter:description"
          content="Visualize and analyze data with our app created using OpenAI's GPT3"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* MainHeader sudah fixed di posisinya */}
      <MainHeader
        onSettingsClick={handleShowSettings}
        onRandomData={handleRandomDataset}
        fileName={fileName} // Meneruskan fileName ke MainHeader
        onUpload={handleDatasetChange} // Meneruskan fungsi upload ke MainHeader
      />

      {/* Konten utama di bawah header: Sidebar + Panel Kanan */}
      <Flex
        direction="row"
        flexGrow={1}
        mt={headerHeight}
        height="calc(100vh - 50px)"
        overflow="hidden"
      >
        {/* Panel Kiri (Sidebar) */}
        <Box
          width="250px"
          bg={colorMode === "light" ? "white" : "gray.800"}
          color={colorMode === "light" ? "black" : "whiteAlpha.900"}
          p={4}
          borderRadius="lg"
          boxShadow={colorMode === "light" ? "lg" : "dark-lg"}
          display="flex"
          flexDirection="column"
          height="100%"
          overflowY="hidden"
          flexShrink={0}
        >
          {/* Menu Navigasi */}
          <Box mb={6} flexShrink={0} pt={4}>
            {/* Menggunakan Tooltip untuk informasi tambahan pada ikon */}
            <Tooltip label="View Dashboard" placement="right">
              <Button
                variant="ghost"
                width="full"
                justifyContent="flex-start"
                mb={2}
                onClick={() => setView("dashboard")}
                leftIcon={<MdDashboard />}
                isActive={view === "dashboard"}
                _active={{ bg: "blue.500", color: "white" }}
                _hover={{
                  bg:
                    view === "dashboard"
                      ? "blue.500"
                      : colorMode === "light"
                      ? "gray.100"
                      : "whiteAlpha.200",
                  color:
                    view === "dashboard"
                      ? "white"
                      : colorMode === "light"
                      ? "gray.800"
                      : "whiteAlpha.800",
                }}
              >
                Dashboard
              </Button>
            </Tooltip>
            <Tooltip label="View Data Table" placement="right">
              <Button
                variant="ghost"
                width="full"
                justifyContent="flex-start"
                mb={2}
                onClick={() => setView("table")}
                leftIcon={<FaTable />}
                isActive={view === "table"}
                _active={{ bg: "blue.500", color: "white" }}
                _hover={{
                  bg:
                    view === "table"
                      ? "blue.500"
                      : colorMode === "light"
                      ? "gray.100"
                      : "whiteAlpha.200",
                  color:
                    view === "table"
                      ? "white"
                      : colorMode === "light"
                      ? "gray.800"
                      : "whiteAlpha.800",
                }}
              >
                Table
              </Button>
            </Tooltip>
            <Tooltip label="View Generated Prompt" placement="right">
              <Button
                variant="ghost"
                width="full"
                justifyContent="flex-start"
                mb={2}
                onClick={() => setView("prompt")}
                leftIcon={<TbPrompt />}
                isActive={view === "prompt"}
                _active={{ bg: "blue.500", color: "white" }}
                _hover={{
                  bg:
                    view === "prompt"
                      ? "blue.500"
                      : colorMode === "light"
                      ? "gray.100"
                      : "whiteAlpha.200",
                  color:
                    view === "prompt"
                      ? "white"
                      : colorMode === "light"
                      ? "gray.800"
                      : "whiteAlpha.800",
                }}
              >
                Prompt
              </Button>
            </Tooltip>
            <Tooltip label="View Generated Code" placement="right">
              <Button
                variant="ghost"
                width="full"
                justifyContent="flex-start"
                mb={0}
                onClick={() => setView("code")}
                leftIcon={<FaCode />}
                isActive={view === "code"}
                _active={{ bg: "blue.500", color: "white" }}
                _hover={{
                  bg:
                    view === "code"
                      ? "blue.500"
                      : colorMode === "light"
                      ? "gray.100"
                      : "whiteAlpha.200",
                  color:
                    view === "code"
                      ? "white"
                      : colorMode === "light"
                      ? "gray.800"
                      : "whiteAlpha.800",
                }}
              >
                Code
              </Button>
            </Tooltip>
          </Box>
          {/* Area untuk TextAreaInput dan Analyze Button (Selalu di Sidebar) */}
          <Box flexGrow={0} display="flex" flexDirection="column" pt={0}>
            <TextAreaInput
              label={
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  width="full"
                >
                  <Text color={colorMode === "light" ? "black" : "white"}>
                    Context about the data
                  </Text>
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Clear Context"
                    variant="ghost"
                    colorScheme={colorMode === "light" ? "gray" : "white"}
                    _hover={{
                      bg: colorMode === "light" ? "gray.100" : "whiteAlpha.200",
                    }}
                    size="sm"
                    onClick={handleClearContext}
                  />
                </Flex>
              }
              value={userContext}
              onChange={setUserContext}
              mb={0}
              flexGrow={1}
              minH="170px"
              placeholder="Provide additional context about your data here..."
            />
            <Button
              colorScheme={colorMode === "light" ? "green" : "teal"}
              rightIcon={
                settings?.apikey && dashboard && data ? <TbAnalyze /> : undefined
              }
              onClick={handleAnalyze}
              disabled={!data && !!settings?.apikey}
              borderRadius="md"
              width="full"
              mt={2}
              flexShrink={0}
            >
              {(() => {
                if (!settings.apikey) return "Set up your API KEY";
                return dashboard && data ? "Re-analyze" : "Analyze";
              })()}
            </Button>
          </Box>
        </Box>
        {/* Panel Kanan (Konten Utama Dashboard) */}
        <Box
          flex="1"
          p={6}
          borderRadius="lg"
          display="flex"
          flexDirection="column"
          height="100%"
          overflowY="auto"
          ml="15px"
          mt={15}
          color={colorMode === "light" ? "black" : "whiteAlpha.900"}
        >
          {rightPanelContent}
        </Box>
      </Flex>

      {loading && <Loader />}
      {showSettings && (
        <SettingsModal
          value={settings}
          onChange={handleSettingsChange}
          onCancel={handleCloseSettings}
        />
      )}
    </>
  );
}