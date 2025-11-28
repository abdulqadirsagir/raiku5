import { GoogleGenAI } from "@google/genai";
import { RAIKU_CONTEXT } from "../constants";

// Initialize Gemini
// NOTE: Hardcoded for immediate functionality in this environment.
const apiKey = process.env.API_KEY || 'AIzaSyDpl8KDIF7Fpk5Wa1ivymeX9nIsWVsdtJM'; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const searchRaiku = async (query: string): Promise<string> => {
  if (!ai) {
    return "API Key not configured. Please set process.env.API_KEY.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Construct the prompt with grounding
    const prompt = `
      ${RAIKU_CONTEXT}
      
      User Query: ${query}
      
      Answer specifically based on the context provided above. 
      Keep the response concise and under 280 characters.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // Removed maxOutputTokens to prevent cutting off responses prematurely
        // relying on system instruction/prompt for length control.
        temperature: 0.3, // Factual
      }
    });

    const text = response.text;
    
    if (!text) {
        console.warn("Gemini returned empty text. Response:", JSON.stringify(response, null, 2));
        return "I couldn't generate a response. The query might be flagged or unrelated.";
    }

    // Basic heuristic to check if the answer is completely unrelated (though system prompt should handle this)
    if (text.toLowerCase().includes("i cannot") || text.toLowerCase().includes("not related")) {
        return "I'm not sure this search term is Raiku related.";
    }

    return text;

  } catch (error) {
    console.error("Gemini Error:", error);
    return "An error occurred while searching. Please try again later.";
  }
};