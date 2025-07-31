// D:\BPS_Dashboard\ai-data-dashboard\pages\index.tsx

import Head from "next/head";
import React from "react";

import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { SettingsIcon, DeleteIcon, ArrowForwardIcon } from "@chakra-ui/icons";

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
  const [view, setView] = React.useState<"prompt" | "code" | "dashboard">(
    "dashboard"
  );
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
    setView("prompt");
  }, []);

  const handleAnalyze = React.useCallback(() => {
    if (!settings.apikey) {
      setShowSettings(true);
    } else if (data) {
      setLoading(true);
      setErrorMessage(null);
      generateDashboard(
        data,
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
      setView("prompt");
    },
    [setView]
  );

  const handleClick = React.useCallback(() => {
    setUserContext(" ");
  }, []);

  const handleClearContext = React.useCallback(() => {
    setUserContext("");
  }, []);

  return (
    <>
      <Head>
        <title>BPS AI Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="BPS" />
        <meta name="og:type" content="website" />
        <meta
          property="og:image"
          content=""
        />
        <meta property="og:title" content="BPS AI Dashboard" />
        <meta
          property="og:description"
          content="Visualize data with our tool created using OpenAI's GPT3 technology"
        />
        <meta
          name="og:url"
          content=""
        />
        <meta name="twitter:creator" content="BPS" />
        <meta
          property="twitter:image"
          content=""
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BPS AI Dashboard" />
        <meta
          name="twitter:url"
          content=""
        />
        <meta
          property="twitter:description"
          content="Visualize and analyze data with our app created using OpenAI's GPT3"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainHeader
        onSettingsClick={handleShowSettings}
        onRandomData={handleRandomDataset}
        currentView={view}
        onViewChange={setView}
      />

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={6}
        p={6}
        width="full"
        maxW="1440px"
        mx="auto"
        flexGrow={1}
        height="calc(100vh - 70px)"
        overflowY="auto"
      >
        <Box
          flex="0 0 auto"
          width={{ base: "full", md: "300px", lg: "400px" }}
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
          minH={{ base: "auto", md: "calc(100vh - 150px)" }}
        >
          <Heading as="h2" size="md" mb={4} color="brand.primary">
            {fileName || "AI Data Dashboard"}
          </Heading>

          <Table
            data={data || []}
            onChange={(newData) => {
              setData(newData);
            }}
          />

          <Flex justifyContent="space-between" mb={4} mt={4}>
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

          <TextAreaInput
            label={
              <Flex
                alignItems="center"
                justifyContent="space-between"
                width="full"
              >
                <Text>Context about the data</Text>
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Clear Context"
                  variant="ghost"
                  colorScheme="gray"
                  size="sm"
                  onClick={handleClearContext}
                />
              </Flex>
            }
            value={userContext}
            onChange={setUserContext}
            mb={4}
          />

          <Button
            colorScheme="green"
            rightIcon={
              settings?.apikey && dashboard && data ? (
                <ArrowForwardIcon />
              ) : undefined
            }
            onClick={handleAnalyze}
            disabled={!data && !!settings?.apikey}
            borderRadius="md"
            width="full"
            mt={0}
          >
            {(() => {
              if (!settings.apikey) return "Set up your API KEY";
              return dashboard && data ? "Re-analyze" : "Analyze";
            })()}
          </Button>
        </Box>

        <Box
          flex="1"
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="lg"
          height="full"
          overflowY="auto"
        >
          {!settings.apikey && !data && !dashboard ? (
            <MissingApiKeyMessage
              onApiKeyClick={handleShowSettings}
              onRandomData={handleRandomDataset}
            />
          ) : null}
          {settings.apikey && !data && !dashboard ? (
            <EmptyMessage
              onRandomData={handleRandomDataset}
              onUpload={handleDatasetChange}
            />
          ) : null}
          {settings.apikey && data && !dashboard ? (
            <DataLoadedMessage onAnalyze={handleAnalyze} />
          ) : null}
          {dashboard && data && view === "dashboard" ? (
            <Dashboard dashboard={dashboard} data={data} />
          ) : null}
          {dashboard && view === "code" ? (
            <CodeHighlighter dashboard={dashboard} />
          ) : null}
          {data && view === "prompt" && (
            <TextAreaInput
              disabled
              value={generatePrompt(
                data,
                userContext,
                settings.sampleRows,
                settings.model
              )}
              minH="300px"
            />
          )}

          {errorMessage && (
            <OpenAIErrorMessage>{errorMessage}</OpenAIErrorMessage>
          )}
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
