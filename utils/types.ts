// Ustaad AI - Core Type Definitions

export interface Provider {
  id: string;
  name: string;
  service: ServiceType;
  location: string;
  rating: number;
  distance: number;
  availability: boolean;
  phone: string;
  price_range: string;
  experience_years: number;
  estimatedPrice?: string;
  responseTime?: string;
  profilePic?: string;
  bio?: string;
}

export type ServiceType =
  | 'plumber'
  | 'electrician'
  | 'ac_technician'
  | 'tutor'
  | 'beautician'
  | 'carpenter'
  | 'painter'
  | 'mechanic';

export interface ExtractedIntent {
  service: ServiceType | null;
  location: string | null;
  time: string | null;
  urgency: 'low' | 'medium' | 'high';
  original_message: string;
  language_detected: 'english' | 'urdu' | 'roman_urdu';
  confidence: number;
  keywords?: string[];
}

export interface ProviderMatch {
  provider: Provider;
  score: number;
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'provider_list' | 'booking_confirmation' | 'booking_time_select';
  providers?: ProviderMatch[];
  booking?: BookingSimulation;
  intent?: ExtractedIntent;
  agentLogs?: AgentLog[];
  pendingBookingIndex?: number;
}

export interface AgentLog {
  agent: string;
  action: string;
  input: string;
  output: string;
  timestamp: Date;
  duration_ms: number;
  confidence?: number;
}

export interface BookingSimulation {
  id: string;
  provider: Provider;
  service: ServiceType;
  location: string;
  scheduled_time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  confirmation_message: string;
  reminder_scheduled: boolean;
  otp?: string;
  eta?: string;
  status_logs?: string[];
}
