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
  // PERBAIKAN: Inisialisasi Pinecone client sesuai versi terbaru, properti 'environment' tidak lagi ada di sini.
  pinecone = new Pinecone({
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
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
      input: text,
    }),
  });

  const responseJson = await response.json();
  const { data } = responseJson;

  if (data && data.length > 0 && data[0].embedding) {
    return data[0].embedding;
  }
  // Menambahkan log error yang lebih baik
  console.error("Failed to create embedding. API Response:", responseJson);
  throw new Error("Failed to create embedding.");
};

/**
 * Memecah dataset menjadi potongan-potongan kecil (chunks)
 * @param dataset - Dataset yang akan dipecah
 * @param chunkSize - Jumlah baris per chunk
 * @returns Array dari string, di mana setiap string adalah representasi dari chunk.
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
 * Ini akan dipanggil setiap kali dataset baru diunggah.
 */
export const indexDataset = async (
  dataset: IDataset,
  datasetId: string, // ID unik untuk dataset, bisa nama file
  apiKey: string
) => {
  try {
    const pinecone = await initPinecone();
    const indexName = process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME || 'dashboard-bps';
    const index = pinecone.index(indexName);

    // Pinecone namespaces are now part of operations, not index selection
    const namespace = datasetId;

    // Hapus vektor lama jika ada untuk namespace ini untuk menghindari duplikasi (opsional, tergantung use case)
    // await index.namespace(namespace).deleteAll();

    const chunks = chunkDataset(dataset);
    
    // Proses chunk dalam batch untuk efisiensi
    for (let i = 0; i < chunks.length; i += 50) { // Batch size 50
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
  }
};

/**
 * Fungsi untuk mencari dan mengambil konteks yang relevan dari Pinecone
 * @param query - Prompt dari pengguna
 * @param datasetId - ID unik dari dataset yang sedang aktif
 * @param apiKey - OpenAI API Key
 * @param topK - Jumlah konteks teratas yang ingin diambil
 * @returns String berisi konteks yang paling relevan
 */
export const retrieveContext = async (
  query: string,
  datasetId: string,
  apiKey: string,
  topK: number = 5
): Promise<string> => {
  try {
    const pinecone = await initPinecone();
    const indexName = process.env.NEXT_PUBLIC_PINECONE_INDEX_NAME || 'dashboard-bps';
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
    return "Error retrieving context.";
  }
};