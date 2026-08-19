import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import PlaceIcon from '@mui/icons-material/Place';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BadgeIcon from '@mui/icons-material/Badge';
import NotesIcon from '@mui/icons-material/Notes';
import api from '../api/axios';

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/orders'), api.get('/vendors')])
      .then(([ordersRes, vendorsRes]) => {
        const locationByVendor = new Map(vendorsRes.data.vendors.map((v) => [v.name, v.location]));
        const pending = ordersRes.data.orders
          .filter((order) => order.status === 'pending')
          .map((order) => ({
            id: order._id,
            partyName: order.vendorName,
            location: locationByVendor.get(order.vendorName) || '—',
            salesmanName: order.salesmanName,
            note: order.note,
            totalBags: order.totalBags,
            totalWeightTonnes: order.totalWeightKg / 1000,
          }));
        setCards(pending);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load pending orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        Pending Orders
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : cards.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No pending orders.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 2,
          }}
        >
          {cards.map((card) => (
            <Card key={card.id} variant="outlined">
              <CardActionArea onClick={() => navigate(`/orders/${card.id}/edit`)}>
                <CardContent>
                  <Typography variant="h6" noWrap gutterBottom>
                    {card.partyName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <PlaceIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {card.location}
                    </Typography>
                  </Box>
                  {card.salesmanName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                      <BadgeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {card.salesmanName}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Inventory2Icon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {card.totalBags} bags · {card.totalWeightTonnes.toFixed(2)} tonnes
                    </Typography>
                  </Box>
                  {card.note && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mt: 1 }}>
                      <NotesIcon fontSize="small" color="action" sx={{ mt: '2px' }} />
                      <Typography variant="body2" color="text.secondary">
                        {card.note}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
