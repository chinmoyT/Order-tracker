import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import OrderForm from './OrderForm';

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function OrderAdd() {
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    await api.post('/orders', payload);
    navigate('/orders');
  }

  return (
    <OrderForm
      title="Add New Order"
      initialValues={{ orderDate: today(), vendorName: '', salesmanName: '', items: [] }}
      onSubmit={handleSubmit}
      onCancel={() => navigate('/orders')}
      submitLabel="Submit"
    />
  );
}
