// pages/api/dashboard.ts

import { NextApiRequest, NextApiResponse } from "next";
import { IDashboard, IDataset } from "../../types";
import { prepareDatasetForRag, generateDashboard } from "../../openai/analyze";
import { getPromptModel } from "../../utils/models"; // Pastikan path ini benar

// Definisikan tipe untuk body request agar lebih aman
type AnalyzeRequestBody = {
  action: "analyze";
  userContext: string;
  fileName: string;
  dataset: IDataset;
  model: string;
};

type IndexRequestBody = {
  action: "index";
  dataset: IDataset;
  fileName: string;
};

type RequestBody = AnalyzeRequestBody | IndexRequestBody;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Ambil OpenAI API key dari header Authorization untuk keamanan
  const apiKey = req.headers.authorization?.split(" ")[1];
  if (!apiKey) {
    return res.status(401).json({ message: "Missing OpenAI API Key" });
  }

  const body = req.body as RequestBody;

  try {
    if (body.action === "index") {
      // Menjalankan proses indeksasi data di server
      await prepareDatasetForRag(body.dataset, body.fileName, apiKey);
      return res.status(200).json({ message: "Indexing successful" });
    } else if (body.action === "analyze") {
      // Menjalankan proses analisis dan pembuatan dashboard di server
      const { dashboard } = await generateDashboard(
        body.dataset,
        body.userContext,
        body.fileName,
        apiKey,
        body.model
      );
      return res.status(200).json({ dashboard });
    } else {
      return res.status(400).json({ message: "Invalid action specified" });
    }
  } catch (error: any) {
    console.error("API Route Error:", error);
    return res
      .status(500)
      .json({ message: error.message || "An internal server error occurred" });
  }
}
