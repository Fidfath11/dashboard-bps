import React from "react";
import { IDashboard, IDataset } from "../../types";
import {
  Box,
  Flex,
  Heading,
  Divider,
  SimpleGrid,
  Wrap,
  WrapItem,
  useColorMode,
} from "@chakra-ui/react";
import { DropdownFilter } from "./DropdownFilter";
import { PerformanceIndicator } from "./PerformanceIndicator";
import { DashboardPanel } from "./DashboardPanel";
import { shuffleArray } from "../../utils/parseFunc";

interface DashboardProps {
  dashboard: IDashboard;
  data: IDataset;
}

export const Dashboard = React.forwardRef<HTMLDivElement, DashboardProps>((props, ref) => {
  const { colorMode } = useColorMode();
  const [filters, setFilters] = React.useState<Record<string, string>>({});

  const [chartZoomLevels, setChartZoomLevels] = React.useState<
    Record<string, number>
  >({});

  const [shuffledCharts, setShuffledCharts] = React.useState(
    props.dashboard.charts
  );

  React.useEffect(() => {
    setShuffledCharts(shuffleArray([...props.dashboard.charts]));
  }, [props.dashboard.charts]);

  const handleFilterChange = React.useCallback((column: string) => {
    return (value: string) => {
      setFilters((filters) => ({ ...filters, [column]: value }));
    };
  }, []);

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

  const handleChartTypeChange = React.useCallback(
    (chartId: string, newType: string) => {
      setShuffledCharts((prevCharts) =>
        prevCharts.map((chart) =>
          chart.title === chartId ? { ...chart, chartType: newType } : chart
        )
      );
    },
    []
  );

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

  return (
    <Box p={0} ref={ref}>
      <Wrap spacing={4} mb={6} justify="center">
        {props.dashboard.filters.map((filter, index) => {
          const options = Array.from(
            new Set(props.data.map((row) => row[filter.column]))
          ) as string[];

          return (
            <WrapItem key={`${filter.column}-${index}`}>
              <DropdownFilter
                label={filter.column}
                value={filters[filter.column]}
                onChange={handleFilterChange(filter.column)}
                options={options}
              />
            </WrapItem>
          );
        })}
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
      <SimpleGrid columns={{ base: 1, md: 2, lg: 1 }} spacing={6}>
        {shuffledCharts.map((chart, index) => (
          <DashboardPanel
            key={`${chart.title}-${index}`}
            chart={chart}
            data={filteredData}
            zoomLevel={chartZoomLevels[chart.title] || 0}
            onZoomChange={handleZoomChange}
            onChartTypeChange={handleChartTypeChange}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
});

// PERBAIKAN: Menambahkan display name
Dashboard.displayName = 'Dashboard';