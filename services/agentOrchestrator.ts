import { extractIntent } from '../agents/intentAgent';
import { extractLocation } from '../agents/locationAgent';
import { rankProviders } from '../agents/providerRankingAgent';
import { createBooking } from '../agents/bookingAgent';
import { reasoningLogger } from '../utils/reasoningLogger';
import { ExtractedIntent, ProviderMatch, BookingSimulation, AgentLog } from '../utils/types';

export interface OrchestratorResult {
  intent: ExtractedIntent;
  providers: ProviderMatch[];
  booking: BookingSimulation | null;
  reasoningLogs: AgentLog[];
  replyMessage: string;
}

export async function runAgenticWorkflow(userMessage: string, bookingChoice?: number, previousState?: OrchestratorResult): Promise<OrchestratorResult> {
  reasoningLogger.clearLogs();
  
  if (bookingChoice !== undefined && previousState && previousState.providers.length >= bookingChoice) {
    // User selected a provider to book
    const match = previousState.providers[bookingChoice - 1];
    const booking = createBooking(previousState.intent, match);
    return {
      ...previousState,
      booking,
      reasoningLogs: reasoningLogger.getLogs(),
      replyMessage: `Booking confirmed with ${match.provider.name}!`
    };
  }

  // Pipeline Step 1: Intent Agent
  const intent = await extractIntent(userMessage);

  // Smart State Merging: Accumulate context across multiple messages
  if (previousState?.intent) {
    if (!intent.service) intent.service = previousState.intent.service;
    if (!intent.time) intent.time = previousState.intent.time;
    if (intent.urgency === 'medium' && previousState.intent.urgency && previousState.intent.urgency !== 'medium') {
      intent.urgency = previousState.intent.urgency;
    }
    
    // Merge keywords uniquely
    const prevKeywords = previousState.intent.keywords || [];
    const currentKeywords = intent.keywords || [];
    if (prevKeywords.length > 0 || currentKeywords.length > 0) {
      intent.keywords = [...new Set([...prevKeywords, ...currentKeywords])];
    }
  }

  // Pipeline Step 2: Location Agent
  let location = await extractLocation(userMessage);
  
  if (!location && previousState?.intent?.location) {
    location = previousState.intent.location;
  }
  
  intent.location = location;

  let providers: ProviderMatch[] = [];
  let replyMessage = '';

  if (!intent.service) {
    replyMessage = "🤔 I couldn't identify the service you need. Could you please specify? (e.g., Plumber, AC Repair)";
  } else if (!intent.location) {
    replyMessage = `📍 Where do you need the ${intent.service.replace('_', ' ')}? Please provide your location (e.g., DHA, Gulshan, PECHS).`;
  } else {
    // Pipeline Step 3: Provider Ranking Agent
    providers = rankProviders(intent);
    
    if (providers.length === 0) {
      replyMessage = `😔 Sorry, no available providers found in ${intent.location}.`;
    } else {
      replyMessage = `Found ${providers.length} recommended providers.`;
    }
  }

  return {
    intent,
    providers,
    booking: null,
    reasoningLogs: reasoningLogger.getLogs(),
    replyMessage
  };
}
