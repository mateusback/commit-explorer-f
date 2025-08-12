import React, { useEffect, useMemo, useRef, useState } from "react";
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
        <div className="relative w-8 h-8 rounded-full bg-white/70 ring-1 ring-stone-200 overflow-hidden flex items-center justify-center">
            {src ? (
                <img src={src} className="w-full h-full object-cover" />
            ) : (
                <span className="text-[10px] font-semibold text-emerald-700">{label}</span>
            )}
        </div>
    );
}

function Pill({ active, onClick, children, title, innerRef }) {
    return (
        <button
            ref={innerRef}
            type="button"
            title={title}
            onClick={onClick}
            className={[
                "relative inline-flex items-center gap-2 px-4 py-2 rounded-full",
                "border transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
                active
                    ? "bg-emerald-50 text-stone-900 border-stone-200 shadow-lg shadow-emerald-100/40"
                    : "bg-white/60 backdrop-blur border-stone-200 text-stone-600 hover:bg-white hover:text-stone-900 hover:shadow",
            ].join(" ")}
            role="tab"
            aria-current={active ? "page" : undefined}
        >
            {children}
            {/* Hover glow */}
            <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300"
                style={{ background: "radial-gradient(60% 70% at 50% 20%, rgba(16,185,129,0.08), transparent)" }}
            />
        </button>
    );
}

function StatChip({ icon, value, title }) {
    if (value == null) return null;
    return (
        <span title={title} className="inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-100 rounded-full px-2 py-0.5">
            {icon}
            <span className="font-medium text-stone-700">{value}</span>
        </span>
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
            commits: a.totalCommits,
            smells: a.quantidadeCodeSmells,
            avatarUrl: a.avatarUrl,
        }));
        return [
            {
                key: "geral",
                label: geral.label || "Geral",
                commits: geral.totalCommits,
                smells: geral.quantidadeCodeSmells,
                isGeral: true,
            },
            ...mapped,
        ];
    }, [autores, geral]);

    const listRef = useRef(null);
    const pillRefs = useRef(new Map());
    const [indicator, setIndicator] = useState({ left: 0, width: 0 });

    const updateIndicator = () => {
        const container = listRef.current;
        const el = pillRefs.current.get(value);
        if (!container || !el) return;
        const cRect = container.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const left = r.left - cRect.left + container.scrollLeft;
        setIndicator({ left, width: r.width });
    };

    useEffect(() => {
        updateIndicator();
        const onResize = () => updateIndicator();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [value, items.length]);

    const scrollBy = (delta) => {
        if (!listRef.current) return;
        listRef.current.scrollBy({ left: delta, behavior: "smooth" });
        setTimeout(updateIndicator, 200);
    };

    const onKeyDown = (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const idx = items.findIndex((it) => it.key === value);
        if (idx < 0) return;
        const nextIdx = e.key === "ArrowRight" ? Math.min(idx + 1, items.length - 1) : Math.max(idx - 1, 0);
        onChange?.(items[nextIdx].key);
    };

    return (
        <div className={["not-prose", className].join(" ")}>
            {/* Mobile compact select */}
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
                                {it.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-2">
                <button type="button" className="btn btn-sm btn-ghost" aria-label="Rolar para a esquerda" onClick={() => scrollBy(-240)}>
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="relative flex-1">
                    <div
                        ref={listRef}
                        role="tablist"
                        aria-label="Escopo da análise"
                        className="overflow-x-auto no-scrollbar flex items-center gap-3 px-1"
                        onKeyDown={onKeyDown}
                    >
                        {items.map((it) => {
                            const active = value === it.key;
                            return (
                                <Pill
                                    key={it.key}
                                    innerRef={(el) => el && pillRefs.current.set(it.key, el)}
                                    active={active}
                                    onClick={() => onChange?.(it.key)}
                                    title={it.isGeral ? "Visão geral da análise" : `Ver dados de ${it.label}`}
                                >
                                    {it.isGeral ? (
                                        <span className="inline-flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-emerald-50 ring-1 ring-emerald-200 text-emerald-600 flex items-center justify-center">
                                                <Sparkles className="w-4 h-4" />
                                            </span>
                                            <span className="text-sm font-semibold">{it.label}</span>
                                            <span className="hidden lg:inline-flex items-center gap-2">
                                                <StatChip icon={<GitCommit className="w-3.5 h-3.5" />} value={it.commits} title="Commits (geral)" />
                                                <StatChip icon={<Users className="w-3.5 h-3.5" />} value={autores.length} title="Autores (geral)" />
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            {/* Avatar já é 32x32 */}
                                            <Avatar name={it.label} src={it.avatarUrl} />
                                            <span className="text-sm font-semibold">{it.label}</span>
                                            <span className="hidden xl:inline-flex items-center gap-2">
                                                <StatChip icon={<GitCommit className="w-3.5 h-3.5" />} value={it.commits} title="Commits do autor" />
                                            </span>
                                        </span>
                                    )}
                                </Pill>
                            );
                        })}
                    </div>

                    {/* Underline animado */}
                    <div
                        className="pointer-events-none absolute -bottom-1 h-[3px] rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 transition-all duration-300"
                        style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
                        aria-hidden
                    />
                </div>

                <button type="button" className="btn btn-sm btn-ghost" aria-label="Rolar para a direita" onClick={() => scrollBy(240)}>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* separador visual */}
            <div className="mt-4 border-t border-stone-200" />
        </div>
    );
}
