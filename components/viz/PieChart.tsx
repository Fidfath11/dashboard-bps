// D:\BPS_Dashboard\ai-data-dashboard\components\viz\PieChart.tsx

import React from "react";
import { IChart, IDataset } from "../../types";

import {
  PieChart as RPieChart,
  ResponsiveContainer,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import { runFunc, agregateData } from "../../utils/parseFunc";
import { ErrorBoundary } from "../layout/ErrorBoundary";
import { formatNumber } from "../../utils/numberFormatter";
import { IChartData } from "../../utils/parseFunc";
import { Box, useTheme, Flex, Text, Center, useColorMode } from "@chakra-ui/react";

export function PieChart(
  props: React.PropsWithChildren<{
    config: IChart;
    data: IDataset;
  }>
) {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const CHART_COLORS = React.useMemo(
    () => [
      theme.colors.blue[500],
      theme.colors.green[500],
      theme.colors.purple[500],
      theme.colors.orange[500],
      theme.colors.red[500],
      theme.colors.teal[500],
      theme.colors.yellow[500],
      theme.colors.pink[500],
    ],
    [theme]
  );

  const rawData = React.useMemo(() => {
    const fallbackValue: IChartData[] = [];
    const result = runFunc(
      props.config.javascriptFunction,
      props.data,
      fallbackValue
    );

    if (!Array.isArray(result)) return null;

    if (
      props.config.agregate?.strategy === "top_n" &&
      props.config.agregate.n
    ) {
      return agregateData(
        result,
        props.config.agregate.n,
        props.config.agregate.othersLabel || "Lainnya"
      );
    }
    return result;
  }, [props.config, props.data]);

  const pieChartData = React.useMemo(() => {
    if (!rawData) return null;
    return rawData.map((item) => ({
      name: item.x,
      value: item.y,
    }));
  }, [rawData]);

  if (!pieChartData || pieChartData.length === 0) {
    return (
      <Center height="100%">
        <Text color="gray.500">Data tidak tersedia.</Text>
      </Center>
    );
  }
  
  const textColor = colorMode === "light" ? "gray.700" : "whiteAlpha.800";
  const tooltipBg = colorMode === "light" ? "white" : "#1A202C";
  const tooltipBorder = colorMode === "light" ? "gray.300" : "#4A5568";

  return (
    <ErrorBoundary>
      <ResponsiveContainer width="100%" height="100%">
        <RPieChart>
          <Pie
            data={pieChartData}
            nameKey={"name"}
            dataKey={"value"}
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            fill="#8884d8"
            stroke={theme.colors.gray[200]}
            strokeWidth={1}
            labelLine={false}
            label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
          >
            {pieChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              formatNumber(value as number),
              props.payload.name,
            ]}
            contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}` }}
            labelStyle={{ color: textColor }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: "5px", lineHeight: "1.2em" }}
            formatter={(value, entry) => {
              if (entry && (entry.payload as any)?.name) {
                return (
                  <Text as="span" fontSize="sm" color={textColor}>
                    {(entry.payload as any).name}
                  </Text>
                );
              }
              return null;
            }}
          />
        </RPieChart>
      </ResponsiveContainer>
    </ErrorBoundary>
  );
}