"use client";

import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { RootState } from "@/store/store";
import type { LLMConfig } from "@/types/llm_config";
import {
  IMAGE_PROVIDERS,
  LLM_PROVIDERS,
  WEB_SEARCH_PROVIDERS,
} from "@/utils/providerConstants";

const TEXT_MODEL_FIELDS: Record<string, keyof LLMConfig> = {
  openai: "OPENAI_MODEL",
  deepseek: "DEEPSEEK_MODEL",
  google: "GOOGLE_MODEL",
  vertex: "VERTEX_MODEL",
  azure: "AZURE_OPENAI_MODEL",
  bedrock: "BEDROCK_MODEL",
  openrouter: "OPENROUTER_MODEL",
  fireworks: "FIREWORKS_MODEL",
  together: "TOGETHER_MODEL",
  cerebras: "CEREBRAS_MODEL",
  litellm: "LITELLM_MODEL",
  lmstudio: "LMSTUDIO_MODEL",
  anthropic: "ANTHROPIC_MODEL",
  ollama: "OLLAMA_MODEL",
  custom: "CUSTOM_MODEL",
  codex: "CODEX_MODEL",
};

export default function CurrentConfig() {
  const llmConfig = useSelector((state: RootState) => state.userConfig.llm_config);
  const textProvider = llmConfig.LLM || "";
  const textProviderLabel = textProvider
    ? LLM_PROVIDERS[textProvider]?.label || textProvider
    : "Not configured";
  const modelField = TEXT_MODEL_FIELDS[textProvider];
  const textModel = modelField ? String(llmConfig[modelField] || "").trim() : "";
  const textSummary = textModel
    ? `${textProviderLabel} · ${textModel}`
    : textProvider && textProvider !== "presenton"
      ? `${textProviderLabel} · No model selected`
      : textProviderLabel;

  const imageProvider = llmConfig.IMAGE_PROVIDER || "";
  const imageProviderLabel = llmConfig.DISABLE_IMAGE_GENERATION
    ? "Off"
    : imageProvider
      ? IMAGE_PROVIDERS[imageProvider]?.label || imageProvider
      : "Not configured";
  const imageModel =
    !llmConfig.DISABLE_IMAGE_GENERATION && imageProvider === "openai_compatible"
      ? llmConfig.OPENAI_COMPAT_IMAGE_MODEL?.trim()
      : "";
  const imageSummary = imageModel
    ? `${imageProviderLabel} · ${imageModel}`
    : imageProviderLabel;

  const webProvider = (llmConfig.WEB_SEARCH_PROVIDER || "auto").toLowerCase();
  const webSummary = WEB_SEARCH_PROVIDERS[webProvider]?.label || webProvider;

  const summaries = [
    { label: "Text", value: textSummary },
    { label: "Image", value: imageSummary },
    { label: "Web", value: webSummary },
  ];

  return (
    <div className="font-manrope text-xs text-[#333333]">
      <div
        className="hidden h-[42px] items-center overflow-hidden rounded-xl border border-[#EDEEEF] bg-white shadow-[0_1px_3px_rgba(16,19,35,0.04)] lg:flex"
        role="group"
        aria-label="Selected providers and models"
      >
        {summaries.map(({ label, value }, index) => (
          <span
            key={label}
            title={`${label}: ${value}`}
            className={`flex min-w-0 items-center gap-2 px-3.5 ${index > 0 ? "border-l border-[#EDEEEF]" : ""}`}
          >
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#909097]">{label}</span>
            <span className={`truncate font-semibold text-[#252535] ${label === "Text" ? "max-w-[220px]" : "max-w-[145px]"}`}>{value}</span>
          </span>
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex h-[42px] max-w-[calc(100vw-100px)] items-center gap-2 rounded-xl border border-[#EDEEEF] bg-white px-3 text-left shadow-[0_1px_3px_rgba(16,19,35,0.04)] lg:hidden"
            aria-label="Selected providers and models"
          >
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#909097]">Text</span>
            <span className="truncate font-semibold text-[#252535]">{textSummary}</span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#808080]" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(320px,calc(100vw-32px))] rounded-xl border-[#EDEEEF] bg-white p-1.5 font-manrope text-xs">
          <div>
            {summaries.map(({ label, value }) => (
              <div key={label} className="flex gap-3 rounded-lg px-3 py-2.5 even:bg-[#F8F8FA]">
                <span className="w-12 shrink-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#909097]">{label}</span>
                <span className="min-w-0 break-words font-semibold text-[#252535]">{value}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
