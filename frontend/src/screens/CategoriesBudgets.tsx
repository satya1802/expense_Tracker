// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { ApiError, apiFetch } from "@/lib/api";

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
  Badge,
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
  Empty,
} = UI;

const PERIOD_LABEL = "November 2026";
const CURRENCY_CODE = "USD";

function formatMoney(value) {
  return (
    "$" +
    Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

function statusOf(category) {
  if (category.monthly_amount === null || category.monthly_amount === undefined) {
    return { key: "none", label: "No budget set", ratio: null };
  }
  const ratio = category.monthly_amount > 0 ? category.spent / category.monthly_amount : 0;
  if (category.spent > category.monthly_amount) return { key: "over", label: "Over budget", ratio };
  if (ratio >= 0.8) return { key: "near", label: "Near budget", ratio };
  return { key: "under", label: "Under budget", ratio };
}

// The categories API (GET /categories) returns only {id, name, is_default}. Budget
// amounts and spend are out of scope for this ticket (a separate budgets endpoint),
// so a freshly loaded or newly created category always starts with no budget and no
// recorded spend; the budgets ticket is responsible for wiring those in.
function toRow(apiCategory) {
  return {
    id: apiCategory.id,
    name: apiCategory.name,
    is_default: apiCategory.is_default,
    monthly_amount: null,
    spent: 0,
    expense_count: 0,
  };
}

export default function Screen() {
  const navigate = useNavigate();
  // Colour roles: brand primary (cyan) carries "on track", the direction's crimson
  // carries over-budget, amber carries the near-budget warning. Accent is reserved
  // for the one primary action and for custom-category identity.
  const TONE = {
    under: brand.primaryColor,
    near: "#f5b041",
    over: "#f2577d",
    none: brand.neutralColor,
  };
  const SURFACE = "rgba(255,255,255,0.06)";
  const SURFACE_2 = "rgba(255,255,255,0.09)";
  const HAIRLINE = "1px solid rgba(255,255,255,0.13)";
  const TEXT = "rgba(255,255,255,0.94)";

  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editor, setEditor] = React.useState(null);
  const [errors, setErrors] = React.useState({ name: null, budget: null });
  const [saving, setSaving] = React.useState(false);
  const [flashId, setFlashId] = React.useState(null);
  const [notice, setNotice] = React.useState({
    tone: "info",
    text: "Budgets run monthly — on 1 December your spend counters reset and these amounts carry over.",
  });

  const timers = React.useRef([]);
  const panelRef = React.useRef(null);
  const nameRef = React.useRef(null);
  const budgetRef = React.useRef(null);

  const after = React.useCallback((ms, fn) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  }, []);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // AC-016: load the signed-in user's categories on mount. A 401 is handled
  // globally by apiFetch (clears the token and redirects to sign-in); any other
  // failure just leaves the list empty with a notice rather than seeded data.
  React.useEffect(() => {
    let active = true;
    apiFetch("/categories")
      .then((result) => {
        if (!active) return;
        setCategories((result.categories || []).map(toRow));
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setLoading(false);
        if (!(err instanceof ApiError && err.status === 401)) {
          setNotice({
            tone: "error",
            text: "Couldn't load your categories — check your connection and try again.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const current =
    editor && editor.mode === "edit" ? categories.find((c) => c.id === editor.id) : null;
  const isNew = !!editor && editor.mode === "new";
  const isDefaultCat = !!current && current.is_default;

  // Focus the first usable field whenever the editor opens or changes record.
  React.useEffect(() => {
    if (!editor) return;
    const t = setTimeout(() => {
      if (isDefaultCat) {
        if (budgetRef.current) budgetRef.current.focus();
      } else if (nameRef.current) {
        nameRef.current.focus();
      }
    }, 40);
    return () => clearTimeout(t);
  }, [editor && editor.id, editor && editor.mode]);

  React.useEffect(() => {
    if (!editor) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeEditor();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editor]);

  function closeEditor() {
    setEditor(null);
    setErrors({ name: null, budget: null });
    setSaving(false);
  }

  function openNew() {
    setErrors({ name: null, budget: null });
    setEditor({ mode: "new", id: null, name: "", budget: "", pendingDelete: false });
  }

  function openEdit(cat, pendingDelete) {
    setErrors({ name: null, budget: null });
    setEditor({
      mode: "edit",
      id: cat.id,
      name: cat.name,
      budget: cat.monthly_amount === null ? "" : String(cat.monthly_amount),
      pendingDelete: !!pendingDelete,
    });
  }

  function trapTab(e) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const nodes = Array.prototype.slice
      .call(panelRef.current.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])'))
      .filter((n) => !n.disabled && n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function flash(id) {
    setFlashId(id);
    after(1900, () => setFlashId(null));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!editor || saving) return;
    const nextErrors = { name: null, budget: null };
    const trimmed = editor.name.trim();
    const nameEditable = isNew || !isDefaultCat;

    if (nameEditable) {
      // AC-018: a blank name is blocked client-side before any call is made.
      if (!trimmed) {
        nextErrors.name = "Give the category a name — it can’t be blank.";
      } else {
        const clash = categories.find(
          (c) => c.name.toLowerCase() === trimmed.toLowerCase() && c.id !== editor.id,
        );
        if (clash) {
          nextErrors.name =
            "You already have a category called “" + clash.name + "”. Pick a different name.";
        }
      }
    }

    const raw = editor.budget.trim().replace(/[$,]/g, "");
    let budgetValue = null;
    if (raw !== "") {
      const parsed = Number(raw);
      if (!isFinite(parsed) || raw.match(/[^0-9.]/)) {
        nextErrors.budget = "Enter the budget as a plain number, like 250 or 250.00.";
      } else if (parsed <= 0) {
        nextErrors.budget =
          "A monthly budget has to be more than 0. Use Clear budget to remove it instead.";
      } else {
        budgetValue = Math.round(parsed * 100) / 100;
      }
    }

    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.budget) {
      setNotice({
        tone: "error",
        text: "That category wasn’t saved — check the highlighted field in the editor. Nothing you typed was lost.",
      });
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        // AC-017: POST /categories; on 201 the list gains the new row.
        const created = await apiFetch("/categories", {
          method: "POST",
          body: JSON.stringify({ name: trimmed }),
        });
        const row = { ...toRow(created), monthly_amount: budgetValue };
        setCategories((prev) => prev.concat([row]));
        flash(row.id);
        setNotice({
          tone: "success",
          text:
            "“" +
            trimmed +
            "” added as a custom category" +
            (budgetValue !== null
              ? " with a " + formatMoney(budgetValue) + " monthly budget."
              : " — no budget set yet."),
        });
      } else if (nameEditable && trimmed !== current.name) {
        const updated = await apiFetch("/categories/" + editor.id, {
          method: "PATCH",
          body: JSON.stringify({ name: trimmed }),
        });
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editor.id ? { ...c, name: updated.name, monthly_amount: budgetValue } : c,
          ),
        );
        flash(editor.id);
        setNotice({
          tone: "success",
          text:
            updated.name +
            " saved — " +
            (budgetValue !== null
              ? "budget for " + PERIOD_LABEL + " is " + formatMoney(budgetValue) + "."
              : "no monthly budget is set, so it won’t show a comparison."),
        });
      } else {
        // Only the (locally-held) budget amount changed — nothing to send.
        setCategories((prev) =>
          prev.map((c) => (c.id === editor.id ? { ...c, monthly_amount: budgetValue } : c)),
        );
        flash(editor.id);
        setNotice({
          tone: "success",
          text:
            current.name +
            " saved — " +
            (budgetValue !== null
              ? "budget for " + PERIOD_LABEL + " is " + formatMoney(budgetValue) + "."
              : "no monthly budget is set, so it won’t show a comparison."),
        });
      }
      setSaving(false);
      setEditor(null);
    } catch (err) {
      setSaving(false);
      // AC-018: a 409 renders the duplicate-name validation message without
      // adding a row (or renaming the existing one).
      if (err instanceof ApiError && err.status === 409) {
        setErrors({
          ...nextErrors,
          name: (err.body && err.body.detail) || "You already have a category with that name",
        });
        setNotice({
          tone: "error",
          text: "That category wasn’t saved — check the highlighted field in the editor. Nothing you typed was lost.",
        });
        return;
      }
      if (err instanceof ApiError && err.status === 422) {
        const message =
          (err.body && Array.isArray(err.body.detail) && err.body.detail[0]?.message) ||
          "Name is required";
        setErrors({ ...nextErrors, name: message });
        setNotice({
          tone: "error",
          text: "That category wasn’t saved — check the highlighted field in the editor. Nothing you typed was lost.",
        });
        return;
      }
      if (!(err instanceof ApiError && err.status === 401)) {
        setNotice({
          tone: "error",
          text: "Couldn't save that category — check your connection and try again.",
        });
      }
    }
  }

  function handleClearBudget() {
    if (!current || current.monthly_amount === null) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === current.id ? { ...c, monthly_amount: null } : c)),
    );
    flash(current.id);
    setNotice({
      tone: "info",
      text:
        "Budget cleared for " +
        current.name +
        " — it no longer shows a budget comparison or near/over alerts.",
    });
    setEditor(null);
  }

  async function handleDelete() {
    if (!current || current.is_default) return;
    if (!editor.pendingDelete) {
      setEditor({ ...editor, pendingDelete: true });
      return;
    }
    setSaving(true);
    try {
      await apiFetch("/categories/" + current.id, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== current.id));
      setNotice({
        tone: "info",
        text:
          current.name +
          " deleted. Its " +
          current.expense_count +
          " expense" +
          (current.expense_count === 1 ? "" : "s") +
          " stay in your history and now show as Uncategorised.",
      });
      setSaving(false);
      setEditor(null);
    } catch (err) {
      setSaving(false);
      if (!(err instanceof ApiError && err.status === 401)) {
        setNotice({
          tone: "error",
          text: "Couldn't delete that category — check your connection and try again.",
        });
      }
    }
  }

  const budgetedCount = categories.filter((c) => c.monthly_amount !== null).length;
  const totalBudget = categories.reduce((s, c) => s + (c.monthly_amount || 0), 0);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);

  const noticeTone =
    notice.tone === "success"
      ? brand.primaryColor
      : notice.tone === "error"
        ? TONE.over
        : brand.neutralColor;

  const css = `
    @keyframes np-row-in { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
    @keyframes np-panel-in { from { opacity: 0; transform: translateY(14px) scale(.985); } to { opacity: 1; transform: none; } }
    @keyframes np-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes np-flash { 0% { background-color: rgba(34,211,238,.20); } 100% { background-color: rgba(34,211,238,0); } }
    @keyframes np-spin { to { transform: rotate(360deg); } }
    .np-focus:focus-visible { outline: 2px solid ${brand.accentColor}; outline-offset: 2px; }
    .np-row { animation: np-row-in .3s ease both; }
    .np-flash td, .np-flash div.np-mobile { animation: np-flash 1.9s ease-out both; }
    .np-panel { animation: np-panel-in .22s cubic-bezier(.2,.8,.25,1) both; }
    .np-backdrop { animation: np-fade-in .18s ease both; }
    .np-bar > span { transition: width .55s cubic-bezier(.2,.7,.2,1); }
    .np-spin { animation: np-spin .8s linear infinite; }
    .np-link:hover { color: ${brand.accentColor}; }
    .np-rowbtn:hover { background-color: rgba(255,255,255,0.10); }
    @media (prefers-reduced-motion: reduce) {
      .np-row, .np-panel, .np-backdrop, .np-flash td, .np-flash div.np-mobile, .np-spin { animation: none !important; }
      .np-bar > span { transition: none !important; }
    }
  `;

  const StatusCell = ({ cat, compact }) => {
    const s = statusOf(cat);
    const tone = TONE[s.key];
    const pct = s.ratio === null ? null : Math.round(s.ratio * 100);
    return (
      <div className={compact ? "" : "min-w-[150px]"}>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{
            color: tone,
            backgroundColor: s.key === "none" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.07)",
            border: "1px solid " + (s.key === "none" ? "rgba(255,255,255,0.12)" : tone + "55"),
          }}
        >
          {s.key === "under" ? (
            <Icons.CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
          ) : s.key === "none" ? (
            <span aria-hidden="true" className="text-[14px] leading-none">
              –
            </span>
          ) : (
            <Icons.AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {s.label}
        </span>
        {pct !== null ? (
          <div className="mt-2">
            <div
              className="np-bar h-1.5 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
            >
              <span
                className="block h-full rounded-full"
                style={{
                  width: Math.min(100, pct) + "%",
                  background:
                    s.key === "under"
                      ? "linear-gradient(90deg, " +
                        brand.primaryColor +
                        ", " +
                        brand.accentColor +
                        ")"
                      : tone,
                  boxShadow: "0 0 12px " + tone + "66",
                }}
              />
            </div>
            <p
              className="mt-1 text-[11px]"
              style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}
            >
              {pct}% of budget
              {s.key === "over"
                ? " · " + formatMoney(cat.spent - cat.monthly_amount) + " over"
                : ""}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-[11px]" style={{ color: brand.neutralColor }}>
            Spending tracked, no comparison
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
      style={{ fontFamily: brand.fontBody, color: TEXT }}
    >
      <style>{css}</style>

      {/* Ambient glows — the signature neon wash behind the ledger */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-28 -left-24 h-72 w-72 rounded-full"
          style={{
            background: "radial-gradient(circle, " + brand.primaryColor + "2e, transparent 65%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute -top-16 right-0 h-80 w-80 rounded-full"
          style={{
            background: "radial-gradient(circle, " + brand.accentColor + "2b, transparent 65%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Row 1 — title + primary action */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div data-wf="b-0-0" className="sm:w-9/12">
          <p
            className="text-[12px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: brand.accentColor }}
          >
            {PERIOD_LABEL} · {CURRENCY_CODE}
          </p>
          <h1
            className="mt-2 text-[34px] font-extrabold leading-tight tracking-tight sm:text-[40px]"
            style={{ fontFamily: brand.fontHeading }}
          >
            Categories &amp; budgets
          </h1>
          <p
            className="mt-2 max-w-[62ch] text-[15px] leading-relaxed"
            style={{ color: brand.neutralColor }}
          >
            Your starter categories are ready to use. Add your own, rename the ones you made, and
            set a monthly cap wherever you want to be warned before you overspend.
          </p>
        </div>
        <div className="sm:w-3/12 sm:text-right">
          <Button
            data-wf="b-0-1"
            type="button"
            onClick={openNew}
            className="np-focus inline-flex w-full items-center justify-center gap-2 px-5 py-3 text-[15px] font-bold sm:w-auto"
            style={{
              background:
                "linear-gradient(100deg, " + brand.primaryColor + ", " + brand.accentColor + ")",
              color: brand.backgroundColor,
              borderRadius: brand.radius,
              border: "none",
              boxShadow: "0 18px 44px " + brand.accentColor + "45",
            }}
          >
            <Icons.Plus className="h-4 w-4" aria-hidden="true" />
            New category
          </Button>
        </div>
      </div>

      {/* Row 2 — the ledger */}
      <Card
        data-wf="b-1-0"
        className="relative mt-8 overflow-hidden"
        style={{
          backgroundColor: SURFACE,
          border: HAIRLINE,
          borderRadius: brand.radius,
          backdropFilter: "blur(14px)",
        }}
      >
        <CardHeader className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-start sm:justify-between sm:px-7 sm:pt-6">
          <div>
            <CardTitle
              className="text-[20px] font-bold"
              style={{ fontFamily: brand.fontHeading, color: TEXT }}
            >
              Your categories — {PERIOD_LABEL}
            </CardTitle>
            <CardDescription className="mt-1 text-[13px]" style={{ color: brand.neutralColor }}>
              {categories.length} categories · {budgetedCount} budgeted ·{" "}
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatMoney(totalBudget)}</span>{" "}
              budgeted vs{" "}
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{formatMoney(totalSpent)}</span>{" "}
              spent
            </CardDescription>
          </div>
        </CardHeader>

        <div className="px-5 pb-1 sm:px-7">
          <p
            role="status"
            aria-live="polite"
            className="flex items-start gap-2 rounded-2xl px-4 py-3 text-[13px] leading-relaxed"
            style={{
              color: notice.tone === "info" ? brand.neutralColor : noticeTone,
              backgroundColor: "rgba(255,255,255,0.05)",
              border:
                "1px solid " +
                (notice.tone === "info" ? "rgba(255,255,255,0.12)" : noticeTone + "55"),
              borderRadius: brand.radius,
            }}
          >
            {notice.tone === "success" ? (
              <Icons.CheckCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : notice.tone === "error" ? (
              <Icons.AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <Icons.Calendar className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{notice.text}</span>
          </p>
        </div>

        <CardContent className="px-0 pb-2 pt-4 sm:px-2">
          {loading ? (
            <div className="px-5 pb-8 pt-2 sm:px-5">
              <p className="text-[14px]" style={{ color: brand.neutralColor }}>
                Loading your categories…
              </p>
            </div>
          ) : categories.length === 0 ? (
            <div className="px-5 pb-8 pt-2 sm:px-5">
              <Empty
                title="No categories left"
                description="You removed every category. Create one — like Groceries or Transport — and it will be ready the next time you log an expense."
                action={
                  <Button
                    type="button"
                    onClick={openNew}
                    className="np-focus inline-flex items-center gap-2 px-5 py-2.5 text-[14px] font-bold"
                    style={{
                      background:
                        "linear-gradient(100deg, " +
                        brand.primaryColor +
                        ", " +
                        brand.accentColor +
                        ")",
                      color: brand.backgroundColor,
                      borderRadius: brand.radius,
                      border: "none",
                    }}
                  >
                    <Icons.Plus className="h-4 w-4" aria-hidden="true" />
                    New category
                  </Button>
                }
              />
            </div>
          ) : (
            <Table className="w-full text-left" style={{ fontVariantNumeric: "tabular-nums" }}>
              <THead>
                <TR style={{ borderBottom: HAIRLINE }}>
                  <TH
                    data-wf="i-1-0-0"
                    scope="col"
                    className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] sm:px-6"
                    style={{ color: brand.neutralColor }}
                  >
                    Category
                  </TH>
                  <TH
                    data-wf="i-1-0-1"
                    scope="col"
                    className="hidden px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] md:table-cell"
                    style={{ color: brand.neutralColor }}
                  >
                    Type
                  </TH>
                  <TH
                    data-wf="i-1-0-2"
                    scope="col"
                    className="hidden px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em] sm:table-cell"
                    style={{ color: brand.neutralColor }}
                  >
                    Monthly budget
                  </TH>
                  <TH
                    data-wf="i-1-0-3"
                    scope="col"
                    className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: brand.neutralColor }}
                  >
                    Spent this month
                  </TH>
                  <TH
                    data-wf="i-1-0-4"
                    scope="col"
                    className="hidden px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] lg:table-cell"
                    style={{ color: brand.neutralColor }}
                  >
                    Status
                  </TH>
                  <TH
                    data-wf="i-1-0-5"
                    scope="col"
                    className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em] sm:px-6"
                    style={{ color: brand.neutralColor }}
                  >
                    Actions
                  </TH>
                </TR>
              </THead>
              <TBody>
                {categories.map((cat) => {
                  const s = statusOf(cat);
                  return (
                    <TR
                      key={cat.id}
                      className={"np-row " + (flashId === cat.id ? "np-flash" : "")}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <TD className="px-5 py-4 align-top sm:px-6">
                        <span className="block text-[15px] font-semibold" style={{ color: TEXT }}>
                          {cat.name}
                        </span>
                        <div className="np-mobile mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 lg:hidden">
                          <span
                            className="text-[12px] md:hidden"
                            style={{
                              color: cat.is_default ? brand.neutralColor : brand.accentColor,
                            }}
                          >
                            {cat.is_default ? "Default" : "Custom"}
                          </span>
                          <span
                            className="text-[12px] sm:hidden"
                            style={{ color: brand.neutralColor }}
                          >
                            {cat.monthly_amount === null
                              ? "No budget"
                              : formatMoney(cat.monthly_amount) + " / month"}
                          </span>
                          <span
                            className="text-[12px] font-semibold lg:hidden"
                            style={{ color: TONE[s.key] }}
                          >
                            {s.label}
                          </span>
                        </div>
                        <span
                          className="mt-1 hidden text-[12px] lg:block"
                          style={{ color: brand.neutralColor }}
                        >
                          {cat.expense_count} expense{cat.expense_count === 1 ? "" : "s"} this month
                        </span>
                      </TD>
                      <TD className="hidden px-4 py-4 align-top md:table-cell">
                        <Badge
                          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{
                            color: cat.is_default ? brand.neutralColor : brand.accentColor,
                            backgroundColor: cat.is_default
                              ? "rgba(255,255,255,0.05)"
                              : brand.accentColor + "1f",
                            border:
                              "1px solid " +
                              (cat.is_default
                                ? "rgba(255,255,255,0.14)"
                                : brand.accentColor + "55"),
                          }}
                        >
                          {cat.is_default ? "Default" : "Custom"}
                        </Badge>
                      </TD>
                      <TD
                        className="hidden px-4 py-4 text-right align-top text-[15px] sm:table-cell"
                        style={{ color: TEXT }}
                      >
                        {cat.monthly_amount === null ? (
                          <span style={{ color: brand.neutralColor }}>—</span>
                        ) : (
                          formatMoney(cat.monthly_amount)
                        )}
                      </TD>
                      <TD className="px-4 py-4 text-right align-top">
                        <span className="text-[17px] font-bold" style={{ color: TEXT }}>
                          {formatMoney(cat.spent)}
                        </span>
                      </TD>
                      <TD className="hidden px-4 py-4 align-top lg:table-cell">
                        <StatusCell cat={cat} />
                      </TD>
                      <TD className="px-5 py-4 text-right align-top sm:px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            onClick={() => openEdit(cat, false)}
                            className="np-focus np-rowbtn inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.06)",
                              color: TEXT,
                              border: HAIRLINE,
                              borderRadius: "999px",
                            }}
                          >
                            <Icons.Edit className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            aria-label={
                              cat.is_default
                                ? "Delete " + cat.name + " — default categories cannot be deleted"
                                : "Delete " + cat.name
                            }
                            title={
                              cat.is_default
                                ? "Default categories can’t be deleted"
                                : "Delete " + cat.name
                            }
                            disabled={cat.is_default}
                            onClick={() => openEdit(cat, true)}
                            className="np-focus np-rowbtn inline-flex h-9 w-9 items-center justify-center"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.04)",
                              color: cat.is_default ? "rgba(159,180,208,0.45)" : TONE.over,
                              border: HAIRLINE,
                              borderRadius: "999px",
                              cursor: cat.is_default ? "not-allowed" : "pointer",
                            }}
                          >
                            <Icons.Trash className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          )}
        </CardContent>

        {categories.length > 0 ? (
          <CardFooter className="px-5 pb-5 pt-2 sm:px-7">
            <p className="text-[12px]" style={{ color: brand.neutralColor }}>
              Default categories can hold a budget but keep their names, so your past expenses stay
              readable.
            </p>
          </CardFooter>
        ) : null}
      </Card>

      {/* Rows 3–7 — the editor */}
      {editor ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <div
            className="np-backdrop absolute inset-0"
            style={{ backgroundColor: "rgba(3,10,22,0.74)", backdropFilter: "blur(6px)" }}
            aria-hidden="true"
            onClick={closeEditor}
          />
          <div
            data-wf="b-2-0"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="np-editor-title"
            onKeyDown={trapTab}
            className="np-panel relative max-h-[92vh] w-full overflow-y-auto sm:max-w-xl"
            style={{
              backgroundColor: "rgba(11,26,52,0.94)",
              border: HAIRLINE,
              borderRadius: brand.radius,
              backdropFilter: "blur(20px)",
              boxShadow: "0 40px 90px rgba(2,8,20,0.65), 0 0 60px " + brand.accentColor + "22",
            }}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-6 sm:px-8 sm:pt-7">
              <div>
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: brand.primaryColor }}
                >
                  {isNew ? "Create" : "Edit"} · {PERIOD_LABEL}
                </p>
                <h2
                  id="np-editor-title"
                  className="mt-2 text-[22px] font-bold leading-snug"
                  style={{ fontFamily: brand.fontHeading, color: TEXT }}
                >
                  {isNew
                    ? "New category"
                    : "Edit category — " +
                      current.name +
                      " (" +
                      (current.is_default ? "default" : "custom") +
                      ")"}
                </h2>
              </div>
              <Button
                type="button"
                aria-label="Close the category editor"
                onClick={closeEditor}
                className="np-focus np-rowbtn inline-flex h-9 w-9 shrink-0 items-center justify-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  color: TEXT,
                  border: HAIRLINE,
                  borderRadius: "999px",
                }}
              >
                <Icons.X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <form
              data-wf="b-3-0"
              onSubmit={handleSave}
              noValidate
              className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label
                    htmlFor="np-category-name"
                    className="mb-2 block text-[13px] font-semibold"
                    style={{ color: TEXT }}
                  >
                    Category name
                  </Label>
                  <Input
                    data-wf="i-3-0-0"
                    id="np-category-name"
                    ref={nameRef}
                    value={editor.name}
                    disabled={!isNew && isDefaultCat}
                    onChange={(e) => {
                      setEditor({ ...editor, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    placeholder="Groceries"
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby="np-editor-help"
                    className="np-focus w-full px-4 py-3 text-[15px]"
                    style={{
                      backgroundColor:
                        !isNew && isDefaultCat ? "rgba(255,255,255,0.03)" : SURFACE_2,
                      color: !isNew && isDefaultCat ? brand.neutralColor : TEXT,
                      border: "1px solid " + (errors.name ? TONE.over : "rgba(255,255,255,0.14)"),
                      borderRadius: brand.radius,
                    }}
                  />
                  <p className="mt-2 text-[12px]" style={{ color: brand.neutralColor }}>
                    {!isNew && isDefaultCat
                      ? "Default categories keep their names — only custom ones can be renamed."
                      : "Shown everywhere this category appears."}
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="np-category-budget"
                    className="mb-2 block text-[13px] font-semibold"
                    style={{ color: TEXT }}
                  >
                    Monthly budget amount ({CURRENCY_CODE})
                  </Label>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-semibold"
                      style={{ color: brand.primaryColor }}
                    >
                      $
                    </span>
                    <Input
                      data-wf="i-3-0-1"
                      id="np-category-budget"
                      ref={budgetRef}
                      value={editor.budget}
                      inputMode="decimal"
                      onChange={(e) => {
                        setEditor({ ...editor, budget: e.target.value });
                        if (errors.budget) setErrors({ ...errors, budget: null });
                      }}
                      placeholder="650.00"
                      aria-invalid={errors.budget ? "true" : "false"}
                      aria-describedby="np-editor-help"
                      className="np-focus w-full py-3 pl-9 pr-4 text-[15px]"
                      style={{
                        backgroundColor: SURFACE_2,
                        color: TEXT,
                        border:
                          "1px solid " + (errors.budget ? TONE.over : "rgba(255,255,255,0.14)"),
                        borderRadius: brand.radius,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    />
                  </div>
                  <p className="mt-2 text-[12px]" style={{ color: brand.neutralColor }}>
                    Applies every month from {PERIOD_LABEL}. Leave blank for no budget.
                  </p>
                </div>
              </div>

              {/* Row 5 — guidance, validation and delete warning */}
              <div
                data-wf="b-4-0"
                id="np-editor-help"
                aria-live="polite"
                className="mt-6 rounded-2xl px-4 py-3 text-[13px] leading-relaxed"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border:
                    "1px solid " +
                    (errors.name || errors.budget
                      ? TONE.over + "66"
                      : editor.pendingDelete
                        ? TONE.near + "66"
                        : "rgba(255,255,255,0.12)"),
                  borderRadius: brand.radius,
                }}
              >
                {errors.name || errors.budget ? (
                  <ul className="space-y-1.5">
                    {errors.name ? (
                      <li className="flex items-start gap-2" style={{ color: TONE.over }}>
                        <Icons.AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{errors.name}</span>
                      </li>
                    ) : null}
                    {errors.budget ? (
                      <li className="flex items-start gap-2" style={{ color: TONE.over }}>
                        <Icons.AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{errors.budget}</span>
                      </li>
                    ) : null}
                  </ul>
                ) : editor.pendingDelete && current ? (
                  <p className="flex items-start gap-2" style={{ color: TONE.near }}>
                    <Icons.AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      Deleting “{current.name}” affects {current.expense_count} existing expense
                      {current.expense_count === 1 ? "" : "s"} — confirm to continue. Choose{" "}
                      <strong>Confirm delete</strong> again to remove it, or press Esc to keep it.
                    </span>
                  </p>
                ) : (
                  <p style={{ color: brand.neutralColor }}>
                    Name cannot be blank or duplicate another of your categories. A budget must be a
                    number greater than zero.
                  </p>
                )}
              </div>

              {/* Row 6 — actions */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Button
                  data-wf="b-5-0"
                  type="submit"
                  disabled={saving}
                  className="np-focus inline-flex items-center justify-center gap-2 px-4 py-3 text-[15px] font-bold"
                  style={{
                    background: saving
                      ? "rgba(255,255,255,0.12)"
                      : "linear-gradient(100deg, " +
                        brand.primaryColor +
                        ", " +
                        brand.accentColor +
                        ")",
                    color: saving ? brand.neutralColor : brand.backgroundColor,
                    border: "none",
                    borderRadius: brand.radius,
                    boxShadow: saving ? "none" : "0 16px 40px " + brand.accentColor + "45",
                    cursor: saving ? "progress" : "pointer",
                  }}
                >
                  {saving ? (
                    <>
                      <span
                        className="np-spin inline-block h-4 w-4 rounded-full"
                        style={{
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: brand.primaryColor,
                        }}
                        aria-hidden="true"
                      />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Icons.Check className="h-4 w-4" aria-hidden="true" />
                      Save category
                    </>
                  )}
                </Button>

                <Button
                  data-wf="b-5-1"
                  type="button"
                  onClick={handleClearBudget}
                  disabled={isNew || !current || current.monthly_amount === null || saving}
                  className="np-focus np-rowbtn inline-flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-semibold"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    color:
                      isNew || !current || current.monthly_amount === null
                        ? "rgba(159,180,208,0.5)"
                        : TEXT,
                    border: HAIRLINE,
                    borderRadius: brand.radius,
                    cursor:
                      isNew || !current || current.monthly_amount === null
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  <Icons.X className="h-4 w-4" aria-hidden="true" />
                  Clear budget
                </Button>

                <Button
                  data-wf="b-5-2"
                  type="button"
                  onClick={handleDelete}
                  disabled={isNew || isDefaultCat || saving}
                  className="np-focus inline-flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-semibold"
                  style={{
                    backgroundColor: editor.pendingDelete ? TONE.over : "rgba(255,255,255,0.04)",
                    color:
                      isNew || isDefaultCat
                        ? "rgba(159,180,208,0.5)"
                        : editor.pendingDelete
                          ? brand.backgroundColor
                          : TONE.over,
                    border:
                      "1px solid " +
                      (isNew || isDefaultCat ? "rgba(255,255,255,0.12)" : TONE.over + "66"),
                    borderRadius: brand.radius,
                    cursor: isNew || isDefaultCat ? "not-allowed" : "pointer",
                  }}
                >
                  <Icons.Trash className="h-4 w-4" aria-hidden="true" />
                  {editor.pendingDelete ? "Confirm delete" : "Delete category"}
                </Button>
              </div>

              {isDefaultCat && !isNew ? (
                <p className="mt-3 text-[12px]" style={{ color: brand.neutralColor }}>
                  “{current.name}” is one of your default categories — you can budget it, but it
                  can’t be renamed or deleted.
                </p>
              ) : null}

              <div className="mt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }} />

              {/* Row 7 — link through to the expense list */}
              <div className="mt-4">
                {!isNew && current && current.expense_count > 0 ? (
                  <button
                    data-wf="b-6-0"
                    type="button"
                    onClick={() => navigate("expenses")}
                    className="np-focus np-link inline-flex items-center gap-1.5 text-[14px] font-semibold underline underline-offset-4"
                    style={{ color: brand.primaryColor, borderRadius: "8px" }}
                  >
                    View the {current.expense_count} expense{current.expense_count === 1 ? "" : "s"}{" "}
                    in {current.name}
                    <Icons.ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <p data-wf="b-6-0" className="text-[13px]" style={{ color: brand.neutralColor }}>
                    {isNew
                      ? "Once you save, this category appears when you add an expense and you can jump to its expenses from here."
                      : "No expenses in this category yet — add one and it will be listed here."}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
