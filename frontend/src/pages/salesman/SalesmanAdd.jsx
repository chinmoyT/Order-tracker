import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import SalesmanForm from './SalesmanForm';

const emptyForm = { name: '', areaCovered: '', contactNumber: '', numberOfParties: '' };

export default function SalesmanAdd() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/salesmen', form);
      navigate('/salesmen');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add salesman');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SalesmanForm
      title="Add Salesman"
      form={form}
      onChange={setForm}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/salesmen')}
      error={error}
      submitting={submitting}
      submitLabel="Save Salesman"
    />
  );
}
