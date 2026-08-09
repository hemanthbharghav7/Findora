/**
 * Badge.jsx
 * ---------
 * Small status pill — used for item status (lost/found) and claim status
 * (pending/approved/rejected).
 *
 * Props:
 *  - tone: 'neutral' | 'success' | 'warning' | 'danger' (default 'neutral')
 */

function Badge({ children, tone = 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export default Badge;
