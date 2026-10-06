import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import api from '../../api/axios';

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return d.toLocaleDateString();
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) =>
      [
        formatDate(order.orderDate),
        order.vendorName,
        order.salesmanName,
        order.note,
        order.status === 'dispatched' ? 'dispatched' : 'pending',
        ...(order.items || []).flatMap((it) => [it.category, it.item]),
      ].some((field) => (field || '').toLowerCase().includes(term))
    );
  }, [orders, search]);

  const allSelected =
    filteredOrders.length > 0 && filteredOrders.every((o) => selectedIds.includes(o._id));
  const someSelected = filteredOrders.some((o) => selectedIds.includes(o._id)) && !allSelected;

  function loadOrders() {
    setLoading(true);
    return api
      .get('/orders')
      .then((res) => {
        const fetched = res.data.orders;
        const existingIds = new Set(fetched.map((o) => o._id));
        setOrders(fetched);
        setSelectedIds((prev) => prev.filter((id) => existingIds.has(id)));
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function toggleOne(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAll() {
    const visibleIds = filteredOrders.map((o) => o._id);
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !visibleIds.includes(id))
        : [...prev, ...visibleIds.filter((id) => !prev.includes(id))]
    );
  }

  async function handleConfirmDelete() {
    setDeleteError('');
    setDeleting(true);
    try {
      await api.delete(`/orders/${orderToDelete._id}`);
      setOrderToDelete(null);
      await loadOrders();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete order');
    } finally {
      setDeleting(false);
    }
  }

  async function handleConfirmBulkDelete() {
    setDeleteError('');
    setDeleting(true);
    try {
      await api.post('/orders/bulk-delete', { ids: selectedIds });
      setBulkDeleteOpen(false);
      setSelectedIds([]);
      await loadOrders();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete orders');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
          Orders
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/orders/new')}>
          Add New Order
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        placeholder="Search orders by date, vendor, salesman, status, note, category or item..."
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {selectedIds.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 2,
            px: 2,
            py: 1,
            borderRadius: 1,
            bgcolor: 'action.selected',
          }}
        >
          <Typography variant="body2">{selectedIds.length} selected</Typography>
          <Button
            color="error"
            variant="contained"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => {
              setDeleteError('');
              setBulkDeleteOpen(true);
            }}
          >
            Delete Selected
          </Button>
        </Box>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={someSelected}
                    checked={allSelected}
                    onChange={toggleAll}
                    disabled={filteredOrders.length === 0}
                  />
                </TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Vendor Name</TableCell>
                <TableCell>Salesman Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Dispatched On</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {orders.length === 0 ? 'No orders yet.' : 'No orders match your search.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order._id} selected={selectedIds.includes(order._id)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(order._id)}
                        onChange={() => toggleOne(order._id)}
                      />
                    </TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{order.vendorName}</TableCell>
                    <TableCell>{order.salesmanName}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status === 'dispatched' ? 'Dispatched' : 'Pending'}
                        color={order.status === 'dispatched' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(order.dispatchedOn)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => navigate(`/orders/${order._id}/edit`)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => setOrderToDelete(order)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)}>
        <DialogTitle>Delete Orders</DialogTitle>
        <DialogContent>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <DialogContentText>
            Are you sure you want to delete {selectedIds.length} selected order
            {selectedIds.length === 1 ? '' : 's'}? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleConfirmBulkDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(orderToDelete)} onClose={() => setOrderToDelete(null)}>
        <DialogTitle>Delete Order</DialogTitle>
        <DialogContent>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <DialogContentText>
            Are you sure you want to delete the order for "{orderToDelete?.vendorName}"
            {orderToDelete ? ` (${formatDate(orderToDelete.orderDate)})` : ''}? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderToDelete(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
