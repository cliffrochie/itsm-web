import * as Sentry from "@sentry/react";
import { env } from "./env";

let isInitialized = false;

export function initSentry(): void {
  const dsn = env.SENTRY_DSN;

  if (!dsn) {
    if (env.IS_DEV) {
      console.info("[Sentry] DSN not configured; error monitoring is disabled.");
    }
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE || "development",
    sendDefaultPii: false,
    tracesSampleRate: env.IS_DEV ? 1.0 : 0.2,
    beforeSend(event) {
      // Guard: Never leak Authorization header or JWTs
      if (event.request?.headers) {
        delete event.request.headers["Authorization"];
        delete event.request.headers["authorization"];
      }
      return event;
    },
  });

  isInitialized = true;
  if (env.IS_DEV) {
    console.info("[Sentry] Error monitoring initialized successfully.");
  }
}

export function isSentryActive(): boolean {
  return isInitialized;
}

export function reportException(error: unknown, context?: Record<string, unknown>): void {
  if (env.IS_DEV) {
    console.error("[Reported Exception]", error, context);
  }

  if (isInitialized) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setExtras(context);
      }
      Sentry.captureException(error);
    });
  }
}

export { Sentry };
