import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';

const emptyItem = { category: '', item: '', bags: '', bagSize: '50kg' };

export default function OrderForm({
  title,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  showStatus = false,
}) {
  const [orderDate, setOrderDate] = useState(initialValues.orderDate);
  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState(initialValues.vendorName);
  const [salesmen, setSalesmen] = useState([]);
  const [salesmanName, setSalesmanName] = useState(initialValues.salesmanName || '');
  const [items, setItems] = useState(
    initialValues.items?.length
      ? initialValues.items.map((it) => ({ ...it, bags: String(it.bags), bagSize: it.bagSize || '50kg' }))
      : [{ ...emptyItem }]
  );
  const [status, setStatus] = useState(initialValues.status || 'pending');
  const [dispatchedOn, setDispatchedOn] = useState(initialValues.dispatchedOn || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/vendors').then((res) => setVendors(res.data.vendors)).catch(() => setVendors([]));
    api.get('/salesmen').then((res) => setSalesmen(res.data.salesmen)).catch(() => setSalesmen([]));
  }, []);

  function handleVendorChange(e) {
    const name = e.target.value;
    setVendorName(name);
    const vendor = vendors.find((v) => v.name === name);
    setSalesmanName(vendor?.salesman || '');
  }

  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }

  function addItemRow() {
    setItems((prev) => [...prev, { ...emptyItem }]);
  }

  function removeItemRow(index) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  const totalBags = useMemo(
    () => items.reduce((sum, it) => sum + (Number(it.bags) || 0), 0),
    [items]
  );

  const totalWeightTonnes = useMemo(() => {
    const totalKg = items.reduce((sum, it) => {
      const sizeKg = it.bagSize === '25kg' ? 25 : 50;
      return sum + (Number(it.bags) || 0) * sizeKg;
    }, 0);
    return totalKg / 1000;
  }, [items]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!vendorName) {
      setError('Please select a vendor');
      return;
    }

    const cleanedItems = items
      .map((it) => ({ ...it, category: it.category.trim(), item: it.item.trim() }))
      .filter((it) => it.category || it.item || it.bags !== '');

    if (cleanedItems.length === 0) {
      setError('Add at least one item');
      return;
    }

    for (const it of cleanedItems) {
      if (!it.category || !it.item || it.bags === '' || Number(it.bags) < 0) {
        setError('Every item needs a category, item and a valid number of bags');
        return;
      }
    }

    setSubmitting(true);
    try {
      await onSubmit({
        orderDate,
        vendorName,
        salesmanName,
        items: cleanedItems.map((it) => ({ ...it, bags: Number(it.bags) })),
        ...(showStatus && { status, dispatchedOn: dispatchedOn || null }),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save order');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 720 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Date of Order Placed"
              type="date"
              required
              fullWidth
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth required>
              <InputLabel id="order-vendor-label">Vendor Name</InputLabel>
              <Select
                labelId="order-vendor-label"
                label="Vendor Name"
                value={vendorName}
                onChange={handleVendorChange}
              >
                {vendorName && !vendors.some((v) => v.name === vendorName) && (
                  <MenuItem value={vendorName}>{vendorName}</MenuItem>
                )}
                {vendors.map((v) => (
                  <MenuItem key={v._id} value={v.name}>
                    {v.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="order-salesman-label">Salesman</InputLabel>
              <Select
                labelId="order-salesman-label"
                label="Salesman"
                value={salesmanName || ''}
                onChange={(e) => setSalesmanName(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {salesmanName && !salesmen.some((s) => s.name === salesmanName) && (
                  <MenuItem value={salesmanName}>{salesmanName}</MenuItem>
                )}
                {salesmen.map((s) => (
                  <MenuItem key={s._id} value={s.name}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {showStatus && (
              <FormControl fullWidth>
                <InputLabel id="order-status-label">Status</InputLabel>
                <Select
                  labelId="order-status-label"
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="dispatched">Dispatched</MenuItem>
                </Select>
              </FormControl>
            )}

            {showStatus && (
              <TextField
                label="Dispatched On"
                type="date"
                fullWidth
                value={dispatchedOn}
                onChange={(e) => setDispatchedOn(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            )}

            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Items
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell width={120}>Bags</TableCell>
                    <TableCell width={110}>Bag Size</TableCell>
                    <TableCell width={48} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((it, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="e.g. Broiler"
                          value={it.category}
                          onChange={(e) => updateItem(index, 'category', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="e.g. Pre starter"
                          value={it.item}
                          onChange={(e) => updateItem(index, 'item', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          fullWidth
                          type="number"
                          inputProps={{ min: 0 }}
                          value={it.bags}
                          onChange={(e) => updateItem(index, 'bags', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          fullWidth
                          value={it.bagSize || '50kg'}
                          onChange={(e) => updateItem(index, 'bagSize', e.target.value)}
                        >
                          <MenuItem value="50kg">50kg</MenuItem>
                          <MenuItem value="25kg">25kg</MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => removeItemRow(index)}
                          disabled={items.length === 1}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle2">Total Bags</Typography>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle2">{totalBags}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="subtitle2">Total Weight</Typography>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Typography variant="subtitle2">{totalWeightTonnes.toFixed(2)} tonnes</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Button startIcon={<AddIcon />} onClick={addItemRow} sx={{ alignSelf: 'flex-start' }}>
              Add Item
            </Button>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button type="submit" variant="contained" disabled={submitting} fullWidth>
                {submitting ? 'Saving...' : submitLabel}
              </Button>
              <Button variant="outlined" onClick={onCancel} fullWidth>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
