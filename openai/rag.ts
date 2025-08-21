// openai/rag.ts

import { Pinecone } from "@pinecone-database/pinecone";
import { IDataset, IDatasetRecord } from "../types";
import { stringifyData } from "../utils/parseData";

let pinecone: Pinecone | null = null;

// Inisialisasi Pinecone Client
const initPinecone = async () => {
  if (pinecone) {
    return pinecone;
  }
  pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  return pinecone;
};

// Fungsi untuk membuat embedding dari teks menggunakan API OpenAI
const createEmbedding = async (
  text: string,
  apiKey: string
): Promise<number[]> => {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "), // Menghapus newline yang bisa menyebabkan masalah
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("OpenAI API Error:", errorBody);
    throw new Error(`Failed to create embedding. Status: ${response.status}. Body: ${errorBody}`);
  }

  const responseJson = await response.json();
  const { data } = responseJson;

  if (data && data.length > 0 && data[0].embedding) {
    return data[0].embedding;
  }

  console.error("Failed to create embedding. Invalid API Response:", responseJson);
  throw new Error("Failed to create embedding from API response.");
};

/**
 * Memecah dataset menjadi potongan-potongan kecil (chunks)
 */
const chunkDataset = (dataset: IDataset, chunkSize: number = 20): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < dataset.length; i += chunkSize) {
    const chunk = dataset.slice(i, i + chunkSize);
    chunks.push(stringifyData(chunk, ","));
  }
  return chunks;
};

/**
 * Fungsi untuk mengindeks data ke Vector Database (Pinecone)
 */
export const indexDataset = async (
  dataset: IDataset,
  datasetId: string,
  apiKey: string
) => {
  try {
    const pinecone = await initPinecone();
    const indexName = process.env.PINECONE_INDEX_NAME!;
    const index = pinecone.index(indexName);
    const namespace = datasetId;

    const chunks = chunkDataset(dataset);
    
    for (let i = 0; i < chunks.length; i += 50) {
        const batchChunks = chunks.slice(i, i + 50);
        const embeddings = await Promise.all(
            batchChunks.map(chunk => createEmbedding(chunk, apiKey))
        );

        const vectors = batchChunks.map((chunk, j) => ({
            id: `${namespace}-${i + j}`,
            values: embeddings[j],
            metadata: { text: chunk },
        }));

        await index.namespace(namespace).upsert(vectors);
    }

    console.log(`Dataset "${datasetId}" successfully indexed in Pinecone.`);
  } catch (error) {
    console.error("Error indexing dataset:", error);
    // Melempar kembali error agar bisa ditangkap oleh API route
    throw error;
  }
};

/**
 * Fungsi untuk mencari dan mengambil konteks yang relevan dari Pinecone
 */
export const retrieveContext = async (
  query: string,
  datasetId: string,
  apiKey: string,
  topK: number = 5
): Promise<string> => {
  try {
    const pinecone = await initPinecone();
    const indexName = process.env.PINECONE_INDEX_NAME!;
    const index = pinecone.index(indexName);
    const namespace = datasetId;

    const queryEmbedding = await createEmbedding(query, apiKey);

    const results = await index.namespace(namespace).query({
      topK,
      vector: queryEmbedding,
      includeMetadata: true,
    });

    if (results.matches && results.matches.length > 0) {
      return results.matches
        .map((match) => (match.metadata as { text: string }).text)
        .join("\n---\n");
    }
    return "No relevant context found.";
  } catch (error) {
    console.error("Error retrieving context:", error);
    throw error;
  }
};