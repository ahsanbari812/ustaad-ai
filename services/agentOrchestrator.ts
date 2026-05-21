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

  // Pipeline Step 2: Location Agent
  const location = await extractLocation(userMessage);
  intent.location = location;

  // Pipeline Step 3: Provider Ranking Agent
  const providers = rankProviders(intent);

  // Generate Reply
  let replyMessage = '';
  if (!intent.service) {
    replyMessage = "🤔 I couldn't identify the service you need. Could you please specify? (e.g., Plumber, AC Repair)";
  } else if (providers.length === 0) {
    replyMessage = `😔 Sorry, no available providers found${intent.location ? ` in ${intent.location}` : ''}.`;
  } else {
    replyMessage = `Found ${providers.length} recommended providers.`;
  }

  return {
    intent,
    providers,
    booking: null,
    reasoningLogs: reasoningLogger.getLogs(),
    replyMessage
  };
}
