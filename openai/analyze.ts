// openai/analyze.ts

import { IDashboard, IDataset } from "../types";
import { stringifyData } from "../utils/parseData";
import { getPrompt, queryCompletionsChat } from "./completions";
import { getPromptModel } from "../utils/models";
import { indexDataset, retrieveContext } from "./rag";

/**
 * Fungsi baru untuk mengindeks dataset.
 * Harusnya dipanggil sekali saat data diunggah di `pages/index.tsx`.
 */
export async function prepareDatasetForRag(
  dataset: IDataset,
  fileName: string,
  apiKey: string
) {
  if (!dataset || dataset.length === 0 || !fileName || !apiKey) return;
  await indexDataset(dataset, fileName, apiKey);
}

// Fungsi ini tidak banyak berubah, hanya untuk melihat prompt jika diperlukan
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


/**
 * Fungsi generateDashboard yang telah dikembangkan dengan alur RAG.
 */
export async function generateDashboard(
  dataset: IDataset,
  userContext: string,
  fileName: string, // fileName digunakan sebagai ID dataset
  apikey: string,
  model: string
): Promise<{ dashboard: IDashboard }> {
  
  // Tahap 1: Retrieve - Dapatkan konteks yang relevan dari Vector DB
  const relevantContext = await retrieveContext(userContext, fileName, apikey, 5);

  // Tahap 2: Augment - Buat prompt baru dengan konteks yang sudah ditemukan
  const augmentedQuestion = `
  This is a sample of the dataset for schema reference (column names and data types):
  ${stringifyData(dataset.slice(0, 3), ",")}

  ---

  Here are the most RELEVANT DATA SNIPPETS based on my query. Base your analysis primarily on this context:
  ${relevantContext}
  
  ---

  My specific query or goal is: 
  "${userContext}"
  `;

  // Tahap 3: Generate - Kirim prompt yang sudah diperkaya ke LLM
  const response = await queryCompletionsChat(
    getPromptModel(model),
    [{ question: augmentedQuestion }],
    { apikey, model }
  );

  return {
    dashboard: JSON.parse(response?.[0].reply || "") as IDashboard,
  };
}