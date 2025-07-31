// D:\BPS_Dashboard\ai-data-dashboard\utils\parseFunc.ts

import { IDataset } from "../types";

const characters = "(),+%$";

function parseNumber(value: string) {
  value = value || "";

  if (value)
    characters.split("").forEach((char) => {
      value = value.replaceAll(char, "");
    });

  return Number(value);
}

// Fungsi untuk mengacak array
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fungsi agregasi
export interface IChartData {
    x: string | number;
    y: number;
}

export function agregateData(data: IChartData[], n: number, othersLabel: string): IChartData[] {
  const sortedData = [...data].sort((a, b) => b.y - a.y);
  
  const topNData = sortedData.slice(0, n);

  if (sortedData.length > n) {
      const othersValue = sortedData.slice(n).reduce((sum, item) => sum + item.y, 0);
      topNData.push({ x: othersLabel, y: othersValue });
  }

  return topNData;
}

// Fungsi untuk mengeksekusi string fungsi dengan aman
export function runFunc(funcString: string, data: IDataset, fallback: any) {
  try {
    const fn = eval(funcString);
    if (typeof fn === 'function') {
      return fn(data);
    }
    return fallback;
  } catch (error) {
    console.error("Error evaluating function string:", error);
    return fallback;
  }
}

// Fungsi parsing 
export function parseFunc<T>(func: string, fallback: T): T {
  try {
    if (func.includes("function(data)")) {
      return eval(func.replace("function(data)", "data => "));
    }
    if (func.includes("(data) => ")) {
      return eval(func.replace("(data) =>", "data =>"));
    }
    if (func.includes("data => ")) {
      return eval(func);
    }

    const myFunc: T = eval(`data => ${func}`);
    return myFunc;
  } catch (err) {
    return fallback;
  }
}