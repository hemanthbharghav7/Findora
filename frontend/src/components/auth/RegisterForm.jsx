/**
 * RegisterForm.jsx
 * ----------------
 * New account registration form. Used by pages/Register.jsx.
 * Wires up to useAuth().register once AuthContext is implemented.
 */

import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useState } from 'react';

function RegisterForm() {
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // TODO: await register(values); then redirect on success
      await register(values);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Alert tone="error">{error}</Alert>
      <Input id="name" name="name" label="Full Name" value={values.name} onChange={handleChange} required />
      <Input id="email" name="email" type="email" label="Email" value={values.email} onChange={handleChange} required />
      <Input id="password" name="password" type="password" label="Password" value={values.password} onChange={handleChange} required />
      <Button type="submit" loading={loading}>Create Account</Button>
    </form>
  );
}

export default RegisterForm;
