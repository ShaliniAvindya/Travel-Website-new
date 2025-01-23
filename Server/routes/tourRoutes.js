const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour'); 

router.get('/', async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json(tours);
    } catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({ error: 'Failed to retrieve tours' });
    }
});

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
    const { title, days, price,images, description } = req.body;

    console.log('Received data:', {
        title,
        days,
        price,
        images,
        description,
    });

    try {
        const newTour = new Tour({
        title,
        days,
        price,
        images,
        description,
        });
        const savedTour = await newTour.save();
        res.status(201).json(savedTour);
    } catch (error) {
        console.error('Error saving tour:', error);
        res.status(500).json({ message: 'Failed to save tour', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        room.title = req.body.title || tour.title;
        room.days = req.body.days || tour.days;
        room.price = req.body.price || tour.price;
        room.description = req.body.description || room.description;

        if (req.body.images) {
            tour.images = req.body.images; // Update with new images
        }

        const updatedTour = await tour.save();
        res.json(updatedTour);
    } catch (error) {
        console.error('Error updating tour:', error);
        res.status(500).json({ message: 'Failed to update tour', error: error.message });
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
        res.status(500).json({ message: 'Failed to delete tour', error });
    }
});

module.exports = router;
