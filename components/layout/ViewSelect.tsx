// D:\BPS_Dashboard\ai-data-dashboard\components\layout\ViewSelect.tsx

import React from "react";
import gtag from "../../lib/gtag";
import { Flex, Text, RadioGroup, Radio, Stack } from '@chakra-ui/react';

type ViewOption = "prompt" | "code" | "dashboard";

interface ViewSelectProps {
  value: ViewOption;
  onChange?: (value: ViewOption) => void;
}

export function ViewSelect(props: ViewSelectProps) {
  const handleChange = React.useCallback(
    (newValue: string) => { 
      const validNewValue = newValue as ViewOption; 

      gtag.report("event", "view_selection", {
        event_category: "settings",
        event_label: validNewValue,
      });
      props.onChange?.(validNewValue);
    },
    [props.onChange]
  );

  return (
    <Flex alignItems="center">
      <Text fontWeight="bold" mr={2}>View:</Text> 
      <RadioGroup onChange={handleChange} value={props.value}>
        <Stack direction="row" spacing={3}> 
          <Radio value="prompt" colorScheme="blue">Prompt</Radio>
          <Radio value="code" colorScheme="blue">Code</Radio>
          <Radio value="dashboard" colorScheme="blue">Dashboard</Radio>
        </Stack>
      </RadioGroup>
    </Flex>
  );
}