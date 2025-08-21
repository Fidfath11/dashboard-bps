// pages/api/dashboard.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { IDashboard, IDataset } from '../../types';
import { prepareDatasetForRag, generateDashboard } from '../../openai/analyze';

// ... (tipe RequestBody tetap sama)
type AnalyzeRequestBody = {
  action: 'analyze';
  userContext: string;
  fileName: string;
  dataset: IDataset;
  model: string;
};

type IndexRequestBody = {
  action: 'index';
  dataset: IDataset;
  fileName: string;
};

type RequestBody = AnalyzeRequestBody | IndexRequestBody;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("API Route /api/dashboard started.");

  if (req.method !== 'POST') {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiKey = req.headers.authorization?.split(' ')[1];
  if (!apiKey) {
    console.error("OpenAI API Key is missing from headers.");
    return res.status(401).json({ message: 'Missing OpenAI API Key' });
  }
  console.log("OpenAI API Key found.");

  // Memeriksa variabel lingkungan Pinecone di sisi server
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
    console.error("Pinecone environment variables are not set on the server.");
    return res.status(500).json({ message: "Pinecone configuration is missing on the server." });
  }
  console.log("Pinecone environment variables found.");

  const body = req.body as RequestBody;

  try {
    if (body.action === 'index') {
      console.log(`Action: 'index'. Indexing file: ${body.fileName}`);
      await prepareDatasetForRag(body.dataset, body.fileName, apiKey);
      console.log("Indexing successful.");
      return res.status(200).json({ message: 'Indexing successful' });

    } else if (body.action === 'analyze') {
      console.log(`Action: 'analyze'. Analyzing file: ${body.fileName}`);
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
      console.log("Invalid action specified in request body.");
      return res.status(400).json({ message: 'Invalid action specified' });
    }
  } catch (error: any) {
    console.error('API Route execution failed:', error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
}