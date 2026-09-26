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
    const price = raw.price === '' || raw.price === undefined || raw.price === null ? 0 : Number(raw.price);

    if (!category || !item || !Number.isFinite(bags) || bags < 0) {
      return { error: 'Each item needs a category, item and a valid bags count' };
    }
    if (!Number.isFinite(price) || price < 0) {
      return { error: 'Each item needs a valid price' };
    }

    cleanedItems.push({ category, item, bags, bagSize, price });
  }

  return { cleanedItems };
}

function totalWeightKgOf(cleanedItems) {
  return cleanedItems.reduce((sum, i) => sum + i.bags * (i.bagSize === '25kg' ? 25 : 50), 0);
}

function totalPriceOf(cleanedItems) {
  return cleanedItems.reduce((sum, i) => sum + i.bags * (i.price || 0), 0);
}

// Older orders saved before bag size/weight/price tracking existed don't have
// totalWeightKg/totalPrice stored — fall back to computing them from their items so
// every order returns a valid value.
function withWeightFallback(order) {
  const withWeight = typeof order.totalWeightKg === 'number'
    ? order
    : { ...order, totalWeightKg: totalWeightKgOf(order.items || []) };
  return typeof withWeight.totalPrice === 'number'
    ? withWeight
    : { ...withWeight, totalPrice: totalPriceOf(order.items || []) };
}

async function listOrders(req, res) {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ orders: orders.map((o) => withWeightFallback(o.toObject())) });
}

async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json({ order: withWeightFallback(order.toObject()) });
}

async function createOrder(req, res) {
  const { orderDate, vendorName, salesmanName, note, items } = req.body;

  if (!orderDate || !vendorName) {
    return res.status(400).json({ message: 'orderDate and vendorName are required' });
  }

  const { error, cleanedItems } = cleanItems(items);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const totalBags = cleanedItems.reduce((sum, i) => sum + i.bags, 0);
  const totalWeightKg = totalWeightKgOf(cleanedItems);
  const totalPrice = totalPriceOf(cleanedItems);

  const order = await Order.create({
    orderDate,
    vendorName,
    salesmanName,
    note,
    items: cleanedItems,
    totalBags,
    totalWeightKg,
    totalPrice,
  });

  res.status(201).json({ order });
}

async function updateOrder(req, res) {
  const { orderDate, vendorName, salesmanName, note, items, status, dispatchedOn } = req.body;

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
  const totalPrice = totalPriceOf(cleanedItems);

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      orderDate,
      vendorName,
      salesmanName,
      note,
      items: cleanedItems,
      totalBags,
      totalWeightKg,
      totalPrice,
      dispatchedOn: dispatchedOn || null,
      ...(status && { status }),
    },
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
