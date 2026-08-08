const express = require('express');
const {
  listVendors,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
} = require('../controllers/vendor.controller');
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);
router.get('/', listVendors);
router.post('/', createVendor);
router.get('/:id', getVendor);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

module.exports = router;
