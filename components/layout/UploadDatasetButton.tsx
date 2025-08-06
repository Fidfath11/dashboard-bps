import React from "react";
import { Button, useColorMode } from "@chakra-ui/react";
import { FaRegFileAlt } from "react-icons/fa";
import Papa from "papaparse";
import * as xlsx from "xlsx";

interface UploadDatasetButtonProps {
  onUpload: (dataset: string | ArrayBuffer, uploadedFileName: string) => void;
}

export function UploadDatasetButton(props: UploadDatasetButtonProps) {
  const { onUpload } = props;
  const { colorMode } = useColorMode();
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
        const isXLSX = inputFile.name.endsWith(".xlsx");
        const fileName = inputFile.name;

        reader.onload = function (event) {
          if (isCSV) {
            const text = event?.target?.result as string;
            if (text) {
              onUpload?.(text, fileName);
            }
          } else if (isXLSX) {
            const arrayBuffer = event?.target?.result as ArrayBuffer;
            if (arrayBuffer) {
              onUpload?.(arrayBuffer, fileName);
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
    [onUpload]
  );

  return (
    <>
      <Button
        leftIcon={<FaRegFileAlt />}
        colorScheme="blue"
        onClick={handleUploadFileClick}
        borderRadius="md"
        flexGrow={1}
        size="sm"
        width="full"
        maxW="120px"
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