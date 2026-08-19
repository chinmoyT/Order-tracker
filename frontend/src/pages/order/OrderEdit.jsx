import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import api from '../../api/axios';
import OrderForm from './OrderForm';

export default function OrderEdit() {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [loadError, setLoadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => {
        const { orderDate, vendorName, salesmanName, note, items, status, dispatchedOn } = res.data.order;
        setInitialValues({
          orderDate: orderDate.slice(0, 10),
          vendorName,
          salesmanName,
          note,
          items,
          status,
          dispatchedOn: dispatchedOn ? dispatchedOn.slice(0, 10) : '',
        });
      })
      .catch((err) => setLoadError(err.response?.data?.message || 'Failed to load order'));
  }, [id]);

  async function handleSubmit(payload) {
    await api.put(`/orders/${id}`, payload);
    navigate('/orders');
  }

  if (loadError) {
    return <Alert severity="error">{loadError}</Alert>;
  }

  if (!initialValues) {
    return <CircularProgress />;
  }

  return (
    <OrderForm
      title="Edit Order"
      initialValues={initialValues}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/orders')}
      submitLabel="Save Changes"
      showStatus
    />
  );
}
