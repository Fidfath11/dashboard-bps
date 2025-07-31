// D:\BPS_Dashboard\ai-data-dashboard\components\layout\TextAreaInput.tsx

import React from "react";
import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";
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
}

export function TextAreaInput(props: TextAreaInputProps) {
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
    [] // dependency array kosong karena tidak bergantung pada props
  );

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
        borderColor={borderColor || "gray.300"}
        _hover={_hover || { borderColor: "gray.400" }}
        _focus={_focus || { borderColor: "blue.500", boxShadow: "outline" }}
        borderRadius={borderRadius || "md"}
        bg={bg || "white"}
        color={color || "gray.800"}
        placeholder={placeholder}
      />
    </FormControl>
  );
}
