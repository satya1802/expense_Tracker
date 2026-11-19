// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Textarea, Label, Select, Badge, Table, THead, TBody, TR, TH, TD, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, Search, Check, X, ChevronRight, Trash, Edit, Filter, Download, AlertCircle, CheckCircle } = Icons;

const TODAY = '2026-11-19';

const CURRENCY = 'USD';

const CATEGORIES = [
  { id: 'cat_groceries', name: 'Groceries', is_default: true },
  { id: 'cat_dining', name: 'Dining out', is_default: true },
  { id: 'cat_transport', name: 'Transport', is_default: true },
  { id: 'cat_housing', name: 'Housing', is_default: true },
  { id: 'cat_utilities', name: 'Utilities', is_default: true },
  { id: 'cat_health', name: 'Health', is_default: true },
  { id: 'cat_fun', name: 'Entertainment', is_default: true },
  { id: 'cat_shopping', name: 'Shopping', is_default: true },
  { id: 'cat_climbing', name: 'Climbing gym', is_default: false },
  { id: 'cat_pets', name: 'Pet care', is_default: false },
];

const SEED_EXPENSES = [
  { id: 'exp_241', category_id: 'cat_dining', amount: 18.4, spent_on: '2026-11-19', note: 'Lunch at Tartine with Nadia' },
  { id: 'exp_240', category_id: 'cat_transport', amount: 3.75, spent_on: '2026-11-19', note: 'BART to Embarcadero' },
  { id: 'exp_239', category_id: 'cat_groceries', amount: 86.22, spent_on: '2026-11-18', note: 'Rainbow Grocery — weekly shop' },
  { id: 'exp_238', category_id: 'cat_pets', amount: 54.0, spent_on: '2026-11-18', note: "Mochi's booster shots" },
  { id: 'exp_237', category_id: 'cat_utilities', amount: 112.38, spent_on: '2026-11-17', note: 'PG&E — October statement' },
  { id: 'exp_236', category_id: 'cat_fun', amount: 32.0, spent_on: '2026-11-16', note: 'Roxie Theater — two tickets' },
  { id: 'exp_235', category_id: 'cat_dining', amount: 64.9, spent_on: '2026-11-16', note: 'Birthday dinner, Nopalito' },
  { id: 'exp_234', category_id: 'cat_climbing', amount: 29.0, spent_on: '2026-11-15', note: 'Day pass + shoe rental' },
  { id: 'exp_233', category_id: 'cat_shopping', amount: 149.99, spent_on: '2026-11-14', note: 'Winter boots' },
  { id: 'exp_232', category_id: 'cat_groceries', amount: 23.15, spent_on: '2026-11-14', note: '' },
  { id: 'exp_231', category_id: 'cat_transport', amount: 42.6, spent_on: '2026-11-13', note: 'Gas — Shell on Cesar Chavez' },
  { id: 'exp_230', category_id: 'cat_health', amount: 35.0, spent_on: '2026-11-12', note: 'Physio copay' },
  { id: 'exp_229', category_id: 'cat_dining', amount: 11.25, spent_on: '2026-11-12', note: 'Ritual coffee + pastry' },
  { id: 'exp_228', category_id: 'cat_housing', amount: 2150.0, spent_on: '2026-11-11', note: 'November rent' },
  { id: 'exp_227', category_id: 'cat_groceries', amount: 71.48, spent_on: '2026-11-10', note: "Trader Joe's" },
  { id: 'exp_226', category_id: 'cat_fun', amount: 15.99, spent_on: '2026-11-09', note: 'Spotify family plan' },
  { id: 'exp_225', category_id: 'cat_transport', amount: 28.0, spent_on: '2026-11-08', note: 'Airport shuttle, SFO' },
  { id: 'exp_224', category_id: 'cat_shopping', amount: 62.3, spent_on: '2026-11-07', note: "Gift for Dad's birthday" },
  { id: 'exp_223', category_id: 'cat_utilities', amount: 59.0, spent_on: '2026-11-06', note: 'Sonic fibre internet' },
  { id: 'exp_222', category_id: 'cat_dining', amount: 46.75, spent_on: '2026-11-05', note: 'Team lunch (reimbursable)' },
  { id: 'exp_221', category_id: 'cat_groceries', amount: 94.03, spent_on: '2026-11-04', note: 'Costco run' },
  { id: 'exp_220', category_id: 'cat_health', amount: 24.5, spent_on: '2026-11-03', note: 'Walgreens — prescription' },
  { id: 'exp_219', category_id: 'cat_climbing', amount: 95.0, spent_on: '2026-11-02', note: 'Monthly membership' },
  { id: 'exp_218', category_id: 'cat_pets', amount: 38.9, spent_on: '2026-11-01', note: 'Dog food, 12kg' },
  { id: 'exp_217', category_id: 'cat_transport', amount: 3.75, spent_on: '2026-10-30', note: 'BART to Civic Center' },
  { id: 'exp_216', category_id: 'cat_groceries', amount: 52.1, spent_on: '2026-10-29', note: 'Alemany farmers market' },
  { id: 'exp_215', category_id: 'cat_fun', amount: 21.0, spent_on: '2026-10-28', note: 'Warriors game — standing room' },
];

