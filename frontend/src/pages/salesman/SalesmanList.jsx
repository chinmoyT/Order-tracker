import { useEffect, useState } from 'react';
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../api/axios';

export default function SalesmanList() {
  const [salesmen, setSalesmen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salesmanToDelete, setSalesmanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const navigate = useNavigate();

  function loadSalesmen() {
    setLoading(true);
    return api
      .get('/salesmen')
      .then((res) => setSalesmen(res.data.salesmen))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load salesmen'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadSalesmen();
  }, []);

  async function handleConfirmDelete() {
    setDeleteError('');
    setDeleting(true);
    try {
      await api.delete(`/salesmen/${salesmanToDelete._id}`);
      setSalesmanToDelete(null);
      await loadSalesmen();
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete salesman');
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
          Salesmen
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/salesmen/new')}>
          Add Salesman
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Salesman Name</TableCell>
                <TableCell>Area Covered</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Number of Parties</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesmen.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No salesmen yet.
                  </TableCell>
                </TableRow>
              ) : (
                salesmen.map((salesman) => (
                  <TableRow key={salesman._id}>
                    <TableCell>{salesman.name}</TableCell>
                    <TableCell>{salesman.areaCovered}</TableCell>
                    <TableCell>{salesman.contactNumber}</TableCell>
                    <TableCell>{salesman.numberOfParties}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => navigate(`/salesmen/${salesman._id}/edit`)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => setSalesmanToDelete(salesman)}>
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

      <Dialog open={Boolean(salesmanToDelete)} onClose={() => setSalesmanToDelete(null)}>
        <DialogTitle>Delete Salesman</DialogTitle>
        <DialogContent>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <DialogContentText>
            Are you sure you want to delete "{salesmanToDelete?.name}"? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSalesmanToDelete(null)} disabled={deleting}>
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
