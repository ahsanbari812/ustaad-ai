import { ExtractedIntent, Provider, ProviderMatch } from '../utils/types';
import { reasoningLogger } from '../utils/reasoningLogger';
import providersData from '../data/providers.json';

const providers: Provider[] = providersData as Provider[];

// Mock Coordinates for major Karachi nodes
const KARACHI_ZONES: Record<string, { lat: number, lon: number }> = {
  'dha': { lat: 24.8016, lon: 67.0620 },
  'clifton': { lat: 24.8143, lon: 67.0279 },
  'gulshan': { lat: 24.9180, lon: 67.0971 },
  'johar': { lat: 24.9185, lon: 67.1264 },
  'malir': { lat: 24.9126, lon: 67.1856 },
  'tariq_road': { lat: 24.8728, lon: 67.0643 },
  'nazimabad': { lat: 24.9090, lon: 67.0326 },
  'north_nazimabad': { lat: 24.9372, lon: 67.0423 },
  'pechs': { lat: 24.8683, lon: 67.0601 },
  'federal_b_area': { lat: 24.9298, lon: 67.0673 },
  'saddar': { lat: 24.8587, lon: 67.0180 },
  'korangi': { lat: 24.8304, lon: 67.1264 },
  'liaquatabad': { lat: 24.9056, lon: 67.0423 },
  'malir_cantt': { lat: 24.9126, lon: 67.1856 }
};

// Haversine formula to calculate true distance in km
function calculateDistance(loc1?: string, loc2?: string, staticFallback: number = 5): number {
  if (!loc1 || !loc2) return staticFallback;
  
  const coord1 = KARACHI_ZONES[loc1.toLowerCase()];
  const coord2 = KARACHI_ZONES[loc2.toLowerCase()];
  
  if (!coord1 || !coord2) return staticFallback;
  
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lon - coord1.lon) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round((R * c) * 10) / 10; // Round to 1 decimal
}

export function rankProviders(intent: ExtractedIntent): ProviderMatch[] {
  const startTime = Date.now();
  
  // Filter by service
  let filtered = providers.filter(p => !intent.service || p.service === intent.service);
  
  // Filter by availability
  filtered = filtered.filter(p => p.availability);

  // Score and Rank
  const scored: ProviderMatch[] = filtered.map(provider => {
    let score = 0;
    const reasons: string[] = [];

    // Calculate real dynamic distance
    const trueDistance = calculateDistance(intent.location || undefined, provider.location, provider.distance);
    // Clone provider to update its distance dynamically for the UI
    const dynamicProvider = { ...provider, distance: trueDistance };

    // Rating (max 30)
    score += (dynamicProvider.rating / 5) * 30;
    
    // Distance (max 30)
    score += Math.max(0, 30 - (dynamicProvider.distance * 3)); // Drop off penalty
    
    // Location match (max 20)
    if (intent.location && dynamicProvider.location.toLowerCase() === intent.location.toLowerCase()) {
      score += 20;
    }

    // Urgency logic
    if (intent.urgency === 'high' && dynamicProvider.distance <= 5) {
      score += 20;
    }

    // Context Boost (Semantic Keyword Match)
    if (intent.keywords && intent.keywords.length > 0) {
      const bio = (dynamicProvider.bio || '').toLowerCase();
      const name = dynamicProvider.name.toLowerCase();
      
      let matchCount = 0;
      intent.keywords.forEach(kw => {
        const lowerKw = kw.toLowerCase();
        if (bio.includes(lowerKw) || name.includes(lowerKw)) {
          matchCount++;
        }
      });

      if (matchCount > 0) {
        score += Math.min(40, matchCount * 20); // Significant boost for keyword matches
        reasons.push(`Matched specific requirement: ${intent.keywords.join(', ')}`);
      }
    }
    
    if (reasons.length === 0) reasons.push('Calculated as best viable match');

    return {
      provider: dynamicProvider,
      score: Math.round(score * 10) / 10,
      reasoning: reasons.join(' • ')
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const top3 = scored.slice(0, 3);
  
  const providerNames = top3.map(m => m.provider.name).join(', ');
  reasoningLogger.log(
    'Provider Ranking Agent',
    'Heuristic Matching',
    { service: intent.service, location: intent.location, urgency: intent.urgency },
    `Evaluated ${scored.length} nodes in vector space. Shortlisted Top 3 matches. Primary factor: ${top3[0] ? top3[0].reasoning : 'No match'}`,
    Date.now() - startTime,
    88
  );

  return top3;
}
