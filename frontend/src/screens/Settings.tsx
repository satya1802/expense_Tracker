// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Card, CardHeader, CardContent, Input, Label, Select, Badge, Separator, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Check, FileText, Download, AlertCircle, CheckCircle } = Icons;

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "$" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
];

const RECENT_EXPENSES = [
  { id: "exp_8841", note: "Tesco Metro — weekly shop", category: "Groceries", spent_on: "18 Nov 2026", amount: 84.2 },
  { id: "exp_8836", note: "November rent", category: "Housing", spent_on: "01 Nov 2026", amount: 1240 },
  { id: "exp_8852", note: "Kaffi Vest — flat white", category: "Eating out", spent_on: "19 Nov 2026", amount: 4.6 },
];

const EXPORT_META = {
  rows: 148,
  first: "04 Jan 2026",
  last: "18 Nov 2026",
  size: "11.4 KB",
  columns: ["amount", "category", "spent_on", "note"],
};

const LAST_EXPORT = { file: "expenses-2026-10-02.csv", when: "2 Oct 2026, 11:46", rows: 132 };

const SESSION = { device: "Chrome on macOS · this device", since: "19 Nov 2026, 08:14", idleMinutes: 30 };

export default function Screen() {
  const navigate = useNavigate();
  const [currency, setCurrency] = React.useState("USD");
  const [savedCurrency, setSavedCurrency] = React.useState("USD");
  const [saveState, setSaveState] = React.useState("idle"); // idle | saving | saved | offline
  const [exportState, setExportState] = React.useState("idle"); // idle | preparing | ready | offline
  const [online, setOnline] = React.useState(
    typeof navigator === "undefined" || navigator.onLine !== false
  );

  const timers = React.useRef([]);

  React.useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const after = (ms, fn) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  const dirty = currency !== savedCurrency;
  const active = CURRENCIES.find((c) => c.code === savedCurrency) || CURRENCIES[0];
  const chosen = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const money = (value, code) => {
    try {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(value);
    } catch (e) {
      return code + " " + value.toFixed(2);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!dirty || saveState === "saving") return;
    if (!online) {
      setSaveState("offline");
      return;
    }
    setSaveState("saving");
    after(900, () => {
      setSavedCurrency(currency);
      setSaveState("saved");
    });
  };

  const handleExport = () => {
    if (exportState === "preparing") return;
    if (!online) {
      setExportState("offline");
      return;
    }
    setExportState("preparing");
    after(1300, () => setExportState("ready"));
  };

  const glass = {
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.13)",
    borderRadius: brand.radius,
    backdropFilter: "blur(18px)",
  };
  const hair = "rgba(255,255,255,0.12)";
  const body = { color: brand.neutralColor };
  const gradient = `linear-gradient(100deg, ${brand.primaryColor}, ${brand.accentColor})`;

  const fieldStyle = {
    backgroundColor: "rgba(6,20,43,0.55)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "12px",
    color: "#ffffff",
  };

  return (
    <div
      className="relative min-h-full px-5 sm:px-8 lg:px-10 py-8 sm:py-10"
      style={{
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontBody,
        "--np-primary": brand.primaryColor,
        "--np-accent": brand.accentColor,
      }}
    >
      <style>{`
        @keyframes np-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes np-grow { from { width: 8%; } to { width: 100%; } }
        @keyframes np-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        .np-rise { animation: np-rise .34s cubic-bezier(.2,.7,.3,1) both; }
        .np-bar > span { display:block; height:100%; border-radius:999px; animation: np-grow 1.25s cubic-bezier(.35,0,.2,1) forwards; }
        .np-dot { animation: np-pulse 1.4s ease-in-out infinite; }
        .np-focus:focus-visible { outline: 2px solid var(--np-primary); outline-offset: 3px; }
        .np-row:hover { background-color: rgba(255,255,255,0.04); }
        @media (prefers-reduced-motion: reduce) {
          .np-rise, .np-bar > span, .np-dot { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-10 h-72 w-72 rounded-full"
        style={{ background: brand.primaryColor, opacity: 0.16, filter: "blur(90px)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 right-0 h-80 w-80 rounded-full"
        style={{ background: brand.accentColor, opacity: 0.14, filter: "blur(110px)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* Row 1 */}
        <header data-wf="b-0-0" className="mb-8">
          <p
            className="text-xs uppercase tracking-[0.18em] mb-3"
            style={{ color: brand.accentColor }}
          >
            Your account
          </p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
            style={{ fontFamily: brand.fontHeading }}
          >
            Account settings
          </h1>
          <p className="mt-3 text-base max-w-[62ch] leading-relaxed" style={body}>
            One currency, one export, one way out. Everything here applies only to your own
            expenses, budgets and summaries.
          </p>
          {!online && (
            <div
              className="np-rise mt-5 flex items-start gap-3 px-4 py-3"
              style={{
                borderRadius: brand.radius,
                border: "1px solid rgba(232,121,249,0.35)",
                backgroundColor: "rgba(232,121,249,0.10)",
              }}
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: brand.accentColor }} aria-hidden="true" />
              <p className="text-sm text-white">
                <span className="font-semibold">You&rsquo;re offline.</span>{" "}
                <span style={body}>
                  Your currency choice is kept on this screen and will save as soon as the
                  connection is back.
                </span>
              </p>
            </div>
          )}
        </header>

        <div className="grid grid-cols-12 gap-x-6 gap-y-5">
          {/* Row 2 — left: Account form */}
          <form
            data-wf="b-1-0"
            onSubmit={handleSave}
            className="col-span-12 lg:col-span-7 p-6 sm:p-7"
            style={glass}
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: brand.fontHeading }}
              >
                Account
              </h2>
              <Badge
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "rgba(34,211,238,0.14)",
                  color: brand.primaryColor,
                  border: "1px solid rgba(34,211,238,0.35)",
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Email verified
                </span>
              </Badge>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="account-email" className="text-sm font-semibold text-white">
                  Email address
                </Label>
                <Input
                  data-wf="i-1-0-0"
                  id="account-email"
                  name="email"
                  type="email"
                  value="sai.kiron@quorq.ai"
                  readOnly
                  aria-describedby="account-email-help"
                  className="np-focus mt-2 w-full h-12 px-4 text-base"
                  style={{ ...fieldStyle, fontVariantNumeric: "tabular-nums" }}
                />
                <p id="account-email-help" className="mt-2 text-xs" style={body}>
                  This is the address you sign in with and where budget alerts are sent.
                </p>
              </div>

              <div>
                <Label htmlFor="currency-code" className="text-sm font-semibold text-white">
                  Currency (USD
                </Label>
                <Select
                  data-wf="i-1-0-1"
                  id="currency-code"
                  name="currency_code"
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    setSaveState("idle");
                  }}
                  aria-describedby="currency-help"
                  className="np-focus mt-2 w-full h-12 px-4 text-base"
                  style={fieldStyle}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} style={{ color: "#06142b" }}>
                      {c.code} — {c.name}
                    </option>
                  ))}
                </Select>
                <p id="currency-help" className="mt-2 text-xs" style={body}>
                  Currently saved: <span className="text-white font-medium">{active.code} — {active.name}</span>
                </p>
              </div>

              {/* Signature: live amount preview */}
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: "14px",
                  border: "1px solid " + hair,
                  backgroundColor: "rgba(6,20,43,0.45)",
                }}
              >
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderBottom: "1px solid " + hair }}
                >
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: brand.accentColor }}>
                    How your amounts will read
                  </h3>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ color: "#ffffff", border: "1px solid " + hair, fontVariantNumeric: "tabular-nums" }}
                  >
                    {chosen.symbol} {chosen.code}
                  </span>
                </div>
                <ul className="divide-y" style={{ borderColor: hair, fontVariantNumeric: "tabular-nums" }}>
                  {RECENT_EXPENSES.map((x) => (
                    <li key={x.id} className="np-row flex items-center justify-between gap-4 px-4 py-3 transition-colors">
                      <span className="min-w-0">
                        <span className="block text-sm text-white truncate">{x.note}</span>
                        <span className="block text-xs mt-0.5" style={body}>
                          {x.category} · {x.spent_on}
                        </span>
                      </span>
                      <span className="text-base font-semibold text-white shrink-0">
                        {money(x.amount, currency)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </form>

          {/* Row 2 — right: Data export card */}
          <Card
            data-wf="b-1-1"
            className="col-span-12 lg:col-span-5 p-6 sm:p-7"
            style={glass}
          >
            <CardHeader className="p-0 mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: brand.fontHeading }}>
                Data export
              </h2>
              <Download className="h-5 w-5" style={{ color: brand.primaryColor }} aria-hidden="true" />
            </CardHeader>
            <CardContent className="p-0">
              {EXPORT_META.rows === 0 ? (
                <Empty
                  title="Nothing to export yet"
                  description="Log your first expense and the CSV will be ready the moment you need it."
                  action={
                    <Button
                      type="button"
                      onClick={() => navigate("expenses")}
                      className="np-focus rounded-full px-4 h-10 font-semibold"
                      style={{ background: gradient, color: brand.backgroundColor }}
                    >
                      Add an expense
                    </Button>
                  }
                />
              ) : (
                <div>
                  <p
                    className="text-5xl font-extrabold text-white leading-none"
                    style={{ fontVariantNumeric: "tabular-nums", fontFamily: brand.fontHeading }}
                  >
                    {EXPORT_META.rows}
                  </p>
                  <p className="mt-2 text-sm" style={body}>
                    expenses ready · {EXPORT_META.first} – {EXPORT_META.last}
                  </p>

                  <div className="my-5" style={{ borderTop: "1px solid " + hair }} />

                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-3" style={{ color: brand.accentColor }}>
                    Columns in the file
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {EXPORT_META.columns.map((col) => (
                      <li
                        key={col}
                        className="text-xs font-medium px-3 py-1.5 rounded-full text-white"
                        style={{ border: "1px solid " + hair, backgroundColor: "rgba(255,255,255,0.05)" }}
                      >
                        {col}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-xs" style={body}>
                    Last export: <span className="text-white">{LAST_EXPORT.file}</span> · {LAST_EXPORT.when} ·{" "}
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{LAST_EXPORT.rows} rows</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Row 3 — supporting copy */}
          <p
            data-wf="b-2-0"
            className="col-span-12 lg:col-span-7 text-sm leading-relaxed max-w-[68ch]"
            style={body}
          >
            All expenses, budgets and summaries are shown in this single currency. No conversion is
            applied to amounts you have already entered.
          </p>
          <p
            data-wf="b-2-1"
            className="col-span-12 lg:col-span-5 text-sm leading-relaxed"
            style={body}
          >
            Download a CSV of your own expenses with their amount, category and date.
          </p>

          {/* Row 4 — actions */}
          <div className="col-span-12 lg:col-span-4">
            <Button
              data-wf="b-3-0"
              type="submit"
              form="none"
              onClick={handleSave}
              disabled={!dirty || saveState === "saving"}
              aria-describedby="save-currency-status"
              className="np-focus w-full h-14 rounded-full text-base font-bold transition-all duration-200"
              style={
                dirty && saveState !== "saving"
                  ? {
                      background: gradient,
                      color: brand.backgroundColor,
                      boxShadow: "0 18px 48px -12px rgba(232,121,249,0.55)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.07)",
                      color: brand.neutralColor,
                      border: "1px solid " + hair,
                      cursor: saveState === "saving" ? "progress" : "not-allowed",
                    }
              }
            >
              {saveState === "saving" ? (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="np-dot h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: brand.primaryColor }}
                    aria-hidden="true"
                  />
                  Saving currency…
                </span>
              ) : (
                "Save currency"
              )}
            </Button>

            <div id="save-currency-status" role="status" aria-live="polite" className="mt-3">
              {saveState === "saved" && (
                <p className="np-rise flex items-start gap-2 text-sm" style={{ color: brand.primaryColor }}>
                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>
                    Saved. Every amount now reads in {active.code} — {active.name}. The figures
                    themselves were left untouched.
                  </span>
                </p>
              )}
              {saveState === "offline" && (
                <p className="np-rise flex items-start gap-2 text-sm text-white">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: brand.accentColor }} aria-hidden="true" />
                  <span>
                    Couldn&rsquo;t reach your account — the device is offline. Your pick of{" "}
                    {chosen.code} is still selected; press Save currency again once you reconnect.
                  </span>
                </p>
              )}
              {saveState === "idle" && !dirty && (
                <p className="text-xs" style={body}>
                  Choose a different currency to enable saving.
                </p>
              )}
              {saveState === "idle" && dirty && (
                <p className="text-xs" style={body}>
                  Unsaved change: {active.code} → <span className="text-white font-medium">{chosen.code}</span>
                </p>
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-start-8 lg:col-span-5">
            <Button
              data-wf="b-3-1"
              type="button"
              onClick={handleExport}
              disabled={exportState === "preparing" || EXPORT_META.rows === 0}
              aria-describedby="export-status"
              className="np-focus w-full h-14 rounded-full text-base font-bold transition-all duration-200"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                color: "#ffffff",
                border: "1px solid rgba(34,211,238,0.45)",
                cursor: exportState === "preparing" ? "progress" : "pointer",
              }}
            >
              <span className="inline-flex items-center gap-2">
                <Download className="h-4 w-4" aria-hidden="true" />
                {exportState === "preparing" ? "Building your CSV…" : "Export expenses (CSV)"}
              </span>
            </Button>

            <div id="export-status" role="status" aria-live="polite" className="mt-3">
              {exportState === "preparing" && (
                <div className="np-rise">
                  <div
                    className="np-bar h-1.5 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
                    aria-hidden="true"
                  >
                    <span style={{ background: gradient }} />
                  </div>
                  <p className="mt-2 text-xs" style={body}>
                    Gathering {EXPORT_META.rows} expenses from your account only.
                  </p>
                </div>
              )}
              {exportState === "ready" && (
                <div
                  className="np-rise flex items-start gap-3 px-4 py-3"
                  style={{
                    borderRadius: "14px",
                    border: "1px solid rgba(34,211,238,0.35)",
                    backgroundColor: "rgba(34,211,238,0.09)",
                  }}
                >
                  <FileText className="h-5 w-5 mt-0.5 shrink-0" style={{ color: brand.primaryColor }} aria-hidden="true" />
                  <p className="text-sm text-white">
                    <span className="font-semibold">expenses-2026-11-19.csv</span> saved to your
                    downloads —{" "}
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>
                      {EXPORT_META.rows} rows · {EXPORT_META.size}
                    </span>
                    <span className="block mt-1" style={body}>
                      Amounts are written in {active.code}, exactly as entered.
                    </span>
                  </p>
                </div>
              )}
              {exportState === "offline" && (
                <p className="np-rise flex items-start gap-2 text-sm text-white">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: brand.accentColor }} aria-hidden="true" />
                  <span>The export needs a connection and this device is offline. Nothing was lost — try again when you&rsquo;re back.</span>
                </p>
              )}
              {exportState === "idle" && (
                <p className="text-xs" style={body}>
                  The file contains only your account&rsquo;s data.
                </p>
              )}
            </div>
          </div>

          {/* Row 5 — sign out */}
          <div className="col-span-12 mt-6">
            <Separator className="opacity-20" />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Button
              data-wf="b-4-0"
              type="button"
              onClick={() => navigate("sign-in")}
              className="np-focus w-full h-13 min-h-[52px] rounded-full text-base font-semibold text-white transition-colors duration-200 hover:bg-white/10"
              style={{ backgroundColor: "transparent", border: "1px solid " + hair }}
            >
              Sign out
            </Button>
            <p className="mt-3 text-xs leading-relaxed" style={body}>
              {SESSION.device} · signed in {SESSION.since}. Sessions end automatically after{" "}
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{SESSION.idleMinutes}</span>{" "}
              minutes of inactivity, and you&rsquo;ll be asked to sign in again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
