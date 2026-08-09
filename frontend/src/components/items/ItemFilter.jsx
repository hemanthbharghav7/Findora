/**
 * ItemFilter.jsx
 * --------------
 * Search + type/category filter bar for BrowseItems.
 * Debounces the search input via useDebounce before calling onChange.
 *
 * Props:
 *  - onChange: (filters) => void
 */

import { useState, useEffect } from 'react';
import Input from '../common/Input';
import { useDebounce } from '../../hooks/useDebounce';

function ItemFilter({ onChange }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    onChange?.({ q: debouncedQuery, type });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, type]);

  return (
    <div className="item-filter">
      <Input
        id="search" placeholder="Search items…"
        value={query} onChange={(e) => setQuery(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">All</option>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
    </div>
  );
}

export default ItemFilter;
