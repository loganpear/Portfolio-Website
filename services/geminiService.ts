
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getProjectInsights = async (projectDescription: string) => {
  if (!API_KEY) return "Insight unavailable: Missing API Key";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a 2-sentence expert critique from a Product Manager's perspective for this project: "${projectDescription}". Focus on market impact and scalability.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Failed to fetch AI insights.";
  }
};

export const getResumeSummary = async (resumeContent: string) => {
  if (!API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following resume content into a powerful 3-sentence personal statement for a high-end portfolio website: ${resumeContent}`,
    });
    return response.text;
  } catch (error) {
    return null;
  }
};
