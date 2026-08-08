const express = require('express');
const { listOrders, getOrder, createOrder, updateOrder } = require('../controllers/order.controller');
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);
router.get('/', listOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);

module.exports = router;
