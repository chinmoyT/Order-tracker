const express = require('express');
const { listOrders, getOrder, createOrder, updateOrder, deleteOrder, bulkDeleteOrders } = require('../controllers/order.controller');
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);
router.get('/', listOrders);
router.post('/', createOrder);
router.post('/bulk-delete', bulkDeleteOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
