const Salesman = require('../models/Salesman');

async function listSalesmen(req, res) {
  const salesmen = await Salesman.find().sort({ createdAt: -1 });
  res.json({ salesmen });
}

async function getSalesman(req, res) {
  const salesman = await Salesman.findById(req.params.id);
  if (!salesman) {
    return res.status(404).json({ message: 'Salesman not found' });
  }
  res.json({ salesman });
}

async function createSalesman(req, res) {
  const { name, areaCovered, contactNumber, numberOfParties } = req.body;

  if (!name || !areaCovered) {
    return res.status(400).json({ message: 'name and areaCovered are required' });
  }

  const salesman = await Salesman.create({ name, areaCovered, contactNumber, numberOfParties });
  res.status(201).json({ salesman });
}

async function updateSalesman(req, res) {
  const { name, areaCovered, contactNumber, numberOfParties } = req.body;

  if (!name || !areaCovered) {
    return res.status(400).json({ message: 'name and areaCovered are required' });
  }

  const salesman = await Salesman.findByIdAndUpdate(
    req.params.id,
    { name, areaCovered, contactNumber, numberOfParties },
    { new: true, runValidators: true }
  );

  if (!salesman) {
    return res.status(404).json({ message: 'Salesman not found' });
  }
  res.json({ salesman });
}

async function deleteSalesman(req, res) {
  const salesman = await Salesman.findByIdAndDelete(req.params.id);
  if (!salesman) {
    return res.status(404).json({ message: 'Salesman not found' });
  }
  res.status(204).send();
}

module.exports = { listSalesmen, getSalesman, createSalesman, updateSalesman, deleteSalesman };
