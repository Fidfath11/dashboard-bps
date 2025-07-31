// D:\BPS_Dashboard\ai-data-dashboard\utils\parseData.ts

import papa from "papaparse";
import * as XLSX from "xlsx";
import { IDataset, IDatasetRecord } from "../types";

export function isDataValid(dataset: string) {
  try {
    const data = parseData(dataset);
    return !!data.length;
  } catch (err) {
    return false;
  }
}

// Fungsi parsing data utama yang mendukung CSV dan XLSX
export function parseData(data: string | ArrayBuffer): IDataset {
  // Jika input adalah string, proses sebagai CSV
  if (typeof data === "string") {
    const result = papa.parse(data, {
      header: true,
      skipEmptyLines: true,
    });

    if (!result.data) return [];

    // Hapus kolom kosong yang mungkin muncul
    const emptyColumns = result.meta.fields || [];
    if (!emptyColumns.length) return result.data as IDataset;

    return (result.data as IDataset)
      .map((row) => {
        delete row[""];
        return row;
      })
      .slice(0, 1000);

    // Jika input adalah ArrayBuffer, proses sebagai XLSX
  } else if (data instanceof ArrayBuffer) {
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    // Mengubah worksheet menjadi array of objects (JSON)
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Memproses jsonData untuk mendapatkan format yang konsisten
    const [headers, ...rows] = jsonData;
    const typedHeaders = headers as string[];
    const finalData = rows.map((row) => {
      const obj: IDatasetRecord = {};

      (typedHeaders as string[]).forEach((header, index) => {
        if (header) {
          obj[header] =
            (row as unknown[])[index] !== undefined
              ? String((row as unknown[])[index])
              : "";
        }
      });
      return obj;
    });

    return finalData.slice(0, 1000);
  }

  // Jika tipe data tidak dikenali, kembalikan array kosong
  return [];
}

export function stringifyData(dataset: IDataset, delimiter?: string) {
  return papa.unparse(dataset, {
    delimiter: delimiter || "\t",
  });
}
