// D:\BPS_Dashboard\ai-data-dashboard\components\layout\Button.tsx

import React from "react";
import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {}

export function Button(props: React.PropsWithChildren<CustomButtonProps>) {
  const { children, ...rest } = props;
  return <ChakraButton {...rest}>{children}</ChakraButton>;
}
