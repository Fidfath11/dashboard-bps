// D:\BPS_Dashboard\ai-data-dashboard\components\viz\DropdownFilter.tsx

import React from "react";
import { IFilter, IDataset } from "../../types";
import {
  FormControl,
  FormLabel,
  Select,
  Box,
  useColorMode,
} from "@chakra-ui/react";

interface DropdownFilterProps {
  config: IFilter;
  data: IDataset;
  onChange?: (value: string) => void;
  value?: string;
}

export function DropdownFilter(props: DropdownFilterProps) {
  const { colorMode } = useColorMode();

  const values = React.useMemo(() => {
    return props.data
      .map((row) => row[props.config.column])
      .filter((x, i, arr) => arr.indexOf(x) === i)
      .filter((x) => x !== undefined && x !== null && x !== "")
      .sort((a, b) => (a > b ? 1 : -1));
  }, [props.config, props.data]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      props.onChange?.(e.target.value);
    },
    [props.onChange]
  );

  // styling adaptif berdasarkan colorMode
  const labelColor = colorMode === "light" ? "gray.700" : "whiteAlpha.800";
  const selectBg = colorMode === "light" ? "white" : "gray.700";
  const selectColor = colorMode === "light" ? "gray.800" : "whiteAlpha.900";
  const selectBorderColor = colorMode === "light" ? "gray.300" : "gray.600";
  const hoverBorderColor = colorMode === "light" ? "gray.400" : "gray.500";
  const focusBorderColor = colorMode === "light" ? "blue.500" : "blue.300";

  return (
    <FormControl
      id={`filter-${props.config.column}`}
      width="180px"
      minW="120px"
    >
      <FormLabel fontSize="sm" mb={1} color={labelColor}>
        {" "}
        {props.config.title}
      </FormLabel>
      <Select
        value={props.value || ""}
        onChange={handleChange}
        size="sm"
        borderRadius="md"
        borderColor={selectBorderColor}
        _hover={{ borderColor: hoverBorderColor }}
        _focus={{ borderColor: focusBorderColor, boxShadow: "outline" }}
        bg={selectBg}
        color={selectColor}
      >
        <option
          key={"None"}
          value=""
          style={{ background: selectBg, color: selectColor }}
        >
          None
        </option>
        {values.map((value) => (
          <option
            key={value}
            value={value}
            style={{ background: selectBg, color: selectColor }}
          >
            {value}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
