// D:\BPS_Dashboard\ai-data-dashboard\components\viz\TreemapChart.tsx

import React from "react";
import { IChart, IDataset } from "../../types"; 
import { Treemap as RTreemap, ResponsiveContainer, Tooltip } from "recharts";
import { runFunc, agregateData, IChartData } from "../../utils/parseFunc";
import { ErrorBoundary } from "../layout/ErrorBoundary";
import { palette } from "../../utils/palette";
import { formatNumber } from "../../utils/numberFormatter";
import { Box, useTheme, Text, Center } from '@chakra-ui/react'; 

const CustomizedTreemapContent = ({
  root,
  depth,
  x,
  y,
  width,
  height,
  index,
  colors,
  name
}: any) => {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor(Math.random() * colors.length)] : "none",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-4),
          strokeOpacity: 1 / (depth + 1e-4)
        }}
      />
      {depth === 1 && width > 40 && height > 20 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          style={{
            fontSize: Math.min(20, Math.max(10, width/name.length))
          }}
        >
          {name}
        </text>
      ) : null}
    </g>
  );
};

export function TreemapChart(
  props: React.PropsWithChildren<{
    config: IChart;
    data: IDataset;
  }>
) {
  const rawData = React.useMemo(() => {
    const fallbackValue: IChartData[] = [];
    const result = runFunc(props.config.javascriptFunction, props.data, fallbackValue);
    
    if (!Array.isArray(result)) {
        return null;
    }

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

  if (!rawData || rawData.length === 0) {
    return (
      <Center height="100%">
        <Text color="gray.500">Data tidak tersedia.</Text>
      </Center>
    );
  }
  
  const formattedData = rawData.map((d, index) => ({
    name: d.x || `Tidak Tersedia ${index}`,
    value: d.y,
  }));

  return (
    <ErrorBoundary>
      <ResponsiveContainer width="100%" height="90%">
        <RTreemap
          width={400}
          height={200}
          data={formattedData}
          dataKey="value"
          aspectRatio={4/3}
          stroke="var(--textColor)"
          fill={palette[0]}
          content={<CustomizedTreemapContent colors={palette} />}
        >
          <Tooltip
            formatter={(value, name, item) => {
              if (item?.payload) {
                return [
                  formatNumber(item.payload.value as number),
                  item.payload.name,
                ];
              }
              return null;
            }}
          />
        </RTreemap>
      </ResponsiveContainer>
    </ErrorBoundary>
  );
}