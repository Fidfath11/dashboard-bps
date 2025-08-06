import { Select, useColorMode } from "@chakra-ui/react";
import React from "react";
import { ChangeEvent } from "react";

export function DropdownFilter(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const { colorMode } = useColorMode();
  const { onChange, options, value } = props;

  const handleChange = React.useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <Select
      value={value}
      onChange={handleChange}
      placeholder={props.label}
      size="sm"
      bg={colorMode === "light" ? "white" : "gray.700"}
      color={colorMode === "light" ? "gray.800" : "whiteAlpha.900"}
      borderColor={colorMode === "light" ? "gray.300" : "gray.600"}
      _hover={{
        borderColor: colorMode === "light" ? "gray.400" : "gray.500",
      }}
      _focus={{
        borderColor: colorMode === "light" ? "blue.500" : "blue.300",
        boxShadow: "outline",
      }}
      borderRadius="md"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
}