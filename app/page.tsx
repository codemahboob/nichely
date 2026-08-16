"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/* ---------------------------------------------------------------- */
/* Small shared bits                                                 */
/* ---------------------------------------------------------------- */

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Rounded 6-point burst — the "moving star" motif, reused across
   slides at different sizes / positions / colors. */
function BurstStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <path
        d="M50 4C52 4 53.6 5.4 54 7.3L58 26.6C58.6 29.6 62.2 30.8 64.5 28.8L79.4 15.7C80.9 14.4 83.1 14.4 84.6 15.7C86.1 17.1 86.3 19.3 85.1 20.9L73.8 36.6C71.9 39.2 73.9 42.8 77.1 42.5L96.6 40.7C98.5 40.5 100.2 41.9 100.5 43.8C100.7 45.7 99.4 47.5 97.5 47.9L78.5 52C75.5 52.6 74.3 56.2 76.3 58.5L89.4 73.4C90.7 74.9 90.7 77.1 89.4 78.6C88 80.1 85.8 80.3 84.2 79.1L68.5 67.8C65.9 65.9 62.3 67.9 62.6 71.1L64.4 90.6C64.6 92.5 63.2 94.2 61.3 94.5C59.4 94.7 57.6 93.4 57.2 91.5L53.1 72.5C52.5 69.5 48.9 68.3 46.6 70.3L31.7 83.4C30.2 84.7 28 84.7 26.5 83.4C25 82 24.8 79.8 26 78.2L37.3 62.5C39.2 59.9 37.2 56.3 34 56.6L14.5 58.4C12.6 58.6 10.9 57.2 10.6 55.3C10.4 53.4 11.7 51.6 13.6 51.2L32.6 47.1C35.6 46.5 36.8 42.9 34.8 40.6L21.7 25.7C20.4 24.2 20.4 22 21.7 20.5C23.1 19 25.3 18.8 26.9 20L42.6 31.3C45.2 33.2 48.8 31.2 48.5 28L46.7 8.5C46.5 6.4 47.9 4.6 49.8 4.3C49.9 4.3 49.9 4 50 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Stylised cash-stack illustration for the opening slide — the very
   first thing a new creator sees, so it carries a soft lime glow, a
   slightly larger stage and a playful "same day" sticker badge to
   make the strongest possible first impression. */
function MoneyIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* soft glow behind the stack for extra visual pop */}
      <div className="absolute w-48 h-48 rounded-full bg-lime/25 blur-3xl" />
      <BurstStar className="w-6 h-6 text-lime/70 absolute top-4 left-6 animate-drift-b" />
      <BurstStar className="w-4 h-4 text-paper/40 absolute bottom-8 right-8 animate-drift-c" />
      <svg viewBox="0 0 220 180" className="w-56 h-auto animate-drift-a relative">
        {/* back bill */}
        <rect x="18" y="58" width="150" height="86" rx="10" fill="#1C1C1F" stroke="#3A3A3E" strokeWidth="1.5" />
        {/* middle bill */}
        <rect x="34" y="42" width="150" height="86" rx="10" fill="#26262A" stroke="#45454A" strokeWidth="1.5" />
        {/* front bill */}
        <rect x="50" y="26" width="150" height="86" rx="10" fill="#D7FF3D" />
        <circle cx="125" cy="69" r="24" fill="none" stroke="#0B0B0C" strokeOpacity="0.25" strokeWidth="2" />
        <text x="125" y="77" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0B0B0C" fillOpacity="0.75">
          ₹
        </text>
        <rect x="62" y="38" width="26" height="6" rx="3" fill="#0B0B0C" fillOpacity="0.18" />
        <rect x="62" y="98" width="26" height="6" rx="3" fill="#0B0B0C" fillOpacity="0.18" />
        <rect x="176" y="38" width="10" height="6" rx="3" fill="#0B0B0C" fillOpacity="0.18" />
        <rect x="176" y="98" width="10" height="6" rx="3" fill="#0B0B0C" fillOpacity="0.18" />
      </svg>
      {/* playful sticker badge, tilted like it's stuck onto the scene */}
      <span className="absolute bottom-3 -right-1 -rotate-6 bg-ink text-lime text-xs font-bold tracking-wide px-3 py-1.5 rounded-full border border-lime/40 shadow-lg animate-drift-b">
        Same-day ⚡
      </span>
    </div>
  );
}

/* Large drifting star used on the brands slide — same motif,
   repositioned and recoloured per slide. */
function StarIllustration({
  position,
  tone,
}: {
  position: "top-right" | "bottom-left";
  tone: "lime" | "paper";
}) {
  const posClass =
    position === "top-right"
      ? "top-2 right-6"
      : "bottom-4 left-6";
  const colorClass = tone === "lime" ? "text-lime" : "text-paper";
  return (
    <div className="relative w-full h-full">
      <BurstStar
        className={`w-28 h-28 absolute ${posClass} ${colorClass} animate-drift-a`}
      />
      <BurstStar className="w-5 h-5 text-paper/50 absolute bottom-8 right-10 animate-drift-b" />
      <BurstStar className="w-3 h-3 text-lime/60 absolute top-12 left-10 animate-drift-c" />
    </div>
  );
}

