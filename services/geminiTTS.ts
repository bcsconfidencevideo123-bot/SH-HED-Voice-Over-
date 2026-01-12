
import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, createWavBlob } from "../utils/audioUtils";

export async function generateSpeech(text: string, voiceName: string): Promise<Blob> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data returned from API");
    }

    const pcmData = decodeBase64(base64Audio);
    return createWavBlob(pcmData, 24000);
  } catch (error) {
    console.error("Speech generation failed:", error);
    throw error;
  }
}
