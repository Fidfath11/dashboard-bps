// D:\BPS_Dashboard\ai-data-dashboard\components\viz\BarChart.tsx

import React from "react";
import { IChart, IDataset } from "../../types";
import {
  CartesianGrid,
  BarChart as RBarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { runFunc } from "../../utils/parseFunc";
import { ErrorBoundary } from "../layout/ErrorBoundary";
import { formatNumber } from "../../utils/numberFormatter";
import { IChartData } from "../../utils/parseFunc";
import { Box, useTheme, Text, Center, useColorMode } from '@chakra-ui/react';

interface BarChartProps {
  config: IChart;
  data: IDataset;
  zoomLevel?: number;
}

export function BarChart(props: React.PropsWithChildren<BarChartProps>) {
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const CHART_COLORS = React.useMemo(
    () => [
      theme.colors.purple[500],
      theme.colors.blue[500],
      theme.colors.green[500],
      theme.colors.orange[500],
      theme.colors.red[500],
    ],
    [theme]
  );

  const data = React.useMemo(() => {
    const fallbackValue: IChartData[] = [];
    const result = runFunc(
      props.config.javascriptFunction,
      props.data,
      fallbackValue
    );
    if (!Array.isArray(result)) return null;
    return result;
  }, [props.config, props.data]);

  if (!data || data.length === 0) {
    return (
      <Center height="100%">
        <Text color="gray.500">Data tidak tersedia.</Text>
      </Center>
    );
  }

  const effectiveZoom = props.zoomLevel !== undefined ? props.zoomLevel : 0;
  const baseBarSize = 30;
  const zoomFactor = 1.2;
  const barSize = baseBarSize * Math.pow(zoomFactor, effectiveZoom);

  const baseBarGap = 10;
  const barGap = baseBarGap * Math.pow(zoomFactor, effectiveZoom);

  const minChartWidth = Math.max(
    500,
    data.length * (barSize + barGap)
  );

  const axisColor = colorMode === "light" ? theme.colors.gray[600] : theme.colors.gray[300];
  const gridColor = colorMode === "light" ? theme.colors.gray[200] : theme.colors.gray[600];

  return (
    <ErrorBoundary>
      <ResponsiveContainer minWidth={minChartWidth} height={350}>
        <RBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          barCategoryGap={barGap}
        >
          <XAxis
            hide={false}
            stroke={axisColor}
            dataKey={"x"}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 10, fill: axisColor }}
          />
          <YAxis
            stroke={axisColor}
            tickFormatter={formatNumber}
            tick={{ fontSize: 12, fill: axisColor }}
          />
          <Tooltip
            formatter={(value) => formatNumber(value as number)}
            contentStyle={{ backgroundColor: colorMode === "light" ? "white" : "#1A202C", border: "1px solid #4A5568" }}
            labelStyle={{ color: colorMode === "light" ? "#1A202C" : "white" }}
          />
          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="5 5"
          />
          <Bar
            dataKey={"y"}
            fill={CHART_COLORS[0]}
            barSize={barSize}
          />
        </RBarChart>
      </ResponsiveContainer>
    </ErrorBoundary>
  );
}