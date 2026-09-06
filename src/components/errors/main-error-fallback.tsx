import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { env } from "@/config/env";

export interface MainErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
}

export function MainErrorFallback({
  error,
  resetErrorBoundary,
}: MainErrorFallbackProps) {
  const handleReset = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred while rendering this page. Our team has been notified.
          </CardDescription>
        </CardHeader>

        {env.IS_DEV && error ? (
          <CardContent>
            <div className="rounded-md bg-muted p-3 text-left font-mono text-xs text-muted-foreground overflow-auto max-h-40">
              <p className="font-semibold text-destructive">{error.name}: {error.message}</p>
              {error.stack && (
                <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
              )}
            </div>
          </CardContent>
        ) : null}

        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            type="button"
            variant="default"
            onClick={handleReset}
            className="w-full sm:w-auto gap-1.5"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try again</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGoHome}
            className="w-full sm:w-auto gap-1.5"
          >
            <Home className="h-4 w-4" />
            <span>Go to home</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default MainErrorFallback;
