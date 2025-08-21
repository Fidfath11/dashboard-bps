import React from 'react';
import { IDashboard, IDataset, IChart } from '../../types';
import { Box, Wrap, WrapItem, Tabs, TabList, Tab, TabPanels, TabPanel, SimpleGrid, useColorMode, Divider } from '@chakra-ui/react';
import { DropdownFilter } from './DropdownFilter';
import { shuffleArray } from '../../utils/parseFunc';
import { RechartsTab } from './tabs/RechartsTab';
import { NivoTab } from './tabs/NivoTab';
import { PerformanceIndicator } from './PerformanceIndicator';

interface DashboardProps {
  dashboard: IDashboard;
  data: IDataset;
}

export const Dashboard = React.forwardRef<HTMLDivElement, DashboardProps>(
  (props, ref) => {
    const { colorMode } = useColorMode();
    const [filters, setFilters] = React.useState<Record<string, string>>({});
    const [chartZoomLevels, setChartZoomLevels] = React.useState<Record<string, number>>({});
    const [shuffledCharts, setShuffledCharts] = React.useState<IChart[]>(props.dashboard.charts);

    React.useEffect(() => {
      setShuffledCharts(shuffleArray([...props.dashboard.charts]));
    }, [props.dashboard.charts]);

    const handleFilterChange = React.useCallback((column: string) => {
      return (value: string) => {
        setFilters((filters) => ({ ...filters, [column]: value }));
      };
    }, []);

    const handleZoomChange = React.useCallback((chartId: string, delta: number) => {
      setChartZoomLevels((prevLevels) => {
        const currentLevel = prevLevels[chartId] || 0;
        const newLevel = Math.max(-2, Math.min(5, currentLevel + delta));
        return { ...prevLevels, [chartId]: newLevel };
      });
    }, []);

    const handleChartTypeChange = React.useCallback((chartId: string, newType: string) => {
      setShuffledCharts((prevCharts) =>
        prevCharts.map((chart) =>
          chart.title === chartId ? { ...chart, chartType: newType } : chart
        )
      );
    }, []);

    const filteredData = React.useMemo(() => {
      if (Object.keys(filters).length) {
        return Object.keys(filters).reduce((result, key) => {
          if (filters[key])
            return result.filter((row) => String(row[key]) === filters[key]);
          return result;
        }, props.data);
      }
      return props.data;
    }, [filters, props.data]);

    return (
      <Box p={4} ref={ref}>
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
        
        <Divider my={6} borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'} />

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

        <Tabs isFitted variant="enclosed-colored">
          <TabList>
            <Tab>Recharts</Tab>
            <Tab>Nivo</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <RechartsTab
                shuffledCharts={shuffledCharts}
                filteredData={filteredData}
                chartZoomLevels={chartZoomLevels}
                onZoomChange={handleZoomChange}
                onChartTypeChange={handleChartTypeChange}
              />
            </TabPanel>
            <TabPanel p={0}>
              <NivoTab
                shuffledCharts={shuffledCharts}
                filteredData={filteredData}
                chartZoomLevels={chartZoomLevels}
                onZoomChange={handleZoomChange}
                onChartTypeChange={handleChartTypeChange}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    );
  }
);

Dashboard.displayName = 'Dashboard';