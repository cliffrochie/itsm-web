import { describe, it, expect } from "vitest";
import { handleAxiosError } from "../error-handler";
import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";

function createAxiosError(status: number, data: unknown): AxiosError {
  const headers = new AxiosHeaders();
  const response: AxiosResponse = {
    data,
    status,
    statusText: "Error",
    headers,
    config: { headers },
  };
  const error = new AxiosError("Request failed", "ERR_BAD_REQUEST", { headers }, null, response);
  error.response = response;
  return error;
}

describe("handleAxiosError", () => {
  it("returns undefined for non-Axios errors", () => {
    expect(handleAxiosError(new Error("Regular JS error"))).toBeUndefined();
    expect(handleAxiosError("string error")).toBeUndefined();
    expect(handleAxiosError(null)).toBeUndefined();
  });

  it("extracts field error from 422 validation response with array message", () => {
    const error = createAxiosError(422, {
      message: "Validation failed.",
      errors: {
        email: ["Email already taken.", "Invalid domain."],
      },
    });

    const parsed = handleAxiosError(error);
    expect(parsed).toEqual({
      key: "email",
      message: "Email already taken.",
    });
  });

  it("extracts field error from response with string error message", () => {
    const error = createAxiosError(422, {
      message: "Validation failed.",
      errors: {
        username: "Username must be at least 3 characters.",
      },
    });

    const parsed = handleAxiosError(error);
    expect(parsed).toEqual({
      key: "username",
      message: "Username must be at least 3 characters.",
    });
  });

  it("falls back to root message when no errors field object is present", () => {
    const error = createAxiosError(404, {
      message: "The requested ticket was not found.",
    });

    const parsed = handleAxiosError(error);
    expect(parsed).toEqual({
      key: "root",
      message: "The requested ticket was not found.",
    });
  });

  it("returns undefined when response has no data", () => {
    const error = new AxiosError("Network Error", "ERR_NETWORK");
    expect(handleAxiosError(error)).toBeUndefined();
  });
});
