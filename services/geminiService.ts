
import { GoogleGenAI } from "@google/genai";
import { TrainingScenario } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const imagePrompts = [
  "Photorealistic image of a concerned doctor, middle-aged, in a bright, modern office, looking at patient charts. The focus is on the doctor's thoughtful expression. Medical setting.",
  "A clinical photograph of a pharmacist consulting with a patient over the counter. The patient appears engaged and is listening intently. The pharmacy is well-lit and professional.",
  "A photorealistic image of a doctor and a pharmaceutical sales representative in a professional meeting. They are discussing a medical brochure in a modern office.",
  "An image of a doctor presenting at a medical conference, with a slide about obesity treatment visible in the background. The audience is attentive.",
];

const questionPrompts = [
  "You are a sales training scenario writer for Ozempic. Create a short, challenging question a doctor might ask a sales rep. The doctor is concerned about the cardiovascular benefits of Ozempic compared to competitors.",
  "You are a sales training scenario writer for Ozempic. A doctor is asking about the common side effects and how to manage them for a patient just starting on Ozempic for obesity. Formulate the doctor's question.",
  "You are a sales training scenario writer for Ozempic. A physician is skeptical about prescribing Ozempic for weight loss versus traditional lifestyle interventions. Craft the physician's skeptical question.",
  "You are a sales training scenario writer for Ozempic. Create a question from a doctor who is asking about the long-term efficacy and safety data for Ozempic in the context of chronic weight management.",
];

export async function generateTrainingScenario(): Promise<TrainingScenario> {
  try {
    // 1. Generate an image
    const imageResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: imagePrompts[Math.floor(Math.random() * imagePrompts.length)],
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
      throw new Error("Image generation failed");
    }
    const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
    
    // 2. Generate a question
    const questionResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: questionPrompts[Math.floor(Math.random() * questionPrompts.length)],
    });
    
    const question = questionResponse.text.trim();

    return { imageUrl, question };

  } catch (error) {
    console.error("Error in generateTrainingScenario:", error);
    throw new Error("Failed to generate training scenario from Gemini API.");
  }
}

export async function getFeedbackOnAnswer(question: string, answer: string): Promise<string> {
    try {
        const prompt = `
The doctor's question was: "${question}"

The sales rep's answer was: "${answer}"

Provide constructive feedback on the rep's answer. Focus on three areas: 
1. **Accuracy & Key Messages**: Did the rep accurately convey key information about Ozempic?
2. **Addressing Concerns**: How well did the rep acknowledge and address the doctor's underlying concern?
3. **Clarity & Confidence**: Was the response clear, concise, and delivered confidently?

Format the feedback with Markdown. Use headings for each area and bullet points for specific suggestions. Keep the tone encouraging and professional.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-pro',
          contents: prompt,
          config: {
              systemInstruction: "You are an expert sales training coach for pharmaceutical representatives. You are evaluating a sales rep's response regarding Ozempic for obesity."
          }
        });
        
        return response.text;

    } catch (error) {
        console.error("Error in getFeedbackOnAnswer:", error);
        throw new Error("Failed to get feedback from Gemini API.");
    }
}
