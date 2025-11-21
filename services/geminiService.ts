import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { Task, Note, BrandProfile, CompetitorAnalysis, Transaction, HealthMetric, CourseModule, ChatMessage, Workflow } from "../types";

const apiKey = process.env.API_KEY || '';

const getClient = () => {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// --- CORE UTILS ---

export const generateDailyBrief = async (tasks: Task[]): Promise<string> => {
  const client = getClient();
  if (!client) return "System: API Key not detected. Unable to generate brief.";

  const taskSummary = tasks.map(t => `- ${t.title} (${t.priority})`).join('\n');
  
  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Fast response
      contents: `You are the Infigenie OS AI core. Generate a concise, motivating morning brief for the user. 
      Here are their current pending tasks:
      ${taskSummary}
      
      Structure the response with a greeting, a "Focus of the Day" based on the most urgent tasks, and a philosophical quote about productivity. Keep it under 150 words.`,
    });
    return response.text || "Could not generate brief.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "System: Intelligence module unavailable.";
  }
};

// --- LIFE OS ---

export const suggestTasksFromGoal = async (goal: string): Promise<{title: string, priority: 'Low' | 'Medium' | 'High' | 'Urgent'}[]> => {
  const client = getClient();
  if (!client) return [{title: "Define clear objectives", priority: "High"}, {title: "Break down into steps", priority: "Medium"}];

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user has a high-level goal: "${goal}". 
      Break this down into 5 specific, highly actionable tasks that can be completed in 1-2 hours each. 
      Start each task with a verb.
      For each task, assign a priority (Low, Medium, High, Urgent) based on importance or order.
      
      Return ONLY a JSON array of objects with keys: "title" and "priority".`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const suggestSubtasksForTask = async (taskTitle: string): Promise<string[]> => {
  const client = getClient();
  if (!client) return ["Plan details", "Execute"];

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Fast response
      contents: `The user has a task: "${taskTitle}". Suggest 3-4 subtasks to complete this. Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const suggestHabitsForGoal = async (focusArea: string): Promise<string[]> => {
  const client = getClient();
  if (!client) return ["Drink water", "Read 10 pages"];

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Fast response
      contents: `Suggest 4 daily habits that would help someone achieve success in: "${focusArea}". Keep them short (3-5 words). Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const suggestMilestonesForGoal = async (goalTitle: string): Promise<string[]> => {
  const client = getClient();
  if (!client) return ["Milestone 1", "Milestone 2"];

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash', // Standard flash for better milestone planning
      contents: `Create 4 key milestones to track progress for the goal: "${goalTitle}". 
      These should be significant checkpoints, not small tasks.
      Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return [];
  }
};

// --- FINANCE OS ---

export const analyzeFinancials = async (transactions: Transaction[], query: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Financial Intelligence module unavailable.";

  const txData = JSON.stringify(transactions.slice(0, 20)); // Limit context

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Financial Advisor. Analyze these transactions: ${txData}.
      
      User Question: "${query}"
      
      Provide a helpful, data-driven answer. Identify trends or anomalies if relevant. Keep it under 100 words.`,
    });
    return response.text || "Unable to analyze.";
  } catch (error) {
    console.error(error);
    return "Error in financial analysis.";
  }
};

// --- HEALTH OS ---

export const analyzeHealth = async (metrics: HealthMetric[], query: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Health Intelligence module unavailable.";

  const metricsData = JSON.stringify(metrics.slice(0, 20)); 

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an empathetic and knowledgeable Health Coach. 
      Here is the user's recent health data: ${metricsData}.
      
      User Question/Context: "${query}"
      
      Provide personalized advice or encouragement. Do not provide medical diagnoses. Focus on wellness, sleep, and habit optimization. Keep it under 100 words.`,
    });
    return response.text || "Unable to analyze health data.";
  } catch (error) {
    console.error(error);
    return "Error in health analysis.";
  }
};

// --- BIOS CORE ---

export const analyzeBrandVoice = async (sampleText: string): Promise<Partial<BrandProfile>> => {
  const client = getClient();
  if (!client) return {};

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following text to determine the brand voice. 
      Text: "${sampleText}"
      
      Return a JSON object with fields: "toneVoice", "coreValues", "targetAudience". Keep descriptions concise.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return {};
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const analyzeCompetitor = async (competitorName: string, context: string): Promise<Partial<CompetitorAnalysis>> => {
  const client = getClient();
  if (!client) return {};

  try {
    // Use thinking model for deeper analysis
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: `Perform a detailed SWOT analysis for the company/competitor: "${competitorName}". 
      Context/Industry: "${context}".
      
      Return a JSON object with this structure:
      {
        "marketShareEstimate": "string (e.g. High/Low/Niche)",
        "swot": {
          "strengths": ["string", "string"],
          "weaknesses": ["string", "string"],
          "opportunities": ["string", "string"],
          "threats": ["string", "string"]
        }
      }`,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 2048 } // Moderate thinking for SWOT
      }
    });

    const text = response.text;
    if (!text) return {};
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return { swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] } };
  }
};

// --- MEMORY OS / SEARCH ---

