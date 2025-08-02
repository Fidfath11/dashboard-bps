// D:\BPS_Dashboard\ai-data-dashboard\components\viz\PerformanceIndicator.tsx

import React from "react";
import { IDataset, IKPI } from "../../types";
import { Box, Heading, Text, useColorMode } from "@chakra-ui/react";
import { runFunc } from "../../utils/parseFunc";
import { formatNumber } from "../../utils/numberFormatter";

// palet warna yang lebih cerah dan adaptif
const INDICATOR_COLORS = [
  { light: "teal.500", dark: "teal.300" },
  { light: "blue.500", dark: "blue.300" },
  { light: "purple.500", dark: "purple.300" },
  { light: "orange.500", dark: "orange.300" },
];

export function PerformanceIndicator(
  props: React.PropsWithChildren<{
    config: IKPI;
    data: IDataset;
    index: number;
  }>
) {
  const { colorMode } = useColorMode();
  const value = React.useMemo(() => {
    const fallbackValue = "-";
    const result = runFunc(
      props.config.javascriptFunction,
      props.data,
      fallbackValue
    );

    let val: any = result;
    if (typeof result === "object" && result !== null) {
      const keys = Object.keys(result);
      if (keys.length > 0) {
        val = result[keys[0]];
      } else {
        val = fallbackValue;
      }
    }

    if (typeof val === "number") {
      return formatNumber(val);
    }
    return val;
  }, [props.config, props.data]);

  // Pilih warna berdasarkan index
  const colorScheme = INDICATOR_COLORS[props.index % INDICATOR_COLORS.length];
  const bg = colorMode === "light" ? colorScheme.light : colorScheme.dark;
  const boxShadow =
    colorMode === "light"
      ? `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
      : `0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -1px rgba(255, 255, 255, 0.06)`;

  return (
    <Box
      bg={bg}
      p={4}
      borderRadius="md"
      boxShadow={boxShadow}
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="120px"
      className="performanceIndicator"
    >
      <Heading as="h4" size="sm" mb={2}>
        {props.config.title.replace("Average", "Avg.")}
      </Heading>
      <Text fontSize="2xl" fontWeight="bold">
        {value}
      </Text>
    </Box>
  );
}
