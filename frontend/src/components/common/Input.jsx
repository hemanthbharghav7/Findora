/**
 * Input.jsx
 * ---------
 * Shared labeled text input for forms (LoginForm, RegisterForm, ItemForm).
 *
 * Props:
 *  - label: string
 *  - error: string — validation message shown below the input
 *  - rest props are forwarded to the native <input>
 */

function Input({ label, error, id, ...rest }) {
  return (
    <div className="form-field">
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} {...rest} />
      {error && <span className="form-field-error">{error}</span>}
    </div>
  );
}

export default Input;
