import React from "react";
import { FormControl, FormLabel, Select, useColorMode } from "@chakra-ui/react";
import { ChangeEvent } from "react";

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  mb?: string | number;
  id?: string;
}

export function SelectInput(props: SelectInputProps) {
  const { colorMode } = useColorMode();

  return (
    <FormControl mb={props.mb} id={props.id || props.label}>
      <FormLabel mb={1}>{props.label}</FormLabel>
      <Select
        value={props.value}
        onChange={props.onChange}
        bg={colorMode === "light" ? "white" : "gray.700"}
        color={colorMode === "light" ? "gray.800" : "whiteAlpha.900"}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}