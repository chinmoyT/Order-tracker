const express = require('express');
const {
  listSalesmen,
  getSalesman,
  createSalesman,
  updateSalesman,
  deleteSalesman,
} = require('../controllers/salesman.controller');
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);
router.get('/', listSalesmen);
router.post('/', createSalesman);
router.get('/:id', getSalesman);
router.put('/:id', updateSalesman);
router.delete('/:id', deleteSalesman);

module.exports = router;
