/**
 * BrowseItems.jsx
 * ---------------
 * The "Evidence Room" — server-side paginated search & filter.
 * All filtering/sorting happens on the backend; only the current page is fetched.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './BrowseItems.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const LIMIT = 12;

const CATEGORIES = [
  'All Categories', 'Electronics', 'Clothing', 'Documents',
  'Keys', 'Wallet', 'Jewellery', 'Bag', 'Other',
];

const CAT_ICONS = {
  Electronics: '💻', Clothing: '👕', Documents: '📄', Keys: '🔑',
  Wallet: '👛', Jewellery: '💍', Bag: '🎒', Other: '📦',
};

function BrowseItems() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync state from URL params so links/back button work
  const [searchTerm,     setSearchTerm]     = useState(searchParams.get('search')   || '');
  const [filterType,     setFilterType]     = useState(searchParams.get('type')     || 'All');
  const [filterCategory, setFilterCategory] = useState(searchParams.get('category') || 'All Categories');
  const [sortBy,         setSortBy]         = useState(searchParams.get('sort')     || 'newest');
  const [page,           setPage]           = useState(parseInt(searchParams.get('page') || '1', 10));

  const [items,   setItems]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Debounce search input
  const debounceRef = useRef(null);

  const fetchItems = useCallback(async (params) => {
    setLoading(true);
    setError('');
    try {
      const url = new URL(`${API}/api/items`);
      if (params.search)                              url.searchParams.set('search',   params.search);
      if (params.type     && params.type !== 'All')   url.searchParams.set('type',     params.type);
      if (params.category && params.category !== 'All Categories')
                                                       url.searchParams.set('category', params.category);
      url.searchParams.set('sort',  params.sort  || 'newest');
      url.searchParams.set('page',  params.page  || 1);
      url.searchParams.set('limit', LIMIT);

      const res  = await fetch(url.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Server error');

      setItems(data.items);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      setError(err.message || 'Failed to load items.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch whenever any filter/page changes
  useEffect(() => {
    const params = { search: searchTerm, type: filterType, category: filterCategory, sort: sortBy, page };

    // Update URL
    const sp = new URLSearchParams();
    if (searchTerm)                              sp.set('search',   searchTerm);
    if (filterType     !== 'All')                sp.set('type',     filterType);
    if (filterCategory !== 'All Categories')     sp.set('category', filterCategory);
    if (sortBy         !== 'newest')             sp.set('sort',     sortBy);
    if (page           !== 1)                    sp.set('page',     page);
    setSearchParams(sp, { replace: true });

    fetchItems(params);
  }, [searchTerm, filterType, filterCategory, sortBy, page, fetchItems, setSearchParams]);

  // Debounced search handler
  const handleSearchChange = (val) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchTerm(val);
      setPage(1);
    }, 400);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterType('All');
    setFilterCategory('All Categories');
    setSortBy('newest');
    setPage(1);
  };

  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="browse-page">
      <div className="browse-container">

        {/* ── Header ──────────────────────────────────────── */}
        <header className="browse-header">
          <div className="header-content">
            <h1 className="browse-title">🗄️ The Evidence Room</h1>
            <p className="browse-subtitle">
              Search across {total > 0 ? total.toLocaleString() : '…'} case files. Use filters to narrow your investigation.
            </p>
          </div>
          <Link to="/report" className="btn btn-primary">📝 File New Case</Link>
        </header>

        {/* ── Filter Board ────────────────────────────────── */}
        <section className="filter-board">
          <div className="scan-radar-bar" aria-hidden="true">
            <span className="radar-status">🔎 INTEL_RADAR: ACTIVE</span>
            <span className="radar-ping" />
            <span className="radar-text">SCANNING FID EVIDENCE FILES...</span>
          </div>

          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by title, description, location…"
              defaultValue={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button className="search-clear" onClick={() => { setSearchTerm(''); setPage(1); }} title="Clear search">✕</button>
            )}
          </div>

          <div className="filter-controls">
            {/* Type pills */}
            <div className="type-toggle-mini">
              {['All', 'Lost', 'Found'].map(t => (
                <button
                  key={t}
                  className={`toggle-btn ${filterType === t ? 'active' : ''} ${t.toLowerCase()}`}
                  onClick={() => { setFilterType(t); setPage(1); }}
                >
                  {t === 'Lost' ? '🔴 ' : t === 'Found' ? '🟢 ' : ''}{t}
                </button>
              ))}
            </div>

            {/* Category */}
            <select
              className="category-select"
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="category-select"
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            >
              <option value="newest">⬇ Newest First</option>
              <option value="oldest">⬆ Oldest First</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>

            {/* Reset */}
            {(searchTerm || filterType !== 'All' || filterCategory !== 'All Categories' || sortBy !== 'newest') && (
              <button className="btn-reset" onClick={resetFilters}>✕ Reset</button>
            )}
          </div>
        </section>

        {/* ── Evidence Grid ───────────────────────────────── */}
        <section className="evidence-section">

          {/* Results count */}
          {!loading && !error && (
            <p className="results-count">
              {total === 0
                ? 'No case files found'
                : `Showing ${((page - 1) * LIMIT) + 1}–${Math.min(page * LIMIT, total)} of ${total.toLocaleString()} case file${total !== 1 ? 's' : ''}`}
            </p>
          )}

          {loading && <div className="loader">Accessing records…</div>}
          {error   && <div className="form-error">⚠️ {error}</div>}

          {!loading && !error && items.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">📂</span>
              <h3>No matching files found</h3>
              <p>Try adjusting your search terms or clearing the filters.</p>
              <button className="btn btn-outline" onClick={resetFilters} style={{ marginTop: '1rem' }}>
                Clear Filters
              </button>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="case-grid">
              {items.map(item => (
                <div key={item._id} className={`case-file-card ${item.type.toLowerCase()} status-${item.status.toLowerCase()}`}>
                  {item.status === 'Resolved' && (
                    <div className="resolved-card-overlay">
                      <span className="resolved-card-stamp">RESOLVED</span>
                    </div>
                  )}

                   {/* Image */}
                  {item.image ? (
                    <div className="card-image-wrapper">
                      <div className="card-photo-corners">
                        <span className="card-corner tl" />
                        <span className="card-corner tr" />
                        <span className="card-corner bl" />
                        <span className="card-corner br" />
                      </div>
                      <img
                        src={item.image.startsWith('http') || item.image.startsWith('data:') ? item.image : `${API}${item.image}`}
                        alt={item.title}
                        className="card-image"
                      />
                    </div>
                  ) : (
                    <div className="card-no-image">
                      <div className="card-photo-corners">
                        <span className="card-corner tl" />
                        <span className="card-corner tr" />
                        <span className="card-corner bl" />
                        <span className="card-corner br" />
                      </div>
                      <span>{CAT_ICONS[item.category] || '📦'}</span>
                    </div>
                  )}

                  <div className="case-header">
                    <span className={`badge ${item.status.toLowerCase()}`}>
                      {item.status === 'Open' ? '🔴 Open'
                        : item.status === 'Claimed' ? '🟡 Claimed' : '🟢 Resolved'}
                    </span>
                    <span className="card-case-num">FID-{item._id.slice(-6).toUpperCase()}</span>
                    <span className="case-type">{item.type}</span>
                  </div>

                  <h3 className="case-title">{item.title}</h3>

                  <div className="case-details">
                    <p><strong>📂</strong> {item.category}</p>
                    <p><strong>📍</strong> {item.location}</p>
                    <p><strong>📅</strong> {new Date(item.date).toLocaleDateString()}</p>
                  </div>

                  <p className="case-preview">
                    {item.description.length > 90
                      ? `${item.description.slice(0, 90)}…`
                      : item.description}
                  </p>

                  <div className="case-footer">
                    <Link to={`/items/${item._id}`} className="btn-small w-100 text-center">
                      Examine File →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Pagination ──────────────────────────────── */}
          {!loading && pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn page-arrow"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >← Prev</button>

              <div className="page-numbers">
                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === '…'
                      ? <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
                      : <button
                          key={p}
                          className={`page-btn ${page === p ? 'active' : ''}`}
                          onClick={() => goToPage(p)}
                        >{p}</button>
                  )}
              </div>

              <button
                className="page-btn page-arrow"
                disabled={page >= pages}
                onClick={() => goToPage(page + 1)}
              >Next →</button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default BrowseItems;