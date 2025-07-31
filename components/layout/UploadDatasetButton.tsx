// D:\BPS_Dashboard\ai-data-dashboard\components\layout\UploadDatasetButton.tsx

import React from "react";
import { Button } from "./Button";
import { AddIcon } from "@chakra-ui/icons";
import { parseData, stringifyData } from "../../utils/parseData";

interface UploadDatasetButtonProps {
  onUpload: (dataset: string | ArrayBuffer, uploadedFileName: string) => void;
}

export function UploadDatasetButton(props: UploadDatasetButtonProps) {
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const handleUploadFileClick = React.useCallback(() => {
    inputFileRef.current?.click?.();
  }, []);

  const handleUploadFile = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files.length > 0) {
        const inputFile = e.target.files[0];
        const reader = new FileReader();

        const isCSV = inputFile.name.endsWith(".csv");
        const isXLSX =
          inputFile.name.endsWith(".xlsx") ||
          inputFile.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const fileName = inputFile.name;

        reader.onload = function (event) {
          if (isCSV) {
            const text = event?.target?.result as string;
            if (text) {
              props.onUpload?.(text, fileName);
            }
          } else if (isXLSX) {
            const arrayBuffer = event?.target?.result as ArrayBuffer;
            if (arrayBuffer) {
              props.onUpload?.(arrayBuffer, fileName);
            }
          }
        };

        if (isCSV) {
          reader.readAsText(inputFile);
        } else if (isXLSX) {
          reader.readAsArrayBuffer(inputFile);
        }
      }
    },
    [props.onUpload]
  );

  return (
    <>
      <Button
        onClick={handleUploadFileClick}
        colorScheme="brand"
        bg="brand.primaryAccent"
        _hover={{ bg: "#257DA3" }}
        leftIcon={<AddIcon />}
        borderRadius="md"
        size="sm"
      >
        Upload Data
      </Button>
      <input
        ref={inputFileRef}
        hidden
        type="file"
        onChange={handleUploadFile}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
    </>
  );
}
