// D:\BPS_Dashboard\ai-data-dashboard\components\layout\SelectInput.tsx

import React from "react";
import {
  FormControl,
  FormLabel,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

interface SelectInputProps {
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  variant?: string; // Prop ini akan diterapkan ke MenuButton
}

export default function SelectInput(props: SelectInputProps) {
  const { colorMode } = useColorMode();
  const { title, options, value, onChange, variant = "outline" } = props;

  // styling adaptif berdasarkan colorMode
  const labelColor = colorMode === "light" ? "black" : "whiteAlpha.900";
  const menuButtonBg = colorMode === "light" ? "white" : "gray.700";
  const menuButtonColor = colorMode === "light" ? "gray.800" : "whiteAlpha.900";
  const menuButtonBorderColor = colorMode === "light" ? "gray.300" : "gray.600";
  const menuButtonHoverBorderColor =
    colorMode === "light" ? "gray.400" : "gray.500";
  const menuButtonFocusBorderColor =
    colorMode === "light" ? "blue.500" : "blue.300";

  const menuListBg = colorMode === "light" ? "white" : "gray.700";
  const menuItemHoverBg = colorMode === "light" ? "gray.100" : "whiteAlpha.200";
  const menuItemColor = colorMode === "light" ? "black" : "whiteAlpha.900";

  const handleMenuItemClick = React.useCallback(
    (itemValue: string) => {
      onChange(itemValue);
    },
    [onChange]
  );

  return (
    <FormControl>
      <FormLabel fontSize="md" fontWeight="bold" color={labelColor}>
        {title}
      </FormLabel>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant={variant}
          size="sm"
          borderRadius="md"
          bg={menuButtonBg}
          color={menuButtonColor}
          borderColor={menuButtonBorderColor}
          _hover={{ borderColor: menuButtonHoverBorderColor }}
          _focus={{
            borderColor: menuButtonFocusBorderColor,
            boxShadow: "outline",
          }}
          width="full"
          justifyContent="space-between"
        >
          <Text>{value || options[0] || "None"}</Text>
        </MenuButton>
        <MenuList
          bg={menuListBg}
          borderColor={menuButtonBorderColor}
          boxShadow="lg"
          maxH="200px"
          overflowY="auto"
        >
          <MenuItem
            onClick={() => handleMenuItemClick("")}
            bg={value === "" ? menuItemHoverBg : "transparent"}
            color={menuItemColor}
            _hover={{ bg: menuItemHoverBg }}
            _focus={{ bg: menuItemHoverBg }}
          >
            None
          </MenuItem>

          {options.map((option) => (
            <MenuItem
              key={option}
              onClick={() => handleMenuItemClick(option)}
              bg={value === option ? menuItemHoverBg : "transparent"}
              color={menuItemColor}
              _hover={{ bg: menuItemHoverBg }}
              _focus={{ bg: menuItemHoverBg }}
            >
              {option}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </FormControl>
  );
}
