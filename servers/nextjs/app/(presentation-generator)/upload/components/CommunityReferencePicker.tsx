"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Command, Eye, Heart, Loader2, RefreshCw, Search } from "lucide-react";
import Link from "next/link";

import SmartHtmlSlide from "../../components/SmartHtmlSlide";
import {
  CommunityPresentationApi,
  getCommunityErrorState,
  type CommunityErrorState,
  type CommunityPresentation,
} from "../../services/api/community";

export default function CommunityReferencePicker({
  selectedId,
  onSelect,
}: {
  selectedId: number | null;
  onSelect: (presentation: CommunityPresentation | null) => void;
}) {
  const [items, setItems] = useState<CommunityPresentation[]>([]);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<CommunityErrorState | null>(null);

  const load = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    CommunityPresentationApi.list(1, 4, signal)
      .then((response) => setItems(response.results ?? []))
      .catch((requestError) => {
        if ((requestError as Error)?.name !== "AbortError") {
          setItems([]);
          setError(
            getCommunityErrorState(
              requestError,
              "Could not load community designs. Please try again."
            )
          );
        }
      })
      .finally(() => {
        if (!signal?.aborted) setLoading(false);
      });
  }, []);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;
    return items.filter((item) =>
      [item.title, item.created_by, item.prompt]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedQuery)),
    );
  }, [items, query]);

  return (
    <section className="w-full font-manrope" data-testid="design-grid">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-10 w-[200px] items-center rounded-lg border border-[#EDEEEF] bg-white p-1 font-manrope text-xs font-medium text-[#191919]">
          <span className="flex h-8 flex-1 items-center justify-center rounded-lg bg-[#F6F6F9]">Community</span>
          <Link href="/dashboard" className="flex h-8 flex-1 items-center justify-center rounded-lg hover:bg-[#F6F6F9]">My Designs</Link>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-5 lg:w-auto">
          <label className="flex h-[38px] w-full items-center gap-2.5 rounded-md border border-[#EDEEEF] bg-white px-2.5 sm:w-[298px]">
            <Search className="h-4 w-4 shrink-0 text-[#808080]" strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Search designs</span>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or keyword"
              className="min-w-0 flex-1 bg-transparent font-syne text-base font-normal text-[#191919] outline-none placeholder:text-[#808080]"
            />
            <span className="flex items-center gap-px font-syne text-sm text-[#CCCCCC]" aria-hidden="true"><Command className="h-[11px] w-[11px]" strokeWidth={2} />K</span>
          </label>
          <Link href="/community" className="inline-flex shrink-0 items-center gap-1.5 font-manrope text-xs font-medium text-[#7A5AF8] hover:text-[#6938EF]">Browse All<ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /></Link>
          {selectedId !== null && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="whitespace-nowrap text-xs font-medium text-[#7A5AF8] hover:text-[#6938EF]"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex h-52 items-center justify-center text-[#7A5AF8]">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : error ? (
        <div
          role="alert"
          className="mx-auto mt-5 flex min-h-40 w-[calc(100%-3rem)] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/40 px-6 py-8 text-center"
        >
          <h3 className="text-sm font-semibold text-[#191919]">
            Could not load community designs
          </h3>
          <p className="mt-2 max-w-lg text-xs leading-5 text-[#666666]">
            {error.message}
          </p>
          {error.retryable && (
            <button
              type="button"
              onClick={() => load()}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E0DDFC] bg-white px-4 py-2 text-xs font-medium text-[#6847F4] transition hover:bg-[#F8F7FF]"
            >
              <RefreshCw className="h-4 w-4" /> Try again
            </button>
          )}
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="mx-0 mt-5 rounded-xl border border-dashed border-[#D9D9DE] bg-[#FAFAFC] px-6 py-10 text-center sm:mx-6">
          <Search className="mx-auto h-4 w-4 text-[#808080]" strokeWidth={2} aria-hidden="true" />
          <h3 className="mt-3 text-sm font-semibold text-[#191919]">
            No matching designs
          </h3>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {visibleItems.map((item) => {
            const selected = selectedId === item.id;
            const preview = item.slides?.find((slide) => slide.trim());
            return (
              <article
                key={item.id}
                className={`min-w-0 overflow-hidden rounded-xl border bg-white transition ${
                  selected
                    ? "border-[#7A5AF8] ring-2 ring-[#7A5AF8]/15"
                    : "border-[#EDEEEF] hover:border-[#D8D3FA]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(selected ? null : item)}
                  className="group relative block aspect-[306/169] w-full overflow-hidden bg-[#F8FBFB]"
                  aria-label={`Use ${item.title || "community design"}`}
                >
                  {preview ? (
                    <SmartHtmlSlide
                      executeScripts={false}
                      html={preview}
                      fonts={item.fonts}
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-xs text-[#999999]">
                      No preview
                    </span>
                  )}
                  <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/5" />
                </button>

                <div className="border-t border-[#EDEEEF] px-2.5 pb-2.5">
                  <div className="flex min-h-[54px] items-center gap-2.5 py-3.5">
                    <p className="min-w-0 flex-1 truncate text-sm font-semibold text-[#191919]">
                      {item.title?.trim() || "Untitled presentation"}
                    </p>
                    <Link href="/community" aria-label={`Preview ${item.title || "community design"}`} className="flex h-[26px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[#EDEEEF] bg-white">
                      <Eye className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onSelect(selected ? null : item)}
                      className="flex h-[26px] items-center gap-1.5 rounded-full border border-[#EDEEEF] bg-white pl-3 pr-1 font-syne text-xs font-medium text-[#191919] hover:bg-[#F6F6F9]"
                    >
                      {selected && <Check className="h-3.5 w-3.5 text-[#7A5AF8]" />}
                      {selected ? "Selected" : "Use"}
                      <span className="ml-1 flex h-5 w-[25px] items-center justify-center border-l border-[#EDEEEF]"><ChevronDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /></span>
                    </button>
                  </div>
                  <div className="h-px w-full bg-[#EDEEEF]" aria-hidden="true" />
                  <div className="flex min-h-[34px] items-center justify-between py-2.5 text-[10px] font-medium tracking-[0.4px] text-[#808080]">
                    <span className="min-w-0 flex-1 truncate">
                      by {item.created_by?.trim() || "Presenton"}
                    </span>
                    <div className="ml-2 flex shrink-0 items-center gap-2">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" /> {formatCount(item.likes ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function formatCount(value: number) {
  return Intl.NumberFormat("en", { notation: "compact" }).format(value);
}
