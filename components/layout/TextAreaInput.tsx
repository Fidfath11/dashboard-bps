// D:\BPS_Dashboard\ai-data-dashboard\components\layout\TextAreaInput.tsx

import React from "react";
import {
  FormControl,
  FormLabel,
  Textarea,
  useColorMode,
} from "@chakra-ui/react";
import { ChangeEvent } from "react";

interface TextAreaInputProps {
  label?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  mb?: string | number;
  mt?: string | number;
  ml?: string | number;
  mr?: string | number;
  px?: string | number;
  py?: string | number;
  p?: string | number;
  w?: string;
  h?: string;
  minH?: string;
  maxH?: string;
  borderColor?: string;
  _hover?: object;
  _focus?: object;
  borderRadius?: string | number;
  bg?: string;
  color?: string;
  placeholder?: string;
  id?: string;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onCopy?: React.ClipboardEventHandler<HTMLTextAreaElement>;
  flexGrow?: number;
}

export function TextAreaInput(props: TextAreaInputProps) {
  const { colorMode } = useColorMode();
  const {
    label,
    value,
    onChange,
    disabled,
    mb,
    mt,
    ml,
    mr,
    p,
    px,
    py,
    w,
    h,
    minH,
    maxH,

    borderColor: propBorderColor,
    _hover: prop_hover,
    _focus: prop_focus,
    borderRadius: propBorderRadius,
    bg: propBg,
    color: propColor,
    placeholder,
    id,
    onBlur,
    onFocus,
    onCopy,
    flexGrow,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = React.useState(value || "");
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  React.useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (onChange) {
        onChange(internalValue);
      }
    }, 500); // Waktu debounce 500ms

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [internalValue, onChange]);

  const handleChange = React.useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInternalValue(e.target.value);
    },
    []
  );

  // styling adaptif berdasarkan colorMode
  const inputBg = colorMode === "light" ? "white" : "gray.700";
  const inputColor = colorMode === "light" ? "gray.800" : "whiteAlpha.900";
  const inputBorderColor = colorMode === "light" ? "gray.300" : "gray.600";
  const hoverBorderColor = colorMode === "light" ? "gray.400" : "gray.500";
  const focusBorderColor = colorMode === "light" ? "blue.500" : "blue.300";
  const placeholderColor = colorMode === "light" ? "gray.500" : "gray.400";

  // Teks placeholder default
  const defaultPlaceholderText =
    "Masukan pertanyaan atau instruksi analisis data disini...";

  return (
    <FormControl
      id={id || (typeof label === "string" ? label : undefined)}
      isDisabled={disabled}
      mb={mb}
      mt={mt}
      ml={ml}
      mr={mr}
      p={p}
      px={px}
      py={py}
      w={w}
      h={h}
      flexGrow={flexGrow}
      {...rest}
    >
      {label && <FormLabel mb={1}>{label}</FormLabel>}
      <Textarea
        value={internalValue}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onCopy={onCopy}
        minH={minH || "60px"}
        maxH={maxH}
        borderColor={propBorderColor || inputBorderColor}
        _hover={prop_hover || { borderColor: hoverBorderColor }}
        _focus={
          prop_focus || { borderColor: focusBorderColor, boxShadow: "outline" }
        }
        borderRadius={propBorderRadius || "md"}
        bg={propBg || inputBg}
        color={propColor || inputColor}
        placeholder={placeholder || defaultPlaceholderText} 
        _placeholder={{ color: placeholderColor }} 
      />
    </FormControl>
  );
}
