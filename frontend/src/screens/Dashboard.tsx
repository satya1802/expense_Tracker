// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Card, Select, Badge, Table, THead, TBody, TR, TH, TD, Empty } = UI;

const CURRENCY = { code: "USD", symbol: "$" };

const ACCOUNT_EMAIL = "sai.kiron@quorq.ai";

const NEAR_THRESHOLD = 0.8;

const BUDGET_ROWS = [
  { id: "cat_groceries", name: "Groceries", monthly_amount: 400, spent: 420 },
  { id: "cat_rent", name: "Rent", monthly_amount: 850, spent: 650 },
  { id: "cat_transport", name: "Transport", monthly_amount: 150, spent: 123 },
  { id: "cat_dining", name: "Dining out", monthly_amount: 300, spent: 91.5 },
];

const UNBUDGETED = [
  { id: "cat_gifts", name: "Gifts", spent: 45, last_spent_on: "Nov 14, 2026" },
  { id: "cat_subs", name: "Subscriptions", spent: 22.99, last_spent_on: "Nov 3, 2026" },
];

const ALERTS_SEED = [
  {
    id: "alr_8821",
    category_id: "cat_groceries",
    category: "Groceries",
    status: "over",
    spent: 420,
    budget: 400,
    period_month: "2026-11",
    email_sent: false,
    is_read: false,
    created_at: "Nov 18, 6:42 PM",
  },
  {
    id: "alr_8794",
    category_id: "cat_transport",
    category: "Transport",
    status: "near",
    spent: 123,
    budget: 150,
    period_month: "2026-11",
    email_sent: false,
    is_read: false,
    created_at: "Nov 16, 9:15 AM",
  },
];

const toRgb = (hex) => {
  const h = String(hex).replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};
