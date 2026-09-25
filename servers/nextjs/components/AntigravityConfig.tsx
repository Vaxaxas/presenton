"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronUp,
  Download,
  Loader2,
  RefreshCw,
  Trash2,
  UserCheck,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notify } from "@/components/ui/sonner";
import { getApiUrl } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { syncStoreAfterAntigravitySignOut } from "@/utils/storeHelpers";
import {
  ANTIGRAVITY_MODELS,
  DEFAULT_ANTIGRAVITY_MODEL,
  isSupportedAntigravityModel,
} from "@/utils/antigravityModels";
import {
  isAntigravityAuthRequiredResponse,
  normalizeAntigravityAuthMessage,
  requestAntigravityReauth,
} from "@/utils/antigravityAuth";

interface AntigravityConfigProps {
  antigravityModel: string;
  onInputChange: (value: string | boolean, field: string) => void;
  onAuthStatusChange?: (authenticated: boolean) => void;
  showModelSelect?: boolean;
}

type AuthStatus = "checking" | "unauthenticated" | "polling" | "authenticated";

interface StatusResponse {
  status: string;
  email?: string;
  name?: string;
  project_id?: string;
  detail?: string;
  local_creds_available?: boolean;
}

export default function AntigravityConfig({
  antigravityModel,
  onInputChange,
  onAuthStatusChange,
  showModelSelect = true,
}: AntigravityConfigProps) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [localCredsAvailable, setLocalCredsAvailable] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [isExchanging, setIsExchanging] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isImportingLocal, setIsImportingLocal] = useState(false);
  const [openModelSelect, setOpenModelSelect] = useState(false);

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    checkCurrentAuthStatus();
    return () => stopPolling();
  }, []);

  useEffect(() => {
    onAuthStatusChange?.(authStatus === "authenticated");
  }, [authStatus, onAuthStatusChange]);

  useEffect(() => {
    if (antigravityModel && !isSupportedAntigravityModel(antigravityModel)) {
      onInputChange(DEFAULT_ANTIGRAVITY_MODEL, "antigravity_model");
    }
  }, [antigravityModel, onInputChange]);

  const applyProfile = (data: Partial<StatusResponse>) => {
    setName(data.name ?? null);
    setEmail(data.email ?? null);
    setProjectId(data.project_id ?? null);
    if (data.local_creds_available !== undefined) {
      setLocalCredsAvailable(data.local_creds_available);
    }
  };

  const checkCurrentAuthStatus = async () => {
    try {
      const res = await fetch(getApiUrl("/api/v1/ppt/antigravity/auth/status"));
      if (!res.ok) {
        setAuthStatus("unauthenticated");
        applyProfile({});
        return;
      }
      const data: StatusResponse = await res.json();
      if (data.local_creds_available !== undefined) {
        setLocalCredsAvailable(data.local_creds_available);
      }
      if (data.status === "authenticated") {
        onInputChange("antigravity", "LLM");
        if (!isSupportedAntigravityModel(antigravityModel)) {
          onInputChange(DEFAULT_ANTIGRAVITY_MODEL, "antigravity_model");
        }
        setAuthStatus("authenticated");
        applyProfile(data);
      } else {
        setAuthStatus("unauthenticated");
        applyProfile(data);
      }
    } catch {
      setAuthStatus("unauthenticated");
      applyProfile({});
    }
  };

  const handleImportLocal = async () => {
    setIsImportingLocal(true);
    try {
      const res = await fetch(getApiUrl("/api/v1/ppt/antigravity/auth/import-local"), {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Local credential import failed");
      }
      const data: StatusResponse = await res.json();
      onInputChange("antigravity", "LLM");
      if (!isSupportedAntigravityModel(antigravityModel)) {
        onInputChange(DEFAULT_ANTIGRAVITY_MODEL, "antigravity_model");
      }
      setAuthStatus("authenticated");
      applyProfile(data);
      notify.success(
        "Imported local Gemini credentials",
        `Connected as ${data.email || "Google user"}`
      );
    } catch (err: any) {
      notify.error(
        "Import failed",
        err.message || "Could not import local Gemini credentials."
      );
    } finally {
      setIsImportingLocal(false);
    }
  };

  const handleSignIn = async () => {
    try {
      onInputChange("antigravity", "LLM");

      const res = await fetch(getApiUrl("/api/v1/ppt/antigravity/auth/initiate"), {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to initiate auth");
      const data = await res.json();
      const { session_id, url } = data;

      setSessionId(session_id);
      setAuthStatus("polling");
      window.open(url, "_blank", "noopener,noreferrer");

      pollIntervalRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch(
            getApiUrl(`/api/v1/ppt/antigravity/auth/status/${session_id}`)
          );
          if (!pollRes.ok) return;
          const pollData: StatusResponse = await pollRes.json();

          if (pollData.status === "success") {
            stopPolling();
            setAuthStatus("authenticated");
            applyProfile(pollData);
            setSessionId(null);
            if (!isSupportedAntigravityModel(antigravityModel)) {
              onInputChange(DEFAULT_ANTIGRAVITY_MODEL, "antigravity_model");
            }
            notify.success(
              "Signed in to Google Antigravity",
              "Your account is connected and ready to use."
            );
          } else if (pollData.status === "failed") {
            stopPolling();
            setAuthStatus("unauthenticated");
            applyProfile({});
            notify.error(
              "Sign-in failed",
              "Authentication did not complete. Please try signing in again."
            );
          }
        } catch {
          // keep polling on transient errors
        }
      }, 2000);
    } catch (err) {
      notify.error(
        "Sign-in failed",
        "Could not start the sign-in flow. Please try again."
      );
      setAuthStatus("unauthenticated");
      applyProfile({});
    }
  };

  const handleManualExchange = async () => {
    if (!sessionId || !manualCode.trim()) return;
    setIsExchanging(true);
    try {
      const res = await fetch(getApiUrl("/api/v1/ppt/antigravity/auth/exchange"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, code: manualCode.trim() }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Exchange failed");
      }
      const data = await res.json();
      stopPolling();
      setAuthStatus("authenticated");
      applyProfile(data);
      setSessionId(null);
      setManualCode("");
      if (!isSupportedAntigravityModel(antigravityModel)) {
        onInputChange(DEFAULT_ANTIGRAVITY_MODEL, "antigravity_model");
      }
      notify.success(
        "Signed in to Google Antigravity",
        "Your account is connected and ready to use."
      );
    } catch (err: any) {
      notify.error(
        "Sign-in failed",
        err.message || "The verification code could not be accepted. Please try again."
      );
    } finally {
      setIsExchanging(false);
    }
  };

  const handleCancelPolling = () => {
    stopPolling();
    setSessionId(null);
    setManualCode("");
    setAuthStatus("unauthenticated");
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch(getApiUrl("/api/v1/ppt/antigravity/auth/logout"), {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Antigravity logout returned ${response.status}`);
      }
      setAuthStatus("unauthenticated");
      setName(null);
      setEmail(null);
      setProjectId(null);
      onInputChange("", "antigravity_model");
      onInputChange("", "ANTIGRAVITY_ACCESS_TOKEN");
      onInputChange("", "ANTIGRAVITY_REFRESH_TOKEN");
      onInputChange("", "ANTIGRAVITY_TOKEN_EXPIRES");
      onInputChange("", "ANTIGRAVITY_EMAIL");
      onInputChange("", "ANTIGRAVITY_NAME");
      onInputChange("", "ANTIGRAVITY_PROJECT_ID");
      syncStoreAfterAntigravitySignOut();
      router.replace(pathname.startsWith("/settings") ? "/settings" : "/");
      notify.success(
        "Signed out",
        "You have been disconnected from Google Antigravity."
      );
    } catch {
      notify.error(
        "Sign-out failed",
        "Could not disconnect from Antigravity. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(getApiUrl("/api/v1/ppt/antigravity/auth/refresh"), {
        method: "POST",
      });
      if (!res.ok) {
        let errorData: { detail?: unknown; message?: string; error?: string } | null = null;
        let message = "Your session could not be renewed. Please sign in again.";
        try {
          const parsedError: { detail?: unknown; message?: string; error?: string } =
            await res.json();
          errorData = parsedError;
          message =
            (typeof parsedError.detail === "string" && parsedError.detail) ||
            parsedError.message ||
            parsedError.error ||
            message;
        } catch {}
        if (isAntigravityAuthRequiredResponse(res, errorData, message)) {
          requestAntigravityReauth({
            message: normalizeAntigravityAuthMessage(message),
            source: "antigravity-refresh",
          });
          return;
        }
        throw new Error(message);
      }
      const data = await res.json();
      applyProfile(data);
      notify.success(
        "Session refreshed",
        "Your Antigravity connection was renewed successfully."
      );
    } catch {
      notify.error(
        "Session refresh failed",
        "Your session could not be renewed. Please sign in again."
      );
      setAuthStatus("unauthenticated");
      applyProfile({});
    } finally {
      setIsRefreshing(false);
    }
  };

  if (authStatus === "checking") {
    return (
      <div className="mb-5 w-full p-3 border border-[#EDEEEF] font-syne rounded-[8px] flex items-center gap-6">
        <div className="w-[74px] h-[74px] bg-[#333333] rounded-full flex items-center justify-center shrink-0">
          <Loader2 className="w-10 h-10 text-[#191919] animate-spin" />
        </div>
        <div className="text-start flex-1 min-w-0">
          <h4 className="text-[#191919] text-lg font-medium">Checking status</h4>
          <p className="text-[#B3B3B3] text-sm font-normal">
            Verifying your Antigravity connection…
          </p>
        </div>
      </div>
    );
  }

  if (authStatus === "polling") {
    return (
      <div className="mb-5 space-y-4 font-syne">
        <div className="w-full p-3 border border-[#EDEEEF] rounded-[8px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0 flex-1">
            <div className="w-[40px] h-[40px] bg-[#EDEEEF] rounded-full flex items-center justify-center shrink-0">
              <Loader2 className="w-5 h-5 text-[#191919] animate-spin" />
            </div>
            <div className="text-start min-w-0">
              <h4 className="text-[#191919] text-lg font-medium">Waiting for Google sign-in</h4>
              <p className="text-[#B3B3B3] text-sm font-normal">
                Complete sign-in in the browser tab we opened.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancelPolling}
            className="shrink-0 text-sm text-[#B3B3B3] hover:text-[#191919] underline underline-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="space-y-2 rounded-[8px] border border-[#EDEEEF] p-3">
          <p className="text-[#191919] text-xs font-normal">
            Paste redirect URL or authorization code if you were not redirected automatically
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste URL or code…"
              className="flex-1 min-w-0 px-3 py-2.5 outline-none border border-[#EDEEEF] rounded-[8px] text-sm text-[#191919] placeholder:text-[#666666] focus:border-[#555555] transition-colors"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
            <button
              type="button"
              onClick={handleManualExchange}
              disabled={isExchanging || !manualCode.trim()}
              className="shrink-0 px-4 py-2.5 bg-[#EDEEEF] hover:bg-[#E4E5E6] disabled:opacity-40 disabled:hover:bg-[#EDEEEF] rounded-[8px] text-sm font-medium text-[#191919] transition-colors flex items-center justify-center min-w-[88px]"
            >
              {isExchanging ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === "authenticated") {
    return (
      <div className="mb-5 space-y-4">
        <div className="flex items-center justify-between gap-3 p-4 border border-[#EDEEEF] rounded-[8px]">
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] bg-slate-900 rounded-full flex items-center justify-center">
              <img
                src="/providers/gemini-color.svg"
                alt="Antigravity Logo"
                className="w-[24px] h-[24px]"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <p className="text-sm font-medium text-[#191919] truncate">
                  {name || email || "Google Antigravity User"}
                </p>
              </div>
              {email && <p className="text-xs text-[#B3B3B3] truncate">{email}</p>}
              {projectId && (
                <p className="text-xs text-[#B3B3B3] truncate">Project: {projectId}</p>
              )}
              <p className="text-xs text-emerald-600 font-medium">Connected</p>
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={handleRefreshToken}
              disabled={isRefreshing}
              title="Refresh token"
              className="flex items-center justify-center px-3.5 py-2.5 border border-[#EDEEEF] rounded-[58px] hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              {isRefreshing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#191919]" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 text-[#191919]" />
              )}
            </button>
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              title="Sign out"
              className="flex items-center justify-center px-3.5 py-2.5 border border-[#EDEEEF] rounded-[58px] hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              {isLoggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#191919]" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 text-[#191919]" />
              )}
            </button>
          </div>
        </div>

        {showModelSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Antigravity Model
            </label>
            <Popover open={openModelSelect} onOpenChange={setOpenModelSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openModelSelect}
                  className="w-full h-10 px-3 outline-none border border-gray-300 rounded-lg hover:border-gray-400 justify-between"
                >
                  <span className="text-sm text-gray-900">
                    {antigravityModel
                      ? (ANTIGRAVITY_MODELS.find((m) => m.id === antigravityModel)?.name ??
                        antigravityModel)
                      : "Select an Antigravity model"}
                  </span>
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                align="start"
                style={{ width: "var(--radix-popover-trigger-width)" }}
              >
                <Command>
                  <CommandInput placeholder="Search Antigravity models…" />
                  <CommandList>
                    <CommandEmpty>No model found.</CommandEmpty>
                    <CommandGroup>
                      {ANTIGRAVITY_MODELS.map((model) => (
                        <CommandItem
                          key={model.id}
                          value={model.id}
                          onSelect={(value) => {
                            onInputChange(value, "antigravity_model");
                            setOpenModelSelect(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              antigravityModel === model.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span className="text-sm text-gray-900">{model.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 font-syne">
      <button
        onClick={handleSignIn}
        className="w-full p-4 border border-[#EDEEEF] hover:bg-[#F7F6F9] transition-colors duration-300 rounded-[12px] flex items-center justify-between"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-[40px] h-[40px] bg-slate-900 rounded-full flex items-center justify-center">
            <img
              src="/providers/gemini-color.svg"
              alt="Google Antigravity"
              className="w-[24px] h-[24px]"
            />
          </div>
          <div className="text-start flex-1">
            <h4 className="text-[#191919] text-sm font-medium">
              Sign in with Google (Antigravity)
            </h4>
            <p className="text-[#B3B3B3] text-xs font-normal">
              OAuth login for Gemini 3 Pro, Claude, Image Generation & Web Search
            </p>
          </div>
        </div>
        <ArrowRight className="w-[22px] h-[22px] text-[#4C4C4C]" />
      </button>

      {localCredsAvailable && (
        <button
          onClick={handleImportLocal}
          disabled={isImportingLocal}
          className="w-full p-3 border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/60 transition-colors rounded-[10px] flex items-center justify-between text-xs text-emerald-800"
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Found local Gemini CLI credentials (~/.gemini/oauth_creds.json)</span>
          </div>
          <span className="font-semibold underline">
            {isImportingLocal ? "Importing…" : "One-Click Import"}
          </span>
        </button>
      )}
    </div>
  );
}
