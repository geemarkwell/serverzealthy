import { Injectable, LoggerService, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger implements LoggerService {
  private context?: string;

  setContext(context: string) {
    this.context = context;
  }

  private formatMessage(message: any, meta?: any, context?: string): string {
    const timestamp = new Date().toISOString();
    const ctx = context || this.context || 'Application';
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${ctx}] ${message}${metaString}`;
  }

  private logToFile(level: string, message: string, meta?: any) {
    // Here if we wanted we could add file logging logic.
    //for this code challange we'll just log to the console.
    console.log(`${level}: ${message}`, meta || '');
  }

  log(message: any, context?: string) {
    const formattedMessage = this.formatMessage(message, null, context);
    this.logToFile('INFO', formattedMessage);
  }

  error(message: any, trace?: string | any, context?: string) {
    const formattedMessage = this.formatMessage(message, { trace }, context);
    this.logToFile('ERROR', formattedMessage);
  }

  warn(message: any, meta?: any, context?: string) {
    const formattedMessage = this.formatMessage(message, meta, context);
    this.logToFile('WARN', formattedMessage);
  }

  debug(message: any, meta?: any, context?: string) {
    const formattedMessage = this.formatMessage(message, meta, context);
    this.logToFile('DEBUG', formattedMessage);
  }

  verbose(message: any, meta?: any, context?: string) {
    const formattedMessage = this.formatMessage(message, meta, context);
    this.logToFile('VERBOSE', formattedMessage);
  }
}