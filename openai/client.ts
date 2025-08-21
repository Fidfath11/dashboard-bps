// openai/client.ts
// BERKAS BARU: Berisi fungsi yang AMAN diimpor oleh komponen sisi klien.

import { IDataset } from "../types";
import { stringifyData } from "../utils/parseData";
import { getPrompt } from "./completions";
import { getPromptModel } from "../utils/models";

// Fungsi ini aman karena tidak memiliki dependensi ke 'rag.ts' atau pustaka server lainnya.
export function generatePrompt(
  dataset: IDataset,
  userContext: string,
  sampleRows: number,
  model: string
) {
  return getPrompt(getPromptModel(model), [
    {
      question: `
  This is the dataset:

  ${stringifyData(dataset.slice(0, sampleRows), ",")}${
        userContext
          ? `


  More information about the dataset: 

            ${userContext}`
          : ""
      }
          `,
    },
  ]);
}