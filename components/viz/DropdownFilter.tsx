// D:\BPS_Dashboard\ai-data-dashboard\components\viz\DropdownFilter.tsx

import React from "react";
import { IFilter, IDataset } from "../../types";
import { FormControl, FormLabel, Select, Box } from "@chakra-ui/react";

interface DropdownFilterProps {
  config: IFilter;
  data: IDataset;
  onChange?: (value: string) => void;
  value?: string;
}

export function DropdownFilter(props: DropdownFilterProps) {
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

  return (
    <FormControl
      id={`filter-${props.config.column}`}
      width="180px"
      minW="120px"
    >
      <FormLabel fontSize="sm" mb={1}>
        {" "}
        {props.config.title}
      </FormLabel>
      <Select
        value={props.value || ""} 
        onChange={handleChange}
        size="sm" 
        borderRadius="md" 
        borderColor="gray.300" 
        _hover={{ borderColor: "gray.400" }} 
        _focus={{ borderColor: "blue.500", boxShadow: "outline" }} 
        bg="white" 
        color="gray.800"
      >
        <option key={"None"} value="">
          None
        </option>
        {values.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}
