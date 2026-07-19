import { askGemini } from '../services/gemini';
import { reasoningLogger } from '../utils/reasoningLogger';

const LOCATION_PROMPT = `You are the Location Agent for Ustaad AI.
Extract the city area or location mentioned in the user's message.
Normalize the location to one of our supported areas if it closely matches.

Supported Locations:
- DHA
- Gulshan
- Johar
- Clifton
- Nazimabad
- North Nazimabad
- PECHS
- Federal B Area
- Saddar
- Malir Cantt
- Korangi
- Liaquatabad

Return ONLY valid JSON:
{
  "location": "Normalized Location Name" | null
}

User Message: "{MESSAGE}"`;

export async function extractLocation(message: string): Promise<string | null> {
  const startTime = Date.now();
  
  try {
    const prompt = LOCATION_PROMPT.replace('{MESSAGE}', message);
    const response = await askGemini(prompt);
    
    const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const location = parsed.location || null;
    reasoningLogger.log('Location Agent (Gemini 3.5 Flash)', 'Geospatial Parsing', message, location ? `Mapped colloquial area to normalized geographical zone: ${location}.` : `No specific location detected. Defaulting to city-wide search.`, Date.now() - startTime, location ? 98 : 75);
    return location;
  } catch (error) {
    // Basic fallback
    const lower = message.toLowerCase();
    const locations = [
      'dha', 'gulshan', 'johar', 'clifton', 'nazimabad', 
      'north nazimabad', 'pechs', 'federal b area', 'saddar', 
      'malir cantt', 'korangi', 'liaquatabad'
    ];
    const found = locations.find(l => lower.includes(l));
    
    let location = null;
    if (found) {
      location = found.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (found === 'dha') location = 'DHA';
    }
    
    reasoningLogger.log('Location Agent (Gemini 3.5 Flash)', 'extract_location_fallback', message, `Detected location: ${location}`, Date.now() - startTime);
    return location;
  }
}
