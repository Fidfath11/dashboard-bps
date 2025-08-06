import React from "react";
import { FormControl, FormLabel, Input, useColorMode } from "@chakra-ui/react";
import { ChangeEvent } from "react";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  mb?: string | number;
  type?: string;
  id?: string;
}

export function TextInput(props: TextInputProps) {
  const { colorMode } = useColorMode();
  const inputBg = colorMode === "light" ? "white" : "gray.700";
  const inputColor = colorMode === "light" ? "gray.800" : "whiteAlpha.900";

  return (
    <FormControl mb={props.mb} id={props.id || props.label}>
      <FormLabel mb={1}>{props.label}</FormLabel>
      <Input
        value={props.value}
        onChange={props.onChange}
        type={props.type || "text"}
        bg={inputBg}
        color={inputColor}
      />
    </FormControl>
  );
}