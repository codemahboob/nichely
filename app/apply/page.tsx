"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { NICHES } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4;

type FormState = {
  instagramHandle: string;
  followers: string;
  avgLikes: string;
  avgViews: string;
  niches: string[];
  otherNiche: string;
  fullName: string;
  whatsapp: string;
  reelCharge: string;
};

const initialState: FormState = {
  instagramHandle: "",
  followers: "",
  avgLikes: "",
  avgViews: "",
  niches: [],
  otherNiche: "",
  fullName: "",
  whatsapp: "",
  reelCharge: "",
};

// Bottom padding that clears the browser's own bottom bar / gesture area.
const SAFE_BOTTOM = "pb-[calc(1rem+env(safe-area-inset-bottom))]";

/* ---------------------------------------------------------------- */
/* Small shared bits                                                 */
/* ---------------------------------------------------------------- */

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="progress-track" aria-hidden="true">
      <div className={`progress-seg ${step >= 1 ? "done" : ""}`} />
      <div className={`progress-seg ${step >= 2 ? "done" : ""}`} />
      <div className={`progress-seg ${step >= 3 ? "done" : ""}`} />
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pill rounded-full px-4 py-2 text-sm font-medium text-left ${
        active ? "active" : "bg-white text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none">
      <path
        d="M4 10.5L8 14.5L16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none">
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Radio-style option row, used inside RangeSelect's popover. */
function OptionRow({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-[15px] font-medium border-b border-line last:border-b-0 transition-colors ${
        active ? "bg-lime/25 text-ink" : "bg-white text-ink"
      }`}
    >
      <span>{children}</span>
      <span
        className={`shrink-0 w-5 h-5 rounded-full border-[1.6px] flex items-center justify-center ${
          active ? "border-ink bg-ink" : "border-line"
        }`}
      >
        {active && <IconCheck className="w-3 h-3 text-lime" />}
      </span>
    </button>
  );
}

/* Walks up the DOM to find the nearest ancestor that actually
   scrolls, so popover placement can be measured against the visible
   area a person can scroll within, rather than the full browser
   window (which is wrong once the app is framed inside a smaller
   desktop card). */
function getScrollParent(node: HTMLElement): HTMLElement | null {
  let el = node.parentElement;
  while (el) {
    const style = window.getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

/* Compact "select a range" field. Renders as a single closed field —
   tapping it opens a small popover anchored directly beneath the
   field (not a full-screen sheet). Selecting an option closes the
   popover immediately and shows only the chosen value in the field.
   Tapping the field again reopens it so the choice can be changed. */
function RangeSelect({
  label,
  helperText,
  placeholder,
  value,
  options,
  onChange,
  error,
}: {
  label: string;
  helperText?: string;
  placeholder: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  // When there isn't enough room below the field (e.g. it's near the
  // bottom of the scrollable form), the popover opens upward instead
  // so it's never pushed off-screen or hidden behind the button bar.
  const [dropUp, setDropUp] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const POPOVER_MAX_HEIGHT = 224; // px, matches max-h-56 below

  function openPopover() {
    const el = wrapRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      // Measure against the nearest scrollable ancestor's visible
      // bounds (the form body), not the browser window. On mobile
      // that container fills the viewport so the two are the same,
      // but on desktop/Windows the app renders inside a smaller
      // centered card, so window height alone would give the wrong
      // answer and let the popover spill outside the card.
      const scrollParent = getScrollParent(el);
      const boundaryBottom = scrollParent
        ? scrollParent.getBoundingClientRect().bottom
        : window.innerHeight;
      const spaceBelow = boundaryBottom - rect.bottom;
      setDropUp(spaceBelow < POPOVER_MAX_HEIGHT + 24 && rect.top > spaceBelow);
      // Bring the whole field into view first, so the popover that's
      // about to render has room and isn't clipped by the scroll
      // container or the pinned button bar.
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <label className="text-sm font-medium">{label}</label>
      {helperText && (
        <p className="text-xs text-mute mt-0.5">{helperText}</p>
      )}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPopover())}
        aria-expanded={open}
        className={`mt-1.5 w-full flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[15px] text-left transition-colors ${
          open ? "border-ink" : "border-line"
        }`}
      >
        <span
          className={`truncate ${value ? "text-ink font-medium" : "text-mute"}`}
        >
          {value || placeholder}
        </span>
        <IconChevronDown
          className={`w-4 h-4 shrink-0 text-mute transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute z-30 w-full rounded-xl border border-line bg-white shadow-lg max-h-56 overflow-y-auto ${
            dropUp ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {options.map((opt) => (
            <OptionRow
              key={opt}
              active={value === opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </OptionRow>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

/* Typed audience-metric field — used for followers, average
   likes/views and reel charge. Uses a normal (ABC + 123) keyboard
   rather than a numbers-only one, since people often type shorthand
   like "20k" or "1.2L" instead of spelling out the full number. */
function NumberField({
  label,
  helperText,
  placeholder,
  value,
  onChange,
  error,
  prefix,
}: {
  label: string;
  helperText?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      {helperText && <p className="text-xs text-mute mt-0.5">{helperText}</p>}
      <div className="mt-1.5 flex rounded-xl border border-line overflow-hidden focus-within:border-ink">
        {prefix && (
          <span className="px-3 py-3 text-[15px] text-mute bg-black/[0.03] border-r border-line shrink-0">
            {prefix}
          </span>
        )}
        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/[^0-9a-zA-Z.,]/g, ""))
          }
          placeholder={placeholder}
          inputMode="text"
          className="flex-1 px-4 py-3 text-[15px] outline-none min-w-0"
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

/* Small helper that plays a short two-tone success chime using the
   Web Audio API — no audio asset needed, and it's created on the
   click that triggers submit so mobile browsers don't block it. */
function playSuccessChime(ctx: AudioContext) {
  const notes: [number, number][] = [
    [880, 0],
    [1318.5, 0.11],
  ];
  notes.forEach(([freq, delay]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.32);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.34);
  });
}

export default function ApplyPage() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleNiche(n: string) {
    setForm((f) => {
      const has = f.niches.includes(n);
      const niches = has ? f.niches.filter((x) => x !== n) : [...f.niches, n];
      return { ...f, niches };
    });
  }

  function validateProfile() {
    const e: Record<string, string> = {};
    const handle = form.instagramHandle.replace("@", "").trim();
    if (!handle) e.instagramHandle = "Enter your Instagram handle";
    if (!form.followers.trim()) e.followers = "Enter your follower count";
    if (!form.avgLikes.trim())
      e.avgLikes = "Enter your average Reel likes";
    if (!form.avgViews.trim())
      e.avgViews = "Enter your average Reel views";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateContentStyle() {
    const e: Record<string, string> = {};
    if (form.niches.length === 0) e.niches = "Pick at least one niche";
    if (form.niches.includes("Other") && !form.otherNiche.trim())
      e.otherNiche = "Tell us your niche";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateContact() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Enter your full name";
    const digits = form.whatsapp.replace(/\D/g, "");
    if (digits.length < 10) e.whatsapp = "Enter a valid WhatsApp number";
    if (!form.reelCharge.trim())
      e.reelCharge = "Enter how much you charge for 1 Reel";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function goNext() {
    if (validateProfile()) {
      setErrors({});
      setStep(2);
    }
  }

  function goToContact() {
    if (validateContentStyle()) {
      setErrors({});
      setStep(3);
    }
  }

  function goBack() {
    setErrors({});
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  }

  async function handleSubmit() {
    if (!validateContact()) return;

    // Create/resume the AudioContext synchronously inside this click
    // handler so the later chime isn't blocked by autoplay policies.
    try {
      if (!audioCtxRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        audioCtxRef.current = new Ctx();
      }
      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }
    } catch {
      // Audio isn't essential — ignore if unsupported/blocked.
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/submit-influencer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          whatsapp: form.whatsapp.trim(),
          instagramHandle: form.instagramHandle.replace("@", "").trim(),
          followers: form.followers.trim(),
          avgLikes: form.avgLikes.trim(),
          avgViews: form.avgViews.trim(),
          niches: form.niches,
          otherNiche: form.otherNiche.trim(),
          reelCharge: form.reelCharge.trim(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStep(4);
      if (audioCtxRef.current) playSuccessChime(audioCtxRef.current);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const handlePreview = useMemo(() => {
    const h = form.instagramHandle.replace("@", "").trim();
    return h ? `@${h}` : "@yourhandle";
  }, [form.instagramHandle]);

  if (step === 4) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center bg-paper md:bg-[#EEEEE8] md:py-10 md:px-6">
        <main className="h-dvh md:h-[840px] md:max-h-[92vh] w-full md:max-w-[430px] overflow-hidden bg-paper flex flex-col items-center justify-center md:rounded-[2rem] md:shadow-2xl md:border md:border-black/10">
        <div className="mx-auto w-full max-w-md px-6 flex flex-col items-center text-center">
          <div className="tick-wrap w-20 h-20 rounded-full bg-lime flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-9 h-9 tick-mark" fill="none">
              <path
                d="M5 12.5L10 17.5L19 7"
                stroke="#0B0B0C"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-extrabold tracking-tight">
            You&rsquo;re on the list{form.fullName ? `, ${form.fullName.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-3 text-mute text-[15px] leading-relaxed">
            Thanks for applying to AdFex&rsquo;s creator network. Our team
            will review your profile and reach out on WhatsApp as soon as we
            find a matching brand collab.
          </p>
          <Link
            href="/"
            className="mt-8 w-full bg-ink text-paper font-semibold rounded-2xl px-6 py-4"
          >
            Back to home
          </Link>
        </div>
        </main>
      </div>
    );
  }

  return (
    // Same phone-shaped card treatment as the onboarding screen: full
    // viewport on mobile, a centered fixed-size card from md up so it
    // doesn't stretch into a strange narrow strip on desktop/Windows.
    <div className="min-h-dvh w-full flex items-center justify-center bg-paper md:bg-[#EEEEE8] md:py-10 md:px-6">
      <main className="h-dvh md:h-[840px] md:max-h-[92vh] w-full md:max-w-[430px] overflow-hidden bg-paper flex flex-col md:rounded-[2rem] md:shadow-2xl md:border md:border-black/10">
      {/* Sticky header — back button + progress stay put while the
          form body scrolls underneath it. */}
      <div className="shrink-0 border-b border-line bg-paper">
        <div className="mx-auto w-full max-w-md px-6 pt-6 pb-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => (step === 1 ? history.back() : goBack())}
            aria-label="Go back"
            className="w-9 h-9 rounded-full border border-line flex items-center justify-center shrink-0"
          >
            ←
          </button>
          <ProgressBar step={step} />
        </div>
      </div>

      {/* Scrollable form body — only this area scrolls. */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-md px-6 py-6">
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Your creator profile
              </h1>
              <p className="text-mute text-sm mt-2 leading-relaxed">
                Share a few details about your Instagram so we can match you
                with the right brands across India.
              </p>

              <div className="mt-6 space-y-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-mute">
                    Instagram profile
                  </p>
                  <div className="mt-2.5">
                    <label className="text-sm font-medium">
                      Instagram handle
                    </label>
                    <div className="mt-1.5 flex rounded-xl border border-line overflow-hidden focus-within:border-ink">
                      <span className="w-11 flex items-center justify-center text-ink bg-black/[0.03] border-r border-line shrink-0">
                        <IconInstagram className="w-[18px] h-[18px]" />
                      </span>
                      <input
                        value={form.instagramHandle}
                        onChange={(e) =>
                          update("instagramHandle", e.target.value)
                        }
                        placeholder="yourhandle"
                        className="flex-1 px-4 py-3 text-[15px] outline-none min-w-0"
                      />
                    </div>
                    <p className="text-xs text-mute mt-1">
                      This is how brands will recognise you: {handlePreview}
                    </p>
                    {errors.instagramHandle && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.instagramHandle}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-mute">
                    Audience size
                  </p>
                  <div className="mt-2.5">
                    <NumberField
                      label="Followers"
                      helperText="Enter your current Instagram follower count — numbers or shorthand both work, e.g. 15000 or 15k."
                      placeholder="e.g. 15000 or 15k"
                      value={form.followers}
                      onChange={(v) => update("followers", v)}
                      error={errors.followers}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-mute">
                    Average Reel performance
                  </p>
                  <p className="text-xs text-mute mt-1">
                    A close estimate is fine — exact numbers aren&rsquo;t
                    required.
                  </p>
                  <div className="mt-2.5 space-y-4">
                    <NumberField
                      label="Average Reel likes"
                      placeholder="e.g. 1200 or 1.2k"
                      value={form.avgLikes}
                      onChange={(v) => update("avgLikes", v)}
                      error={errors.avgLikes}
                    />
                    <NumberField
                      label="Average Reel views"
                      placeholder="e.g. 25000 or 25k"
                      value={form.avgViews}
                      onChange={(v) => update("avgViews", v)}
                      error={errors.avgViews}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Your content style
              </h1>
              <p className="text-mute text-sm mt-2 leading-relaxed">
                This helps us send you collabs that actually fit how you
                create.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <label className="text-sm font-medium">
                    What&rsquo;s your content niche?{" "}
                    <span className="text-mute font-normal">
                      (select all that apply)
                    </span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {NICHES.map((n) => (
                      <Chip
                        key={n}
                        active={form.niches.includes(n)}
                        onClick={() => toggleNiche(n)}
                      >
                        {n}
                      </Chip>
                    ))}
                  </div>
                  {errors.niches && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.niches}
                    </p>
                  )}

                  {form.niches.includes("Other") && (
                    <div className="mt-3">
                      <input
                        value={form.otherNiche}
                        onChange={(e) =>
                          update("otherNiche", e.target.value)
                        }
                        placeholder="Tell us your niche"
                        className="w-full rounded-xl border border-line px-4 py-3 text-[15px] outline-none focus:border-ink"
                      />
                      {errors.otherNiche && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.otherNiche}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Almost done — your details
              </h1>
              <p className="text-mute text-sm mt-2 leading-relaxed">
                So our team can reach you the moment there&rsquo;s a matching
                collab.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-sm font-medium">Full name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 text-[15px] outline-none focus:border-ink"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium">
                    WhatsApp number
                  </label>
                  <div className="mt-1.5 flex rounded-xl border border-line overflow-hidden focus-within:border-ink">
                    <span className="px-3 py-3 text-[15px] text-mute bg-black/[0.03] border-r border-line">
                      +91
                    </span>
                    <input
                      value={form.whatsapp}
                      onChange={(e) => update("whatsapp", e.target.value)}
                      placeholder="98765 43210"
                      inputMode="numeric"
                      className="flex-1 px-4 py-3 text-[15px] outline-none min-w-0"
                    />
                  </div>
                  <p className="text-xs text-mute mt-1">
                    We&rsquo;ll message you here once you&rsquo;re approved.
                  </p>
                  {errors.whatsapp && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.whatsapp}
                    </p>
                  )}
                </div>

                <div>
                  <NumberField
                    label="Your charge for 1 Reel"
                    helperText="What you'd typically charge a brand for one sponsored Reel."
                    placeholder="e.g. 3000 or 3k"
                    prefix="₹"
                    value={form.reelCharge}
                    onChange={(v) => update("reelCharge", v)}
                    error={errors.reelCharge}
                  />
                </div>
              </div>

              <p className="text-xs text-mute mt-6 text-center leading-relaxed">
                By submitting, you agree to AdFex&rsquo;s{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms((v) => !v)}
                  className="text-ink font-medium underline underline-offset-2"
                >
                  Terms &amp; Conditions
                </button>{" "}
                and to be contacted about brand collab opportunities.
              </p>

              {showTerms && (
                <div className="mt-3 rounded-xl border border-line bg-black/[0.02] px-4 py-3.5 text-xs text-mute leading-relaxed space-y-2">
                  <p className="text-ink font-semibold text-[13px]">
                    Terms &amp; Conditions
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5">
                    <li>
                      Applications are reviewed by the AdFex team; being
                      listed here doesn&rsquo;t guarantee a brand collab.
                    </li>
                    <li>
                      The details you share — Instagram handle, audience
                      metrics and contact information — are used only to
                      match you with relevant campaigns across India.
                    </li>
                    <li>
                      Collab terms, deliverables and payment for each
                      campaign are confirmed separately once a brand match
                      is made.
                    </li>
                    <li>
                      You can ask us to update or remove your application at
                      any time by contacting our team.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {submitError && (
            <p className="text-sm text-red-600 mt-4">{submitError}</p>
          )}
        </div>
      </div>

      {/* Pinned button bar — always in the same on-screen spot. */}
      <div className={`shrink-0 border-t border-line bg-paper`}>
        <div className={`mx-auto w-full max-w-md px-6 pt-4 ${SAFE_BOTTOM}`}>
          {step === 1 && (
            <button
              type="button"
              onClick={goNext}
              className="w-full bg-ink text-paper font-semibold rounded-2xl px-6 py-4"
            >
              Continue
            </button>
          )}
          {step === 2 && (
            <button
              type="button"
              onClick={goToContact}
              className="w-full bg-ink text-paper font-semibold rounded-2xl px-6 py-4"
            >
              Continue
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-lime text-ink font-semibold rounded-2xl px-6 py-4 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit application"}
            </button>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
