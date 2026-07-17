import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Apple,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarClock,
  ChevronDown,
  Coins,
  CreditCard,
  Egg,
  Globe2,
  Leaf,
  Music2,
  Package,
  PartyPopper,
  Pause,
  Play,
  Recycle,
  Rocket,
  Sparkles,
  Store,
  Trophy,
  Truck,
  Utensils,
  Zap,
} from "lucide-react";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";
import belandLogo from "@/assets/beland-logo.png";
import betterTechLogo from "@/assets/better-tech.png";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  // I18nProvider is already provided at the root, but re-declaring for safety in isolation.
  return <Page />;
}

/* ---------------------------- Language selector ---------------------------- */

function LangSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang)!;

  useEffect(() => {
    const close = () => setOpen(false);
    if (open) {
      window.addEventListener("click", close);
      return () => window.removeEventListener("click", close);
    }
  }, [open]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-sm font-semibold text-beland-ink backdrop-blur-md transition hover:border-beland-green/50 hover:shadow-glow-green"
      >
        <Globe2 className="h-4 w-4 text-beland-green" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 origin-top-right animate-scale-in rounded-2xl border border-black/10 bg-white p-1.5 shadow-2xl">
          {LANGS.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code as Lang);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-beland-green/10 font-bold text-beland-green-deep"
                    : "text-beland-ink hover:bg-black/5"
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span className="flex-1">{l.label}</span>
                {active && <span className="h-2 w-2 rounded-full bg-beland-green" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Navbar --------------------------------- */

function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { href: "#ritual", label: t("nav.ritual") },
    { href: "#products", label: t("nav.products") },
    { href: "#stations", label: t("nav.stations") },
    { href: "#movement", label: t("nav.movement") },
    { href: "#hub", label: t("nav.hub") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-white/70 border-b border-black/5" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <img src={belandLogo} alt="Beland" className="h-8 w-auto" />
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-beland-ink/80 transition hover:bg-black/5 hover:text-beland-ink"
            >
              {it.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <a
            href="#hero"
            className="hidden rounded-full bg-beland-orange px-4 py-2 text-sm font-bold text-white shadow-glow-orange transition hover:brightness-110 sm:inline-flex"
          >
            {t("nav.download")}
          </a>
        </div>
      </nav>
    </header>
  );
}

/* ---------------------------- Typing rotator ---------------------------- */

function useTyped(words: string[], speed = 70, pause = 1400) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = words[idx % words.length] ?? "";
    if (!del && text === current) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && text === "") {
      setDel(false);
      setIdx((i) => i + 1);
      return;
    }
    const t = setTimeout(
      () => {
        setText((prev) =>
          del ? current.slice(0, Math.max(0, prev.length - 1)) : current.slice(0, prev.length + 1),
        );
      },
      del ? speed / 2 : speed,
    );
    return () => clearTimeout(t);
  }, [text, del, idx, words, speed, pause]);

  return text;
}

/* ------------------------------- Reveal ------------------------------- */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ------------------------------- Hero ------------------------------- */

