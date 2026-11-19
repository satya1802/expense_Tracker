// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Check } = Icons;

const PRODUCT = "Expense Tracker";
const PAGE_TITLE = "Create your account";
const INTRO = "Track your spending privately. Your expenses, categories and budgets are visible only to you.";
const EMAIL_IN_USE_COPY =
  "That email is already in use. Enter a valid email address and a password that meets the stated minimum requirements.";
const PRIVACY_HINT =
  "Your password is saved hashed, never in plain text. We only email you about your own budget alerts.";

// Emails already registered in this demo account store (users.email is unique)
const REGISTERED_EMAILS = ["maya.okonkwo@fastmail.com", "rui.alvarez@hey.com"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const mix = (colour, percent) => `color-mix(in srgb, ${colour} ${percent}%, transparent)`;

export default function Screen() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = React.useState({});
  const [phase, setPhase] = React.useState("idle"); // idle | creating

  const glass = {
    backgroundColor: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: brand.radius,
  };
  const glow = `0 20px 60px -10px ${mix(brand.primaryColor, 70)}`;

  const pwLongEnough = form.password.length >= 10;
  const pwHasNumber = /\d/.test(form.password);
  const emailTaken = errors.email === "taken";
  const errorList = Object.keys(errors).length > 0;

  const set = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const next = {};
    const email = form.email.trim();
    if (!email) next.email = "Enter the email address you want to sign in with.";
    else if (!EMAIL_PATTERN.test(email)) next.email = "That email address does not look right. Check for a missing @ or domain.";
    else if (REGISTERED_EMAILS.includes(email.toLowerCase())) next.email = "taken";

    if (!form.password) next.password = "Choose a password of at least 10 characters including one number.";
    else if (!pwLongEnough || !pwHasNumber)
      next.password = "Password needs at least 10 characters and at least one number.";

    if (!form.confirm) next.confirm = "Re-type your password so we know it is the one you meant.";
    else if (form.confirm !== form.password) next.confirm = "The two passwords do not match.";

    return next;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (phase === "creating") return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) setPhase("creating");
  };

  React.useEffect(() => {
    if (phase !== "creating") return undefined;
    const t = setTimeout(() => navigate("dashboard"), 700);
    return () => clearTimeout(t);
  }, [phase]);

  const fieldStyle = (invalid) => ({
    ...glass,
    border: invalid ? `1px solid ${mix(brand.accentColor, 75)}` : glass.border,
  });

  const messages = [];
  if (emailTaken) messages.push(EMAIL_IN_USE_COPY);
  else {
    if (errors.email) messages.push(errors.email);
    if (errors.password) messages.push(errors.password);
    if (errors.confirm) messages.push(errors.confirm);
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 text-white"
      style={{ fontFamily: brand.fontBody, backgroundColor: brand.backgroundColor, "--np-ring": brand.primaryColor }}
    >
      <style>{`
        .np-focus:focus-visible { outline: 2px solid var(--np-ring); outline-offset: 2px; }
        .np-enter { animation: npEnter 220ms ease-out both; }
        @keyframes npEnter { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .np-enter { animation: none; }
          .np-lift { transition: none !important; }
        }
      `}</style>

      <div aria-hidden className="pointer-events-none absolute -left-32 top-[-120px] h-[520px] w-[520px] rounded-full blur-[120px]" style={{ backgroundColor: mix(brand.primaryColor, 70) }} />
      <div aria-hidden className="pointer-events-none absolute bottom-[-160px] right-[-80px] h-[560px] w-[560px] rounded-full blur-[130px]" style={{ backgroundColor: mix(brand.accentColor, 60) }} />
      <p className="absolute left-6 top-7 text-lg font-bold sm:left-10 sm:top-8" style={{ fontFamily: brand.fontHeading }}>{PRODUCT}</p>

      <main className="relative w-full max-w-[460px] p-7 backdrop-blur-2xl sm:p-10" style={{ ...glass, boxShadow: "0 40px 120px -20px rgba(0,0,0,0.6)" }}>
        <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: mix(brand.accentColor, 25), color: "#fff" }}>
          <span aria-hidden>●</span> Private by default
        </p>

        <h1 data-wf="b-0-0" className="mt-5 text-[34px] font-extrabold leading-tight tracking-tight sm:text-4xl" style={{ fontFamily: brand.fontHeading }}>
          {PAGE_TITLE}
        </h1>
        <p data-wf="b-1-0" className="mt-3 text-sm leading-relaxed text-white/70">{INTRO}</p>

        <form data-wf="b-2-0" className="mt-8" onSubmit={onSubmit} noValidate aria-describedby="np-form-note">
          <h2 className="sr-only">Sign up</h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="np-email" className="block text-xs font-semibold uppercase tracking-wider text-white/75">
                Email address
              </label>
              <input
                data-wf="i-2-0-0"
                id="np-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "np-email-error" : undefined}
                className="np-focus mt-2 h-12 w-full px-4 text-sm text-white placeholder:text-white/35 outline-none"
                style={fieldStyle(Boolean(errors.email))}
              />
              {errors.email ? (
                <p id="np-email-error" className="np-enter mt-2 flex items-start gap-1.5 text-xs font-semibold" style={{ color: brand.accentColor }}>
                  <Icons.AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{emailTaken ? "That email is already in use." : errors.email}</span>
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="np-password" className="block text-xs font-semibold uppercase tracking-wider text-white/75">
                Password <span className="normal-case tracking-normal text-white/55">(minimum 10 characters, at least one number)</span>
              </label>
              <input
                data-wf="i-2-0-1"
                id="np-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={set("password")}
                aria-invalid={errors.password ? "true" : undefined}
                aria-describedby={errors.password ? "np-password-rules np-password-error" : "np-password-rules"}
                className="np-focus mt-2 h-12 w-full px-4 text-sm text-white placeholder:text-white/35 outline-none"
                style={fieldStyle(Boolean(errors.password))}
              />
              <ul id="np-password-rules" className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
                <li className="flex items-center gap-1.5" style={pwLongEnough ? { color: brand.primaryColor } : undefined}>
                  {pwLongEnough ? <Icons.Check className="h-3.5 w-3.5" aria-hidden /> : <Icons.X className="h-3.5 w-3.5" aria-hidden />}
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    {pwLongEnough ? "10+ characters" : `10 characters (${form.password.length} so far)`}
                  </span>
                </li>
                <li className="flex items-center gap-1.5" style={pwHasNumber ? { color: brand.primaryColor } : undefined}>
                  {pwHasNumber ? <Icons.Check className="h-3.5 w-3.5" aria-hidden /> : <Icons.X className="h-3.5 w-3.5" aria-hidden />}
                  <span>At least one number</span>
                </li>
              </ul>
              {errors.password ? (
                <p id="np-password-error" className="np-enter mt-2 flex items-start gap-1.5 text-xs font-semibold" style={{ color: brand.accentColor }}>
                  <Icons.AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{errors.password}</span>
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="np-confirm" className="block text-xs font-semibold uppercase tracking-wider text-white/75">
                Confirm password
              </label>
              <input
                data-wf="i-2-0-2"
                id="np-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={form.confirm}
                onChange={set("confirm")}
                aria-invalid={errors.confirm ? "true" : undefined}
                aria-describedby={errors.confirm ? "np-confirm-error" : undefined}
                className="np-focus mt-2 h-12 w-full px-4 text-sm text-white placeholder:text-white/35 outline-none"
                style={fieldStyle(Boolean(errors.confirm))}
              />
              {errors.confirm ? (
                <p id="np-confirm-error" className="np-enter mt-2 flex items-start gap-1.5 text-xs font-semibold" style={{ color: brand.accentColor }}>
                  <Icons.AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>{errors.confirm}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div
            data-wf="b-3-0"
            id="np-form-note"
            role={errorList ? "alert" : "status"}
            className={`mt-6 p-4 text-sm leading-relaxed ${errorList ? "np-enter" : ""}`}
            style={
              errorList
                ? { ...glass, border: `1px solid ${mix(brand.accentColor, 60)}`, boxShadow: `0 20px 60px -20px ${mix(brand.accentColor, 70)}` }
                : { ...glass, backgroundColor: "rgba(255,255,255,0.04)" }
            }
          >
            {errorList ? (
              <>
                <p className="flex items-center gap-2 font-bold" style={{ color: brand.accentColor }}>
                  <Icons.AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
                  We could not create the account yet
                </p>
                <ul className="mt-2 space-y-1 text-white/80">
                  {messages.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </>
            ) : phase === "creating" ? (
              <p className="flex items-center gap-2 font-semibold" style={{ color: brand.primaryColor }}>
                <Icons.CheckCircle className="h-4 w-4 shrink-0" aria-hidden />
                Account created. Taking you to your dashboard…
              </p>
            ) : (
              <p className="text-white/70">{PRIVACY_HINT}</p>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              data-wf="b-4-0"
              type="submit"
              disabled={phase === "creating"}
              className="np-focus np-lift h-12 w-full text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
              style={{
                background: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`,
                borderRadius: brand.radius,
                boxShadow: glow,
              }}
            >
              {phase === "creating" ? "Creating account…" : "Create account"}
            </button>
            <button
              data-wf="b-4-1"
              type="button"
              onClick={() => navigate("sign-in")}
              className="np-focus h-12 w-full text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white"
              style={glass}
            >
              Already have an account? <span className="font-bold" style={{ color: brand.accentColor }}>Sign in</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
