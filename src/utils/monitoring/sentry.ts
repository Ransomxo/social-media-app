import * as Sentry from '@sentry/node';
import { Express } from 'express';
import { Integrations } from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import type { Event, Integration } from '@sentry/types';

export const initSentry = (app: Express): void => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Integrations.Http({ tracing: true }),
      new Integrations.Express({ app }),
      new ProfilingIntegration() as unknown as Integration,
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    beforeSend(event: Event) {
      // Sanitize error messages in production
      if (process.env.NODE_ENV === 'production') {
        if (event.exception?.values?.[0]?.stacktrace) {
          delete event.exception.values[0].stacktrace;
        }
      }
      return event;
    },
  });

  // RequestHandler creates a separate execution context using domains
  app.use(Sentry.Handlers.requestHandler());
  
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
};

// Error handler must be before any other error middleware and after all controllers
export const sentryErrorHandler = Sentry.Handlers.errorHandler({
  shouldHandleError(error: { status?: string | number }) {
    // Only report errors with status code >= 500
    const statusCode = typeof error.status === 'string' ? parseInt(error.status, 10) : error.status;
    return !statusCode || statusCode >= 500;
  },
});
