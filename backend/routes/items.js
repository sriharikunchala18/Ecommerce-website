const express = require('express');
const Item = require('../models/Item');
const router = express.Router();

// Create item
router.post('/', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
});

// Read/list with filters
router.get('/', async (req, res) => {
  const { q, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { description: new RegExp(q, 'i') }];
  if (category) filter.category = category;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = parseFloat(minPrice);
  if (maxPrice) filter.price.$lte = parseFloat(maxPrice);

  let query = Item.find(filter);
  if (sort === 'price_asc') query = query.sort({ price: 1 });
  else if (sort === 'price_desc') query = query.sort({ price: -1 });
  else query = query.sort({ createdAt: -1 });

  const total = await Item.countDocuments(filter);
  const items = await query.skip((page - 1) * limit).limit(parseInt(limit));
  res.json({ total, page: parseInt(page), items });
});

// Get single
router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
});

// Update
router.put('/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(item);
});

// Delete
router.delete('/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
