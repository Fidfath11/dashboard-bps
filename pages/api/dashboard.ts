// pages/api/dashboard.ts

import { NextApiRequest, NextApiResponse } from "next";
import { IDataset } from "../../types";
import { prepareDatasetForRag, generateDashboard } from "../../openai/analyze";

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

  // PERBAIKAN: Ambil OpenAI API key dari environment variables di server.
  // Ini jauh lebih aman daripada menerimanya dari client.
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "OpenAI API Key not configured on the server" });
  }

  const body = req.body as RequestBody;

  try {
    if (body.action === "index") {
      await prepareDatasetForRag(body.dataset, body.fileName, apiKey);
      return res.status(200).json({ message: "Indexing successful" });
    } else if (body.action === "analyze") {
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