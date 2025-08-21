import React from "react";
import {
  Box,
  Flex,
  Heading,
  useColorMode,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Tooltip as ChakraTooltip,
  Center,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, RepeatIcon } from "@chakra-ui/icons";
import { FaExpandArrowsAlt, FaCompressArrowsAlt } from "react-icons/fa";
import { IChart, IDataset } from "../../types";
import { runFunc, IChartData } from "../../utils/parseFunc";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveTreeMap } from "@nivo/treemap";

const NivoBarChart = ({
  data,
  compactView,
  colorMode,
  tickValues,
}: {
  data: any[];
  compactView: boolean;
  colorMode: string;
  tickValues?: (string | number)[];
}) => (
  <ResponsiveBar
    data={data}
    keys={["value"]}
    indexBy="id"
    margin={{ top: 30, right: 30, bottom: 80, left: 60 }}
    padding={0.3}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    theme={{
      axis: {
        domain: { line: { stroke: colorMode === "light" ? "#aaa" : "#555" } },
        ticks: {
          text: { fill: colorMode === "light" ? "#333" : "#bbb", fontSize: 10 },
        },
      },
      grid: {
        line: {
          stroke: colorMode === "light" ? "#ddd" : "rgba(255, 255, 255, 0.2)",
        },
      },
      tooltip: {
        container: {
          background: colorMode === "light" ? "white" : "#333",
          color: colorMode === "light" ? "#333" : "white",
        },
      },
    }}
    colors={{ scheme: "nivo" }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -45,
      legend: "",

      tickValues: compactView ? tickValues : undefined,
    }}
    // PERBAIKAN: Sumbu Y tidak lagi terpengaruh compactView
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Value",
      legendPosition: "middle",
      legendOffset: -50,
    }}
    enableGridY={true}
    enableLabel={false}
  />
);
const NivoLineChart = ({
  data,
  compactView,
  colorMode,
  tickValues, // Menerima tickValues untuk custom label
}: {
  data: any[];
  compactView: boolean;
  colorMode: string;
  tickValues?: (string | number)[];
}) => (
  <ResponsiveLine
    data={data}
    margin={{ top: 30, right: 30, bottom: 80, left: 60 }}
    xScale={{ type: "point" }}
    yScale={{ type: "linear", min: "auto", max: "auto" }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -45,
      legend: "Category",
      legendPosition: "middle",
      legendOffset: 55,
      // PERBAIKAN: Menggunakan tickValues jika ada (saat compact view)
      tickValues: compactView ? tickValues : undefined,
    }}
    // PERBAIKAN: Sumbu Y tidak lagi terpengaruh compactView
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Value",
      legendPosition: "middle",
      legendOffset: -50,
    }}
    enableGridX={false}
    enableGridY={true}
    pointSize={compactView ? 2 : 8}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    useMesh={true}
    theme={{
      axis: {
        domain: { line: { stroke: colorMode === "light" ? "#aaa" : "#555" } },
        ticks: {
          text: { fill: colorMode === "light" ? "#333" : "#bbb", fontSize: 10 },
        },
      },
      grid: {
        line: {
          stroke: colorMode === "light" ? "#ddd" : "rgba(255, 255, 255, 0.2)",
        },
      },
      tooltip: {
        container: {
          background: colorMode === "light" ? "white" : "#333",
          color: colorMode === "light" ? "#333" : "white",
        },
      },
    }}
  />
);
const NivoPieChart = ({
  data,
  colorMode,
}: {
  data: any[];
  colorMode: string;
}) => (
  <ResponsivePie
    data={data}
    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
    innerRadius={0.5}
    padAngle={0.7}
    cornerRadius={3}
    activeOuterRadiusOffset={8}
    borderWidth={1}
    theme={{
      labels: { text: { fill: colorMode === "light" ? "#333" : "#eee" } },
      tooltip: {
        container: {
          background: colorMode === "light" ? "white" : "#333",
          color: colorMode === "light" ? "#333" : "white",
        },
      },
    }}
    borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor={colorMode === "light" ? "#333" : "#bbb"}
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: "color" }}
    arcLabelsSkipAngle={10}
  />
);
const NivoTreeMap = ({ data, colorMode }: { data: any; colorMode: string }) => (
  <ResponsiveTreeMap
    data={data}
    identity="name"
    value="loc"
    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
    labelSkipSize={12}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", colorMode === "light" ? 2 : 0.5]],
    }}
    parentLabelTextColor={{
      from: "color",
      modifiers: [["darker", colorMode === "light" ? 3 : 0.8]],
    }}
    borderColor={{ from: "color", modifiers: [["darker", 0.1]] }}
    theme={{
      tooltip: {
        container: {
          background: colorMode === "light" ? "white" : "#333",
          color: colorMode === "light" ? "#333" : "white",
        },
      },
    }}
  />
);

const CHART_TYPES = ["barChart", "lineChart", "pieChart", "treemapChart"];

interface NivoPanelProps {
  chart: IChart;
  data: IDataset;
  zoomLevel: number;
  onZoomChange: (chartId: string, delta: number) => void;
  onChartTypeChange: (chartId: string, newType: string) => void;
}

