import React from 'react';
import { Box, SimpleGrid, Divider, useColorMode } from '@chakra-ui/react';
import { IDataset, IChart } from '../../../types';
import { NivoPanel } from '../NivoPanel'; // Menggunakan panel yang baru

interface NivoTabProps {
  shuffledCharts: IChart[];
  filteredData: IDataset;
  chartZoomLevels: Record<string, number>;
  onZoomChange: (chartId: string, delta: number) => void;
  onChartTypeChange: (chartId: string, newType: string) => void;
}

export const NivoTab: React.FC<NivoTabProps> = (props) => {
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
          <NivoPanel
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