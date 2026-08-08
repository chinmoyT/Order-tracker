import { useEffect, useState } from 'react';
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
import api from '../../api/axios';

export default function VendorForm({ title, form, onChange, onSubmit, onCancel, error, submitting, submitLabel }) {
  const [salesmen, setSalesmen] = useState([]);

  useEffect(() => {
    api
      .get('/salesmen')
      .then((res) => setSalesmen(res.data.salesmen))
      .catch(() => setSalesmen([]));
  }, []);

  function handleChange(field) {
    return (e) => onChange((prev) => ({ ...prev, [field]: e.target.value }));
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 480 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={onSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Name"
              required
              fullWidth
              value={form.name}
              onChange={handleChange('name')}
            />
            <TextField
              label="Location"
              required
              fullWidth
              value={form.location}
              onChange={handleChange('location')}
            />
            <FormControl fullWidth>
              <InputLabel id="vendor-salesman-label">Salesman</InputLabel>
              <Select
                labelId="vendor-salesman-label"
                label="Salesman"
                value={form.salesman || ''}
                onChange={handleChange('salesman')}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {form.salesman && !salesmen.some((s) => s.name === form.salesman) && (
                  <MenuItem value={form.salesman}>{form.salesman}</MenuItem>
                )}
                {salesmen.map((s) => (
                  <MenuItem key={s._id} value={s.name}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Contact Number"
              fullWidth
              value={form.contactNumber}
              onChange={handleChange('contactNumber')}
            />
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
