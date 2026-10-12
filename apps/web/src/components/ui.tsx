import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ApiError, SessionExpiredError } from '../api/client';

/**
 * AGENTS.md §9 — every table renders loading, empty and error states.
 * Shared primitives so all screens stay consistent on the Harvik brand
 * system (official logo artwork, gradient #1D4ED8→#2563EB→#0284C7,
 * Inter, 12px radii, soft ease-out motion).
 */

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16 text-sm text-slate-500" role="status">
      <span
        aria-hidden
        className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
      />
      {label}
    </div>
  );
}

/** Shimmering placeholder rows while data loads. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`skeleton rounded-lg ${className}`} />;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="animate-fade-in rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  let message = 'Something went wrong. Please try again.';
  if (error instanceof SessionExpiredError) message = 'Your session expired. Please sign in again.';
  else if (error instanceof ApiError) message = error.message;

  return (
    <div className="animate-fade-in rounded-xl border border-red-200 bg-red-50/70 px-6 py-10 text-center" role="alert">
      <p className="text-sm font-semibold text-red-800">Request failed</p>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-100 active:scale-95"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
  gradient = false,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  /** Render the title in the brand gradient (landing-style headings). */
  gradient?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1
          className={`text-2xl font-extrabold tracking-tight ${
            gradient ? 'text-brand-gradient' : 'text-slate-900'
          }`}
        >
          {title}
        </h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  children,
  className = '',
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`card-lift rounded-xl border border-blue-100 bg-white p-5 shadow-sm ${className}`}
    >
      {title ? (
        <div className="mb-3">
          <h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** Primary action — the corporate gradient with a slow pan, used for the main CTA of a screen. */
export function PrimaryButton({
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`bg-brand-gradient animate-gradient-pan rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-brand-glow transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      style={{ backgroundSize: '200% 100%' }}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Secondary action — outlined, keeps the 12px radius language. */
export function SecondaryButton({
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:scale-[1.02] hover:border-brand-300 hover:text-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    Active: 'bg-green-100 text-green-800 ring-green-600/20',
    Probation: 'bg-amber-100 text-amber-800 ring-amber-600/20',
    'On Notice': 'bg-orange-100 text-orange-800 ring-orange-600/20',
    Resigned: 'bg-purple-100 text-purple-800 ring-purple-600/20',
    Relieved: 'bg-slate-200 text-slate-700 ring-slate-600/20',
    Inactive: 'bg-slate-100 text-slate-500 ring-slate-600/10',
    Available: 'bg-green-100 text-green-800 ring-green-600/20',
    Assigned: 'bg-brand-100 text-brand-800 ring-brand-600/20',
    'Under Repair': 'bg-amber-100 text-amber-800 ring-amber-600/20',
    Lost: 'bg-red-100 text-red-800 ring-red-600/20',
    Damaged: 'bg-red-100 text-red-800 ring-red-600/20',
    Returned: 'bg-slate-200 text-slate-700 ring-slate-600/20',
    Retired: 'bg-slate-200 text-slate-600 ring-slate-600/20',
    Expired: 'bg-red-100 text-red-800 ring-red-600/20',
    Suspended: 'bg-orange-100 text-orange-800 ring-orange-600/20',
    Revoked: 'bg-slate-200 text-slate-700 ring-slate-600/20',
    Pending: 'bg-amber-100 text-amber-800 ring-amber-600/20',
    Approved: 'bg-green-100 text-green-800 ring-green-600/20',
    Rejected: 'bg-red-100 text-red-800 ring-red-600/20',
    Cancelled: 'bg-slate-200 text-slate-700 ring-slate-600/20',
    Completed: 'bg-green-100 text-green-800 ring-green-600/20',
    Open: 'bg-green-100 text-green-800 ring-green-600/20',
    Draft: 'bg-slate-100 text-slate-600 ring-slate-600/10',
    'On Hold': 'bg-amber-100 text-amber-800 ring-amber-600/20',
    Closed: 'bg-slate-200 text-slate-700 ring-slate-600/20',
    Filled: 'bg-brand-100 text-brand-800 ring-brand-600/20',
    Applied: 'bg-slate-100 text-slate-600 ring-slate-600/10',
    Shortlisted: 'bg-brand-100 text-brand-800 ring-brand-600/20',
    Interview: 'bg-amber-100 text-amber-800 ring-amber-600/20',
    Selected: 'bg-green-100 text-green-800 ring-green-600/20',
    Offer: 'bg-brand-100 text-brand-800 ring-brand-600/20',
    Joined: 'bg-green-100 text-green-800 ring-green-600/20',
    'Not Started': 'bg-slate-100 text-slate-600 ring-slate-600/10',
    'In Progress': 'bg-brand-100 text-brand-800 ring-brand-600/20',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset transition-colors duration-200 ${
        tone[status] ?? 'bg-slate-100 text-slate-600 ring-slate-600/10'
      }`}
    >
      {status}
    </span>
  );
}
