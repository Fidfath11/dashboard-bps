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
  useToast,
  Button,
} from "@chakra-ui/react";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";
import { TreemapChart } from "./TreemapChart";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { IChart, IDataset } from "../../types";

interface DashboardPanelProps {
  chart: IChart;
  data: IDataset;
  zoomLevel?: number;
  onZoomChange?: (chartId: string, delta: number) => void;
  onChartTypeChange?: (chartId: string, newType: string) => void;
}

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

  const dashboardBoxShadow =
    colorMode === "light" ? "md" : "0px 4px 6px rgba(255, 255, 255, 0.1)";
  const cardBorderColor = colorMode === "light" ? "gray.200" : "gray.700";

  const renderChart = () => {
    switch (chart.chartType) {
      case "lineChart":
        return <LineChart config={chart} data={data} zoomLevel={zoomLevel} compactView={compactView} />;
      case "barChart":
        return <BarChart config={chart} data={data} zoomLevel={zoomLevel} compactView={compactView} />;
      case "pieChart":
        return <PieChart config={chart} data={data} />;
      case "treemapChart":
        return <TreemapChart config={chart} data={data} />;
      default:
        return <p>Tipe chart tidak didukung.</p>;
    }
  };

  const isZoomable = chart.chartType === "barChart" || chart.chartType === "lineChart";

  return (
    <Flex
      direction="column"
      p={4}
      borderRadius="lg"
      boxShadow={dashboardBoxShadow}
      bg={colorMode === "light" ? "whiteAlpha.900" : "gray.900"}
      borderWidth="2px"
      borderColor={cardBorderColor}
      minH="400px"
      maxH="450px"
      overflowX={isZoomable && !compactView ? "auto" : "hidden"}
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
        {isZoomable && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setCompactView(!compactView)}
            colorScheme={compactView ? "blue" : "gray"}
            mr={2}
          >
            {compactView ? "Normal View" : "Compact View"}
          </Button>
        )}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<BsThreeDotsVertical />}
            variant="ghost"
            size="sm"
          />
          <MenuList>
            <MenuItem onClick={() => handleChartTypeChange("lineChart")}>
              Line Chart
            </MenuItem>
            <MenuItem onClick={() => handleChartTypeChange("barChart")}>
              Bar Chart
            </MenuItem>
            <MenuItem onClick={() => handleChartTypeChange("pieChart")}>
              Pie Chart
            </MenuItem>
            <MenuItem onClick={() => handleChartTypeChange("treemapChart")}>
              Treemap Chart
            </MenuItem>
          </MenuList>
        </Menu>
        {isZoomable && !compactView && onZoomChange && (
          <Flex ml={2}>
            <IconButton
              size="xs"
              icon={<MinusIcon />}
              aria-label="Zoom Out"
              onClick={() => onZoomChange(chart.title, -1)}
              isDisabled={(zoomLevel || 0) <= -2}
              mr={1}
              colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"}
            />
            <IconButton
              size="xs"
              icon={<AddIcon />}
              aria-label="Zoom In"
              onClick={() => onZoomChange(chart.title, 1)}
              colorScheme={colorMode === "light" ? "gray" : "whiteAlpha"}
            />
          </Flex>
        )}
      </Flex>
      <Box flexGrow={1} position="relative">
        {renderChart()}
      </Box>
    </Flex>
  );
}