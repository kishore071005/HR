import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { ApiError, SessionExpiredError } from '../../api/client';
import { useAuth } from './auth-context';
import { Logo } from '../../components/Logo';

/**
 * AGENTS.md §6/§9 — the only page P0 needs. It renders whatever the API says;
 * there is no local role logic and no cached identity to trust.
 *
 * Split-screen: brand panel (official logo on the corporate gradient
 * #1D4ED8→#2563EB→#0284C7 + motto) and the form, with staggered entrances.
 * Quick-login demo accounts are provided so you can switch roles without
 * typing credentials each time.
 */
export function LoginPage() {
  const { account, signIn } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (account) {
    const from = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email, password);
    } catch (caught: unknown) {
      if (caught instanceof SessionExpiredError) {
        setError('Your session could not be restored. Please sign in again.');
      } else if (caught instanceof ApiError) {
        setError(caught.message);
      } else {
        setError('Unable to sign in. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* ——— Brand panel (corporate gradient + official logo) ——— */}
      <div className="relative hidden w-[46%] overflow-hidden bg-brand-gradient lg:flex lg:flex-col">
        {/* decorative glows */}
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-black/10 blur-3xl" />
        <Sparkles aria-hidden className="absolute right-10 top-10 h-6 w-6 animate-pulse-soft text-white/40" />
        <Sparkles aria-hidden className="absolute bottom-24 left-12 h-4 w-4 animate-pulse-soft text-white/30" style={{ animationDelay: '800ms' }} />

        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="animate-logo-pop">
            <Logo height={44} tone="light" />
          </div>

          <div>
            <p className="animate-fade-up inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm" style={{ animationDelay: '150ms' }}>
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
              Internal HR System
            </p>
            <h1
              className="animate-fade-up mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl"
              style={{ animationDelay: '250ms' }}
            >
              The complete
              <br />
              employee lifecycle.
            </h1>
            <p
              className="animate-fade-up mt-4 max-w-md text-base leading-relaxed text-white/85"
              style={{ animationDelay: '350ms' }}
            >
              People, time, assets, software, access and exits — one governed
              platform for Harvik Technologies.
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '450ms' }}>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/80">
              Innovate&nbsp;•&nbsp;Integrate&nbsp;•&nbsp;Elevate
            </p>
            <p className="mt-2 text-xs text-white/60">
              HARVIK Technologies Private Limited · Hyderabad, India
            </p>
          </div>
        </div>
      </div>

      {/* ——— Form side ——— */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 animate-logo-pop lg:hidden">
            <Logo height={40} />
          </div>

          <div
            className="animate-fade-up rounded-2xl border border-slate-200/80 bg-white p-8 shadow-brand-glow"
            style={{ animationDelay: '100ms' }}
          >
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Harvik Technologies
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to the internal HR dashboard
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@harviktech.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>

              {error ? (
                <p role="alert" className="animate-fade-in rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-gradient animate-gradient-pan w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-brand-glow transition-all duration-200 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundSize: '200% 100%' }}
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <div className="mt-6 text-center">
                <span className="text-xs text-slate-500">Quick login as:</span>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('admin@harviktech.com');
                      setPassword('Passw0rd!');
                    }}
                    className="flex-1 rounded-xl px-3 py-1.5 text-sm font-medium text-brand-600 border border-brand-600/50 hover:border-brand-500 transition-all duration-150"
                  >
                    HR Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('hrmanager@harviktech.com');
                      setPassword('Passw0rd!');
                    }}
                    className="flex-1 rounded-xl px-3 py-1.5 text-sm font-medium text-emerald-600 border border-emerald-600/50 hover:border-emerald-500 transition-all duration-150"
                  >
                    HR Manager
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('manager@harviktech.com');
                      setPassword('Passw0rd!');
                    }}
                    className="flex-1 rounded-xl px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-300/50 hover:border-slate-400 transition-all duration-150"
                  >
                    Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('employee@harviktech.com');
                      setPassword('Passw0rd!');
                    }}
                    className="flex-1 rounded-xl px-3 py-1.5 text-sm font-medium text-green-600 border border-green-600/50 hover:border-green-500 transition-all duration-150"
                  >
                    Employee
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">Then click Sign in below (or press Enter).</p>
          </div>

          <p className="animate-fade-in mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400" style={{ animationDelay: '250ms' }}>
            Protected by Harvik HR · unauthorized access is prohibited
          </p>
        </div>
      </div>
    </main>
  );
}
