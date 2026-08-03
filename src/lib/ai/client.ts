import { AIRequest, AIResponse } from "./types";

export async function askAI(
  request: AIRequest
): Promise<AIResponse> {

  console.log(
    "AI Request:",
    request.prompt
  );

  return {
    content:
      "AI response will come here",
  };
}