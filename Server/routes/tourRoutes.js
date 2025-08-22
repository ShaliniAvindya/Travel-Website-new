const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour'); 

router.get('/stats', async (req, res) => {
  try {
    const categoryStats = await Tour.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          image: { $first: '$tour_image' },
        },
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          image: 1,
          _id: 0,
        },
      },
    ]);
    res.status(200).json(categoryStats);
  } catch (error) {
    console.error('Error fetching tour stats:', error);
    res.status(500).json({ error: 'Failed to retrieve tour stats' });
  }
});

// Get all tours
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Failed to retrieve tours' });
  }
});

// Get a single tour by ID
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ error: 'Failed to retrieve tour' });
  }
});

// Create a new tour (Admin only)
router.post('/', async (req, res) => {
  try {
    const tour = new Tour(req.body);
    await tour.save();
    res.status(201).json(tour);
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(400).json({ message: 'Error creating tour', error: error.message });
  }
});

// Update a tour
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(400).json({ message: 'Error updating tour', error: error.message });
  }
});

// Delete a tour (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const tourId = req.params.id;
    const deletedTour = await Tour.findByIdAndDelete(tourId);
    if (!deletedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ message: 'Failed to delete tour', error: error.message });
  }
});

module.exports = router;
