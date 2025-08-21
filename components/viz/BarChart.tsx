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
import { useTheme, Text, Center, useColorMode } from '@chakra-ui/react';

interface BarChartProps {
  config: IChart;
  data: IDataset;
  zoomLevel?: number;
  compactView?: boolean;
}

export function BarChart(props: React.PropsWithChildren<BarChartProps>) {
  const theme = useTheme();
  const { colorMode } = useColorMode();
  const { compactView } = props;

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
 
  const zoomFactor = 1.2;
  const barSize = compactView ? undefined : 30 * Math.pow(zoomFactor, props.zoomLevel || 0);
  const barGap = compactView ? 2 : 10 * Math.pow(zoomFactor, props.zoomLevel || 0);

  const interval = compactView ? 'preserveStart' : (data.length > 15 ? 'preserveStartEnd' : 0);
 
  const minChartWidth = compactView ? '100%' : Math.max(500, data.length * (barSize || 30) + (barGap || 2));
 
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
            interval={interval}
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
            {...(!compactView && { barSize: barSize })}
          />
        </RBarChart>
      </ResponsiveContainer>
    </ErrorBoundary>
  );
}