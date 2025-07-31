// D:\BPS_Dashboard\ai-data-dashboard\components\layout\EmptyMessage.tsx

import React from "react";
import styles from "../../styles/Components.module.scss";
import { Button } from "./Button";
import { ButtonLink } from "./ButtonLink";

interface EmptyMessageProps {
  onUpload: (dataset: string | ArrayBuffer, uploadedFileName: string) => void;
  onRandomData: () => void;
}

export function EmptyMessage(
  props: React.PropsWithChildren<EmptyMessageProps>
) {
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
    <div className={styles.emptyMessageContainer}>
      <div className={styles.emptyMessage}>
        <ButtonLink onClick={handleUploadFileClick}>
          Upload your data
        </ButtonLink>{" "}
        and then click in Analyze or{" "}
        <ButtonLink onClick={props.onRandomData} accent="BRAND">
          try it with random data
        </ButtonLink>
        <input
          ref={inputFileRef}
          hidden
          type="file"
          onChange={handleUploadFile}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </div>
    </div>
  );
}
