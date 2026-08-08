import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import VendorForm from './VendorForm';

const emptyForm = { name: '', location: '', salesman: '', contactNumber: '' };

export default function VendorAdd() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/vendors', form);
      navigate('/vendors');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vendor');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <VendorForm
      title="Add Vendor"
      form={form}
      onChange={setForm}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/vendors')}
      error={error}
      submitting={submitting}
      submitLabel="Save Vendor"
    />
  );
}
