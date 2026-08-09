/**
 * utils/helpers.js
 * ----------------------
 * Small general-purpose helpers that don't belong in a more specific
 * utils file (formatDate.js, validators.js, constants.js).
 */

/** Truncate long text with an ellipsis (e.g. item descriptions in cards). */
export function truncate(text = '', maxLength = 120) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/** Build a full image URL from a backend-relative /uploads path. */
export function resolveImageUrl(path) {
  if (!path) return null;
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return path.startsWith('http') ? path : `${base}${path}`;
}
