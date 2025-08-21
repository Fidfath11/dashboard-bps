import React from 'react';
import { SimpleGrid, Divider, useColorMode, Box } from '@chakra-ui/react';
import { IDataset, IChart } from '../../../types';
import { DashboardPanel } from '../DashboardPanel';

interface RechartsTabProps {
  shuffledCharts: IChart[];
  filteredData: IDataset;
  chartZoomLevels: Record<string, number>;
  onZoomChange: (chartId: string, delta: number) => void;
  onChartTypeChange: (chartId: string, newType: string) => void;
}

export const RechartsTab: React.FC<RechartsTabProps> = (props) => {
  const {
    shuffledCharts,
    filteredData,
    chartZoomLevels,
    onZoomChange,
    onChartTypeChange,
  } = props;
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Divider my={6} borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'} />
      <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
        {shuffledCharts.map((chart) => (
          <DashboardPanel
            key={chart.title}
            chart={chart}
            data={filteredData}
            zoomLevel={chartZoomLevels[chart.title] || 0}
            onZoomChange={onZoomChange}
            onChartTypeChange={onChartTypeChange}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};