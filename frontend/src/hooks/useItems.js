/**
 * hooks/useItems.js
 * -------------------
 * Fetches and manages the lost & found items list (search/filter/paginate)
 * via itemService, so BrowseItems and Dashboard don't duplicate loading/
 * error state handling.
 *
 * Usage:
 *   const { items, loading, error, refetch } = useItems({ q: 'wallet' });
 */

import { useState, useEffect, useCallback } from 'react';
import { getItems } from '../services/itemService';

export function useItems(params = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: itemService.getItems is still a stub — wire this up once
      // the backend endpoint returns real data.
      const data = await getItems(params);
      setItems(data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}

export default useItems;
