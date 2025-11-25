import { GoogleGenAI } from "@google/genai";
import { FeedbackModelType, FeedbackEntry } from "../types";
import { FEEDBACK_MODELS } from "../constants";

// Initialize Gemini Client
// In a real production app, this should be handled securely.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateFeedbackWithGemini = async (
  recipientName: string,
  authorName: string,
  relationship: string,
  modelType: FeedbackModelType,
  inputs: Record<string, string>
): Promise<string> => {
  
  const modelDef = FEEDBACK_MODELS.find(m => m.type === modelType);
  if (!modelDef) throw new Error("Invalid model type");

  // Construct a prompt based on the inputs
  const inputsFormatted = Object.entries(inputs)
    .map(([key, value]) => `- ${key.toUpperCase()}: ${value}`)
    .join('\n');

  const systemInstruction = `You are an expert HR Coach and Leadership Mentor. 
  Your task is to draft professional, constructive, and empathetic feedback based on raw notes provided by the user.
  
  The user is using the ${modelDef.title} (${modelDef.description}).
  
  **Rules:**
  1. Tone: Professional, objective, yet human and encouraging.
  2. Structure: Adhere strictly to the ${modelDef.title} structure in the narrative.
  3. Perspective: Write from the perspective of ${authorName} giving feedback to ${recipientName} (${relationship}).
  4. Output: Return ONLY the drafted feedback text. Do not include introductory phrases like "Here is the feedback" or markdown headers.
  5. Formatting: Use paragraphs for readability.
  6. Language: Detect the primary language used in the 'Context Inputs'. Generate the response in that SAME language. If the inputs are in Portuguese, the feedback must be in Portuguese.`;

  const prompt = `
  Recipient: ${recipientName}
  Context Inputs:
  ${inputsFormatted}
  
  Draft the feedback now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Balanced creativity and coherence
      }
    });

    return response.text || "I apologize, but I couldn't generate the feedback at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate feedback. Please check your connection or API key.");
  }
};