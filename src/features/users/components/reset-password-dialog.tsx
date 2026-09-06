import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KeyRound, Copy, Check, AlertTriangle } from "lucide-react";
import { useResetUserPassword } from "../api";
import { toast } from "sonner";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | number;
  username: string;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  userId,
  username,
}: ResetPasswordDialogProps) {
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const resetMutation = useResetUserPassword();

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setTemporaryPassword(null);
      setCopied(false);
    }
    onOpenChange(newOpen);
  };

  const handleReset = async () => {
    try {
      const result = await resetMutation.mutateAsync(userId);
      setTemporaryPassword(result.temporaryPassword);
      toast.success("Password reset successfully.");
    } catch {
      // Toast handled by mutation onError
    }
  };

  const handleCopy = async () => {
    if (temporaryPassword) {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      toast.success("Temporary password copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <DialogTitle>
              {temporaryPassword ? "Temporary Password Generated" : "Reset User Password"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {temporaryPassword
              ? "Share this temporary password with the user. It will not be shown again."
              : `Are you sure you want to reset the password for "${username}"? All active sessions for this account will be invalidated immediately.`}
          </DialogDescription>
        </DialogHeader>

        {temporaryPassword ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3 font-mono text-base font-semibold tracking-wider">
              <span className="select-all text-primary">{temporaryPassword}</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Please ensure you copy or deliver this temporary password now. The system will
                prompt the user to change their password upon their next sign in.
              </span>
            </div>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          {temporaryPassword ? (
            <Button type="button" onClick={() => handleClose(false)}>
              Done
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={resetMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleReset}
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? "Resetting..." : "Confirm Reset"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ResetPasswordDialog;
