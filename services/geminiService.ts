
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateProductDescription = async (productName: string): Promise<string> => {
  if (!API_KEY) {
    return "AI features are disabled. Please configure the API key.";
  }
  
  try {
    const prompt = `Generate a short, catchy, and creative marketing description for a product called "${productName}". Make it sound delicious and appealing for a cafe menu. Maximum 30 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error(`Error generating content for ${productName}:`, error);
    throw new Error("Failed to generate description from Gemini API.");
  }
};
   