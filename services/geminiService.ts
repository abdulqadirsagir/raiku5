import { GoogleGenAI } from "@google/genai";
import { RAIKU_CONTEXT } from "../constants";

// Initialize Gemini
// NOTE: Using provided credentials directly to ensure connection
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
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        maxOutputTokens: 100, // Limit to ensure brevity (~280 chars)
        temperature: 0.3, // Factual
      }
    });

    const text = response.text;
    
    if (!text) return "I couldn't generate a response. Please try again.";

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