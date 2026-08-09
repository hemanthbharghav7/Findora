/**
 * Alert.jsx
 * ---------
 * Inline banner for form/API errors and success messages.
 *
 * Props:
 *  - tone: 'error' | 'success' | 'info' (default 'info')
 */

function Alert({ children, tone = 'info' }) {
  if (!children) return null;
  return <div className={`alert alert-${tone}`} role="alert">{children}</div>;
}

export default Alert;
