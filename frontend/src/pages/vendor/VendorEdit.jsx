import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import api from '../../api/axios';
import VendorForm from './VendorForm';

const emptyForm = { name: '', location: '', salesman: '', contactNumber: '' };

export default function VendorEdit() {
  const { id } = useParams();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/vendors/${id}`)
      .then((res) => {
        const { name, location, salesman, contactNumber } = res.data.vendor;
        setForm({ name, location, salesman, contactNumber });
      })
      .catch((err) => setLoadError(err.response?.data?.message || 'Failed to load vendor'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.put(`/vendors/${id}`, form);
      navigate('/vendors');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update vendor');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (loadError) {
    return <Alert severity="error">{loadError}</Alert>;
  }

  return (
    <VendorForm
      title="Edit Vendor"
      form={form}
      onChange={setForm}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/vendors')}
      error={error}
      submitting={submitting}
      submitLabel="Save Changes"
    />
  );
}
