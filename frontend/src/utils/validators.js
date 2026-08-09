/**
 * utils/validators.js
 * ----------------------
 * Shared client-side validation helpers for auth and item forms.
 * Mirrors (but does not replace) server-side validation.
 */

export function isValidEmail(email = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password = '') {
  // TODO: align with whatever backend password policy gets implemented
  return password.length >= 8;
}

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}
