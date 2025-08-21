// D:\BPS_Dashboard\ai-data-dashboard\types.ts

export interface ISettings {
  apikey: string;
  sampleRows: number;
  model: string;
}

export interface IFilter {
  title: string;
  column: string;
}

export interface IKPI {
  title: string;
  javascriptFunction: string;
}

export interface IAgregate {
  strategy: string;
  n: number;
  othersLabel: string;
}

export interface IChart {
  title: string;
  chartType: string;
  javascriptFunction: string;
  agregate?: IAgregate;
  // PERBAIKAN: Menambahkan properti yang hilang
  xAxis: string;
  yAxis: string;
}

export interface IDashboard {
  filters: IFilter[];
  kpis: IKPI[];
  charts: IChart[];
}

export type IDatasetRecord = {
  [key: string]: string | number; // Diubah ke string | number untuk fleksibilitas
};

export type IDataset = IDatasetRecord[];

export type ChatInteraction = {
  question?: string;
  reply?: string;
};