export const smartSearch = async (query: string, notes: Note[]): Promise<string> => {
   const client = getClient();
   if (!client) return "Search unavailable without API Key.";

   const notesContext = notes.map(n => `ID: ${n.id}\nTitle: ${n.title}\nContent: ${n.content}`).join('\n---\n');

   try {
     const response = await client.models.generateContent({
       model: 'gemini-2.5-flash',
       contents: `You are the MemoryOS search engine. 
       User Query: "${query}"
       
       Search through these notes and answer the user's question or summarize the relevant information. Cite the Note Title if used.
       
       Notes Data:
       ${notesContext}`
     });
     return response.text || "No relevant results found.";
   } catch (error) {
     console.error(error);
     return "Error performing smart search.";
   }
};

// --- SEARCH GROUNDING ---

export const searchWeb = async (query: string): Promise<{text: string; sources: {uri: string, title: string}[]}> => {
  const client = getClient();
  if (!client) return { text: "API Key missing", sources: [] };

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({ uri: c.web.uri, title: c.web.title }));

    return {
      text: response.text || "No results found.",
      sources: sources
    };
  } catch (error) {
    console.error("Search Error", error);
    return { text: "Error searching web.", sources: [] };
  }
};

// --- MAPS GROUNDING ---

export const queryMaps = async (query: string): Promise<{text: string; places: {uri: string, title: string}[]}> => {
  const client = getClient();
  if (!client) return { text: "API Key missing", places: [] };

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{googleMaps: {}}],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    // Correctly extract maps data
    const places = chunks
      .filter((c: any) => c.maps)
      .map((c: any) => ({ uri: c.maps.uri, title: c.maps.title || 'Map Location' }));

    return {
      text: response.text || "No places found.",
      places: places
    };
  } catch (error) {
    console.error("Maps Error", error);
    return { text: "Error querying maps.", places: [] };
  }
};

// --- LEARN OS ---

export const generateCourseSyllabus = async (topic: string): Promise<Partial<import("../types").Course>> => {
  const client = getClient();
  if (!client) return {};

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a structured course syllabus for the topic: "${topic}".
      
      Return a JSON object with:
      - title (Catchy course title)
      - description (Short description)
      - difficulty (Beginner/Intermediate/Advanced)
      - modules: Array of objects { title: string, description: string }
      
      Create about 5-7 modules.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return {};
    const data = JSON.parse(text);
    return {
      ...data,
      modules: data.modules.map((m: any, i: number) => ({ ...m, id: `mod-${i}`, isCompleted: false }))
    };
  } catch (error) {
    console.error(error);
    return {};
  }
};

// --- MEDIA OS ---

export const summarizeContent = async (text: string): Promise<string[]> => {
  const client = getClient();
  if (!client) return ["Summary unavailable"];

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Fast response
      contents: `Summarize the following text into 3-5 key bullet points/takeaways. Return ONLY a JSON array of strings.
      
      Text:
      ${text.substring(0, 5000)}`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const result = response.text;
    if(!result) return [];
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
    return ["Error summarizing content"];
  }
};

export const repurposeContent = async (content: string, format: 'tweet' | 'blog' | 'email'): Promise<string> => {
  const client = getClient();
  if (!client) return "Content studio unavailable";

  let prompt = "";
  switch(format) {
    case 'tweet': prompt = "Convert this content into a thread of 3-5 engaging tweets/posts for X (Twitter)."; break;
    case 'blog': prompt = "Expand this content into a short blog post outline with an intro, 3 main points, and conclusion."; break;
    case 'email': prompt = "Rewrite this content as a newsletter email to my subscribers."; break;
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Fast response
      contents: `${prompt}
      
      Source Content:
      ${content.substring(0, 3000)}`
    });
    return response.text || "Could not generate content.";
  } catch (error) {
    console.error(error);
    return "Error repurposing content.";
  }
};

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Transcription unavailable";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'audio/mp3', data: audioBase64 } }, 
          { text: "Transcribe this audio." }
        ]
      }
    });
    return response.text || "No transcript generated.";
  } catch (error) {
    console.error("Transcription Error", error);
    return "Error transcribing audio.";
  }
};

export const analyzeVideo = async (videoUrl: string, prompt: string): Promise<string> => {
  // NOTE: In a production environment, this requires uploading the file to the File API.
  // For this demo, we return a message indicating the model that WOULD be used.
  // Gemini 3 Pro is required for video understanding.
  const client = getClient();
  if (!client) return "Intelligence unavailable";
  
  // Mock implementation structure
  return `Analysis with Gemini 3 Pro Preview:
  1. Video content identified.
  2. Key events extracted.
  (Note: Actual video file upload required for live analysis)`;
};

export const analyzeImage = async (imageBase64: string, prompt: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Image analysis unavailable";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-preview', // Image understanding
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/png' } },
          { text: prompt || "Analyze this image." }
        ]
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Image Analysis Error", error);
    return "Error analyzing image.";
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });
    
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return audioData || null;
  } catch (error) {
    console.error("TTS Error", error);
    return null;
  }
}

// --- CREATOR STUDIO ---