function Hero() {
  const { t, lang } = useI18n();
  const words = [
    t("hero.rotate.0"),
    t("hero.rotate.1"),
    t("hero.rotate.2"),
    t("hero.rotate.3"),
  ];
  // Reset typed on lang change by keying
  const typed = useTyped(words);

  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* background motifs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-20 h-[440px] w-[440px] rounded-full bg-beland-green/15 blur-3xl animate-blob" />
        <div className="absolute -right-40 top-60 h-[440px] w-[440px] rounded-full bg-beland-orange/15 blur-3xl animate-blob" />
        <svg className="absolute inset-x-0 top-24 h-40 w-full opacity-40" viewBox="0 0 1440 200" fill="none">
          <path
            d="M0 100 C 240 20, 480 180, 720 100 S 1200 20, 1440 100"
            stroke="url(#g1)"
            strokeWidth="2"
            strokeDasharray="4 8"
            fill="none"
          />
          <defs>
            <linearGradient id="g1" x1="0" x2="1440" y1="0" y2="0">
              <stop stopColor="var(--beland-green)" />
              <stop offset="1" stopColor="var(--beland-orange)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-beland-green/25 bg-beland-green/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-beland-green-deep">
              <Sparkles className="h-3.5 w-3.5" /> {t("hero.eyebrow")}
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 text-5xl leading-[1.05] tracking-tight md:text-7xl">
              {t("hero.title.a")}{" "}
              <span className="text-gradient-eco">{t("hero.title.b")}</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-beland-ink/70 md:text-xl">{t("hero.sub")}</p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-4 flex items-center gap-2 text-base text-beland-ink/80">
              <span className="font-bold text-beland-green-deep">Beland</span>
              <span key={lang} className="typing-caret font-semibold text-beland-orange">
                {typed}
              </span>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-full bg-beland-orange px-6 py-3.5 text-base font-bold text-white shadow-glow-orange transition hover:brightness-110"
              >
                <Apple className="h-5 w-5" /> {t("hero.cta.primary")}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a
                href="#hub"
                className="story-link text-base font-semibold text-beland-green-deep"
              >
                {t("hero.cta.secondary")}
              </a>
            </div>
          </Reveal>
        </div>

        {/* App mockup */}
        <div className="lg:col-span-6">
          <Reveal delay={120}>
            <div className="relative mx-auto w-full max-w-md">
              {/* floating icons */}
              <div className="absolute -left-8 top-6 z-20 animate-float">
                <FloatingChip color="yellow" icon={<Coins className="h-4 w-4" />}>
                  {t("hero.floating.becoin")}
                </FloatingChip>
              </div>
              <div className="absolute -right-6 top-40 z-20 animate-float" style={{ animationDelay: "1.2s" }}>
                <FloatingChip color="red" icon={<PartyPopper className="h-4 w-4" />}>
                  {t("hero.floating.candy")}
                </FloatingChip>
              </div>
              <div className="absolute -right-10 bottom-20 z-20 animate-float" style={{ animationDelay: "2.4s" }}>
                <FloatingChip color="green" icon={<Leaf className="h-4 w-4" />}>
                  +12 kg CO₂
                </FloatingChip>
              </div>

              {/* wavy connector */}
              <svg
                className="pointer-events-none absolute -left-16 top-10 z-10 h-64 w-32 opacity-70"
                viewBox="0 0 120 260"
                fill="none"
              >
                <path
                  d="M100 10 C 20 60, 100 130, 20 200 C 60 240, 90 250, 110 250"
                  stroke="var(--beland-green)"
                  strokeWidth="2"
                  strokeDasharray="3 6"
                />
              </svg>

              <AppMockup />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FloatingChip({
  children,
  icon,
  color,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  color: "yellow" | "red" | "green";
}) {
  const map = {
    yellow: "bg-beland-yellow text-beland-ink",
    red: "bg-beland-red text-white",
    green: "bg-beland-green text-white",
  } as const;
  return (
    <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold shadow-xl ${map[color]}`}>
      {icon}
      {children}
    </div>
  );
}

function AppMockup() {
  const { t } = useI18n();
  return (
    <div className="relative rounded-[2.75rem] border-[10px] border-beland-ink bg-beland-ink p-2 shadow-2xl">
      <div className="overflow-hidden rounded-[2rem] bg-cream">
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 text-[10px] font-bold text-beland-ink/60">
          <span>9:41</span>
          <span className="h-4 w-16 rounded-full bg-beland-ink/80" />
          <span>100%</span>
        </div>

        <div className="px-5 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-beland-ink/50">
                {t("hero.app.subtitle")}
              </p>
              <p className="text-2xl font-black">{t("hero.app.title")}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-beland-green/15 text-beland-green">
              <Bell className="h-5 w-5" />
            </div>
          </div>

          {/* Delivery card */}
          <div className="mt-5 rounded-2xl bg-gradient-to-br from-beland-green to-beland-green-deep p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90">
              <Truck className="h-3.5 w-3.5" /> {t("hero.app.delivery")}
            </div>
            <p className="mt-2 text-lg font-bold">{t("hero.app.delivery.time")}</p>
            <p className="text-sm opacity-90">{t("hero.app.delivery.items")}</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/20">
              <div className="h-1.5 w-3/4 rounded-full bg-beland-yellow" />
            </div>
          </div>

          {/* Recycling pickup */}
          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-beland-orange/15 text-beland-orange">
              <Recycle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-beland-orange">
                {t("hero.app.pickup")}
              </p>
              <p className="text-sm font-bold text-beland-ink">{t("hero.app.pickup.time")}</p>
              <p className="text-xs text-beland-ink/60">{t("hero.app.pickup.items")}</p>
            </div>
            <span className="rounded-full bg-beland-green/15 px-2 py-0.5 text-[10px] font-bold text-beland-green-deep">
              LIVE
            </span>
          </div>

          {/* BeCoins */}
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-beland-yellow/25 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-beland-yellow text-beland-ink shadow">
              <Coins className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-beland-ink/60">
                {t("hero.app.becoins")}
              </p>
              <p className="text-lg font-black text-beland-ink">+ 245 BC</p>
            </div>
            <span className="text-xs font-bold text-beland-green-deep">↑ 18%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Ritual ------------------------------- */

function Ritual() {
  const { t } = useI18n();
  const pillars = [
    {
      icon: <Utensils className="h-6 w-6" />,
      title: t("ritual.pillar1.title"),
      body: t("ritual.pillar1.body"),
      tone: "green" as const,
    },
    {
      icon: <Recycle className="h-6 w-6" />,
      title: t("ritual.pillar2.title"),
      body: t("ritual.pillar2.body"),
      tone: "orange" as const,
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: t("ritual.pillar3.title"),
      body: t("ritual.pillar3.body"),
      tone: "yellow" as const,
    },
  ];
  return (
    <section id="ritual" className="relative bg-cream py-24 md:py-32">
      <div className="wavy-divider absolute inset-x-0 top-0 h-16 opacity-60" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-beland-orange">
              {t("ritual.eyebrow")}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-4xl md:text-6xl">{t("ritual.title")}</h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 text-lg text-beland-ink/70">{t("ritual.copy")}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <PillarCard {...p} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  icon,
  title,
  body,
  tone,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: "green" | "orange" | "yellow";
  index: number;
}) {
  const map = {
    green: "bg-beland-green text-white",
    orange: "bg-beland-orange text-white",
    yellow: "bg-beland-yellow text-beland-ink",
  } as const;
  return (
    <div className="group relative flex h-full flex-col rounded-3xl border border-black/5 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${map[tone]} shadow-lg`}>
        {icon}
      </div>
      <span className="mt-6 text-xs font-black uppercase tracking-widest text-beland-ink/40">
        0{index}
      </span>
      <h3 className="mt-1 text-2xl font-black text-beland-ink">{title}</h3>
      <p className="mt-3 text-base leading-relaxed text-beland-ink/70">{body}</p>
      <div className="mt-6 h-1 w-16 rounded-full bg-beland-green/40 transition-all duration-500 group-hover:w-full group-hover:bg-beland-orange" />
    </div>
  );
}

