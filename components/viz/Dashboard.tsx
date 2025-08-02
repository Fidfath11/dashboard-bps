// D:\BPS_Dashboard\ai-data-dashboard\components\viz\Dashboard.tsx

import React from "react";
import { IDashboard, IDataset, IDatasetRecord } from "../../types";

import {
  Box,
  Flex,
  Heading,
  Divider,
  SimpleGrid,
  Wrap,
  WrapItem,
  IconButton,
  useColorMode, 
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { DropdownFilter } from "./DropdownFilter";
import { PerformanceIndicator } from "./PerformanceIndicator";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";
import { TreemapChart } from "./TreemapChart";
import { shuffleArray } from "../../utils/parseFunc";

export function Dashboard(
  props: React.PropsWithChildren<{
    dashboard: IDashboard;
    data: IDataset;
  }>
) {
  const { colorMode } = useColorMode(); 
  const [filters, setFilters] = React.useState<
    Pick<IDatasetRecord, keyof IDatasetRecord>
  >({});

  const [chartZoomLevels, setChartZoomLevels] = React.useState<
    Record<string, number>
  >({});

  const [shuffledCharts, setShuffledCharts] = React.useState(
    props.dashboard.charts
  );

  React.useEffect(() => {
    // Fitur Acak chart saat dashboard baru dimuat
    setShuffledCharts(shuffleArray([...props.dashboard.charts]));
  }, [props.dashboard.charts]);

  const handleFilterChange = React.useCallback((filter: string) => {
    return (value: string) => {
      setFilters((filters) => ({ ...filters, [filter]: value }));
    };
  }, []);

  const filteredData = React.useMemo(() => {
    if (Object.keys(filters).length) {
      return Object.keys(filters).reduce((result, key) => {
        if (filters[key])
          return result.filter((row) => row[key] == filters[key]);
        return result;
      }, props.data);
    }
    return props.data;
  }, [filters, props.data]);

  const handleZoomChange = React.useCallback(
    (chartId: string, delta: number) => {
      setChartZoomLevels((prevLevels) => {
        const currentLevel = prevLevels[chartId] || 0;
        const newLevel = Math.max(-2, currentLevel + delta);
        return { ...prevLevels, [chartId]: newLevel };
      });
    },
    []
  );

  const dashboardBoxShadow =
    colorMode === "light" ? "md" : "0px 4px 6px rgba(255, 255, 255, 0.1)";
  const cardBorderColor = colorMode === "light" ? "gray.200" : "gray.700";

  return (
    <Box p={0}>
      {" "}
      <Wrap spacing={4} mb={6} justify="center">
        {props.dashboard.filters.map((filter, index) => (
          <WrapItem key={`${filter.column}-${index}`}>
            <DropdownFilter
              config={filter}
              data={props.data}
              onChange={handleFilterChange(filter.column)}
              value={filters[filter.column]}
            />
          </WrapItem>
        ))}
      </Wrap>
      <Divider
        mb={6}
        borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
      />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
        {props.dashboard.kpis.map((kpi, index) => (
          <PerformanceIndicator
            key={`${kpi.title}-${index}`}
            config={kpi}
            data={filteredData}
            index={index}
          />
        ))}
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1 }} spacing={6} mb={6}>
        {shuffledCharts.map((chart, index) => (
          <Flex
            key={`${chart.title}-${index}`}
            direction="column"
            p={4}
            borderRadius="lg"
            boxShadow={dashboardBoxShadow}
            bg={colorMode === "light" ? "whiteAlpha.900" : "gray.900"}
            borderWidth="2px"
            borderColor={cardBorderColor}
            minH="400px"
            maxH="450px"
            overflowX={
              chart.chartType === "barChart" ||
              chart.chartType === "lineChart" ||
              chart.chartType === "treemapChart"
                ? "auto"
                : "hidden"
            }
            overflowY="hidden"
          >
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Heading
                as="h3"
                size="md"
                textAlign="center"
                flexGrow={1}
                color={colorMode === "light" ? "gray.800" : "whiteAlpha.900"}
              >
                {chart.title}
              </Heading>
              {(chart.chartType === "barChart" ||
                chart.chartType === "lineChart") && (
                <Flex ml={2}>
                  <IconButton
                    size="xs"
                    icon={<MinusIcon />}
                    aria-label="Zoom Out"
                    onClick={() => handleZoomChange(chart.title, -1)}
                    isDisabled={chartZoomLevels[chart.title] <= -2}
                    mr={1}
                    colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"}
                  />
                  <IconButton
                    size="xs"
                    icon={<AddIcon />}
                    aria-label="Zoom In"
                    onClick={() => handleZoomChange(chart.title, 1)}
                    colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"}
                  />
                </Flex>
              )}
            </Flex>

            <Box flexGrow={1} position="relative">
              {chart.chartType === "lineChart" && (
                <LineChart
                  config={chart}
                  data={filteredData}
                  zoomLevel={chartZoomLevels[chart.title]}
                />
              )}
              {chart.chartType === "barChart" && (
                <BarChart
                  config={chart}
                  data={filteredData}
                  zoomLevel={chartZoomLevels[chart.title]}
                />
              )}
              {chart.chartType === "pieChart" && (
                <PieChart config={chart} data={filteredData} />
              )}
              {chart.chartType === "treemapChart" && (
                <TreemapChart config={chart} data={filteredData} />
              )}
            </Box>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
}
