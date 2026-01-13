
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

/**
 * Provides a critique of a project.
 */
export const getProjectInsights = async (projectDescription: string) => {
  if (!API_KEY) return "Insight unavailable: Missing API Key";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a 2-sentence expert critique for this project: "${projectDescription}". 
      STRICT: Do not invent any facts about the project. Critique only what is written.`,
      config: {
        temperature: 0.2, // Lower temperature for less creativity/hallucination
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Failed to fetch AI insights.";
  }
};

/**
 * Summarizes the resume content strictly without inventing details.
 */
export const getResumeSummary = async (resumeContent: string) => {
  if (!API_KEY || !resumeContent || resumeContent.trim().length < 10) return null;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional resume summarizer. 
      Summarize the following resume into a 3-sentence personal statement for a high-end portfolio.
      
      STRICT RULES:
      1. Use ONLY information provided in the text below.
      2. DO NOT invent job titles, companies, years, or achievements.
      3. If the resume is short or missing detail, provide a brief but accurate summary.
      4. DO NOT mention any company names not explicitly in the text.
      
      RESUME TEXT:
      ${resumeContent}`,
      config: {
        temperature: 0.1, // Near-zero creativity to prevent hallucinations
      }
    });
    return response.text;
  } catch (error) {
    return null;
  }
};

/**
 * Extracts key metadata from the resume to populate the UI tiles.
 */
export const getResumeMetadata = async (resumeContent: string) => {
  if (!API_KEY || !resumeContent) return null;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract exactly two key technical focus areas and one primary job title from this resume.
      Return as a JSON object with keys: "focus1", "focus2", "title".
      
      RESUME: ${resumeContent}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focus1: { type: Type.STRING, description: "e.g. Frontend Development" },
            focus2: { type: Type.STRING, description: "e.g. Machine Learning" },
            title: { type: Type.STRING, description: "e.g. Software Engineer" }
          },
          required: ["focus1", "focus2", "title"]
        }
      }
    });
    
    return JSON.parse(response.text.trim());
  } catch (error) {
    return null;
  }
};
