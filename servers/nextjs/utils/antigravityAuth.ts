import { getApiUrl } from "@/utils/api";
import { syncStoreAfterAntigravitySignOut } from "@/utils/storeHelpers";

export const ANTIGRAVITY_AUTH_REQUIRED_EVENT = "presenton:antigravity-auth-required";
export const ANTIGRAVITY_AUTH_ACTION_HEADER = "x-presenton-auth-action";
export const ANTIGRAVITY_AUTH_ACTION_VALUE = "antigravity-reauth";
export const ANTIGRAVITY_AUTH_REQUIRED_MARKER = "ANTIGRAVITY_AUTH_REQUIRED:";

export interface AntigravityAuthRequiredEventDetail {
  message?: string;
  source?: string;
}

interface ApiErrorLike {
  detail?: unknown;
  message?: unknown;
  error?: unknown;
}

function stringifyDetail(detail: unknown): string {
  if (!detail) return "";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => stringifyDetail(item)).filter(Boolean).join(" ");
  }
  if (typeof detail === "object") {
    const record = detail as Record<string, unknown>;
    const message = record.message ?? record.detail ?? record.error ?? record.msg;
    if (message) return stringifyDetail(message);
    try {
      return JSON.stringify(detail);
    } catch {
      return "";
    }
  }
  return String(detail);
}

export function normalizeAntigravityAuthMessage(message?: unknown): string {
  const raw = stringifyDetail(message).trim();
  if (!raw) {
    return "Your Google Antigravity session expired. Please sign in again from Settings.";
  }

  const markerIndex = raw.indexOf(ANTIGRAVITY_AUTH_REQUIRED_MARKER);
  if (markerIndex >= 0) {
    return raw.slice(markerIndex + ANTIGRAVITY_AUTH_REQUIRED_MARKER.length).trim();
  }

  return raw;
}

export function isAntigravityAuthRequiredMessage(message?: unknown): boolean {
  const raw = stringifyDetail(message).toLowerCase();
  return (
    raw.includes(ANTIGRAVITY_AUTH_REQUIRED_MARKER.toLowerCase()) ||
    raw.includes("antigravity authentication") ||
    raw.includes("antigravity session") ||
    raw.includes("antigravity oauth")
  );
}

export function isAntigravityAuthRequiredResponse(
  response: Response,
  errorData?: ApiErrorLike | null,
  errorMessage?: string
): boolean {
  const action = response.headers.get(ANTIGRAVITY_AUTH_ACTION_HEADER);
  if (action === ANTIGRAVITY_AUTH_ACTION_VALUE) {
    return true;
  }

  if (response.status !== 401 && response.status !== 403) {
    return false;
  }

  return (
    isAntigravityAuthRequiredMessage(errorMessage) ||
    isAntigravityAuthRequiredMessage(errorData?.detail) ||
    isAntigravityAuthRequiredMessage(errorData?.message) ||
    isAntigravityAuthRequiredMessage(errorData?.error)
  );
}

export function requestAntigravityReauth(
  detail: AntigravityAuthRequiredEventDetail = {}
): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<AntigravityAuthRequiredEventDetail>(
      ANTIGRAVITY_AUTH_REQUIRED_EVENT,
      {
        detail: {
          ...detail,
          message: normalizeAntigravityAuthMessage(detail.message),
        },
      }
    )
  );
}

export async function logoutAntigravityAuth(): Promise<void> {
  let logoutError: unknown = null;

  try {
    const response = await fetch(getApiUrl("/api/v1/ppt/antigravity/auth/logout"), {
      method: "POST",
    });
    if (!response.ok) {
      logoutError = new Error("Antigravity logout request failed");
    }
  } catch (error) {
    logoutError = error;
  } finally {
    syncStoreAfterAntigravitySignOut();
  }

  if (logoutError) {
    throw logoutError;
  }
}
