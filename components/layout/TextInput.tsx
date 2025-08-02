// D:\BPS_Dashboard\ai-data-dashboard\components\layout\TextInput.tsx

import React from "react";
import {
  FormControl,
  FormLabel,
  Textarea,
  useColorMode,
  Input as ChakraInput,
} from "@chakra-ui/react"; 
import { ChangeEvent } from "react";

interface TextAreaInputProps {
  label?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void; // onChange selalu menerima string dari input HTML
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
  // Ubah tipe event handlers agar lebih generik
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onCopy?: React.ClipboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  flexGrow?: number;
  type?: string;
}

export function TextInput(props: TextAreaInputProps) {
  // Ubah nama fungsi menjadi TextInput
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
    borderColor,
    _hover,
    _focus,
    borderRadius,
    bg,
    color,
    placeholder,
    id,
    onBlur,
    onFocus,
    onCopy,
    flexGrow,
    type,
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
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [internalValue, onChange]);

  const handleChange = React.useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInternalValue(e.target.value);
    },
    []
  );

  // styling adaptif berdasarkan colorMode
  const inputBg = colorMode === "light" ? "white" : "gray.700";
  const inputColor = colorMode === "light" ? "gray.800" : "whiteAlpha.900";
  const inputBorderColor = colorMode === "light" ? "gray.300" : "gray.600";
  const placeholderColor = colorMode === "light" ? "gray.500" : "gray.400";
  const hoverBorderColor = colorMode === "light" ? "gray.400" : "gray.500";
  const focusBorderColor = colorMode === "light" ? "blue.500" : "blue.300";

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
      {type === "textarea" ? (
        <Textarea
          value={internalValue}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onCopy={onCopy}
          minH={minH || "60px"}
          maxH={maxH}
          borderColor={borderColor || inputBorderColor}
          bg={bg || inputBg}
          color={color || inputColor}
          _hover={_hover || { borderColor: hoverBorderColor }}
          _focus={
            _focus || { borderColor: focusBorderColor, boxShadow: "outline" }
          }
          borderRadius={borderRadius || "md"}
          placeholder={placeholder}
          _placeholder={{ color: placeholderColor }}
        />
      ) : (
        <ChakraInput
          type={type || "text"}
          value={internalValue}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onCopy={onCopy}
          borderColor={borderColor || inputBorderColor}
          bg={bg || inputBg}
          color={color || inputColor}
          _hover={_hover || { borderColor: hoverBorderColor }}
          _focus={
            _focus || { borderColor: focusBorderColor, boxShadow: "outline" }
          }
          borderRadius={borderRadius || "md"}
          placeholder={placeholder}
          _placeholder={{ color: placeholderColor }}
        />
      )}
    </FormControl>
  );
}
