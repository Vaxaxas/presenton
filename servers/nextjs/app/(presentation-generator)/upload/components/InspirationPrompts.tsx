"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";

const PROMPTS = [
  { title: "Pitch Deck", description: "Pitch your startup to investors.", prompt: "Create a pitch deck for my startup to present to investors. Cover the problem, solution, market, business model, traction, team, and funding ask." },
  { title: "Executive Summary", description: "Summarize key business insights.", prompt: "Create an executive summary presentation covering the key business insights, results, opportunities, and recommended next steps." },
  { title: "Business Review", description: "Review performance, wins, and priorities.", prompt: "Create a business review presentation covering performance, important wins, challenges, and upcoming priorities." },
  { title: "Product Launch", description: "Present your product launch strategy.", prompt: "Create a product launch presentation covering the product, audience, positioning, launch plan, channels, and success metrics." },
  { title: "Sales Proposal", description: "Turn your offer into a pitch.", prompt: "Create a sales proposal presentation explaining the customer's needs, our solution, benefits, pricing, and next steps." },
  { title: "Project Update", description: "Share progress, risks, and next steps.", prompt: "Create a project update presentation covering progress, milestones, risks, decisions, and next steps." },
  { title: "Marketing Plan", description: "Map out your campaign.", prompt: "Create a marketing plan presentation covering goals, target audience, channels, campaign timeline, budget, and success metrics." },
  { title: "Research Findings", description: "Explain the main discoveries.", prompt: "Create a research findings presentation with the objective, methodology, key findings, implications, and recommendations." },
  { title: "Team Strategy", description: "Align people on goals.", prompt: "Create a team strategy presentation covering our mission, goals, responsibilities, roadmap, and measures of success." },
  { title: "Quarterly Results", description: "Show results and trends.", prompt: "Create a quarterly results presentation covering key metrics, trends, achievements, challenges, and the next quarter's priorities." },
  { title: "Training Session", description: "Teach a new skill clearly.", prompt: "Create a training presentation introducing the topic, learning objectives, examples, exercises, and key takeaways." },
  { title: "Event Recap", description: "Highlight the key moments.", prompt: "Create an event recap presentation covering attendance, highlights, feedback, outcomes, and follow-up actions." },
];

export default function InspirationPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  const [page, setPage] = useState(0);
  const visible = PROMPTS.slice(page * 6, page * 6 + 6);

  return (
    <section className="relative font-manrope" aria-label="Presentation ideas">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-[285px] bg-[radial-gradient(ellipse_at_50%_100%,rgba(228,217,255,0.33),transparent_72%)]" />
      <div className="relative mb-[28px] flex items-end justify-between">
        <h2 className="text-base font-semibold tracking-[0.01em] text-[#191919]">Need some inspiration?</h2>
        <button type="button" onClick={() => setPage((current) => (current + 1) % 2)} className="flex h-[34px] items-center gap-2 rounded-full border border-[#EDEEEF] bg-white px-[14px] font-syne text-sm text-[#191919] hover:bg-[#F6F6F9]" aria-label="Shuffle presentation ideas">
          <Shuffle className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          shuffle
        </button>
      </div>
      <div className="relative grid grid-cols-1 gap-x-[11px] gap-y-5 sm:grid-cols-3">
        {visible.map((item) => (
          <button key={item.title} type="button" onClick={() => onSelect(item.prompt)} className="h-[95px] overflow-hidden border border-white bg-white/50 px-5 py-[19px] text-left shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition hover:border-[#D8D3FA] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A5AF8]">
            <span className="block text-[13px] font-medium leading-[17px] text-[#191919]">{item.title}</span>
            <span className="mt-1 block max-w-[160px] text-[13px] leading-[17px] text-[#333333]">{item.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
