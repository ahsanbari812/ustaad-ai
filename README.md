# 🛠️ Ustaad AI - Agentic Service Orchestrator for the Informal Economy
> **Google Antigravity Hackathon — Challenge 2 (AI Service Orchestrator)**  
> Developed by: **Muhammad Ahsan Bari** (AI Engineer) & **Ramaize Shahab** (Full Stack Developer)



## 🎯 Project Overview
In Pakistan's informal economy, hiring services like plumbers, electricians, and tutors is highly inefficient, relying on slow phone calls, messy WhatsApp threads, and unreliable word-of-mouth recommendations.

**Ustaad AI** solves this by implementing an end-to-end **Agentic AI System** that automates the lifecycle of service requests. The application allows users to express their needs in natural **English, Urdu, or Roman Urdu** (e.g., *"Mujhe kal subah DHA mein electrician chahiye"*). The core system then orchestrates multiple specialized nodes to normalize locations, query service providers, rank matches geospatially, execute bookings, and schedule automated follow-up reminders.

---

## 🏗️ System & Multi-Agent Architecture
Ustaad AI utilizes a structured multi-agent workflow simulated on top of the **Google Antigravity** orchestration philosophy.

```
                    User Message (EN / UR / Roman UR)
                                  │
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│                    Google Antigravity Pipeline                    │
│                                                                   │
│  [1] Intent Node (NLU) ──────────────────────────┐                │
│      └─ Extracted service, urgency, & keywords    │                │
│                                                   ▼                │
│  [2] Location Node (Geospatial) ─────────→ Full Context State     │
│      └─ Normalized Karachi zones (DHA, Gulshan)   │                │
│                                                   ▼                │
│  [3] Ranking Node (Heuristics) ───────────────────┤                │
│      └─ Haversine dynamic distance ranking         │                │
│                                                   ▼                │
│  [4] Booking Node (Action Simulation) ←───────────┘                │
│      └─ Confirms slot, yields ETA, triggers OTP                    │
└─────────────────────────────────┬─────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────┴─────────────────────────────────┐
│                        Persistence Layer                          │
│     AsyncStorage (offline caches) & expo-notifications (OS alerts)│
└───────────────────────────────────────────────────────────────────┘
```

### Core Pipeline Nodes:
1. **Intent Node** ([agents/intentAgent.ts](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/agents/intentAgent.ts)): Translates natural language requests into structured service definitions using Google Gemini API (`gemini-3.5-flash`). It handles typos, code-switching (Roman Urdu/Urdu/English), and extracts custom intent keywords.
2. **Location Node** ([agents/locationAgent.ts](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/agents/locationAgent.ts)): Extracts and maps colloquial names (e.g. "fb area", "pechs") onto normalized coordinates.
3. **Provider Ranking Node** ([agents/providerRankingAgent.ts](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/agents/providerRankingAgent.ts)): Takes coordinates from the location node and runs the **Haversine formula** to calculate dynamic distances against the provider directory. It scores candidates out of `100` based on:
   * **Distance penalty**: Dynamic score reduction as provider distance increases.
   * **Ratings**: Weighted reputation score.
   * **Availability**: Pre-filter criteria.
   * **Context Boosts**: Semantic match boosts for keyword alignments (e.g., matching "inverter" to AC tech specialties).
4. **Booking Node** ([agents/bookingAgent.ts](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/agents/bookingAgent.ts)): Simulates transactional logic—assigning slots, computing travel ETAs, and generating job OTPs.

---

## 🛠️ Tech Stack & Dependencies
* **Core Framework**: Expo SDK 54 (React Native), React 19, TypeScript
* **Styling**: NativeWind v4 (TailwindCSS Engine) for fluid, premium responsive layouts
* **AI Cognitive Layer**: Google Gemini Developer API (`gemini-3.5-flash`)
* **Persistence Layer**: Local Storage via React Native `@react-native-async-storage/async-storage`
* **Notification Layer**: Native OS alert triggers via `expo-notifications`

---

## ⚖️ How the System Meets Challenge 2 Requirements

### 1. Intent Understanding
* Handles English, Urdu, and Roman Urdu.
* Extracted objects: `service type`, `normalized location`, and `relative time slot`.
* **Implementation**: Managed by [intentAgent.ts](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/agents/intentAgent.ts).

### 2. Provider Discovery
* Evaluates dynamic availabilities and services.
* **Implementation**: Queries mock database file [providers.json](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/data/providers.json).

### 3. Matching & Ranking
* Dynamic geospatial calculations based on center nodes inside Karachi.
* **Implementation**: Powered by `calculateDistance` (Haversine formula) in [providerRankingAgent.ts](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/agents/providerRankingAgent.ts).

### 4. Decision & Recommendation
* Curates a shortlist of top 3 options with user-friendly explanations.
* **Implementation**: Rendered inside [components/ProviderCard.tsx](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/components/ProviderCard.tsx).

### 5. Action Simulation
* Performs system-state modification (confirming slots, logging operations, writing to storage).
* **Implementation**: Written to database via [storageService.ts](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/services/storageService.ts) and visualized in [components/BookingConfirmation.tsx](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/components/BookingConfirmation.tsx).

### 6. Follow-up Automation
* Schedules system-level callbacks and OS notifications.
* **Implementation**: Handled by [notificationService.ts](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/services/notificationService.ts) (native OS push alerts) and [reminderService.ts](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/services/reminderService.ts) (simulated in-app popups).

### 7. Agentic Workplans & Traces (Google Antigravity Core)
* Full logging of each agent's execution latency, reasoning pipeline, and extraction confidence.
* **Implementation**: Showcased in real-time under the "Show Agent Trace" drawer via [components/WorkflowVisualizer.tsx](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/components/WorkflowVisualizer.tsx) and aggregated globally on the Telemetry page [app/dashboard.tsx](file:///c:/Users/Ahsan/Downloads/CHALLENGE%202/ustaad-ai/app/dashboard.tsx).

---

## 🚀 Quick Start (Running Locally)

### 1. Install Dependencies
```bash
cd ustaad-ai
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the `ustaad-ai` project:
```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npx expo start
```
* Press **i** to run on an iOS simulator.
* Press **a** to run on an Android emulator.
* Scan the QR code using the **Expo Go** application on your physical device.
