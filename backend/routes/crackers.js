const express = require('express');
const router = express.Router();
const Cracker = require('../models/Cracker');
const { auth, adminAuth } = require('../middleware/auth');
const upload = require('../config/multer');

// Get all crackers
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const crackers = await Cracker.find(filter).populate('createdBy', 'name');
    res.json({
      success: true,
      crackers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single cracker
router.get('/:id', async (req, res) => {
  try {
    const cracker = await Cracker.findById(req.params.id).populate('createdBy', 'name');

    if (!cracker) {
      return res.status(404).json({ message: 'Cracker not found' });
    }

    res.json({
      success: true,
      cracker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create cracker (Admin only)
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const cracker = new Cracker({
      name,
      description,
      price,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
      stock,
      createdBy: req.user.id,
    });

    await cracker.save();

    res.status(201).json({
      success: true,
      cracker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cracker (Admin only)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    let cracker = await Cracker.findById(req.params.id);

    if (!cracker) {
      return res.status(404).json({ message: 'Cracker not found' });
    }

    const updateData = {
      name,
      description,
      price,
      category,
      stock,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    cracker = await Cracker.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      cracker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete cracker (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const cracker = await Cracker.findByIdAndDelete(req.params.id);

    if (!cracker) {
      return res.status(404).json({ message: 'Cracker not found' });
    }

    res.json({
      success: true,
      message: 'Cracker deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
