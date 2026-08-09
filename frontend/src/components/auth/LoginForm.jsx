/**
 * LoginForm.jsx
 * -------------
 * Email/password login form. Used by pages/Login.jsx.
 * Wires up to useAuth().login once AuthContext is implemented.
 */

import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useState } from 'react';

function LoginForm() {
  const { values, handleChange } = useForm({ email: '', password: '' });
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // TODO: await login(values); then redirect on success
      await login(values);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Alert tone="error">{error}</Alert>
      <Input
        id="email" name="email" type="email" label="Email"
        value={values.email} onChange={handleChange} required
      />
      <Input
        id="password" name="password" type="password" label="Password"
        value={values.password} onChange={handleChange} required
      />
      <Button type="submit" loading={loading}>Log In</Button>
    </form>
  );
}

export default LoginForm;