const GLASS = {
  backgroundColor: 'rgba(255,255,255,0.055)',
  border: '1px solid rgba(255,255,255,0.13)',
  borderRadius: brand.radius,
  backdropFilter: 'blur(18px)',
};

const FIELD_STYLE = {
  backgroundColor: 'rgba(255,255,255,0.045)',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: brand.radius,
  color: '#f3f8ff',
  colorScheme: 'dark',
  fontVariantNumeric: 'tabular-nums',
};

const money = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 }).format(n);

const shortDate = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const BLANK_FORM = { amount: '', category_id: '', spent_on: TODAY, note: '' };

export default function Screen() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = React.useState(SEED_EXPENSES);
  const [query, setQuery] = React.useState('');
  const [catFilter, setCatFilter] = React.useState('all');
  const [from, setFrom] = React.useState('2026-11-01');
  const [to, setTo] = React.useState('2026-11-30');

  const [modal, setModal] = React.useState(null); // {mode:'add'|'edit', id}
  const [form, setForm] = React.useState(BLANK_FORM);
  const [errors, setErrors] = React.useState({});
  const [formError, setFormError] = React.useState(null);
  const [confirming, setConfirming] = React.useState(false);

  const [pending, setPending] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [flashId, setFlashId] = React.useState(null);
  const [sync, setSync] = React.useState('Synced 10:42');
  const [exported, setExported] = React.useState(false);

  const dialogRef = React.useRef(null);
  const amountRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  const categoryName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || 'Uncategorised';

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return expenses
      .filter((e) => {
        if (catFilter !== 'all' && e.category_id !== catFilter) return false;
        if (from && e.spent_on < from) return false;
        if (to && e.spent_on > to) return false;
        if (q) {
          const hay = (e.note + ' ' + categoryName(e.category_id)).toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => (a.spent_on < b.spent_on ? 1 : a.spent_on > b.spent_on ? -1 : a.id < b.id ? 1 : -1));
  }, [expenses, query, catFilter, from, to]);

  const viewTotal = filtered.reduce((s, e) => s + e.amount, 0);
  const maxAmount = filtered.reduce((m, e) => Math.max(m, e.amount), 1);
  const filtersActive = query.trim() !== '' || catFilter !== 'all' || from !== '' || to !== '';
  const exportName = `expenses_${from || 'all'}_${to || 'all'}.csv`;

  // deferred work (save / delete / export) — cleaned up on unmount
  React.useEffect(() => {
    if (!pending) return undefined;
    const t = setTimeout(() => {
      commit(pending);
      setPending(null);
    }, pending.type === 'export' ? 900 : 550);
    return () => clearTimeout(t);
  }, [pending]);

  React.useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  React.useEffect(() => {
    if (!flashId) return undefined;
    const t = setTimeout(() => setFlashId(null), 1700);
    return () => clearTimeout(t);
  }, [flashId]);

  React.useEffect(() => {
    if (modal) {
      const t = setTimeout(() => amountRef.current && amountRef.current.focus(), 40);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [modal]);

  function commit(p) {
    if (p.type === 'export') {
      setExported(true);
      setToast({
        kind: 'success',
        title: 'CSV ready',
        text: `${p.rows} expenses written to ${p.file}. It contains your account's records only.`,
      });
      return;
    }
    if (p.type === 'save') {
      if (p.amount > 10000) {
        setFormError(
          `${money(p.amount)} is over the single-entry limit of ${money(10000)}. Lower it or split it into two expenses — everything you typed is still here.`
        );
        setSync('Last synced 10:42');
        return;
      }
      if (p.mode === 'add') {
        const id = 'exp_' + (300 + expenses.length);
        setExpenses((prev) => [
          { id, category_id: p.category_id, amount: p.amount, spent_on: p.spent_on, note: p.note },
          ...prev,
        ]);
        setFlashId(id);
        setToast({ kind: 'success', title: 'Expense added', text: `${money(p.amount)} · ${categoryName(p.category_id)} · ${shortDate(p.spent_on)}` });
      } else {
        setExpenses((prev) =>
          prev.map((e) =>
            e.id === p.id ? { ...e, category_id: p.category_id, amount: p.amount, spent_on: p.spent_on, note: p.note } : e
          )
        );
        setFlashId(p.id);
        setToast({ kind: 'success', title: 'Expense updated', text: `${money(p.amount)} · ${categoryName(p.category_id)} · ${shortDate(p.spent_on)}` });
      }
      setSync('Synced just now');
      closeModal();
      return;
    }
    if (p.type === 'delete') {
      setExpenses((prev) => prev.filter((e) => e.id !== p.id));
      setSync('Synced just now');
      setToast({ kind: 'info', title: 'Expense deleted', text: `${money(p.amount)} on ${shortDate(p.spent_on)} no longer counts toward your budgets.` });
      closeModal();
    }
  }

  function openAdd(ev) {
    triggerRef.current = ev && ev.currentTarget;
    setForm({ ...BLANK_FORM });
    setErrors({});
    setFormError(null);
    setConfirming(false);
    setModal({ mode: 'add', id: null });
  }

  function openEdit(expense, ev) {
    triggerRef.current = ev && ev.currentTarget;
    setForm({
      amount: expense.amount.toFixed(2),
      category_id: expense.category_id,
      spent_on: expense.spent_on,
      note: expense.note,
    });
    setErrors({});
    setFormError(null);
    setConfirming(false);
    setModal({ mode: 'edit', id: expense.id });
  }

  function closeModal() {
    setModal(null);
    setConfirming(false);
    setErrors({});
    setFormError(null);
    const node = triggerRef.current;
    if (node && typeof node.focus === 'function') setTimeout(() => node.focus(), 0);
  }

  function validate() {
    const next = {};
    const raw = String(form.amount).trim().replace(/,/g, '');
    const value = Number(raw);
    if (raw === '') next.amount = 'Enter an amount, for example 24.50.';
    else if (!isFinite(value) || isNaN(value)) next.amount = 'Amounts must be numbers only — no letters or symbols.';
    else if (value <= 0) next.amount = 'The amount has to be greater than zero.';
    if (!form.category_id) next.category_id = 'Pick a category so this lands in the right budget.';
    if (!form.spent_on) next.spent_on = 'Choose the date you spent it.';
    else if (form.spent_on > TODAY) next.spent_on = "That date is in the future. Expenses are logged after you've spent.";
    if (form.note && form.note.length > 140) next.note = 'Keep the note under 140 characters.';
    return { next, value };
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (pending) return;
    setFormError(null);
    const { next, value } = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    setSync('Saving…');
    setPending({
      type: 'save',
      mode: modal.mode,
      id: modal.id,
      amount: Math.round(value * 100) / 100,
      category_id: form.category_id,
      spent_on: form.spent_on,
      note: form.note.trim(),
    });
  }

  function handleDeleteConfirmed() {
    const target = expenses.find((e) => e.id === modal.id);
    if (!target) return;
    setSync('Saving…');
    setPending({ type: 'delete', id: target.id, amount: target.amount, spent_on: target.spent_on });
  }

  function clearFilters() {
    setQuery('');
    setCatFilter('all');
    setFrom('');
    setTo('');
  }

  function onDialogKeyDown(ev) {
    if (ev.key === 'Escape') {
      ev.stopPropagation();
      closeModal();
      return;
    }
    if (ev.key !== 'Tab' || !dialogRef.current) return;
    const nodes = Array.prototype.slice
      .call(dialogRef.current.querySelectorAll('button, input, select, textarea'))
      .filter((n) => !n.disabled && n.offsetParent !== null);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  }

  const label = 'text-[12px] font-semibold tracking-[0.14em] uppercase';
  const errText = '#fca5a5';
  const editing = modal && modal.mode === 'edit';
  const editingTarget = editing ? expenses.find((e) => e.id === modal.id) : null;

  return (
    <div
      className="relative w-full min-h-full px-4 sm:px-6 lg:px-10 py-8 lg:py-10"
      style={{
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontBody,
        color: '#eaf2ff',
        ['--np-primary']: brand.primaryColor,
        ['--np-accent']: brand.accentColor,
        ['--np-radius']: brand.radius,
      }}
    >
      <style>{`
        @keyframes npRowIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
        @keyframes npFlash{0%{background-color:rgba(34,211,238,.20)}100%{background-color:transparent}}
        @keyframes npRise{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}
        @keyframes npFade{from{opacity:0}to{opacity:1}}
        @keyframes npPulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes npSpin{to{transform:rotate(360deg)}}
        .np-focus:focus-visible{outline:2px solid var(--np-primary);outline-offset:2px}
        .np-field::placeholder{color:rgba(159,180,208,.55)}
        .np-row{animation:npRowIn .26s ease-out both}
        .np-flash{animation:npFlash 1.7s ease-out both}
        .np-sheet{animation:npRise .22s cubic-bezier(.2,.8,.3,1) both}
        .np-backdrop{animation:npFade .18s ease-out both}
        .np-dot{animation:npPulse 2.4s ease-in-out infinite}
        .np-spin{animation:npSpin .8s linear infinite}
        @media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important}}
      `}</style>

      {/* signature wide glow behind the header */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 h-72 w-[46rem] -translate-x-1/3 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${brand.accentColor}2e, transparent 78%)`,
          filter: 'blur(48px)',
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* ROW 1 */}
        <div className="grid grid-cols-12 gap-4 items-end">
          <div data-wf="b-0-0" className="col-span-12 md:col-span-6">
            <div className="flex items-center gap-2" style={{ color: brand.neutralColor }}>
              <span className="np-dot inline-block h-[7px] w-[7px] rounded-full" style={{ backgroundColor: brand.primaryColor }} aria-hidden="true" />
              <span className={label}>{sync} · {CURRENCY}</span>
            </div>
            <h1
              className="mt-2 text-[34px] sm:text-[40px] leading-[1.1] font-bold"
              style={{ fontFamily: brand.fontHeading, letterSpacing: '-0.02em' }}
            >
              Expenses
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed max-w-[58ch]" style={{ color: brand.neutralColor }}>
              Everything you've typed in, newest first. Search it, narrow it by category or dates, then fix anything that
              looks off.
            </p>
          </div>

          <Button
            data-wf="b-0-1"
            type="button"
            onClick={openAdd}
            className="np-focus col-span-7 md:col-span-3 h-12 inline-flex items-center justify-center gap-2 text-[15px] font-semibold transition-transform hover:-translate-y-[1px]"
            style={{
              backgroundImage: `linear-gradient(100deg, ${brand.primaryColor}, ${brand.accentColor})`,
              color: '#06142b',
              borderRadius: brand.radius,
              border: 'none',
              boxShadow: `0 18px 46px -18px ${brand.accentColor}cc`,
            }}
          >
            <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
            Add expense
          </Button>

          <Button
            data-wf="b-0-2"
            type="button"
            disabled={filtered.length === 0 || (pending && pending.type === 'export')}
            onClick={() => {
              setExported(false);
              setPending({ type: 'export', rows: filtered.length, file: exportName });
            }}
            className="np-focus col-span-5 md:col-span-3 h-12 inline-flex items-center justify-center gap-2 text-[15px] font-semibold disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
            style={{ ...GLASS, color: '#eaf2ff' }}
          >
            {pending && pending.type === 'export' ? (
              <>
                <span
                  className="np-spin inline-block h-4 w-4 rounded-full"
                  style={{ border: '2px solid rgba(255,255,255,0.25)', borderTopColor: brand.primaryColor }}
                  aria-hidden="true"
                />
                Preparing…
              </>
            ) : exported ? (
              <>
                <Check className="h-[18px] w-[18px]" aria-hidden="true" style={{ color: brand.primaryColor }} />
                CSV ready
              </>
            ) : (
              <>
                <Download className="h-[18px] w-[18px]" aria-hidden="true" />
                Export CSV
              </>
            )}
          </Button>
        </div>

        {/* ROW 2 — search */}
        <div data-wf="b-1-0" className="mt-8">
          <Label htmlFor="expense-search" className={label} style={{ color: brand.neutralColor }}>
            Search notes and categories
          </Label>
          <div className="relative mt-2">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2"
              aria-hidden="true"
              style={{ color: brand.primaryColor }}
            />
            <Input
              id="expense-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try “Trader Joe's”, “rent” or “Transport”"
              className="np-focus np-field h-12 w-full pl-12 pr-4 text-[15px]"
              style={FIELD_STYLE}
            />
          </div>
        </div>

        {/* ROW 3 — filters */}
        <div
          data-wf="b-2-0"
          className="mt-4 grid grid-cols-12 gap-3 p-3 sm:p-4"
          style={GLASS}
        >
          <div className="col-span-12 sm:col-span-6 lg:col-span-4">
            <Label htmlFor="filter-category" className={label} style={{ color: brand.neutralColor }}>
              Category
            </Label>
            <div className="relative mt-2">
              <Filter
                className="pointer-events-none absolute left-4 top-1/2 h-[16px] w-[16px] -translate-y-1/2"
                aria-hidden="true"
                style={{ color: brand.neutralColor }}
              />
              <Select
                id="filter-category"
                data-wf="i-2-0-0"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="np-focus h-11 w-full pl-11 pr-3 text-[15px]"
                style={FIELD_STYLE}
              >
                <option value="all" style={{ backgroundColor: brand.backgroundColor }}>All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id} style={{ backgroundColor: brand.backgroundColor }}>
                    {c.name}
                    {c.is_default ? '' : ' (custom)'}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-3">
            <Label htmlFor="filter-from" className={label} style={{ color: brand.neutralColor }}>
              From
            </Label>
            <Input
              id="filter-from"
              data-wf="i-2-0-1"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="np-focus np-field mt-2 h-11 w-full px-3 text-[15px]"
              style={FIELD_STYLE}
            />
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-3">
            <Label htmlFor="filter-to" className={label} style={{ color: brand.neutralColor }}>
              To
            </Label>
            <Input
              id="filter-to"
              data-wf="i-2-0-2"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="np-focus np-field mt-2 h-11 w-full px-3 text-[15px]"
              style={FIELD_STYLE}
            />
          </div>

          <div className="col-span-12 lg:col-span-2 flex items-end">
            <Button
              data-wf="i-2-0-3"
              type="button"
              onClick={clearFilters}
              disabled={!filtersActive}
              className="np-focus mt-2 h-11 w-full inline-flex items-center justify-center gap-2 text-[14px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: brand.radius,
                color: '#eaf2ff',
              }}
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Clear filters
            </Button>
          </div>

          <p className="col-span-12 text-[13px]" style={{ color: brand.neutralColor }} aria-live="polite">
            {filtersActive
              ? `Filtered: ${from ? shortDate(from) : 'any date'} – ${to ? shortDate(to) : 'any date'} · ${
                  catFilter === 'all' ? 'all categories' : categoryName(catFilter)
                }${query.trim() ? ` · “${query.trim()}”` : ''} — ${filtered.length} of ${expenses.length} expenses.`
              : `No filters applied — showing all ${expenses.length} expenses on this account.`}
          </p>
        </div>

        {/* ROW 4 — table */}
        <Card data-wf="b-3-0" className="mt-6 overflow-hidden" style={GLASS}>
          <CardHeader className="px-5 sm:px-6 pt-6 pb-4">
            <CardTitle
              className="text-[20px] sm:text-[22px] font-bold"
              style={{ fontFamily: brand.fontHeading, color: '#f3f8ff', fontVariantNumeric: 'tabular-nums' }}
            >
              {filtered.length} {filtered.length === 1 ? 'expense' : 'expenses'}, newest first
            </CardTitle>
            <CardDescription className="text-[14px] mt-1" style={{ color: brand.neutralColor, fontVariantNumeric: 'tabular-nums' }}>
              {money(viewTotal)} in view · typed in manually, in {CURRENCY}
            </CardDescription>
          </CardHeader>

          <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />

          {filtered.length > 0 && (
            <CardContent className="p-0 overflow-x-auto">
              <Table className="w-full text-[15px]" style={{ fontVariantNumeric: 'tabular-nums', borderCollapse: 'collapse' }}>
                <THead>
                  <TR style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                    <TH data-wf="i-3-0-0" scope="col" className={`${label} text-left px-5 sm:px-6 py-3`} style={{ color: brand.neutralColor }}>
                      Date
                    </TH>
                    <TH data-wf="i-3-0-1" scope="col" className={`${label} text-left px-3 py-3`} style={{ color: brand.neutralColor }}>
                      Category
                    </TH>
                    <TH data-wf="i-3-0-2" scope="col" className={`${label} text-right px-3 py-3`} style={{ color: brand.neutralColor }}>
                      Amount
                    </TH>
                    <TH data-wf="i-3-0-3" scope="col" className={`${label} text-left px-3 py-3 hidden md:table-cell`} style={{ color: brand.neutralColor }}>
                      Note
                    </TH>
                    <TH data-wf="i-3-0-4" scope="col" className={`${label} text-right px-5 sm:px-6 py-3`} style={{ color: brand.neutralColor }}>
                      Actions
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {filtered.map((e) => {
                    const cat = CATEGORIES.find((c) => c.id === e.category_id) || {};
                    const width = Math.max(8, Math.sqrt(e.amount / maxAmount) * 100);
                    return (
                      <TR
                        key={e.id}
                        className={`np-row ${flashId === e.id ? 'np-flash' : ''} transition-colors hover:bg-white/[0.04]`}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <TD className="px-5 sm:px-6 py-4 whitespace-nowrap" style={{ color: '#dfe9f8' }}>
                          {shortDate(e.spent_on)}
                        </TD>
                        <TD className="px-3 py-4">
                          <Badge
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-[13px] font-medium whitespace-nowrap"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.07)',
                              border: '1px solid rgba(255,255,255,0.14)',
                              borderRadius: 999,
                              color: '#eaf2ff',
                            }}
                          >
                            <span
                              aria-hidden="true"
                              className="h-[6px] w-[6px] rounded-full"
                              style={{ backgroundColor: cat.is_default ? brand.primaryColor : brand.accentColor }}
                            />
                            {cat.name}
                          </Badge>
                        </TD>
                        <TD className="px-3 py-4 text-right">
                          <div className="font-semibold text-[16px]" style={{ color: '#ffffff' }}>
                            {money(e.amount)}
                          </div>
                          {/* signature: spend-pulse bar */}
                          <div
                            aria-hidden="true"
                            className="ml-auto mt-1.5 h-[3px] w-24 overflow-hidden rounded-full"
                            style={{ backgroundColor: 'rgba(255,255,255,0.09)' }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: width + '%',
                                marginLeft: 'auto',
                                backgroundImage: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`,
                              }}
                            />
                          </div>
                        </TD>
                        <TD className="px-3 py-4 hidden md:table-cell max-w-[22rem]" style={{ color: brand.neutralColor }}>
                          {e.note ? (
                            <span className="line-clamp-1">{e.note}</span>
                          ) : (
                            <span className="italic opacity-70">No note</span>
                          )}
                        </TD>
                        <TD className="px-5 sm:px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              type="button"
                              aria-label={`Edit ${money(e.amount)} on ${shortDate(e.spent_on)}`}
                              onClick={(ev) => openEdit(e, ev)}
                              className="np-focus h-10 min-w-[44px] px-3 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:bg-white/10"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.14)',
                                borderRadius: 999,
                                color: '#eaf2ff',
                              }}
                            >
                              <Edit className="h-4 w-4" aria-hidden="true" />
                              <span className="hidden lg:inline">Edit</span>
                            </Button>
                            <Button
                              type="button"
                              aria-label={`Delete ${money(e.amount)} on ${shortDate(e.spent_on)}`}
                              onClick={(ev) => {
                                openEdit(e, ev);
                                setConfirming(true);
                              }}
                              className="np-focus h-10 min-w-[44px] px-3 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:bg-white/10"
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid rgba(255,255,255,0.14)',
                                borderRadius: 999,
                                color: brand.neutralColor,
                              }}
                            >
                              <Trash className="h-4 w-4" aria-hidden="true" />
                              <span className="hidden lg:inline">Delete</span>
                            </Button>
                          </div>
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </CardContent>
          )}

          {/* ROW 5 — empty states */}
          {filtered.length === 0 && (
            <div data-wf="b-4-0" className="px-5 sm:px-6 py-12">
              {expenses.length === 0 ? (
                <Empty
                  title="Nothing logged yet"
                  description="Your expense list is empty. Add the first amount, category and date and it appears here straight away."
                  action={
                    <Button
                      type="button"
                      onClick={openAdd}
                      className="np-focus h-11 px-5 inline-flex items-center gap-2 text-[15px] font-semibold"
                      style={{
                        backgroundImage: `linear-gradient(100deg, ${brand.primaryColor}, ${brand.accentColor})`,
                        color: '#06142b',
                        border: 'none',
                        borderRadius: brand.radius,
                      }}
                    >
                      <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
                      Add your first expense
                    </Button>
                  }
                />
              ) : (
                <Empty
                  title="No expenses match the current filters"
                  description="Clear the filters, or add your first expense for this period. Your other records are still safe — they just sit outside this search."
                  action={
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <Button
                        type="button"
                        onClick={clearFilters}
                        className="np-focus h-11 px-5 inline-flex items-center gap-2 text-[15px] font-semibold"
                        style={{
                          backgroundImage: `linear-gradient(100deg, ${brand.primaryColor}, ${brand.accentColor})`,
                          color: '#06142b',
                          border: 'none',
                          borderRadius: brand.radius,
                        }}
                      >
                        <X className="h-[18px] w-[18px]" aria-hidden="true" />
                        Clear filters
                      </Button>
                      <Button
                        type="button"
                        onClick={openAdd}
                        className="np-focus h-11 px-5 inline-flex items-center gap-2 text-[15px] font-semibold"
                        style={{ ...GLASS, color: '#eaf2ff' }}
                      >
                        <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
                        Add expense
                      </Button>
                    </div>
                  }
                />
              )}
            </div>
          )}

          <CardFooter className="px-5 sm:px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-[13px]" style={{ color: brand.neutralColor }}>
              Private to {''}
              <span style={{ color: '#dfe9f8' }}>sai.kiron@quorq.ai</span>. Budgets and category spend live on the{' '}
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="np-focus underline underline-offset-4 font-semibold"
                style={{ color: brand.primaryColor, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                dashboard
              </button>
              .
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* ROWS 6-9 — add / edit modal */}
      {modal && (
        <div
          className="np-backdrop fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ backgroundColor: 'rgba(3,10,22,0.72)', backdropFilter: 'blur(6px)' }}
          onMouseDown={(ev) => {
            if (ev.target === ev.currentTarget) closeModal();
          }}
        >
          <div
            data-wf="b-5-0"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="expense-modal-title"
            onKeyDown={onDialogKeyDown}
            className="np-sheet w-full sm:max-w-xl max-h-full overflow-y-auto"
            style={{
              backgroundColor: 'rgba(12,27,51,0.94)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: brand.radius,
              boxShadow: `0 40px 90px -30px ${brand.accentColor}66, 0 0 0 1px rgba(255,255,255,0.04)`,
            }}
          >
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
              <div>
                <p className={label} style={{ color: brand.accentColor }}>
                  {editing ? 'Edit expense' : 'Add expense'}
                </p>
                <h2
                  id="expense-modal-title"
                  className="mt-1.5 text-[24px] font-bold"
                  style={{ fontFamily: brand.fontHeading, letterSpacing: '-0.01em' }}
                >
                  {editing ? `${money(editingTarget ? editingTarget.amount : 0)} · ${categoryName(form.category_id)}` : 'New expense'}
                </h2>
              </div>
              <Button
                type="button"
                aria-label="Close without saving"
                onClick={closeModal}
                className="np-focus h-10 w-10 shrink-0 inline-flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: 999,
                  color: '#eaf2ff',
                }}
              >
                <X className="h-[18px] w-[18px]" aria-hidden="true" />
              </Button>
            </div>

            <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.12)' }} />

            <form data-wf="b-6-0" onSubmit={handleSubmit} noValidate className="px-6 py-6">
              {formError && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 p-4"
                  style={{
                    backgroundColor: 'rgba(248,113,113,0.10)',
                    border: '1px solid rgba(248,113,113,0.45)',
                    borderRadius: brand.radius,
                  }}
                >
                  <AlertCircle className="h-5 w-5 shrink-0 mt-[2px]" aria-hidden="true" style={{ color: errText }} />
                  <div>
                    <p className="text-[14px] font-semibold" style={{ color: errText }}>
                      Couldn't save that one
                    </p>
                    <p className="text-[14px] mt-1 leading-relaxed" style={{ color: '#e6d6d6' }}>
                      {formError}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6">
                  <Label htmlFor="field-amount" className={label} style={{ color: brand.neutralColor }}>
                    Amount ({CURRENCY})
                  </Label>
                  <Input
                    id="field-amount"
                    data-wf="i-6-0-0"
                    ref={amountRef}
                    type="text"
                    inputMode="decimal"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="24.50"
                    aria-invalid={errors.amount ? 'true' : 'false'}
                    aria-describedby={errors.amount ? 'err-amount' : undefined}
                    className="np-focus np-field mt-2 h-12 w-full px-4 text-[17px] font-semibold"
                    style={{ ...FIELD_STYLE, borderColor: errors.amount ? 'rgba(248,113,113,0.65)' : FIELD_STYLE.border }}
                  />
                  {errors.amount && (
                    <p id="err-amount" className="mt-2 text-[13px] flex items-center gap-1.5" style={{ color: errText }}>
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <Label htmlFor="field-category" className={label} style={{ color: brand.neutralColor }}>
                    Category
                  </Label>
                  <Select
                    id="field-category"
                    data-wf="i-6-0-1"
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    aria-invalid={errors.category_id ? 'true' : 'false'}
                    aria-describedby={errors.category_id ? 'err-category' : undefined}
                    className="np-focus mt-2 h-12 w-full px-3 text-[15px]"
                    style={{ ...FIELD_STYLE, borderColor: errors.category_id ? 'rgba(248,113,113,0.65)' : FIELD_STYLE.border }}
                  >
                    <option value="" style={{ backgroundColor: brand.backgroundColor }}>
                      Choose a category
                    </option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id} style={{ backgroundColor: brand.backgroundColor }}>
                        {c.name}
                        {c.is_default ? '' : ' (custom)'}
                      </option>
                    ))}
                  </Select>
                  {errors.category_id && (
                    <p id="err-category" className="mt-2 text-[13px] flex items-center gap-1.5" style={{ color: errText }}>
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.category_id}
                    </p>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <Label htmlFor="field-date" className={label} style={{ color: brand.neutralColor }}>
                    Date spent
                  </Label>
                  <Input
                    id="field-date"
                    data-wf="i-6-0-2"
                    type="date"
                    max={TODAY}
                    value={form.spent_on}
                    onChange={(e) => setForm({ ...form, spent_on: e.target.value })}
                    aria-invalid={errors.spent_on ? 'true' : 'false'}
                    aria-describedby={errors.spent_on ? 'err-date' : undefined}
                    className="np-focus np-field mt-2 h-12 w-full px-4 text-[15px]"
                    style={{ ...FIELD_STYLE, borderColor: errors.spent_on ? 'rgba(248,113,113,0.65)' : FIELD_STYLE.border }}
                  />
                  {errors.spent_on && (
                    <p id="err-date" className="mt-2 text-[13px] flex items-center gap-1.5" style={{ color: errText }}>
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.spent_on}
                    </p>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <Label htmlFor="field-note" className={label} style={{ color: brand.neutralColor }}>
                    Note (optional)
                  </Label>
                  <Textarea
                    id="field-note"
                    data-wf="i-6-0-3"
                    rows={2}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Rainbow Grocery — weekly shop"
                    aria-describedby={errors.note ? 'err-note' : 'hint-note'}
                    className="np-focus np-field mt-2 w-full px-4 py-3 text-[15px]"
                    style={{ ...FIELD_STYLE, borderColor: errors.note ? 'rgba(248,113,113,0.65)' : FIELD_STYLE.border }}
                  />
                  {errors.note ? (
                    <p id="err-note" className="mt-2 text-[13px] flex items-center gap-1.5" style={{ color: errText }}>
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      {errors.note}
                    </p>
                  ) : (
                    <p id="hint-note" className="mt-2 text-[13px]" style={{ color: brand.neutralColor }}>
                      {form.note.length}/140 characters
                    </p>
                  )}
                </div>
              </div>

              <p data-wf="b-7-0" className="mt-6 text-[14px] leading-relaxed" style={{ color: brand.neutralColor }}>
                Enter a positive amount and choose a category and date. Expenses are typed in manually — there is no bank
                sync or receipt scanning.
              </p>

              {confirming ? (
                <div
                  className="np-sheet mt-6 p-4"
                  style={{
                    backgroundColor: 'rgba(248,113,113,0.09)',
                    border: '1px solid rgba(248,113,113,0.42)',
                    borderRadius: brand.radius,
                  }}
                >
                  <p className="text-[15px] font-semibold" style={{ color: '#ffd9d9' }}>
                    Delete this expense?
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed" style={{ color: '#e6d6d6', fontVariantNumeric: 'tabular-nums' }}>
                    {editingTarget
                      ? `${money(editingTarget.amount)} · ${categoryName(editingTarget.category_id)} · ${shortDate(
                          editingTarget.spent_on
                        )} will be removed and will stop counting toward that budget. This can't be undone.`
                      : 'This entry will be removed.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      type="button"
                      onClick={handleDeleteConfirmed}
                      disabled={!!pending}
                      className="np-focus h-11 px-5 inline-flex items-center gap-2 text-[15px] font-semibold disabled:opacity-60"
                      style={{ backgroundColor: '#f87171', color: '#2a0909', border: 'none', borderRadius: brand.radius }}
                    >
                      <Trash className="h-[18px] w-[18px]" aria-hidden="true" />
                      {pending && pending.type === 'delete' ? 'Deleting…' : 'Yes, delete it'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setConfirming(false)}
                      className="np-focus h-11 px-5 inline-flex items-center text-[15px] font-semibold"
                      style={{ ...GLASS, color: '#eaf2ff' }}
                    >
                      Keep it
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-12 gap-3 items-center">
                  <Button
                    data-wf="b-8-0"
                    type="submit"
                    disabled={!!pending}
                    className="np-focus col-span-12 sm:col-span-4 h-12 inline-flex items-center justify-center gap-2 text-[15px] font-semibold disabled:opacity-70 transition-transform hover:-translate-y-[1px]"
                    style={{
                      backgroundImage: `linear-gradient(100deg, ${brand.primaryColor}, ${brand.accentColor})`,
                      color: '#06142b',
                      border: 'none',
                      borderRadius: brand.radius,
                      boxShadow: `0 18px 46px -20px ${brand.accentColor}cc`,
                    }}
                  >
                    {pending && pending.type === 'save' ? (
                      <>
                        <span
                          className="np-spin inline-block h-4 w-4 rounded-full"
                          style={{ border: '2px solid rgba(6,20,43,0.3)', borderTopColor: '#06142b' }}
                          aria-hidden="true"
                        />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Check className="h-[18px] w-[18px]" aria-hidden="true" />
                        Save expense
                      </>
                    )}
                  </Button>

                  <Button
                    data-wf="b-8-1"
                    type="button"
                    disabled={!editing || !!pending}
                    title={editing ? 'Delete this expense' : 'Available once the expense is saved'}
                    onClick={() => setConfirming(true)}
                    className="np-focus col-span-12 sm:col-span-4 h-12 inline-flex items-center justify-center gap-2 text-[15px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(248,113,113,0.45)',
                      borderRadius: brand.radius,
                      color: '#fca5a5',
                    }}
                  >
                    <Trash className="h-[18px] w-[18px]" aria-hidden="true" />
                    Delete expense
                  </Button>

                  <div className="col-span-12 sm:col-span-4 flex sm:justify-end">
                    <button
                      data-wf="b-8-2"
                      type="button"
                      onClick={() => navigate('categories-budgets')}
                      className="np-focus inline-flex items-center gap-1.5 h-12 px-2 text-[15px] font-semibold underline underline-offset-4"
                      style={{ color: brand.primaryColor, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Create a new category
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="np-sheet fixed bottom-6 right-6 z-50 w-[min(24rem,calc(100vw-3rem))] p-4 flex items-start gap-3"
          style={{
            backgroundColor: 'rgba(12,27,51,0.95)',
            border: '1px solid rgba(255,255,255,0.16)',
            borderRadius: brand.radius,
            boxShadow: `0 30px 70px -28px ${brand.primaryColor}88`,
          }}
        >
          <CheckCircle className="h-5 w-5 shrink-0 mt-[2px]" aria-hidden="true" style={{ color: brand.primaryColor }} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold" style={{ color: '#f3f8ff' }}>
              {toast.title}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed break-words" style={{ color: brand.neutralColor, fontVariantNumeric: 'tabular-nums' }}>
              {toast.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
