const Order = require('../models/Order');

function cleanItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'At least one order item is required' };
  }

  const cleanedItems = [];
  for (const raw of items) {
    const category = (raw.category || '').trim();
    const item = (raw.item || '').trim();
    const bags = Number(raw.bags);
    const bagSize = raw.bagSize === '25kg' ? '25kg' : '50kg';

    if (!category || !item || !Number.isFinite(bags) || bags < 0) {
      return { error: 'Each item needs a category, item and a valid bags count' };
    }

    cleanedItems.push({ category, item, bags, bagSize });
  }

  return { cleanedItems };
}

function totalWeightKgOf(cleanedItems) {
  return cleanedItems.reduce((sum, i) => sum + i.bags * (i.bagSize === '25kg' ? 25 : 50), 0);
}

async function listOrders(req, res) {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ orders });
}

async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json({ order });
}

async function createOrder(req, res) {
  const { orderDate, vendorName, salesmanName, items } = req.body;

  if (!orderDate || !vendorName) {
    return res.status(400).json({ message: 'orderDate and vendorName are required' });
  }

  const { error, cleanedItems } = cleanItems(items);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const totalBags = cleanedItems.reduce((sum, i) => sum + i.bags, 0);
  const totalWeightKg = totalWeightKgOf(cleanedItems);

  const order = await Order.create({
    orderDate,
    vendorName,
    salesmanName,
    items: cleanedItems,
    totalBags,
    totalWeightKg,
  });

  res.status(201).json({ order });
}

async function updateOrder(req, res) {
  const { orderDate, vendorName, salesmanName, items, status } = req.body;

  if (!orderDate || !vendorName) {
    return res.status(400).json({ message: 'orderDate and vendorName are required' });
  }

  if (status && !['pending', 'dispatched'].includes(status)) {
    return res.status(400).json({ message: 'status must be pending or dispatched' });
  }

  const { error, cleanedItems } = cleanItems(items);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const totalBags = cleanedItems.reduce((sum, i) => sum + i.bags, 0);
  const totalWeightKg = totalWeightKgOf(cleanedItems);

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderDate, vendorName, salesmanName, items: cleanedItems, totalBags, totalWeightKg, ...(status && { status }) },
    { new: true, runValidators: true }
  );

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json({ order });
}

async function deleteOrder(req, res) {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.status(204).send();
}

module.exports = { listOrders, getOrder, createOrder, updateOrder, deleteOrder };
