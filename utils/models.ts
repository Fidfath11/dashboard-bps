import { GPT_MODEL } from "../openai/constants";
import { promptTemplate, promptGPT35TurboTemplate } from "../openai/template";

export const getPromptModel = (model: string) => {
  let promptModel = "";
  switch (model) {
    case GPT_MODEL.GPT_35_TURBO:
      promptModel = promptGPT35TurboTemplate;
      break;
    default:
      promptModel = promptTemplate;
  }
  return promptModel;
};

export const models = [
  { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" },
  { label: "Text-Davinci-003", value: "text-davinci-003" },
];
