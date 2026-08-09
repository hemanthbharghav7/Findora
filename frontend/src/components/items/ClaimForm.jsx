/**
 * ClaimForm.jsx
 * -------------
 * Form for submitting an ownership claim on a found item.
 * Used by pages/ItemDetails.jsx.
 *
 * Props:
 *  - itemId: string
 *  - onSubmitted: () => void
 */

import { useForm } from '../../hooks/useForm';
import Input from '../common/Input';
import Button from '../common/Button';
import { submitClaim } from '../../services/itemService';
import { useState } from 'react';

function ClaimForm({ itemId, onSubmitted }) {
  const { values, handleChange } = useForm({ message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitClaim(itemId, values);
      onSubmitted?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="message" name="message" label="Why is this item yours?"
        value={values.message} onChange={handleChange} required
      />
      <Button type="submit" loading={loading}>Submit Claim</Button>
    </form>
  );
}

export default ClaimForm;
