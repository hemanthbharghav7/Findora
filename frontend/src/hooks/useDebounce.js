/**
 * hooks/useDebounce.js
 * ----------------------
 * Returns a debounced copy of `value` that only updates after `delay` ms
 * of no changes. Used for search/filter inputs (e.g. BrowseItems search box)
 * to avoid firing an API call on every keystroke.
 *
 * Usage:
 *   const debouncedQuery = useDebounce(query, 400);
 */

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
