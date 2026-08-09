/**
 * utils/constants.js
 * ----------------------
 * Shared frontend constants: item types/statuses, claim statuses,
 * and localStorage keys used across auth/service files.
 */

export const ITEM_TYPES = { LOST: 'lost', FOUND: 'found' };

export const CLAIM_STATUS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' };

export const STORAGE_KEYS = { TOKEN: 'findora_token', USER: 'findora_user' };