export const generatePostIdeas = async (topic: string, platform: string): Promise<string[]> => {
  const client = getClient();
  if (!client) return ["Idea 1", "Idea 2", "Idea 3"];

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Fast response
      contents: `Generate 5 engaging social media post ideas for the topic "${topic}" specifically for ${platform}. 
      Return ONLY a JSON array of strings.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const result = response.text;
    if (!result) return [];
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const draftSocialPost = async (idea: string, platform: string, tone: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Drafting unavailable.";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Draft a ${platform} post based on this idea: "${idea}".
      Tone: ${tone}.
      
      Include relevant hashtags. Return only the post text.`
    });
    return response.text || "Could not generate draft.";
  } catch (error) {
    console.error(error);
    return "Error generating draft.";
  }
};

// --- IMAGE & VIDEO GENERATION ---

export const generateImage = async (prompt: string, size: '1K'|'2K'|'4K', aspectRatio: string): Promise<string | null> => {
  const client = getClient();
  if (!client) return null;
  
  // Gemini 3 Pro Image Preview
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: size
        }
      }
    });

    // Iterate to find image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error", error);
    return null;
  }
};

export const editImage = async (imageBase64: string, prompt: string): Promise<string | null> => {
  const client = getClient();
  if (!client) return null;

  // Gemini 2.5 Flash Image
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/png' } },
          { text: prompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error", error);
    return null;
  }
};

export const generateVideo = async (prompt: string, imageBase64?: string): Promise<string | null> => {
  const client = getClient();
  if (!client) return null;

  try {
    // Veo 3.1 Fast
    // Note: This is a long-running operation
    let operation;
    const model = 'veo-3.1-fast-generate-preview';
    
    if (imageBase64) {
        // Image-to-Video
        operation = await client.models.generateVideos({
          model,
          prompt,
          image: { imageBytes: imageBase64, mimeType: 'image/png' },
          config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
        });
    } else {
        // Text-to-Video
        operation = await client.models.generateVideos({
          model,
          prompt,
          config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
        });
    }

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
      operation = await client.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
        // Fetch actual bytes (requires key appended)
        const videoRes = await fetch(`${videoUri}&key=${apiKey}`);
        const blob = await videoRes.blob();
        return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error("Video Gen Error", error);
    return null;
  }
};

// --- CHAT / COPILOT ---

export const getChatResponse = async (
  newMessage: string, 
  history: ChatMessage[], 
  currentContext: string, 
  useThinking = false
): Promise<Partial<ChatMessage>> => {
  const client = getClient();
  if (!client) return { content: "Connection error." };

  const conversationHistory = history
    .slice(-10)
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n');

  // Default model Gemini 3 Pro
  const model = 'gemini-3-pro-preview';
  
  const tools: any[] = [];
  const isSearch = newMessage.toLowerCase().includes('search') || newMessage.toLowerCase().includes('find') || newMessage.toLowerCase().includes('who is');
  const isMap = newMessage.toLowerCase().includes('where is') || newMessage.toLowerCase().includes('map') || newMessage.toLowerCase().includes('location');

  if (isSearch) tools.push({ googleSearch: {} });
  if (isMap) tools.push({ googleMaps: {} });

  const config: any = { tools };
  if (useThinking) {
    // Max thinking budget for Gemini 3 Pro
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  try {
    const response = await client.models.generateContent({
      model,
      contents: `You are "Infigenie", the AI Copilot.
      Context: ${currentContext}
      History: ${conversationHistory}
      User: ${newMessage}`,
      config
    });

    // Extract grounding
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = chunks.filter((c: any) => c.web).map((c: any) => ({ uri: c.web.uri, title: c.web.title }));
    // Correct Maps extraction
    const mapSources = chunks
      .filter((c: any) => c.maps)
      .map((c: any) => ({ uri: c.maps.uri, title: c.maps.title || 'Map Location' }));

    return {
      content: response.text || "No response generated.",
      groundingMetadata: {
        web: webSources.length ? webSources : undefined,
        maps: mapSources.length ? mapSources : undefined
      }
    };
  } catch (error) {
    console.error(error);
    return { content: "Error processing request." };
  }
};

export const generateWorkflow = async (description: string): Promise<Partial<Workflow>> => {
  const client = getClient();
  if (!client) return {};

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create an automation workflow based on this description: "${description}".
      
      Return a JSON object with:
      - name (Short workflow name)
      - description (What it does)
      - steps: Array of objects. Each object has:
        - type: 'Trigger' | 'Action' | 'Logic'
        - label: (Short step name like "Every Morning" or "Send Email")
        - icon: (Lucide icon name e.g., "Clock", "Mail", "CheckCircle")
        - config: Object with 1-2 relevant key-values (e.g. {"time": "09:00"} or {"to": "me@test.com"})
      
      Limit to 3-5 steps.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    if (!text) return {};
    const data = JSON.parse(text);
    return {
      ...data,
      steps: data.steps.map((s: any, i: number) => ({ ...s, id: `step-${i}` }))
    };
  } catch (error) {
    console.error(error);
    return {};
  }
};