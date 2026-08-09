/**
 * EditProfileForm.jsx
 * --------------------
 * Editable form for the current user's own profile (name/avatar).
 * Used by pages/Profile.jsx. Wires up to userService.updateProfile
 * once that's implemented.
 */

import { useForm } from '../../hooks/useForm';
import Input from '../common/Input';
import Button from '../common/Button';
import { useState } from 'react';

function EditProfileForm({ user, onSaved }) {
  const { values, handleChange } = useForm({ name: user?.name || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: call userService.updateProfile(values) once implemented
      onSaved?.(values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input id="name" name="name" label="Full Name" value={values.name} onChange={handleChange} required />
      <Button type="submit" loading={loading}>Save Changes</Button>
    </form>
  );
}

export default EditProfileForm;