const mixRgb = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgbaOf = (rgb, a) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})`;

const money = (n) =>
  (n < 0 ? "−" : "") +
  CURRENCY.symbol +
  Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const statusOf = (spent, budget) => {
  if (spent > budget) return "over";
  if (spent / budget >= NEAR_THRESHOLD) return "near";
  return "under";
};

export default function Screen() {
  const navigate = useNavigate();
  const P = toRgb(brand.primaryColor);
  const A = toRgb(brand.accentColor);
  const N = toRgb(brand.neutralColor);

  const [alerts, setAlerts] = React.useState(ALERTS_SEED);
  const [activeCat, setActiveCat] = React.useState(null);
  const [announcement, setAnnouncement] = React.useState("");

  const unread = alerts.filter((a) => !a.is_read);

  const totalSpent = BUDGET_ROWS.reduce((s, r) => s + r.spent, 0);
  const totalBudget = BUDGET_ROWS.reduce((s, r) => s + r.monthly_amount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overCount = BUDGET_ROWS.filter(
    (r) => statusOf(r.spent, r.monthly_amount) === "over"
  ).length;
  const nearCount = BUDGET_ROWS.filter(
    (r) => statusOf(r.spent, r.monthly_amount) === "near"
  ).length;

  const catColor = (i) =>
    mixRgb(P, A, BUDGET_ROWS.length === 1 ? 0 : i / (BUDGET_ROWS.length - 1));

  const statusMeta = {
    over: { label: "Over budget", rgb: A, Icon: Icons.AlertCircle },
    near: { label: "Near budget", rgb: mixRgb(P, A, 0.6), Icon: Icons.Bell },
    under: { label: "On track", rgb: P, Icon: Icons.CheckCircle },
  };

  const glass = {
    backgroundColor: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.13)",
    borderRadius: brand.radius,
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
  };

  const hairline = "1px solid rgba(255,255,255,0.12)";
  const bodyText = { color: rgbaOf(N, 1) };

  const markRead = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
    );
    const a = alerts.find((x) => x.id === id);
    setAnnouncement(a ? `${a.category} alert marked as read.` : "");
  };

  const markAllRead = () => {
    const count = unread.length;
    setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
    setAnnouncement(
      count === 1 ? "1 alert marked as read." : `${count} alerts marked as read.`
    );
  };

  // Donut geometry
  let acc = 0;
  const stops = BUDGET_ROWS.map((c, i) => {
    const start = (acc / totalSpent) * 100;
    acc += c.spent;
    const end = (acc / totalSpent) * 100;
    const dimmed = activeCat && activeCat !== c.id;
    const col = rgbaOf(catColor(i), dimmed ? 0.18 : 0.95);
    return `${col} ${start}% ${end}%`;
  }).join(", ");

  const activeRow =
    BUDGET_ROWS.find((r) => r.id === activeCat) || null;

  const css = `
    @keyframes np-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    @keyframes np-glow { 0%, 100% { opacity: .5; } 50% { opacity: 1; } }
    .np-focus:focus-visible { outline: 2px solid ${brand.primaryColor}; outline-offset: 3px; }
    .np-rise { animation: np-rise .34s cubic-bezier(.2,.7,.3,1) both; }
    .np-row { transition: background-color .18s ease; }
    .np-row:hover { background-color: rgba(255,255,255,0.05); }
    .np-bar { transition: width .5s cubic-bezier(.2,.7,.3,1), opacity .25s ease; }
    .np-soft { transition: background-color .2s ease, border-color .2s ease, opacity .25s ease, transform .2s ease; }
    .np-soft:hover { background-color: rgba(255,255,255,0.07); }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation: none !important; transition: none !important; }
    }
  `;

  const PulseBar = ({ pct, rgb, showTick }) => (
    <div
      className="relative mt-2 h-[6px] w-full overflow-hidden"
      style={{
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.09)",
      }}
      aria-hidden="true"
    >
      <div
        className="np-bar h-full"
        style={{
          width: `${Math.min(100, pct)}%`,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${rgbaOf(rgb, 0.55)}, ${rgbaOf(rgb, 1)})`,
          boxShadow: `0 0 18px ${rgbaOf(rgb, 0.55)}`,
        }}
      />
      {showTick ? (
        <div
          className="absolute top-0 h-full"
          style={{
            left: `${NEAR_THRESHOLD * 100}%`,
            width: 2,
            backgroundColor: "rgba(255,255,255,0.45)",
          }}
        />
      ) : null}
    </div>
  );

  const StatusPill = ({ status }) => {
    const m = statusMeta[status];
    const Icon = m.Icon;
    return (
      <span
        className="inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-xs font-semibold"
        style={{
          borderRadius: 999,
          color: rgbaOf(m.rgb, 1),
          backgroundColor: rgbaOf(m.rgb, 0.13),
          border: `1px solid ${rgbaOf(m.rgb, 0.4)}`,
        }}
      >
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {m.label}
      </span>
    );
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[1200px] px-4 pb-16 pt-6 sm:px-6"
      style={{ fontFamily: brand.fontBody }}
    >
      <style>{css}</style>

      {/* ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl"
        style={{ background: rgbaOf(A, 0.18) }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-64 -left-20 h-72 w-72 rounded-full blur-3xl"
        style={{ background: rgbaOf(P, 0.14) }}
      />

      {/* ───────── Row 1 ───────── */}
      <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-9" data-wf="b-0-0">
          <p
            className="text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: rgbaOf(P, 0.95) }}
          >
            Current month
          </p>
          <h1
            className="mt-2 text-[34px] font-bold leading-tight tracking-tight text-white sm:text-[40px]"
            style={{ fontFamily: brand.fontHeading }}
          >
            November 2026 overview
          </h1>
          <p className="mt-2 text-sm" style={bodyText}>
            Private to {ACCOUNT_EMAIL} · amounts in {CURRENCY.code} · updated 2 minutes ago
          </p>
        </div>
        <div className="lg:col-span-3 lg:justify-self-end">
          <Button
            data-wf="b-0-1"
            onClick={() => navigate("expenses")}
            className="np-focus inline-flex h-12 w-full items-center justify-center gap-2 px-6 text-base font-bold lg:w-auto"
            style={{
              borderRadius: brand.radius,
              border: "none",
              color: brand.backgroundColor,
              background: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`,
              boxShadow: `0 10px 44px ${rgbaOf(A, 0.38)}`,
            }}
          >
            <Icons.Plus className="h-5 w-5" aria-hidden="true" />
            Add expense
          </Button>
        </div>
      </div>

      {/* ───────── Row 2 ───────── */}
      <div className="relative mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          data-wf="b-1-0"
          className="np-rise p-6"
          style={{
            ...glass,
            backgroundColor: rgbaOf(P, 0.08),
            borderColor: rgbaOf(P, 0.28),
            boxShadow: `0 0 60px ${rgbaOf(P, 0.16)}`,
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={bodyText}
          >
            Total spent this month
          </p>
          <p
            className="mt-3 text-[44px] font-bold leading-none text-white"
            style={{ fontVariantNumeric: "tabular-nums", fontFamily: brand.fontHeading }}
          >
            {money(totalSpent)}
          </p>
          <p className="mt-3 text-sm" style={bodyText}>
            Across {BUDGET_ROWS.length} budgeted categories · 1–19 Nov
          </p>
        </Card>

        <Card data-wf="b-1-1" className="np-rise p-6" style={glass}>
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={bodyText}
          >
            Budgeted this month
          </p>
          <p
            className="mt-3 text-[44px] font-bold leading-none text-white"
            style={{ fontVariantNumeric: "tabular-nums", fontFamily: brand.fontHeading }}
          >
            {money(totalBudget)}
          </p>
          <PulseBar
            pct={(totalSpent / totalBudget) * 100}
            rgb={P}
            showTick={false}
          />
          <p className="mt-3 text-sm" style={bodyText}>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {money(totalRemaining)}
            </span>{" "}
            left · {Math.round((totalSpent / totalBudget) * 100)}% used
          </p>
        </Card>

        <Card
          data-wf="b-1-2"
          className="np-rise p-6"
          style={{ ...glass, borderColor: rgbaOf(A, 0.3) }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.18em]"
            style={bodyText}
          >
            Budget health
          </p>
          <p
            className="mt-3 text-[44px] font-bold leading-none text-white"
            style={{ fontVariantNumeric: "tabular-nums", fontFamily: brand.fontHeading }}
          >
            {overCount} over · {nearCount} near
          </p>
          <p className="mt-3 text-sm" style={bodyText}>
            {overCount} category over budget, {nearCount} near budget
          </p>
        </Card>
      </div>

      {/* ───────── Row 3 ───────── */}
      <Card data-wf="b-2-0" className="relative mt-4 p-6" style={glass}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: brand.fontHeading }}
            >
              Alerts
            </h2>
            <p className="mt-1 text-sm" style={bodyText}>
              {unread.length > 0
                ? `${unread.length} unread · thresholds hit at ${Math.round(
                    NEAR_THRESHOLD * 100
                  )}% of a monthly budget`
                : "All caught up for November 2026."}
            </p>
          </div>
          <Button
            data-wf="i-2-0-2"
            onClick={markAllRead}
            disabled={unread.length === 0}
            className="np-focus np-soft inline-flex h-11 items-center gap-2 px-4 text-sm font-semibold"
            style={{
              borderRadius: brand.radius,
              backgroundColor:
                unread.length === 0 ? "rgba(255,255,255,0.04)" : rgbaOf(P, 0.12),
              border: `1px solid ${
                unread.length === 0 ? "rgba(255,255,255,0.1)" : rgbaOf(P, 0.4)
              }`,
              color:
                unread.length === 0 ? rgbaOf(N, 0.6) : rgbaOf(P, 1),
              cursor: unread.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            <Icons.Check className="h-4 w-4" aria-hidden="true" />
            {unread.length === 0 ? "All alerts read" : "Mark all as read"}
          </Button>
        </div>

        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>

        <div className="mt-5">
          {alerts.length === 0 ? (
            <Empty
              title="No budget alerts in November"
              description="Nothing has reached 80% of its monthly budget yet. We'll flag a category here the moment it does."
            />
          ) : (
            <ul className="space-y-3">
              {alerts.map((a, idx) => {
                const m = statusMeta[a.status];
                const line = `${a.category} — ${
                  a.status === "over" ? "over budget" : "approaching budget"
                }: ${money(a.spent)} spent of ${money(a.budget)}`;
                return (
                  <li
                    key={a.id}
                    data-wf={idx === 0 ? "i-2-0-0" : idx === 1 ? "i-2-0-1" : undefined}
                    className="np-rise flex flex-wrap items-center gap-4 p-4"
                    style={{
                      borderRadius: brand.radius,
                      border: `1px solid ${
                        a.is_read ? "rgba(255,255,255,0.1)" : rgbaOf(m.rgb, 0.38)
                      }`,
                      backgroundColor: a.is_read
                        ? "rgba(255,255,255,0.03)"
                        : rgbaOf(m.rgb, 0.1),
                      opacity: a.is_read ? 0.66 : 1,
                      transition: "opacity .3s ease, background-color .3s ease",
                    }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center"
                      style={{
                        borderRadius: 999,
                        backgroundColor: rgbaOf(m.rgb, 0.16),
                        border: `1px solid ${rgbaOf(m.rgb, 0.4)}`,
                        boxShadow: a.is_read
                          ? "none"
                          : `0 0 28px ${rgbaOf(m.rgb, 0.4)}`,
                      }}
                    >
                      <Icons.Bell
                        className="h-5 w-5"
                        style={{ color: rgbaOf(m.rgb, 1) }}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-[220px] flex-1">
                      <p
                        className="text-[15px] font-semibold text-white"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {line}
                      </p>
                      <p className="mt-1 text-xs" style={bodyText}>
                        Triggered {a.created_at} ·{" "}
                        {a.email_sent ? "emailed to you" : "email not sent yet"}
                      </p>
                    </div>

                    <StatusPill status={a.status} />

                    {a.is_read ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
                        style={{
                          borderRadius: 999,
                          color: rgbaOf(N, 1),
                          border: "1px solid rgba(255,255,255,0.14)",
                        }}
                      >
                        <Icons.Check className="h-3.5 w-3.5" aria-hidden="true" />
                        Read
                      </span>
                    ) : (
                      <Button
                        onClick={() => markRead(a.id)}
                        aria-label={`Mark the ${a.category} alert as read`}
                        className="np-focus np-soft inline-flex h-10 items-center gap-2 px-3 text-xs font-semibold"
                        style={{
                          borderRadius: brand.radius,
                          backgroundColor: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          color: "#ffffff",
                        }}
                      >
                        <Icons.Check className="h-4 w-4" aria-hidden="true" />
                        Mark as read
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Card>

      {/* ───────── Row 4 ───────── */}
      <div
        data-wf="b-3-0"
        className="relative mt-4 flex flex-wrap items-start gap-3 p-4"
        style={{
          borderRadius: brand.radius,
          border: hairline,
          backgroundColor: "rgba(255,255,255,0.035)",
        }}
      >
        <Icons.AlertCircle
          className="mt-[2px] h-5 w-5 shrink-0"
          style={{ color: rgbaOf(N, 1) }}
          aria-hidden="true"
        />
        <p className="max-w-[72ch] flex-1 text-sm leading-relaxed" style={bodyText}>
          We also email these near-budget and over-budget alerts to {ACCOUNT_EMAIL}.
          Email delivery is currently unavailable — contact your operator, in-app
          alerts continue to appear.
        </p>
        <Badge
          className="shrink-0 px-3 py-1 text-xs font-semibold"
          style={{
            borderRadius: 999,
            color: rgbaOf(N, 1),
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          Email paused
        </Badge>
      </div>

      {/* ───────── Row 5 ───────── */}
      <div className="relative mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card data-wf="b-4-0" className="p-6 lg:col-span-8" style={glass}>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: brand.fontHeading }}
          >
            Budget vs spending this month
          </h2>
          <p className="mt-1 text-sm" style={bodyText}>
            Select a category to open its budget. The tick on each bar marks{" "}
            {Math.round(NEAR_THRESHOLD * 100)}% of the budget.
          </p>

          <div className="mt-5 -mx-2 overflow-x-auto px-2">
            <Table
              className="w-full min-w-[560px] border-collapse text-sm"
              style={{ backgroundColor: "transparent", fontVariantNumeric: "tabular-nums" }}
            >
              <THead>
                <TR style={{ borderBottom: hairline }}>
                  <TH
                    data-wf="i-4-0-0"
                    scope="col"
                    className="py-3 pr-3 text-left text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: rgbaOf(N, 1), backgroundColor: "transparent" }}
                  >
                    Category
                  </TH>
                  <TH
                    data-wf="i-4-0-1"
                    scope="col"
                    className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: rgbaOf(N, 1), backgroundColor: "transparent" }}
                  >
                    Monthly budget
                  </TH>
                  <TH
                    data-wf="i-4-0-2"
                    scope="col"
                    className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: rgbaOf(N, 1), backgroundColor: "transparent" }}
                  >
                    Spent
                  </TH>
                  <TH
                    data-wf="i-4-0-3"
                    scope="col"
                    className="px-3 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: rgbaOf(N, 1), backgroundColor: "transparent" }}
                  >
                    Remaining
                  </TH>
                  <TH
                    data-wf="i-4-0-4"
                    scope="col"
                    className="py-3 pl-3 text-right text-xs font-semibold uppercase tracking-[0.14em]"
                    style={{ color: rgbaOf(N, 1), backgroundColor: "transparent" }}
                  >
                    Status
                  </TH>
                </TR>
              </THead>
              <TBody>
                {BUDGET_ROWS.map((r, i) => {
                  const st = statusOf(r.spent, r.monthly_amount);
                  const m = statusMeta[st];
                  const remaining = r.monthly_amount - r.spent;
                  const dim = activeCat && activeCat !== r.id;
                  return (
                    <TR
                      key={r.id}
                      className="np-row cursor-pointer"
                      onClick={() => navigate("categories-budgets")}
                      style={{
                        borderBottom: hairline,
                        backgroundColor:
                          activeCat === r.id ? rgbaOf(catColor(i), 0.1) : "transparent",
                        opacity: dim ? 0.45 : 1,
                      }}
                    >
                      <TD className="py-4 pr-3 align-middle" style={{ backgroundColor: "transparent" }}>
                        <button
                          type="button"
                          className="np-focus text-left text-[15px] font-semibold text-white"
                          style={{ borderRadius: 8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("categories-budgets");
                          }}
                        >
                          {r.name}
                        </button>
                        <div className="max-w-[220px]">
                          <PulseBar
                            pct={(r.spent / r.monthly_amount) * 100}
                            rgb={m.rgb}
                            showTick
                          />
                        </div>
                      </TD>
                      <TD className="px-3 py-4 text-right align-middle text-white" style={{ backgroundColor: "transparent" }}>
                        {money(r.monthly_amount)}
                      </TD>
                      <TD className="px-3 py-4 text-right align-middle text-white" style={{ backgroundColor: "transparent" }}>
                        {money(r.spent)}
                      </TD>
                      <TD
                        className="px-3 py-4 text-right align-middle font-semibold"
                        style={{
                          backgroundColor: "transparent",
                          color: remaining < 0 ? rgbaOf(A, 1) : "#ffffff",
                        }}
                      >
                        {money(remaining)}
                      </TD>
                      <TD className="py-4 pl-3 text-right align-middle" style={{ backgroundColor: "transparent" }}>
                        <StatusPill status={st} />
                      </TD>
                    </TR>
                  );
                })}
                <TR>
                  <TD className="py-4 pr-3 text-[13px] font-semibold uppercase tracking-[0.14em]" style={{ backgroundColor: "transparent", color: rgbaOf(N, 1) }}>
                    All budgets
                  </TD>
                  <TD className="px-3 py-4 text-right font-bold text-white" style={{ backgroundColor: "transparent" }}>
                    {money(totalBudget)}
                  </TD>
                  <TD className="px-3 py-4 text-right font-bold text-white" style={{ backgroundColor: "transparent" }}>
                    {money(totalSpent)}
                  </TD>
                  <TD className="px-3 py-4 text-right font-bold" style={{ backgroundColor: "transparent", color: rgbaOf(P, 1) }}>
                    {money(totalRemaining)}
                  </TD>
                  <TD className="py-4 pl-3" style={{ backgroundColor: "transparent" }} />
                </TR>
              </TBody>
            </Table>
          </div>
        </Card>

        {/* Chart */}
        <Card data-wf="b-4-1" className="p-6 lg:col-span-4" style={glass}>
          <h2
            className="text-xl font-bold leading-snug text-white"
            style={{ fontFamily: brand.fontHeading }}
          >
            Spending by category — November 2026
          </h2>

          <div className="mt-6 flex justify-center">
            <div
              className="relative h-[184px] w-[184px] rounded-full"
              style={{
                background: `conic-gradient(from -90deg, ${stops})`,
                boxShadow: `0 0 64px ${rgbaOf(activeRow ? A : P, 0.3)}`,
                transition: "box-shadow .3s ease",
              }}
              role="img"
              aria-label={BUDGET_ROWS.map(
                (c) =>
                  `${c.name} ${money(c.spent)}, ${Math.round(
                    (c.spent / totalSpent) * 100
                  )} percent`
              ).join("; ")}
            >
              <div
                className="absolute inset-[26px] flex flex-col items-center justify-center rounded-full"
                style={{ backgroundColor: brand.backgroundColor }}
              >
                <span
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={bodyText}
                >
                  Total
                </span>
                <span
                  className="mt-1 text-[22px] font-bold text-white"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {money(totalSpent)}
                </span>
              </div>
            </div>
          </div>

          <ul className="mt-6 space-y-1">
            {BUDGET_ROWS.map((c, i) => {
              const pct = (c.spent / totalSpent) * 100;
              const on = activeCat === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActiveCat(on ? null : c.id)}
                    className="np-focus np-soft flex w-full items-center gap-3 px-2 py-2 text-left"
                    style={{
                      borderRadius: 12,
                      backgroundColor: on ? rgbaOf(catColor(i), 0.12) : "transparent",
                    }}
                  >
                    <span
                      className="h-3 w-3 shrink-0"
                      style={{
                        borderRadius: 4,
                        backgroundColor: rgbaOf(catColor(i), 1),
                        boxShadow: `0 0 12px ${rgbaOf(catColor(i), 0.7)}`,
                      }}
                      aria-hidden="true"
                    />
                    <span className="flex-1 text-sm font-medium text-white">
                      {c.name}
                    </span>
                    <span
                      className="text-sm font-semibold text-white"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {money(c.spent)}
                    </span>
                    <span
                      className="w-12 text-right text-xs"
                      style={{ ...bodyText, fontVariantNumeric: "tabular-nums" }}
                    >
                      {pct.toFixed(1)}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-xs leading-relaxed" style={bodyText}>
            {activeRow
              ? `Highlighting ${activeRow.name} — ${(
                  (activeRow.spent / totalSpent) *
                  100
                ).toFixed(1)}% of this month's spending.`
              : "Select a slice to highlight it across the month's figures."}
          </p>
        </Card>
      </div>

      {/* ───────── Row 6 ───────── */}
      <div className="relative mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card data-wf="b-5-0" className="p-6" style={glass}>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: brand.fontHeading }}
          >
            Spending without a budget
          </h2>
          <p className="mt-1 text-sm" style={bodyText}>
            These categories have no monthly budget, so there is no budget
            comparison and no alerts for them.
          </p>

          {UNBUDGETED.length === 0 ? (
            <div className="mt-5">
              <Empty
                title="Every category has a budget"
                description="All of your November spending sits inside a monthly budget. Nice work."
              />
            </div>
          ) : (
            <ul className="mt-5">
              {UNBUDGETED.map((c, i) => (
                <li
                  key={c.id}
                  data-wf={i === 0 ? "i-5-0-0" : "i-5-0-1"}
                  className="flex flex-wrap items-center gap-3 py-4"
                  style={{
                    borderTop: i === 0 ? "none" : hairline,
                  }}
                >
                  <div className="flex-1">
                    <p className="text-[15px] font-semibold text-white">
                      {c.name} —{" "}
                      <span style={{ fontVariantNumeric: "tabular-nums" }}>
                        {money(c.spent)}
                      </span>
                    </p>
                    <p className="mt-1 text-xs" style={bodyText}>
                      No budget set · last expense {c.last_spent_on}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate("categories-budgets")}
                    className="np-focus np-soft inline-flex h-10 items-center gap-1.5 px-3 text-xs font-semibold"
                    style={{
                      borderRadius: brand.radius,
                      backgroundColor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      color: "#ffffff",
                    }}
                  >
                    Set a budget
                    <Icons.ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card data-wf="b-5-1" className="p-6" style={glass}>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: brand.fontHeading }}
          >
            Category breakdown — November 2026
          </h2>
          <p className="mt-1 text-sm" style={bodyText}>
            Spending totals only — this summary does not track income.
          </p>

          <ul className="mt-5 space-y-1">
            {BUDGET_ROWS.map((c, i) => {
              const pct = (c.spent / totalSpent) * 100;
              const on = activeCat === c.id;
              return (
                <li key={c.id} data-wf={`i-5-1-${i}`}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActiveCat(on ? null : c.id)}
                    className="np-focus np-soft w-full px-3 py-3 text-left"
                    style={{
                      borderRadius: 12,
                      backgroundColor: on ? rgbaOf(catColor(i), 0.12) : "transparent",
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[15px] font-semibold text-white">
                        {c.name}
                      </span>
                      <span
                        className="text-[15px] font-semibold text-white"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {money(c.spent)}
                      </span>
                    </div>
                    <PulseBar pct={pct} rgb={catColor(i)} showTick={false} />
                    <span className="mt-2 block text-xs" style={{ ...bodyText, fontVariantNumeric: "tabular-nums" }}>
                      {pct.toFixed(1)}% of the month
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4" style={{ borderTop: hairline }}>
            <div className="flex items-baseline justify-between pt-4">
              <span
                className="text-xs font-semibold uppercase tracking-[0.16em]"
                style={bodyText}
              >
                Total spending
              </span>
              <span
                className="text-xl font-bold"
                style={{ color: rgbaOf(P, 1), fontVariantNumeric: "tabular-nums" }}
              >
                {money(totalSpent)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
