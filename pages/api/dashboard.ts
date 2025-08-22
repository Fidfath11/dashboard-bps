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
  // --- DEBUG LOG 1 ---
  console.log("API route /api/dashboard invoked.");

  if (req.method !== "POST") {
    console.log(`Method ${req.method} not allowed.`);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  
  // --- DEBUG LOG 2 ---
  console.log("Request method is POST. Proceeding...");

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // --- DEBUG LOG ERROR 1 ---
      console.error("CRITICAL: OPENAI_API_KEY is missing or undefined in Vercel environment.");
      return res.status(500).json({ message: "OpenAI API Key not configured on the server" });
    }
    
    // --- DEBUG LOG 3 ---
    console.log("OpenAI API Key found.");

    const body = req.body as RequestBody;
    console.log(`Action received: ${body.action}`);
    
    if (body.action === "index") {
      // --- DEBUG LOG 4 ---
      console.log(`Starting indexing for file: ${body.fileName}`);
      await prepareDatasetForRag(body.dataset, body.fileName, apiKey);
      console.log("Indexing successful.");
      return res.status(200).json({ message: "Indexing successful" });

    } else if (body.action === "analyze") {
      // --- DEBUG LOG 5 ---
      console.log(`Starting analysis for file: ${body.fileName}`);
      const { dashboard } = await generateDashboard(
        body.dataset,
        body.userContext,
        body.fileName,
        apiKey,
        body.model
      );
      console.log("Analysis successful.");
      return res.status(200).json({ dashboard });

    } else {
      console.warn("Invalid action specified in request body.");
      return res.status(400).json({ message: "Invalid action specified" });
    }
  } catch (error: any) {
    // --- DEBUG LOG ERROR 2 ---
    console.error("--- CATCH BLOCK EXECUTED ---");
    console.error("API Route Error Message:", error.message);
    console.error("API Route Error Stack:", error.stack);
    return res
      .status(500)
      .json({ message: error.message || "An internal server error occurred" });
  }
}