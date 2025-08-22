// openai/client.ts

import { IDataset } from "../types";
import { stringifyData } from "../utils/parseData";
import { getPrompt } from "./completions";
import { getPromptModel } from "../utils/models";

// Fungsi ini aman untuk dijalankan di client-side
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