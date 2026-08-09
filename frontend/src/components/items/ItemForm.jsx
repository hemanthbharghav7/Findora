/**
 * ItemForm.jsx
 * ------------
 * Create/edit form for a lost or found item. Used by pages/ReportItem.jsx.
 * Includes ImageUpload for the item photo(s).
 */

import { useForm } from '../../hooks/useForm';
import Input from '../common/Input';
import Button from '../common/Button';
import ImageUpload from './ImageUpload';
import { createItem } from '../../services/itemService';
import { useState } from 'react';

function ItemForm({ onSuccess }) {
  const { values, handleChange, setValues } = useForm({
    title: '', description: '', type: 'lost', category: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: build FormData with values + image, call createItem
      await createItem({ ...values, image });
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input id="title" name="title" label="Item Title" value={values.title} onChange={handleChange} required />
      <Input id="description" name="description" label="Description" value={values.description} onChange={handleChange} required />
      <ImageUpload onChange={setImage} />
      <Button type="submit" loading={loading}>Submit Report</Button>
    </form>
  );
}

export default ItemForm;
