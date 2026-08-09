/**
 * utils/formatDate.js
 * ----------------------
 * Consistent date formatting for item cards, profile info, etc.
 */

export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default formatDate;
