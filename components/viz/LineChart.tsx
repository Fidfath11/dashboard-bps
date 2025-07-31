// D:\BPS_Dashboard\ai-data-dashboard\components\viz\LineChart.tsx

import React from "react";
import { IChart, IDataset } from "../../types";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { runFunc } from "../../utils/parseFunc";
import { ErrorBoundary } from "../layout/ErrorBoundary";
import { formatNumber } from "../../utils/numberFormatter";
import { IChartData } from "../../utils/parseFunc";

import { Box, useTheme, Text, Flex, Center } from '@chakra-ui/react';

interface LineChartProps {
  config: IChart;
  data: IDataset;
  zoomLevel?: number;
}

export function LineChart(
  props: React.PropsWithChildren<LineChartProps>
) {
  const theme = useTheme();

  const CHART_COLORS = React.useMemo(() => [
    theme.colors.purple[500],
    theme.colors.blue[500],
    theme.colors.green[500],
    theme.colors.orange[500],
    theme.colors.red[500],
  ], [theme]);

  const data = React.useMemo(() => {
    const fallbackValue: IChartData[] = [];
    const result = runFunc(props.config.javascriptFunction, props.data, fallbackValue);
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
  
  const baseLineSpacing = 60;
  const zoomFactor = 1.2;
  const currentLineSpacing = baseLineSpacing * Math.pow(zoomFactor, effectiveZoom);

  const minChartWidth = Math.max(
    500,
    data.length * Math.max(10, currentLineSpacing) + 100
  );

  return (
    <ErrorBoundary>
      <ResponsiveContainer minWidth={minChartWidth} height={350}>
        <RLineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <XAxis
            hide={false}
            stroke={theme.colors.gray[600]}
            dataKey={"x"}
            interval="preserveStartEnd"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            stroke={theme.colors.gray[600]}
            tickFormatter={formatNumber}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value) => formatNumber(value as number)} />
          <CartesianGrid
            stroke={theme.colors.gray[200]}
            strokeDasharray="5 5"
          />
          <Line type="monotone" dataKey={"y"} stroke={CHART_COLORS[0]} dot={false} />
        </RLineChart>
      </ResponsiveContainer>
    </ErrorBoundary>
  );
}