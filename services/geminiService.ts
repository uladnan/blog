import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlogDraft = async (topic: string, tone: string = 'Professional'): Promise<string> => {
  if (!topic) return "";

  try {
    const prompt = `
      Write a blog post draft about: "${topic}".
      Tone: ${tone}.
      Format: Markdown.
      Structure:
      - Engaging Title (H1)
      - Introduction
      - Key Points (H2)
      - Conclusion
      
      Do not include "Here is a draft" chatter, just return the markdown content.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert content writer for a high-quality tech and lifestyle blog.",
        temperature: 0.7,
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please check API Key.");
  }
};

export const suggestTitles = async (content: string): Promise<string[]> => {
  if (!content) return [];
  
  try {
    const prompt = `Based on the following blog content, suggest 5 catchy, SEO-friendly titles. Return ONLY the titles as a JSON array of strings. Content excerpt: ${content.substring(0, 500)}...`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini Title Error:", error);
    return ["Error generating titles"];
  }
};