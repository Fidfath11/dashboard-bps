import React from 'react';
import {
  Box, Flex, Heading, useColorMode, IconButton, Menu, MenuButton, MenuList, MenuItem, useToast, Icon, Tooltip as ChakraTooltip,
} from '@chakra-ui/react';
import { LineChart } from './LineChart';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { TreemapChart } from './TreemapChart';
import { AddIcon, MinusIcon, RepeatIcon } from '@chakra-ui/icons';
import { FaExpandArrowsAlt, FaCompressArrowsAlt } from 'react-icons/fa';
import { IChart, IDataset } from '../../types';

interface DashboardPanelProps {
  chart: IChart;
  data: IDataset;
  zoomLevel?: number;
  onZoomChange?: (chartId: string, delta: number) => void;
  onChartTypeChange?: (chartId: string, newType: string) => void;
}

const CHART_TYPES = ['barChart', 'lineChart', 'pieChart', 'treemapChart'];

export function DashboardPanel(props: DashboardPanelProps) {
  const { colorMode } = useColorMode();
  const { chart, data, zoomLevel, onZoomChange, onChartTypeChange } = props;
  const toast = useToast();
  const [compactView, setCompactView] = React.useState(false);

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

  const dashboardBoxShadow = colorMode === "light" ? "md" : "0px 4px 6px rgba(255, 255, 255, 0.1)";
  const cardBorderColor = colorMode === "light" ? "gray.200" : "gray.700";

  const renderChart = () => {
    switch (chart.chartType) {
      case "lineChart": return <LineChart config={chart} data={data} zoomLevel={zoomLevel} compactView={compactView} />;
      case "barChart": return <BarChart config={chart} data={data} zoomLevel={zoomLevel} compactView={compactView} />;
      case "pieChart": return <PieChart config={chart} data={data} />;
      case "treemapChart": return <TreemapChart config={chart} data={data} />;
      default: return <p>Tipe chart tidak didukung.</p>;
    }
  };

  const isZoomable = chart.chartType === "barChart" || chart.chartType === "lineChart";

  return (
    <Flex direction="column" p={4} borderRadius="lg" boxShadow={dashboardBoxShadow} bg={colorMode === "light" ? "whiteAlpha.900" : "gray.900"} borderWidth="2px" borderColor={cardBorderColor} minH="400px" maxH="450px" overflowX={isZoomable && !compactView ? "auto" : "hidden"} overflowY="hidden">
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Heading as="h3" size="md" textAlign="center" flexGrow={1} color={colorMode === "light" ? "gray.800" : "whiteAlpha.900"}>
          {chart.title}
        </Heading>
        {/* BLOK KONTROL BARU DIMASUKKAN DI SINI */}
        <Flex>
          {isZoomable && (
            <>
              <ChakraTooltip label="Zoom In"><IconButton aria-label="Zoom In" icon={<AddIcon />} size="sm" onClick={handleZoomIn} mr={2} isDisabled={(zoomLevel || 0) >= 5} /></ChakraTooltip>
              <ChakraTooltip label="Zoom Out"><IconButton aria-label="Zoom Out" icon={<MinusIcon />} size="sm" onClick={handleZoomOut} mr={2} isDisabled={(zoomLevel || 0) <= -2} /></ChakraTooltip>
              <ChakraTooltip label={compactView ? 'Expand View' : 'Compact View'}><IconButton aria-label="Toggle Compact View" icon={compactView ? <Icon as={FaExpandArrowsAlt} /> : <Icon as={FaCompressArrowsAlt} />} size="sm" onClick={handleCompactToggle} mr={2} /></ChakraTooltip>
            </>
          )}
          <Menu>
            <MenuButton as={IconButton} aria-label="Options" icon={<RepeatIcon />} size="sm" variant="outline" />
            <MenuList>
              {CHART_TYPES.map((type) => (
                <MenuItem key={type} onClick={() => handleChartTypeChange(type)}>Ganti ke {type}</MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Box flexGrow={1} position="relative">
        {renderChart()}
      </Box>
    </Flex>
  );
}