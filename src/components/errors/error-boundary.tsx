import * as React from "react";
import * as Sentry from "@sentry/react";
import { MainErrorFallback } from "./main-error-fallback";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactElement | Sentry.FallbackRender;
  onReset?: () => void;
  onError?: (error: unknown, componentStack: string, eventId?: string) => void;
}

const defaultFallback: Sentry.FallbackRender = ({ error, resetError }) => (
  <MainErrorFallback
    error={error instanceof Error ? error : null}
    resetErrorBoundary={resetError}
  />
);

export function ErrorBoundary({
  children,
  fallback,
  onReset,
  onError,
}: ErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary
      fallback={fallback ?? defaultFallback}
      onReset={onReset}
      onError={(error, componentStack, eventId) => {
        if (onError) {
          onError(error, componentStack, eventId);
        }
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default ErrorBoundary;
