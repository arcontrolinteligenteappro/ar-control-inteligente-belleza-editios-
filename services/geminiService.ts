import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
Eres un experto consultor de imagen y belleza para una aplicación de reservas de salones llamada 'GlamourFlow'.
Tu objetivo es ayudar a los usuarios a elegir estilos, cortes de cabello, colores de uñas o tratamientos faciales.
Tus respuestas deben ser:
1. Amables, profesionales y alentadoras.
2. Breves y directas (ideales para chat móvil).
3. Basadas en tendencias actuales de moda y estética.

Si el usuario te envía una foto, analiza sus rasgos (forma de cara, tono de piel) y sugiere estilos que le favorezcan.
Si el usuario pregunta por servicios, recomienda categorías generales como Barbería, Spa, etc.
No inventes precios específicos, diles que consulten el catálogo de la app.
`;

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string,
  imageBase64?: string
): Promise<string> => {
  try {
    const modelId = imageBase64 ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';
    
    // Construct the contents based on history context if needed, 
    // but for simplicity in this stateless service, we'll mostly rely on the current prompt + instruction
    // In a real chat, we would build the full 'contents' array from history.
    
    const parts: any[] = [];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg', // Assuming jpeg for simplicity from input
          data: imageBase64
        }
      });
    }
    
    parts.push({ text: newMessage });

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelId,
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster chat response
      }
    });

    return response.text || "Lo siento, no pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hubo un error al conectar con tu asesor de belleza virtual. Por favor intenta más tarde.";
  }
};
