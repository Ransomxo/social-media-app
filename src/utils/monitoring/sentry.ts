import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';

export const initSentry = (app: Express): void => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.HttpClient({ tracing: true }),
      new Sentry.Express({ app }),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });

  // RequestHandler creates a separate execution context using domains
  app.use(Sentry.requestHandler());
  
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.tracingHandler());
};

export const sentryErrorHandler = Sentry.errorHandler();
