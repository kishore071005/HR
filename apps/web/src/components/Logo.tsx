/**
 * Harvik brand identity:
 *
 *   logo.png / logo-light.png  official Harvik wordmark (navy on
 *                            transparent / white on transparent)
 *   favicon.png / favicon-light.png
 *                            official Harvik mark (the triangle +
 *                            diamond icon from harviktech.com,
 *                            navy / white on transparent)
 *
 * The wordmark artwork was supplied by the company; the favicon is
 * the site's official icon, white-keyed to transparency.
 */

export function Logo({
  height = 40,
  tone = 'dark',
  className = '',
}: {
  height?: number;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <img
      src={tone === 'light' ? '/logo-light.png' : '/logo.png'}
      alt="Harvik Technologies"
      height={height}
      width={Math.round((height * 555) / 129)}
      className={`block select-none ${className}`}
      style={{ animation: 'logo-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
    />
  );
}

/** The H monogram crop — square, used where a compact mark is needed. */
export function LogoIcon({
  size = 40,
  tone = 'dark',
  className = '',
}: {
  size?: number;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <img
      src={tone === 'light' ? '/favicon-light.png' : '/favicon.png'}
      alt="Harvik"
      width={size}
      height={size}
      className={`block select-none ${className}`}
    />
  );
}

/** Initials chip used in the top bar — derived from the work email. */
export function AvatarInitials({ email, className = '' }: { email: string; className?: string }) {
  const initials = (email.split('@')[0] ?? '')
    .split(/[._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => (part[0] ?? '').toUpperCase())
    .join('');
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center rounded-xl bg-brand-gradient text-xs font-bold text-white ${className}`}
    >
      {initials || 'H'}
    </span>
  );
}
