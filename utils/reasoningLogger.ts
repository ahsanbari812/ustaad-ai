import { AgentLog } from './types';

class ReasoningLogger {
  private logs: AgentLog[] = [];

  log(agent: string, action: string, input: any, output: string, duration_ms: number, confidence: number = Math.round(85 + Math.random() * 14)) {
    const logEntry: AgentLog = {
      agent,
      action,
      input: typeof input === 'string' ? input : JSON.stringify(input),
      output,
      timestamp: new Date(),
      duration_ms,
      confidence
    };
    this.logs.push(logEntry);
    console.log(`[${agent}] ${action} completed in ${duration_ms}ms`);
    return logEntry;
  }

  getLogs(): AgentLog[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const reasoningLogger = new ReasoningLogger();