/* Phone + content-grid illustration for the "create from anywhere"
   slide. Built from the same flat-shape / ink+lime language as the
   other illustrations (dark silhouette, lime screen, soft accent
   stars) so it reads as part of the same set. Swaps out the old
   storefront/pin artwork, since creators shoot from wherever they
   are rather than travelling to a location. */
function AnywhereIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <BurstStar className="w-5 h-5 text-lime/70 absolute top-6 right-10 animate-drift-b" />
      <BurstStar className="w-3.5 h-3.5 text-paper/40 absolute bottom-10 left-10 animate-drift-c" />
      <svg viewBox="0 0 200 180" className="w-40 h-auto animate-drift-a">
        {/* ground shadow */}
        <ellipse cx="100" cy="166" rx="38" ry="6" fill="#0B0B0C" fillOpacity="0.3" />
        {/* phone body */}
        <rect x="58" y="8" width="84" height="160" rx="18" fill="#1C1C1F" stroke="#3A3A3E" strokeWidth="1.5" />
        {/* screen */}
        <rect x="66" y="24" width="68" height="128" rx="8" fill="#D7FF3D" />
        {/* content grid tiles on screen */}
        <rect x="72" y="30" width="27" height="27" rx="4" fill="#0B0B0C" fillOpacity="0.82" />
        <rect x="101" y="30" width="27" height="27" rx="4" fill="#0B0B0C" fillOpacity="0.45" />
        <rect x="72" y="59" width="27" height="27" rx="4" fill="#0B0B0C" fillOpacity="0.45" />
        <rect x="101" y="59" width="27" height="27" rx="4" fill="#0B0B0C" fillOpacity="0.82" />
        {/* play triangle on the top-left tile */}
        <path d="M83 40.5L92.5 45.5L83 50.5Z" fill="#D7FF3D" />
        {/* home indicator */}
        <rect x="86" y="158" width="28" height="4" rx="2" fill="#3A3A3E" />
      </svg>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Slide data                                                        */
/* ---------------------------------------------------------------- */

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  illustration: React.ReactNode;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Zero chasing, zero delays",
    title: "Get paid the same day you deliver",
    description:
      "Finish a collab, get it approved, and watch the payment hit your account — no invoices, no follow-up calls, no waiting weeks for brands to pay up.",
    illustration: <MoneyIllustration />,
  },
  {
    eyebrow: "70+ brands and counting",
    title: "Real brands, ready to collab with you",
    description:
      "Beauty, food, fashion, tech and more — verified brands are already posting briefs and looking for creators like you to work with.",
    illustration: <StarIllustration position="top-right" tone="lime" />,
  },
  {
    eyebrow: "Create from anywhere",
    title: "No studio, no travel — just create",
    description:
      "Shoot from home in your own city and we'll match you with brands looking for exactly that — real, authentic content, wherever you're based.",
    illustration: <AnywhereIllustration />,
  },
];

/* ---------------------------------------------------------------- */
/* Page                                                               */
/* ---------------------------------------------------------------- */

export default function LandingPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  function goNext() {
    if (isLast) {
      router.push("/apply");
    } else {
      setIndex((i) => i + 1);
    }
  }

  function skip() {
    router.push("/apply");
  }

  return (
    // On phones this fills the viewport exactly as before. From the
    // md breakpoint up (tablet/desktop/Windows) the app renders as a
    // centered, fixed-size card on a neutral backdrop instead of
    // stretching the mobile column across the whole browser window.
    <div className="min-h-dvh w-full flex items-center justify-center bg-ink md:bg-[#EEEEE8] md:py-10 md:px-6">
      <main className="h-dvh md:h-[840px] md:max-h-[92vh] w-full md:max-w-[430px] overflow-hidden bg-ink text-paper flex flex-col md:rounded-[2rem] md:shadow-2xl md:border md:border-black/10">
      <div className="mx-auto w-full max-w-md px-6 pt-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkle className="w-5 h-5 text-lime" />
          <span className="text-lg font-semibold tracking-tight">adfex</span>
        </div>
        <button
          type="button"
          onClick={skip}
          className="text-sm text-paper/50 font-medium"
        >
          Skip
        </button>
      </div>

      {/* Illustration stage */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div key={index} className="w-full max-w-md h-64 px-6 animate-rise">
          {slide.illustration}
        </div>
      </div>

      {/* Copy + controls, pinned like the rest of the app's CTA bars */}
      <div className="shrink-0 border-t border-paper/10 bg-ink">
        <div className="mx-auto w-full max-w-md px-6 pt-6 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <div key={`copy-${index}`} className="animate-rise">
            <p className="text-lime text-sm font-medium tracking-wide uppercase">
              {slide.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-tight">
              {slide.title}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-paper/60">
              {slide.description}
            </p>
          </div>

          <div className="mt-7 flex items-center justify-between">
            <div className="flex items-center gap-2" aria-hidden="true">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-lime" : "w-1.5 bg-paper/25"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={goNext}
              className="group flex items-center gap-2 bg-lime text-ink font-semibold rounded-full pl-5 pr-1.5 py-1.5 active:scale-[0.97] transition-transform"
            >
              {isLast ? "Get started" : "Next"}
              <span
                aria-hidden="true"
                className="inline-flex w-8 h-8 rounded-full bg-ink text-lime items-center justify-center group-active:translate-x-0.5 transition-transform"
              >
                →
              </span>
            </button>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
