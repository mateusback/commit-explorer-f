import React, { useMemo, useRef, useState, useEffect } from "react";
import { Users, GitCommit, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

function initials(name = "?") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

function Avatar({ name, src }) {
  const label = initials(name);
  return (
    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 ring-2 ring-white overflow-hidden flex items-center justify-center flex-none shadow-sm">
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-xs font-bold text-emerald-700 leading-none">{label}</span>
      )}
    </div>
  );
}

function StatChip({ icon, value, title }) {
  if (value == null) return null;
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-stone-100 rounded-full px-2 py-[2px] leading-none flex-none"
    >
      {icon}
      <span className="font-medium leading-none">{value}</span>
    </span>
  );
}

function Pill({ active, onClick, title, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-3 h-16 px-5 min-w-[220px] max-w-[320px] rounded-2xl border transition-all flex-none overflow-hidden text-left truncate ${
        active
          ? "bg-emerald-100 border-emerald-300 text-emerald-800 shadow-lg ring-2 ring-emerald-200"
          : "bg-white/90 backdrop-blur border-stone-200 text-stone-700 hover:bg-white hover:shadow-md hover:border-stone-300"
      } ${className}`}
      role="tab"
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}

export default function AnalysisScopeTabs({
  value = "geral",
  onChange,
  autores = [],
  geral = {},
  className = "",
  compactOnMobile = true,
}) {
  const items = useMemo(() => {
    const mapped = autores.map((a) => ({
      key: String(a.idAutor),
      label: a.nome,
      email: a.email,
      commits: a.totalCommits,
      smells: a.quantidadeCodeSmells,
      avatarUrl: a.avatarUrl,
    }));
    return [
      { key: "geral", label: geral.label || "Geral", commits: geral.totalCommits, smells: geral.quantidadeCodeSmells, isGeral: true },
      ...mapped,
    ];
  }, [autores, geral]);

  const scrollerRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, [items.length, value]);

  const scrollBy = (delta) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className={`not-prose ${className}`}>
      {compactOnMobile && (
        <div className="md:hidden mb-3">
          <label className="label py-1" htmlFor="analysisScopeTabsSelect">
            <span className="label-text text-sm">Visualizar</span>
          </label>
          <select
            id="analysisScopeTabsSelect"
            className="select select-bordered w-full"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
          >
            {items.map((it) => (
              <option key={it.key} value={it.key}>
                {it.isGeral ? it.label : `${it.label}${it.email ? ` (${it.email})` : ''}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="hidden md:block">
        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => scrollBy(-240)}
              disabled={!canLeft}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={scrollerRef}
              role="tablist"
              className="overflow-x-auto no-scrollbar flex gap-3 px-1 whitespace-nowrap pb-2"
            >
              {items.map((it) => {
                const active = value === it.key;
                return (
                  <Pill
                    key={it.key}
                    active={active}
                    onClick={() => onChange?.(it.key)}
                    title={it.isGeral ? "Visão geral da análise" : `Ver dados de ${it.label}`}
                  >
                    {it.isGeral ? (
                      <>
                        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 ring-2 ring-white text-emerald-600 flex items-center justify-center flex-none shadow-sm">
                          <Sparkles className="w-5 h-5" />
                        </span>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`text-sm font-semibold truncate ${active ? "text-emerald-800" : "text-stone-800"}`}>{it.label}</span>
                          <span className={`text-xs truncate ${active ? "text-emerald-600" : "text-stone-500"}`}>Visão geral</span>
                        </div>
                        <span className="ml-auto hidden xl:flex items-center gap-2 flex-none">
                          <StatChip icon={<GitCommit className="w-3.5 h-3.5" />} value={it.commits} />
                          <StatChip icon={<Users className="w-3.5 h-3.5" />} value={autores.length} />
                        </span>
                      </>
                    ) : (
                      <>
                        <Avatar name={it.label} src={it.avatarUrl} />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`text-sm font-semibold truncate ${active ? "text-emerald-800" : "text-stone-800"}`}>{it.label}</span>
                          {it.email && (
                            <span className={`text-xs truncate ${active ? "text-emerald-600" : "text-stone-500"}`}>{it.email}</span>
                          )}
                        </div>
                        <span className="ml-auto hidden xl:flex items-center gap-2 flex-none">
                          <StatChip icon={<GitCommit className="w-3.5 h-3.5" />} value={it.commits} />
                        </span>
                      </>
                    )}
                  </Pill>
                );
              })}
            </div>

            <button
              type="button"
              className="btn btn-sm btn-ghost"
              onClick={() => scrollBy(240)}
              disabled={!canRight}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-stone-200" />
    </div>
  );
}