export function NivoPanel(props: NivoPanelProps) {
  const { chart, data, zoomLevel, onZoomChange, onChartTypeChange } = props;
  const { colorMode } = useColorMode();
  const toast = useToast();
  const [compactView, setCompactView] = React.useState(false);

  const chartData = React.useMemo(() => {
    const fallbackValue: IChartData[] = [];
    const result = runFunc(chart.javascriptFunction, data, fallbackValue);
    if (Array.isArray(result)) {
      return result.filter(
        (d) => d.y !== null && d.y !== undefined && !isNaN(d.y)
      );
    }
    return fallbackValue;
  }, [chart, data]);

  // PERBAIKAN: Membuat daftar label untuk compact view (data ke 1, 3, 5, dst.)
  const compactTickValues = React.useMemo(() => {
    if (!chartData) return [];
    return chartData.filter((_d, i) => i % 2 === 0).map((d) => d.x);
  }, [chartData]);

  const handleChartTypeChange = (newType: string) => {
    if (onChartTypeChange) {
      onChartTypeChange(chart.title, newType);
      toast({
        title: `Mengganti tipe chart ke ${newType}`,
        status: "info",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const handleZoomIn = () => onZoomChange?.(chart.title, 1);
  const handleZoomOut = () => onZoomChange?.(chart.title, -1);
  const handleCompactToggle = () => setCompactView(!compactView);

  const isZoomable =
    chart.chartType === "barChart" || chart.chartType === "lineChart";
  const zoomFactor = 1.2;
  const itemSize = 30 * Math.pow(zoomFactor, zoomLevel || 0);
  const minChartWidth = compactView
    ? "100%"
    : Math.max(500, chartData.length * itemSize);

  let chartComponent;
  if (!chartData || chartData.length === 0) {
    chartComponent = (
      <Center h="100%">
        <Text>Data tidak cukup.</Text>
      </Center>
    );
  } else {
    const barPieData = chartData.map((d: IChartData) => ({
      id: d.x,
      value: d.y,
    }));
    const lineData = [
      {
        id: chart.yAxis || "series1",
        data: chartData.map((d: IChartData) => ({ x: d.x, y: d.y })),
      },
    ];
    const treemapData = {
      name: "root",
      children: chartData.map((d: IChartData) => ({ name: d.x, loc: d.y })),
    };

    switch (chart.chartType) {
      case "barChart":
        chartComponent = (
          <NivoBarChart
            data={barPieData}
            compactView={compactView}
            colorMode={colorMode}
            tickValues={compactTickValues}
          />
        );
        break;
      case "lineChart":
        chartComponent = (
          <NivoLineChart
            data={lineData}
            compactView={compactView}
            colorMode={colorMode}
            tickValues={compactTickValues}
          />
        );
        break;
      case "pieChart":
        chartComponent = (
          <NivoPieChart data={barPieData} colorMode={colorMode} />
        );
        break;
      case "treemapChart":
        chartComponent = (
          <NivoTreeMap data={treemapData} colorMode={colorMode} />
        );
        break;
      default:
        chartComponent = <Text>Tipe chart tidak didukung.</Text>;
    }
  }

  const bgColor = colorMode === "light" ? "white" : "gray.900";
  const cardBorderColor = colorMode === "light" ? "gray.200" : "gray.700";

  return (
    <Flex
      direction="column"
      p={4}
      borderRadius="lg"
      boxShadow="md"
      bg={bgColor}
      borderWidth="2px"
      borderColor={cardBorderColor}
      minH="400px"
      maxH="450px"
      overflowX={isZoomable && !compactView ? "auto" : "hidden"}
      overflowY="hidden"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h3" size="md" textAlign="center" flexGrow={1}>
          {chart.title}
        </Heading>
        <Flex>
          {isZoomable && (
            <>
              <ChakraTooltip label="Zoom In">
                <IconButton
                  aria-label="Zoom In"
                  icon={<AddIcon />}
                  size="sm"
                  onClick={handleZoomIn}
                  mr={2}
                  isDisabled={(zoomLevel || 0) >= 5}
                />
              </ChakraTooltip>
              <ChakraTooltip label="Zoom Out">
                <IconButton
                  aria-label="Zoom Out"
                  icon={<MinusIcon />}
                  size="sm"
                  onClick={handleZoomOut}
                  mr={2}
                  isDisabled={(zoomLevel || 0) <= -2}
                />
              </ChakraTooltip>
              <ChakraTooltip
                label={compactView ? "Expand View" : "Compact View"}
              >
                <IconButton
                  aria-label="Toggle Compact View"
                  icon={
                    compactView ? (
                      <Icon as={FaExpandArrowsAlt} />
                    ) : (
                      <Icon as={FaCompressArrowsAlt} />
                    )
                  }
                  size="sm"
                  onClick={handleCompactToggle}
                  mr={2}
                />
              </ChakraTooltip>
            </>
          )}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<RepeatIcon />}
              size="sm"
              variant="outline"
            />
            <MenuList>
              {CHART_TYPES.map((type) => (
                <MenuItem
                  key={type}
                  onClick={() => handleChartTypeChange(type)}
                >
                  Ganti ke {type}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Box flexGrow={1} w="100%" position="relative">
        <Box h="100%" minWidth={minChartWidth}>
          {chartComponent}
        </Box>
      </Box>
    </Flex>
  );
}
