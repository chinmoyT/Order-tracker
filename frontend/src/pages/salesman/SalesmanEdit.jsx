import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import api from '../../api/axios';
import SalesmanForm from './SalesmanForm';

const emptyForm = { name: '', areaCovered: '', contactNumber: '', numberOfParties: '' };

export default function SalesmanEdit() {
  const { id } = useParams();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/salesmen/${id}`)
      .then((res) => {
        const { name, areaCovered, contactNumber, numberOfParties } = res.data.salesman;
        setForm({ name, areaCovered, contactNumber, numberOfParties });
      })
      .catch((err) => setLoadError(err.response?.data?.message || 'Failed to load salesman'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.put(`/salesmen/${id}`, form);
      navigate('/salesmen');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update salesman');
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
    <SalesmanForm
      title="Edit Salesman"
      form={form}
      onChange={setForm}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/salesmen')}
      error={error}
      submitting={submitting}
      submitLabel="Save Changes"
    />
  );
}
