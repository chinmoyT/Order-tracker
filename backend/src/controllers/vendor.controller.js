const Vendor = require('../models/Vendor');

async function listVendors(req, res) {
  const vendors = await Vendor.find().sort({ createdAt: -1 });
  res.json({ vendors });
}

async function getVendor(req, res) {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }
  res.json({ vendor });
}

function parseBalanceDue(raw) {
  if (raw === undefined || raw === null || raw === '') {
    return 0;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

async function createVendor(req, res) {
  const { name, location, salesman, contactNumber, balanceDue } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'name and location are required' });
  }

  const vendor = await Vendor.create({
    name,
    location,
    salesman,
    contactNumber,
    balanceDue: parseBalanceDue(balanceDue),
  });
  res.status(201).json({ vendor });
}

async function updateVendor(req, res) {
  const { name, location, salesman, contactNumber, balanceDue } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'name and location are required' });
  }

  const vendor = await Vendor.findByIdAndUpdate(
    req.params.id,
    { name, location, salesman, contactNumber, balanceDue: parseBalanceDue(balanceDue) },
    { new: true, runValidators: true }
  );

  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }
  res.json({ vendor });
}

async function deleteVendor(req, res) {
  const vendor = await Vendor.findByIdAndDelete(req.params.id);
  if (!vendor) {
    return res.status(404).json({ message: 'Vendor not found' });
  }
  res.status(204).send();
}

module.exports = { listVendors, getVendor, createVendor, updateVendor, deleteVendor };
