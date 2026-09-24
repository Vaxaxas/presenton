"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import { Check } from "lucide-react";
import type { GenerationMode } from "@/utils/presentationGenerationMode";

type GenerationModeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (mode: GenerationMode) => void;
};

const MODES = [
  {
    value: "standard" as const,
    eyebrow: "YOUR CONTENT, YOUR TEMPLATE",
    label: "Standard mode",
    description: "places your text and images into the template you choose. The slide layout stays consistent as your content changes.",
    benefits: ["Uses built-in or custom templates", "Follows the template’s fixed layout"],
    checkColor: "text-[#01A8F2]",
    video: "/Standard.mp4",
  },
  {
    value: "smart" as const,
    eyebrow: "DESIGNED AROUND YOUR CONTENT",
    label: "Smart mode",
    description: "arranges your text and images to suit each slide. The layout can change depending on what you want to present.",
    benefits: ["Creates layouts around your content", "Adapts text and image placement"],
    checkColor: "text-[#5F48F3]",
    video: "/Smart.mp4",
  },
];

export default function GenerationModeDialog({ open, onOpenChange, onSelect }: GenerationModeDialogProps) {
  const [hovered, setHovered] = useState<GenerationMode | null>(null);

  const selectMode = (mode: GenerationMode) => {
    onSelect(mode);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/30" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[61] w-[min(820px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto outline-none">
          <DialogPrimitive.Title className="sr-only">Choose a presentation mode</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Choose Standard mode for a fixed template or Smart mode for layouts adapted to your content.</DialogPrimitive.Description>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2" onMouseLeave={() => setHovered(null)}>
            {MODES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => selectMode(item.value)}
                onMouseEnter={() => setHovered(item.value)}
                aria-label={`Choose ${item.label}`}
                className={`overflow-hidden rounded-xl bg-white text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A5AF8] ${hovered === item.value ? "shadow-[0_4px_18px_rgba(0,0,0,0.37),0_4px_24px_rgba(0,0,0,0.04)]" : ""} ${hovered && hovered !== item.value ? "[&>span:last-child]:opacity-70" : ""}`}
              >
                <span className={`block h-[300px] w-full overflow-hidden ${item.value === "standard" ? "bg-[#F7F7FF]" : ""}`} style={item.value === "smart" ? { background: "linear-gradient(55deg, #FFE9DD 0%, #FFF7FC 47%, #E8E7FF 100%)" } : undefined}>
                  <video
                    src={item.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="flex h-[218px] flex-col gap-[18px] p-[22px]">
                  <span className="font-manrope text-xs font-semibold tracking-[0.1em] text-[#666666]">{item.eyebrow}</span>
                  <span className="block font-manrope text-sm font-medium leading-[22px] tracking-[0.02em] text-[#333333]">
                    <span className={`mr-2 inline-block rounded-full px-[11px] py-[2px] text-[12px] font-semibold leading-[17px] ${item.value === "standard" ? "bg-[#F4FBFE] text-[#01A8F2]" : "bg-[#EFEDFE] text-[#5F48F3]"}`}>{item.label}</span>
                    {item.description}
                  </span>
                  <span className="mt-auto flex flex-col gap-2 font-syne text-sm text-[#333333]">
                    <span className="flex items-center gap-1"><Check className={`h-3.5 w-3.5 ${item.checkColor}`} strokeWidth={2} aria-hidden="true" />{item.benefits[0]}</span>
                    <span className="h-px w-full bg-[#EDEEEF]" aria-hidden="true" />
                    <span className="flex items-center gap-[7px]"><Check className={`h-3.5 w-3.5 ${item.checkColor}`} strokeWidth={2} aria-hidden="true" />{item.benefits[1]}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
