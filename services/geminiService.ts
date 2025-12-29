
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

export const parseLinkedInToATS = async (pdfBase64: string): Promise<ResumeData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are an expert career coach and ATS (Applicant Tracking System) specialist.
    I am providing you with a PDF file of a LinkedIn profile.
    Your task is to:
    1. Extract all relevant professional information from this document.
    2. Rewrite the professional summary to be high-impact, modern, and keyword-rich.
    3. Rewrite experience bullet points using the STAR method (Situation, Task, Action, Result).
    4. Focus on measurable achievements, quantification, and strong action verbs.
    5. Organize skills into logical categories (e.g., Technical, Soft Skills, Tools).
    6. Format the output strictly as a JSON object following the provided schema.

    The input is a PDF version of a LinkedIn Profile. Please read it carefully.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: pdfBase64,
            },
          },
          { text: prompt },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          location: { type: Type.STRING },
          linkedinUrl: { type: Type.STRING },
          professionalSummary: { type: Type.STRING },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["category", "items"]
            }
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                company: { type: Type.STRING },
                location: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                highlights: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "company", "highlights"]
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                institution: { type: Type.STRING },
                location: { type: Type.STRING },
                graduationDate: { type: Type.STRING }
              },
              required: ["degree", "institution"]
            }
          },
          certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["fullName", "experience", "skills"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as ResumeData;
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON:", error);
    throw new Error("Failed to process the LinkedIn PDF. Please ensure the file is a standard LinkedIn profile download.");
  }
};

export const generateMockImage = async (prompt: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};
