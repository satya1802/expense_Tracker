// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { ApiError, apiFetch, setSessionToken } from "@/lib/api";
import { SESSION_EXPIRED_KEY } from "@/App";

const {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Separator,
} = UI;

const { Check } = Icons;

const SESSION_LIFETIME = "30 minutes";

const ASSURANCES = [
  {
    key: "budgets",
    Icon: Icons.Calendar,
    title: "Monthly budgets, per category",
    body: "Groceries, Transport, Eating out — each with its own ceiling, counted fresh on the 1st.",
  },
  {
    key: "alerts",
    Icon: Icons.AlertCircle,
    title: "Near-budget alerts, not post-mortems",
    body: "A nudge in the app and in your inbox while there is still something left to do about it.",
  },
  {
    key: "export",
    Icon: Icons.Download,
    title: "Your ledger, exportable",
    body: "Every expense — amount, category, date — out as CSV the moment you ask for it.",
  },
];

// Signature motif: a 7-day spending pulse, drawn as a neon ledger line.
const PULSE_POINTS = "0,34 18,30 34,36 48,14 62,38 78,22 94,30 110,8 126,32 142,26 160,34";

export default function Screen() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState({});
  const [formError, setFormError] = React.useState(null); // 'credentials' | 'offline' | 'error'
  const [status, setStatus] = React.useState("idle"); // idle | checking | success
  const [online, setOnline] = React.useState(true);
  const [sessionNoticeOpen, setSessionNoticeOpen] = React.useState(false);

  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);

  // AC-007: a redirect the app itself triggered (a 401 from a protected call)
  // leaves a one-shot flag behind; show the notice once, then clear it.
  React.useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_EXPIRED_KEY)) {
        setSessionNoticeOpen(true);
        sessionStorage.removeItem(SESSION_EXPIRED_KEY);
      }
    } catch {
      // No storage: no notice to show.
    }
  }, []);

  React.useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    if (typeof navigator !== "undefined" && navigator.onLine === false) setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const busy = status === "checking";
  const done = status === "success";

  const line = "rgba(255,255,255,0.14)";
  const glass = "rgba(255,255,255,0.06)";

  const validate = () => {
    const next = {};
    const trimmed = email.trim();
    if (!trimmed) {
      next.email = "Enter the email address on your account.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      next.email = "That does not look like an email address — use the format name@domain.com.";
    }
    if (!password) next.password = "Enter your password to continue.";
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy || done) return;

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setFormError(null);
      const target = errs.email ? emailRef.current : passwordRef.current;
      if (target) target.focus();
      return;
    }

    if (!online) {
      setFormError("offline");
      return;
    }

    setFormError(null);
    setStatus("checking");
    try {
      const result = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      setSessionToken(result.token);
      setStatus("success");
      navigate("dashboard");
    } catch (err) {
      setStatus("idle");
      if (err instanceof ApiError && err.status === 401) {
        // Never reveal which field was wrong (NFR-002): one generic message,
        // regardless of whether the email or the password was the problem.
        setFormError("credentials");
        if (passwordRef.current) passwordRef.current.focus();
      } else {
        setFormError("error");
      }
    }
  };

  const css = `
    .np-root { font-variant-numeric: tabular-nums; }
    .np-root h1, .np-root h2, .np-root .np-display { font-family: ${brand.fontHeading}; }
    .np-root :focus-visible {
      outline: 2px solid ${brand.primaryColor};
      outline-offset: 3px;
      border-radius: 12px;
    }
    .np-input {
      transition: border-color .18s ease, box-shadow .18s ease, background-color .18s ease;
    }
    .np-input::placeholder { color: rgba(159,180,208,0.5); }
    .np-input:hover:not(:disabled) { border-color: rgba(255,255,255,0.26); }
    .np-input:focus { border-color: ${brand.primaryColor}; box-shadow: 0 0 0 4px rgba(34,211,238,0.16); }
    .np-input[aria-invalid="true"] { border-color: ${brand.accentColor}; box-shadow: 0 0 0 4px rgba(232,121,249,0.14); }
    .np-input:disabled { opacity: .55; cursor: not-allowed; }
    .np-cta { transition: transform .18s ease, filter .18s ease, box-shadow .18s ease; }
    .np-cta:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.07); box-shadow: 0 18px 48px rgba(34,211,238,0.34); }
    .np-cta:active:not(:disabled) { transform: translateY(0); filter: brightness(.96); }
    .np-cta:disabled { cursor: progress; filter: saturate(.75); }
    .np-quiet { transition: color .18s ease, border-color .18s ease, background-color .18s ease; }
    .np-quiet:hover { color: ${brand.accentColor}; border-color: rgba(232,121,249,0.5); }
    .np-ghost { transition: color .16s ease, background-color .16s ease; }
    .np-ghost:hover { color: #ffffff; background-color: rgba(255,255,255,0.08); }
    @keyframes npGlow {
      0%, 100% { opacity: .55; transform: scale(1); }
      50% { opacity: .85; transform: scale(1.06); }
    }
    @keyframes npDash { to { stroke-dashoffset: -340; } }
    @keyframes npRise {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes npSweep {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes npSpin { to { transform: rotate(360deg); } }
    .np-glow { animation: npGlow 9s ease-in-out infinite; }
    .np-pulse-line { stroke-dasharray: 8 6; animation: npDash 7s linear infinite; }
    .np-rise { animation: npRise .32s ease-out both; }
    .np-sweep { animation: npSweep 1.25s ease-in-out infinite; }
    .np-spin { animation: npSpin .8s linear infinite; }
    @media (prefers-reduced-motion: reduce) {
      .np-root *, .np-root *::before, .np-root *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  return (
    <div
      className="np-root relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontBody,
        color: "#ffffff",
      }}
    >
      <style>{css}</style>

      {/* Ambient depth: wide, soft colour glows behind the canvas */}
      <div
        aria-hidden="true"
        className="np-glow pointer-events-none absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${brand.primaryColor}33 0%, transparent 68%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="np-glow pointer-events-none absolute -bottom-56 -right-32 h-[38rem] w-[38rem] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${brand.accentColor}2e 0%, transparent 66%)`,
          animationDelay: "2.5s",
        }}
      />

      <main className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-12 lg:gap-16 lg:py-20">
        {/* ——— Auth card (focal point) ——— */}
        <div className="lg:order-2 lg:col-span-7">
          <Card
            aria-busy={busy}
            className="relative overflow-hidden border"
            style={{
              borderRadius: brand.radius,
              borderColor: line,
              backgroundColor: glass,
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              boxShadow: "0 48px 120px rgba(2,8,24,0.65)",
            }}
          >
            {/* Signature: neon pulse rail across the card head */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] overflow-hidden"
              style={{
                background: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor}, ${brand.primaryColor})`,
              }}
            >
              {busy ? (
                <div
                  className="np-sweep h-full w-1/2"
                  style={{
                    background: "linear-gradient(90deg, transparent, #ffffff, transparent)",
                  }}
                />
              ) : null}
            </div>

            <CardHeader className="px-6 pb-2 pt-8 sm:px-10 sm:pt-10">
              <CardTitle asChild>
                <h1
                  data-wf="b-0-0"
                  className="text-[34px] font-bold leading-tight tracking-tight sm:text-[40px]"
                  style={{ color: "#ffffff" }}
                >
                  Sign in
                </h1>
              </CardTitle>
              <CardDescription
                className="mt-2 text-[15px] leading-relaxed"
                style={{ color: brand.neutralColor }}
              >
                Private account — only you see your expenses, categories and budgets.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-2 sm:px-10">
              {/* ——— Stale session notice (calm, not alarming) ——— */}
              {sessionNoticeOpen ? (
                <div
                  data-wf="b-1-0"
                  role="status"
                  className="np-rise mb-8 flex items-start gap-3 border px-4 py-4 sm:px-5"
                  style={{
                    borderRadius: brand.radius,
                    borderColor: "rgba(34,211,238,0.3)",
                    backgroundColor: "rgba(34,211,238,0.08)",
                  }}
                >
                  <Icons.Clock
                    aria-hidden="true"
                    className="mt-[2px] h-[18px] w-[18px] shrink-0"
                    style={{ color: brand.primaryColor }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] leading-relaxed" style={{ color: "#e7f4fb" }}>
                      Your session has expired, sign in again to open your expenses, budgets and
                      summary.
                    </p>
                    <p className="mt-2 text-[12px]" style={{ color: brand.neutralColor }}>
                      Sessions last {SESSION_LIFETIME} idle
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSessionNoticeOpen(false)}
                    aria-label="Dismiss the expired session notice"
                    className="np-ghost -mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{ color: brand.neutralColor }}
                  >
                    <Icons.X aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              ) : null}

              {/* ——— Form ——— */}
              <form data-wf="b-2-0" onSubmit={handleSubmit} noValidate className="space-y-6">
                <div>
                  <Label
                    htmlFor="signin-email"
                    className="text-[12px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: brand.neutralColor }}
                  >
                    Email address
                  </Label>
                  <Input
                    id="signin-email"
                    data-wf="i-2-0-0"
                    ref={emailRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@yourdomain.com"
                    value={email}
                    disabled={busy || done}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                    }}
                    aria-invalid={fieldErrors.email ? "true" : "false"}
                    aria-describedby={fieldErrors.email ? "signin-email-error" : undefined}
                    className="np-input mt-2 h-12 w-full border px-4 text-[15px]"
                    style={{
                      borderRadius: brand.radius,
                      borderColor: line,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "#ffffff",
                    }}
                  />
                  {fieldErrors.email ? (
                    <p
                      id="signin-email-error"
                      className="np-rise mt-2 flex items-center gap-2 text-[13px]"
                      style={{ color: brand.accentColor }}
                    >
                      <Icons.AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <Label
                    htmlFor="signin-password"
                    className="text-[12px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: brand.neutralColor }}
                  >
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="signin-password"
                      data-wf="i-2-0-1"
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      disabled={busy || done}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password)
                          setFieldErrors((p) => ({ ...p, password: undefined }));
                        if (formError === "credentials") setFormError(null);
                      }}
                      aria-invalid={
                        fieldErrors.password || formError === "credentials" ? "true" : "false"
                      }
                      aria-describedby={fieldErrors.password ? "signin-password-error" : undefined}
                      className="np-input h-12 w-full border pl-4 pr-[5.5rem] text-[15px]"
                      style={{
                        borderRadius: brand.radius,
                        borderColor: line,
                        backgroundColor: "rgba(255,255,255,0.05)",
                        color: "#ffffff",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-pressed={showPassword}
                      disabled={busy || done}
                      className="np-ghost absolute right-2 top-1/2 h-9 -translate-y-1/2 rounded-full px-3 text-[12px] font-semibold uppercase tracking-[0.1em]"
                      style={{ color: brand.neutralColor }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {fieldErrors.password ? (
                    <p
                      id="signin-password-error"
                      className="np-rise mt-2 flex items-center gap-2 text-[13px]"
                      style={{ color: brand.accentColor }}
                    >
                      <Icons.AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      {fieldErrors.password}
                    </p>
                  ) : null}
                </div>

                {/* ——— Form-level status: error / offline / success ——— */}
                <div data-wf="b-3-0" aria-live="polite" aria-atomic="true">
                  {formError === "credentials" ? (
                    <div
                      className="np-rise flex items-start gap-3 border px-4 py-4"
                      style={{
                        borderRadius: brand.radius,
                        borderColor: "rgba(232,121,249,0.42)",
                        backgroundColor: "rgba(232,121,249,0.1)",
                      }}
                    >
                      <Icons.AlertCircle
                        aria-hidden="true"
                        className="mt-[2px] h-[18px] w-[18px] shrink-0"
                        style={{ color: brand.accentColor }}
                      />
                      <div>
                        <p className="text-[14px] font-semibold" style={{ color: "#ffffff" }}>
                          Invalid email or password
                        </p>
                        <p
                          className="mt-1 text-[13px] leading-relaxed"
                          style={{ color: brand.neutralColor }}
                        >
                          We don't say which one was wrong; that keeps your account safer.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {formError === "offline" ? (
                    <div
                      className="np-rise flex items-start gap-3 border px-4 py-4"
                      style={{
                        borderRadius: brand.radius,
                        borderColor: "rgba(159,180,208,0.35)",
                        backgroundColor: "rgba(159,180,208,0.1)",
                      }}
                    >
                      <Icons.AlertCircle
                        aria-hidden="true"
                        className="mt-[2px] h-[18px] w-[18px] shrink-0"
                        style={{ color: brand.neutralColor }}
                      />
                      <div>
                        <p className="text-[14px] font-semibold" style={{ color: "#ffffff" }}>
                          You're offline, so we can't check your sign-in.
                        </p>
                        <p
                          className="mt-1 text-[13px] leading-relaxed"
                          style={{ color: brand.neutralColor }}
                        >
                          Your email and password are kept exactly as typed. Reconnect and press
                          Sign in again.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {formError === "error" ? (
                    <div
                      className="np-rise flex items-start gap-3 border px-4 py-4"
                      style={{
                        borderRadius: brand.radius,
                        borderColor: "rgba(159,180,208,0.35)",
                        backgroundColor: "rgba(159,180,208,0.1)",
                      }}
                    >
                      <Icons.AlertCircle
                        aria-hidden="true"
                        className="mt-[2px] h-[18px] w-[18px] shrink-0"
                        style={{ color: brand.neutralColor }}
                      />
                      <p className="text-[14px]" style={{ color: "#e7f4fb" }}>
                        Something went wrong reaching the server. Please try again.
                      </p>
                    </div>
                  ) : null}

                  {done ? (
                    <div
                      className="np-rise flex items-center gap-3 border px-4 py-4"
                      style={{
                        borderRadius: brand.radius,
                        borderColor: "rgba(34,211,238,0.42)",
                        backgroundColor: "rgba(34,211,238,0.1)",
                      }}
                    >
                      <Icons.CheckCircle
                        aria-hidden="true"
                        className="h-[18px] w-[18px] shrink-0"
                        style={{ color: brand.primaryColor }}
                      />
                      <p className="text-[14px]" style={{ color: "#e7f4fb" }}>
                        Signed in. Opening your dashboard.
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* ——— Actions ——— */}
                <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2 sm:items-center">
                  <Button
                    data-wf="b-4-0"
                    type="submit"
                    disabled={busy || done}
                    className="np-cta inline-flex h-12 w-full items-center justify-center gap-2 text-[15px] font-bold"
                    style={{
                      borderRadius: brand.radius,
                      border: "none",
                      color: brand.backgroundColor,
                      background: `linear-gradient(100deg, ${brand.primaryColor} 0%, ${brand.accentColor} 100%)`,
                      boxShadow: "0 14px 40px rgba(34,211,238,0.26)",
                    }}
                  >
                    {busy ? (
                      <React.Fragment>
                        <span
                          aria-hidden="true"
                          className="np-spin h-4 w-4 rounded-full border-2"
                          style={{
                            borderColor: "rgba(6,20,43,0.3)",
                            borderTopColor: brand.backgroundColor,
                          }}
                        />
                        Checking your details…
                      </React.Fragment>
                    ) : done ? (
                      <React.Fragment>
                        <Icons.CheckCircle aria-hidden="true" className="h-[18px] w-[18px]" />
                        Signed in
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        Sign in
                        <Icons.ArrowRight aria-hidden="true" className="h-[18px] w-[18px]" />
                      </React.Fragment>
                    )}
                  </Button>

                  <div className="flex justify-center sm:justify-start">
                    <button
                      data-wf="b-4-1"
                      type="button"
                      onClick={() => navigate("sign-up")}
                      className="np-quiet inline-flex h-12 items-center rounded-full border border-transparent px-4 text-[14px] font-semibold underline decoration-dotted underline-offset-[6px]"
                      style={{ color: brand.primaryColor }}
                    >
                      New here? Create an account
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="px-6 pb-8 pt-7 sm:px-10">
              <div className="w-full">
                <div style={{ borderTop: `1px solid ${line}` }}>
                  <Separator className="opacity-0" />
                </div>
                <div
                  className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 text-[12px]"
                  style={{ color: brand.neutralColor }}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icons.CheckCircle
                      aria-hidden="true"
                      className="h-4 w-4"
                      style={{ color: brand.primaryColor }}
                    />
                    Passwords are stored hashed, never in plain text
                  </span>
                  <span className="inline-flex items-center gap-2">
                    {online ? (
                      <React.Fragment>
                        <Icons.Check
                          aria-hidden="true"
                          className="h-4 w-4"
                          style={{ color: brand.primaryColor }}
                        />
                        Connected
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <Icons.AlertCircle
                          aria-hidden="true"
                          className="h-4 w-4"
                          style={{ color: brand.accentColor }}
                        />
                        Offline — sign-in will retry when you reconnect
                      </React.Fragment>
                    )}
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* ——— Identity panel ——— */}
        <section className="lg:order-1 lg:col-span-5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(140deg, ${brand.primaryColor}, ${brand.accentColor})`,
                boxShadow: "0 12px 34px rgba(232,121,249,0.3)",
              }}
            >
              <Icons.FileText className="h-5 w-5" style={{ color: brand.backgroundColor }} />
            </span>
            <span
              className="np-display text-[15px] font-bold uppercase tracking-[0.26em]"
              style={{ color: "#ffffff" }}
            >
              Expense Tracker
            </span>
          </div>

          {/* Signature motif: the seven-day spending pulse */}
          <div className="mt-8" aria-hidden="true">
            <svg viewBox="0 0 160 44" className="h-11 w-full max-w-[22rem]" role="presentation">
              <defs>
                <linearGradient id="np-pulse-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={brand.primaryColor} />
                  <stop offset="100%" stopColor={brand.accentColor} />
                </linearGradient>
              </defs>
              <polyline
                points={PULSE_POINTS}
                fill="none"
                stroke="url(#np-pulse-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
              />
              <polyline
                className="np-pulse-line"
                points={PULSE_POINTS}
                fill="none"
                stroke="url(#np-pulse-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2
            className="mt-6 text-[26px] font-bold leading-snug sm:text-[28px]"
            style={{ color: "#ffffff" }}
          >
            Pick the month back up
            <span style={{ color: brand.accentColor }}> exactly where you left it.</span>
          </h2>

          <ul className="mt-8 space-y-0">
            {ASSURANCES.map((item, index) => {
              const ItemIcon = item.Icon;
              return (
                <li
                  key={item.key}
                  className="flex gap-4 py-5"
                  style={{ borderTop: index === 0 ? "none" : `1px solid ${line}` }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-[2px] flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                    style={{ borderColor: line, backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <ItemIcon className="h-[18px] w-[18px]" style={{ color: brand.primaryColor }} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold" style={{ color: "#ffffff" }}>
                      {item.title}
                    </p>
                    <p
                      className="mt-1 text-[13px] leading-relaxed"
                      style={{ color: brand.neutralColor }}
                    >
                      {item.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div
            className="mt-6 flex items-start gap-3 border px-4 py-4"
            style={{
              borderRadius: brand.radius,
              borderColor: line,
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          >
            <Icons.User
              aria-hidden="true"
              className="mt-[2px] h-[18px] w-[18px] shrink-0"
              style={{ color: brand.accentColor }}
            />
            <p className="text-[13px] leading-relaxed" style={{ color: brand.neutralColor }}>
              One account, one person. Nobody else on this app can open your expenses, categories or
              budgets — and signing out ends the session on this device straight away.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
