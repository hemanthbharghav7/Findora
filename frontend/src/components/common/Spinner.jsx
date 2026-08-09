/**
 * Spinner.jsx
 * -----------
 * Small loading indicator used while awaiting API responses.
 *
 * Props:
 *  - size: 'sm' | 'md' | 'lg' (default 'md')
 */

function Spinner({ size = 'md' }) {
  return <div className={`spinner spinner-${size}`} role="status" aria-label="Loading" />;
}

export default Spinner;
