import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function SalesmanForm({ title, form, onChange, onSubmit, onCancel, error, submitting, submitLabel }) {
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
              label="Salesman Name"
              required
              fullWidth
              value={form.name}
              onChange={handleChange('name')}
            />
            <TextField
              label="Area Covered"
              required
              fullWidth
              value={form.areaCovered}
              onChange={handleChange('areaCovered')}
            />
            <TextField
              label="Contact Number"
              fullWidth
              value={form.contactNumber}
              onChange={handleChange('contactNumber')}
            />
            <TextField
              label="Number of Parties"
              fullWidth
              value={form.numberOfParties}
              onChange={handleChange('numberOfParties')}
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
