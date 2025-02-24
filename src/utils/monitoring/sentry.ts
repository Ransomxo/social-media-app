import * as Sentry from '@sentry/node';
import { Express } from 'express';
import { Integrations } from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export const initSentry = (app: Express): void => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Integrations.Http({ tracing: true }),
      new Integrations.Express({ app }),
      new ProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
    beforeSend(event) {
      // Sanitize error messages in production
      if (process.env.NODE_ENV === 'production') {
        if (event.exception) {
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
  shouldHandleError(error) {
    // Only report errors with status code >= 500
    return !error.status || error.status >= 500;
  },
});
