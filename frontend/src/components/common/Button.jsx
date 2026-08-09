/**
 * Button.jsx
 * ----------
 * Shared button component with variant/size styling hooks.
 * TODO: Replace inline style with Button.css once the design system lands.
 *
 * Props:
 *  - variant: 'primary' | 'secondary' | 'danger' (default 'primary')
 *  - loading: bool — shows a disabled/loading state
 *  - rest props are forwarded to the native <button>
 */

function Button({ children, variant = 'primary', loading = false, ...rest }) {
  return (
    <button className={`btn btn-${variant}`} disabled={loading || rest.disabled} {...rest}>
      {loading ? 'Loading…' : children}
    </button>
  );
}

export default Button;
