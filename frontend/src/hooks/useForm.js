/**
 * hooks/useForm.js
 * ------------------
 * Small generic hook for controlled form state: values, change handler,
 * and reset. Intended for simple forms (LoginForm, RegisterForm, ItemForm)
 * that don't need a full form library.
 *
 * Usage:
 *   const { values, handleChange, resetForm, setValues } =
 *     useForm({ email: '', password: '' });
 */

import { useState } from 'react';

export function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => setValues(initialValues);

  return { values, setValues, handleChange, resetForm };
}

export default useForm;
