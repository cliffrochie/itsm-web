import axios from "axios";

export interface ParsedApiError {
  key: string;
  message: string;
}

export function handleAxiosError(error: unknown): ParsedApiError | undefined {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  const response = error.response;
  if (!response?.data) {
    return undefined;
  }

  const data = response.data as {
    message?: string;
    errors?: Record<string, string[] | string> | null;
  };

  if (data.errors && typeof data.errors === "object") {
    const entries = Object.entries(data.errors);
    if (entries.length > 0) {
      const [key, val] = entries[0];
      let message = "Invalid value.";
      if (Array.isArray(val) && val.length > 0) {
        message = String(val[0]);
      } else if (typeof val === "string") {
        message = val;
      }
      return { key, message };
    }
  }

  if (data.message) {
    return { key: "root", message: data.message };
  }

  return undefined;
}
