/**
 * ImageUpload.jsx
 * ---------------
 * File picker + preview for a single item image. Used by ItemForm.
 *
 * Props:
 *  - onChange: (file: File | null) => void
 */

import { useState } from 'react';

function ImageUpload({ onChange }) {
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    onChange?.(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="image-upload">
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && <img src={preview} alt="Preview" className="image-upload-preview" />}
    </div>
  );
}

export default ImageUpload;
