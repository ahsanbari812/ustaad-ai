import { BookingSimulation, ProviderMatch, ExtractedIntent } from '../utils/types';
import { reasoningLogger } from '../utils/reasoningLogger';
import { storageService } from '../services/storageService';

export function createBooking(intent: ExtractedIntent, match: ProviderMatch): BookingSimulation {
  const startTime = Date.now();
  const provider = match.provider;
  
  // Generate random booking ID
  const bookingId = `UST-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Assign slot
  const time = intent.time || 'Today 4:00 PM';
  
  // Calculate ETA based on distance (approx 5 mins per km)
  const etaMinutes = Math.max(15, Math.round(provider.distance * 5));
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const simulation: BookingSimulation = {
    id: bookingId,
    provider,
    service: provider.service,
    location: intent.location || provider.location,
    scheduled_time: time,
    status: 'confirmed',
    confirmation_message: `Confirmed! ${provider.name} will arrive at ${time}.`,
    reminder_scheduled: true,
    otp,
    eta: `${etaMinutes} mins`,
    status_logs: [
      'Sending encrypted request to provider...',
      'Matching node availability...',
      'Provider [System Node] accepted request.',
      'Agentic workflow complete. Booking secured.'
    ]
  };

  reasoningLogger.log(
    'Booking Agent',
    'create_booking',
    { providerId: provider.id, time },
    `Generated booking ID = ${bookingId}. Assigned slot = ${time}`,
    Date.now() - startTime
  );

  // Save to persistent storage
  storageService.saveBooking(simulation);

  return simulation;
}
