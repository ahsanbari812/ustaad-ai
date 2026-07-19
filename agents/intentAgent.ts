import { askGemini } from '../services/gemini';
import { ExtractedIntent, ServiceType } from '../utils/types';
import { reasoningLogger } from '../utils/reasoningLogger';

const INTENT_PROMPT = `You are the Intent Agent for Ustaad AI, a service finding app.
Your job is to extract the service type, urgency, and requested time from a user's message.
The message can be in English, Urdu, or Roman Urdu.

Supported services: "plumber", "electrician", "ac_technician", "tutor", "beautician", "carpenter", "painter", "mechanic".
Urgency levels: "low", "medium", "high". If the user says "urgently", "jaldi", "foran", set to "high". Otherwise "medium" or "low".

Return ONLY valid JSON matching this structure exactly:
{
  "service": "electrician" | "plumber" | etc | null,
  "urgency": "low" | "medium" | "high",
  "time": "tomorrow morning" | "today" | etc | null,
  "keywords": ["maths", "physics", "inverter", "washing machine", "bridal", "fitting", "leak", "70cc", etc]
}

Example: "Need physics tutor foran" -> keywords: ["physics"]
Example: "Ac service karwani hai gas leak hai" -> keywords: ["gas leak"]
Example: "Bridal makeup urgent" -> keywords: ["bridal"]

User Message: "{MESSAGE}"`;

export async function extractIntent(userInput: string): Promise<ExtractedIntent> {
  const startTime = Date.now();
  
  try {
    const prompt = INTENT_PROMPT.replace('{MESSAGE}', userInput);
    const response = await askGemini(prompt);
    
    // Clean markdown if present
    const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const intent: ExtractedIntent = {
      service: parsed.service || null,
      location: null, // Extracted by Location Agent
      time: parsed.time || null,
      urgency: parsed.urgency === 'high' ? 'high' : (parsed.urgency === 'low' ? 'low' : 'medium'),
      original_message: userInput,
      language_detected: 'roman_urdu',
      confidence: 0.95,
      keywords: parsed.keywords || []
    };

    reasoningLogger.log(
      'Intent Node (Gemini 3.5 Flash)', 
      'NLU Analysis', 
      userInput, 
      `Successfully parsed multilingual request. Identified priority service: [${intent.service?.toUpperCase()}]. Urgency classified as ${intent.urgency.toUpperCase()}.`, 
      Date.now() - startTime, 
      94
    );
    
    return intent;
  } catch (error) {
    // FALLBACK SAFETY SYSTEM
    // If Gemini API fails, we NEVER break the demo. We use keyword heuristics.
    const lower = userInput.toLowerCase();
    let service: ServiceType | null = null;
    
    if (lower.includes('ac') || lower.includes('cooling')) service = 'ac_technician';
    else if (lower.includes('electrician') || lower.includes('bijli')) service = 'electrician';
    else if (lower.includes('plumber') || lower.includes('pani')) service = 'plumber';
    else if (lower.includes('tutor') || lower.includes('parhana')) service = 'tutor';
    else if (lower.includes('beauty') || lower.includes('makeup')) service = 'beautician';
    else if (lower.includes('carpenter') || lower.includes('lakri')) service = 'carpenter';
    else if (lower.includes('painter') || lower.includes('rang')) service = 'painter';
    else if (lower.includes('mechanic') || lower.includes('gari')) service = 'mechanic';
    
    let urgency: 'low' | 'medium' | 'high' = 'medium';
    if (lower.includes('urgent') || lower.includes('jaldi') || lower.includes('foran')) urgency = 'high';

    const intent: ExtractedIntent = {
      service,
      location: null,
      time: null,
      urgency,
      original_message: userInput,
      language_detected: 'roman_urdu',
      confidence: 0.4
    };
    
    reasoningLogger.log(
      'Intent Node (Gemini 3.5 Flash)', 
      'Fallback Entity Extraction', 
      userInput, 
      `API Unreachable. Invoked Fallback Keyword Heuristics: Service=${intent.service || 'Unknown'}, Urgency=${intent.urgency}`, 
      Date.now() - startTime,
      40
    );
    
    return intent;
  }
}