/* ------------------------------ Products ------------------------------ */

function Products() {
  const { t } = useI18n();
 const cards = [
    { key: "1", tone: "yellow", icon: <Egg className="h-8 w-8" />, tag: "Highlight", videoSrc: "/huevos.mp4" },
    { key: "2", tone: "orange", icon: <Sparkles className="h-8 w-8" />, tag: "New", videoSrc: undefined },
    { key: "3", tone: "red", icon: <Sparkles className="h-8 w-8" />, tag: "Origin", videoSrc: undefined },
    { key: "4", tone: "green", icon: <Sparkles className="h-8 w-8" />, tag: "Artisan", videoSrc: undefined },
    { key: "5", tone: "orange", icon: <Sparkles className="h-8 w-8" />, tag: "Seasonal", videoSrc: undefined },
  ] as const;
  return (
    <section id="products" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-beland-green-deep">
                {t("products.eyebrow")}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-4xl md:text-6xl">{t("products.title")}</h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-4 text-lg text-beland-ink/70">{t("products.sub")}</p>
            </Reveal>
          </div>
        </div>

        <div className="mt-12 -mx-5 overflow-x-auto px-5 pb-6">
          <div className="flex gap-5 md:gap-6" style={{ width: "max-content" }}>
            {cards.map((c, i) => (
              <ProductCard
                key={c.key}
                tone={c.tone}
                tag={c.tag}
                icon={c.icon}
                videoSrc={c.videoSrc}
                title={t(`products.card${c.key}.title`)}
                body={t(`products.card${c.key}.body`)}
                highlight={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  title,
  body,
  tag,
  icon,
  tone,
  highlight,
  videoSrc,
}: {
  title: string;
  body: string;
  tag: string;
  icon: React.ReactNode;
  tone: "green" | "orange" | "yellow" | "red";
  highlight?: boolean;
  videoSrc?: string;
}) {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const grad = {
    green: "from-beland-green to-beland-green-deep",
    orange: "from-beland-orange to-beland-red",
    yellow: "from-beland-yellow to-beland-orange",
    red: "from-beland-red to-beland-orange",
  }[tone];

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <article
      className={`group relative w-[300px] shrink-0 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl md:w-[340px] ${
        highlight ? "ring-2 ring-beland-orange" : ""
      }`}
    >
      <div className={`relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br ${grad}`}>
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-30 mix-blend-overlay wavy-divider" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/90 drop-shadow-lg">{icon}</div>
            </div>
          </>
        )}
        <button
          onClick={videoSrc ? toggle : undefined}
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-beland-ink shadow-xl transition group-hover:scale-110"
        >
          {videoSrc && playing ? (
            <Pause className="h-6 w-6" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
          )}
        </button>
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-beland-ink">
          {tag}
        </div>
        {highlight && (
          <div className="absolute right-3 top-3 rounded-full bg-beland-yellow px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-beland-ink shadow">
            ★ {t("products.play")}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-black text-beland-ink">{title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-beland-ink/70">{body}</p>
      </div>
    </article>
  );
}

/* ------------------------------ Stations ------------------------------ */

function Stations() {
  const { t } = useI18n();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(true);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };
  

  return (
    <section id="stations" className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="wavy-divider absolute inset-x-0 top-0 h-16 opacity-60" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-12">
        {/* vertical video placeholder */}
        <div className="lg:col-span-5">
          <Reveal>
            <div className="relative mx-auto w-[280px] rounded-[2.5rem] border-[10px] border-beland-ink bg-beland-ink shadow-2xl">
             <div className="relative aspect-[9/16] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-beland-orange via-beland-red to-beland-orange">
                <video
                  ref={videoRef}
                  src="/maquina.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-beland-red animate-pulse" />
                    {t("stations.videoLabel")}
                  </span>
                  <button
                    onClick={toggle}
                    className="rounded-full bg-white text-beland-ink flex h-9 w-9 items-center justify-center shadow transition hover:scale-110"
                  >
                    {playing ? (
                      <Pause className="h-4 w-4" fill="currentColor" />
                    ) : (
                      <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-beland-orange">
              {t("stations.eyebrow")}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-4xl md:text-6xl">{t("stations.title")}</h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-lg text-beland-ink/70">{t("stations.copy")}</p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Badge icon={<PartyPopper className="h-4 w-4" />} tone="red">
                {t("stations.badge.candy")}
              </Badge>
              <Badge icon={<Coins className="h-4 w-4" />} tone="yellow">
                {t("stations.badge.becoin")}
              </Badge>
              <Badge icon={<Sparkles className="h-4 w-4" />} tone="green">
                {t("stations.badge.proof")}
              </Badge>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Badge({
  children,
  icon,
  tone,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  tone: "green" | "red" | "yellow";
}) {
  const map = {
    green: "bg-beland-green/10 text-beland-green-deep border-beland-green/30",
    red: "bg-beland-red/10 text-beland-red border-beland-red/30",
    yellow: "bg-beland-yellow/25 text-beland-ink border-beland-yellow/60",
  } as const;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold ${map[tone]}`}>
      {icon}
      {children}
    </span>
  );
}

/* ------------------------------ Movement (dark) ------------------------------ */

function Movement() {
  const { t } = useI18n();
  return (
    <section id="movement" className="relative overflow-hidden bg-black py-24 text-white md:py-32">
      {/* festival background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklab,var(--neon-green)_35%,transparent),transparent_50%),radial-gradient(circle_at_80%_60%,color-mix(in_oklab,var(--neon-orange)_35%,transparent),transparent_50%)]" />
        <div className="absolute inset-0 opacity-30 mix-blend-screen wavy-divider" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-neon-green backdrop-blur">
              <Music2 className="h-3.5 w-3.5" /> {t("movement.eyebrow")}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-6 text-4xl leading-tight md:text-7xl">
              {t("movement.title.a")}{" "}
              <span className="text-gradient-neon">{t("movement.title.b")}</span>
            </h2>
          </Reveal>
        </div>

        {/* cinematic video placeholder */}
        <Reveal delay={140}>
          <div className="relative mx-auto mt-12 overflow-hidden rounded-3xl border border-white/10 shadow-glow-neon">
            <div className="relative aspect-[21/9] w-full bg-gradient-to-br from-neutral-900 via-black to-neutral-900">
              {/* crowd silhouette bars */}
              <div className="absolute inset-x-0 bottom-0 flex h-1/2 items-end justify-center gap-1 px-4 opacity-70">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-t bg-gradient-to-t from-neon-green to-neon-orange"
                    style={{ height: `${20 + Math.sin(i * 0.6) * 40 + Math.random() * 30}%` }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,black_100%)]" />
              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-neon-green backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse" />
                {t("movement.live")}
              </div>
              <button className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-black shadow-2xl transition hover:scale-110">
                <Play className="h-8 w-8 translate-x-0.5" fill="currentColor" />
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl text-center">
          <Reveal>
            <p className="text-lg text-white/75 md:text-xl">{t("movement.copy")}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n, i) => (
            <Reveal key={n} delay={i * 120}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur transition hover:border-neon-green/40 hover:bg-white/10">
                <p className="text-4xl font-black text-gradient-neon">{t(`movement.stat${n}.n`)}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-white/60">
                  {t(`movement.stat${n}.l`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Guinness ------------------------------ */

function Guinness() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-beland-ink py-24 text-white md:py-32">
      <div className="absolute inset-0 opacity-40 wavy-divider" />
      <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-neon-green/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-8">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-neon-green/40 bg-neon-green/10 px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-neon-green">
                <Trophy className="h-3.5 w-3.5" /> {t("guinness.eyebrow")}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 text-4xl leading-tight md:text-6xl">
                {t("guinness.title.a")}
                <br />
                <span className="text-neon-green">{t("guinness.title.b")}</span>
              </h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-lg text-white/75">{t("guinness.copy")}</p>
            </Reveal>
            <Reveal delay={220}>
              <a
                href="mailto:sponsors@beland.world"
                className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-neon-green px-6 py-3.5 text-base font-black text-neon-green transition hover:bg-neon-green hover:text-black hover:shadow-glow-neon"
              >
                <Rocket className="h-5 w-5" /> {t("guinness.cta")}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <div className="space-y-3">
              {[t("guinness.stat1"), t("guinness.stat2"), t("guinness.stat3")].map((s, i) => (
                <Reveal key={s} delay={i * 100}>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-green/15 text-neon-green">
                      {i === 0 ? <Music2 className="h-5 w-5" /> : i === 1 ? <Sparkles className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}
                    </div>
                    <span className="text-sm font-bold">{s}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Hub -------------------------------- */

function Hub() {
  const { t } = useI18n();
  return (
    <section id="hub" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-beland-green-deep">
                {t("hub.eyebrow")}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 text-4xl md:text-6xl">{t("hub.title")}</h2>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-lg text-beland-ink/70">{t("hub.copy")}</p>
            </Reveal>
            <ul className="mt-8 space-y-3">
              {[t("hub.bullet1"), t("hub.bullet2"), t("hub.bullet3")].map((b, i) => (
                <Reveal key={b} delay={i * 80}>
                  <li className="flex items-start gap-3 text-base text-beland-ink">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-beland-green text-white">
                      <Leaf className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-semibold">{b}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={280}>
              <a
                href="mailto:hub@beland.world"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-beland-green px-6 py-3.5 text-base font-black text-white shadow-glow-green transition hover:brightness-110"
              >
                <Store className="h-5 w-5" /> {t("hub.cta")}
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={120}>
              <div className="relative rounded-3xl border border-black/5 bg-cream p-6 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  <HubTile icon={<Building2 className="h-5 w-5" />} title="Café" body="+340 clientes / mes" tone="green" />
                  <HubTile icon={<Package className="h-5 w-5" />} title="Delivery" body="Gestionado" tone="orange" />
                  <HubTile icon={<CalendarClock className="h-5 w-5" />} title="Retiros" body="Sincronizados" tone="yellow" />
                  <HubTile icon={<Zap className="h-5 w-5" />} title="Estación" body="0€ instalación" tone="red" />
                </div>
                <div className="mt-5 rounded-2xl bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Impacto mensual</p>
                    <span className="text-xs font-bold text-beland-green-deep">↑ 42%</span>
                  </div>
                  <div className="mt-3 flex items-end gap-1.5 h-16">
                    {[30, 45, 38, 60, 55, 72, 90].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-beland-green to-beland-orange"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function HubTile({
  icon,
  title,
  body,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: "green" | "orange" | "yellow" | "red";
}) {
  const map = {
    green: "bg-beland-green text-white",
    orange: "bg-beland-orange text-white",
    yellow: "bg-beland-yellow text-beland-ink",
    red: "bg-beland-red text-white",
  } as const;
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${map[tone]}`}>{icon}</div>
      <p className="mt-3 text-sm font-black text-beland-ink">{title}</p>
      <p className="text-xs text-beland-ink/60">{body}</p>
    </div>
  );
}

/* ------------------------------ Trojan Horse ------------------------------ */

function Trojan() {
  const { t } = useI18n();
  return (
    <section
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "radial-gradient(ellipse at top, oklch(0.22 0.09 250), oklch(0.08 0.03 250) 70%)",
      }}
    >
      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative mx-auto max-w-5xl px-5 text-center text-white">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-black uppercase tracking-[0.25em] text-white/80 backdrop-blur">
            {t("trojan.eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-6 text-4xl leading-tight md:text-6xl">{t("trojan.title")}</h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">{t("trojan.copy")}</p>
        </Reveal>
        <Reveal delay={220}>
          <div className="mt-10 flex flex-col items-center gap-6">
            <a
              href="https://better-technologies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-base font-black text-white backdrop-blur transition hover:bg-white hover:text-beland-ink"
            >
              {t("trojan.cta")}
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <img
              src={betterTechLogo}
              alt="Better Technologies"
              className="h-12 w-auto opacity-80 transition hover:opacity-100"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- Footer --------------------------------- */

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-black/5 bg-cream py-14">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <img src={belandLogo} alt="Beland" className="h-9 w-auto" />
          <span className="text-sm font-semibold text-beland-ink/60">{t("footer.tag")}</span>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <span className="text-xs font-semibold text-beland-ink/50">{t("footer.rights")}</span>
          <a
            href="https://better-technologies.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-beland-ink/70 story-link"
          >
            {t("footer.made")} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------- Page ---------------------------------- */

function Page() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Ritual />
        <Products />
        <Stations />
        <Movement />
        <Guinness />
        <Hub />
        <Trojan />
      </main>
      <Footer />
    </div>
  );
}
