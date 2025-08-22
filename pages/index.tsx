// pages/index.tsx

import Head from "next/head";
import React from "react";
import {
  Flex,
  Box,
  Text,
  Button,
  useColorMode,
  IconButton,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  MdDashboard,
  FaTable,
  FaCode,
  TbAnalyze,
  TbPrompt,
} from "../components/icons";
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
  DownloadSettingsModal,
} from "../components";
import { MainHeader } from "../components/layout/MainHeader";
import { Loader } from "../components/layout/Loader";
import { Table } from "../components/layout/Table";
import { generatePrompt } from "../openai/client";
import { getRandomDataset } from "../openai/sample";
import { IDashboard, IDataset, ISettings } from "../types";
import { parseData } from "../utils/parseData";
import gtag from "../lib/gtag";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Home() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [view, setView] = React.useState<
    "prompt" | "code" | "dashboard" | "table"
  >("dashboard");
  const [settings, setSettings] = React.useState<ISettings>({
    apikey: "", // Kunci API sekarang hanya sebagai penanda di sisi klien
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

  const dashboardRef = React.useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = React.useState(false);
  const [showDownloadModal, setShowDownloadModal] = React.useState(false);

  React.useEffect(() => {
    const config = localStorage.getItem("analyzer-settings");
    if (config) {
      setSettings(JSON.parse(config) as ISettings);
    }
    const { data, dashboard, context, index } = getRandomDataset(-1);
    const parsedData = parseData(data);
    setData(parsedData);
    setDashboard(dashboard);
    setUserContext(context);
    setCurrentSampleIndex(index);
    setView("dashboard");
    setFileName("sample_data.csv");
  }, []);

  const handleAnalyze = React.useCallback(async () => {
    if (!settings.apikey) {
      setShowSettings(true);
      return;
    }
    if (data && fileName) {
      setLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch('/api/dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'analyze',
            dataset: data,
            userContext: userContext,
            fileName: fileName,
            model: settings.model,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal menghasilkan dashboard');
        }

        const result = await response.json();
        setDashboard(result.dashboard);
        setView("dashboard");
      } catch (err: any) {
        setDashboard(null);
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [data, userContext, settings, fileName]);

  const handleRandomDataset = React.useCallback(() => {
    const { data, dashboard, context, index } = getRandomDataset(currentSampleIndex);
    const parsedData = parseData(data);
    setData(parsedData);
    setDashboard(dashboard);
    setUserContext(context);
    setCurrentSampleIndex(index);
    const randomFileName = `sample_data_${index}.csv`;
    setFileName(randomFileName);
    setErrorMessage(null);
    setView("dashboard");
    
    if (settings.apikey) {
      setLoading(true);
      fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'index',
          dataset: parsedData,
          fileName: randomFileName
        })
      }).then(res => {
        if (!res.ok) throw new Error("Gagal mengindeks data random.");
        toast({ title: "Data contoh siap.", status: "success", duration: 3000, isClosable: true });
      }).catch(err => {
        setErrorMessage(err.message);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [currentSampleIndex, settings.apikey, toast]);

  const handleClear = React.useCallback(() => {
    setData(undefined);
    setDashboard(null);
    setUserContext("");
    setFileName(null);
    setErrorMessage(null);
    setView("dashboard");
  }, []);

  const handleSettingsChange = React.useCallback((settings: ISettings) => {
    localStorage.setItem("analyzer-settings", JSON.stringify(settings));
    setSettings(settings);
    setShowSettings(false);
  }, []);

  const handleShowSettings = React.useCallback(() => setShowSettings(true), []);
  const handleCloseSettings = React.useCallback(() => setShowSettings(false), []);

  const handleDatasetChange = React.useCallback(
    async (dataset: string | ArrayBuffer, uploadedFileName: string) => {
      gtag.report("event", "upload_data", { event_category: "settings", event_label: "uploaded" });
      const parsedData = parseData(dataset);
      setData(parsedData);
      setDashboard(null);
      setFileName(uploadedFileName);
      setErrorMessage(null);
      setView("table");

      if (settings.apikey && parsedData.length > 0) {
        setLoading(true);
        try {
          const response = await fetch('/api/dashboard', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'index',
              dataset: parsedData,
              fileName: uploadedFileName
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mengindeks data');
          }
          
          toast({
            title: "Data siap dianalisis.",
            description: `"${uploadedFileName}" berhasil diindeks.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });

        } catch (err: any) {
          setErrorMessage(err.message);
          toast({
            title: "Gagal Mengindeks Data.",
            description: err.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } finally {
          setLoading(false);
        }
      }
    },
    [settings.apikey, toast]
  );

  const handleClearContext = React.useCallback(() => setUserContext(""), []);
  const openDownloadModal = React.useCallback(() => setShowDownloadModal(true), []);
  const closeDownloadModal = React.useCallback(() => setShowDownloadModal(false), []);

  const handleDownloadPDF = React.useCallback((settings: { size: string; margins: number }) => {
    if (dashboardRef.current) {
      setDownloading(true);
      html2canvas(dashboardRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", settings.size);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min((pdfWidth - 2 * settings.margins) / imgWidth, (pdfHeight - 2 * settings.margins) / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = settings.margins;

        pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`dashboard_${new Date().toISOString().split('T')[0]}.pdf`);
        setDownloading(false);
      });
    }
  }, []);

  const sidebarWidth = "250px";
  const headerHeight = "50px";

  let rightPanelContent: React.ReactNode = null;
  if (loading || downloading) {
    rightPanelContent = <Loader />;
  } else if (errorMessage) {
    rightPanelContent = <OpenAIErrorMessage>{errorMessage}</OpenAIErrorMessage>;
  } else if (view === "dashboard") {
    if (dashboard && data) {
      rightPanelContent = <Dashboard dashboard={dashboard!} data={data!} ref={dashboardRef} />;
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
            setDashboard(null);
          }}
        />
      </Box>
    );
  } else if (view === "prompt") {
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

      <MainHeader
        onSettingsClick={handleShowSettings}
        onRandomData={handleRandomDataset}
        fileName={fileName}
        onUpload={handleDatasetChange}
        onDownloadPDF={openDownloadModal}
        isDownloading={downloading}
        isDashboardView={view === "dashboard" && dashboard !== null}
      />

      <Flex
        direction="row"
        flexGrow={1}
        mt={headerHeight}
        height="calc(100vh - 50px)"
        overflow="hidden"
      >
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
          <Box mb={6} flexShrink={0} pt={4}>
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
              >
                Code
              </Button>
            </Tooltip>
          </Box>
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
              colorScheme="green"
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
        <Box
          ref={dashboardRef}
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
      {(loading || downloading) && <Loader />}
      {showSettings && (
        <SettingsModal
          value={settings}
          onChange={handleSettingsChange}
          onCancel={handleCloseSettings}
        />
      )}
      {showDownloadModal && (
        <DownloadSettingsModal
          isOpen={showDownloadModal}
          onClose={closeDownloadModal}
          onDownload={handleDownloadPDF}
          dashboardContentRef={dashboardRef}
        />
      )}
    </>
  );
}