const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Tour = require('../models/Tour');

// Utility function for ID validation
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/', async (req, res) => {
  const {
    title, price, nights, itinerary, itinerary_images, itinerary_titles,
    inclusions, exclusions, tour_summary, tour_image,
  } = req.body;

  if (!title || !price || !nights || !tour_summary || !tour_image) {
    return res.status(400).json({ message: 'Missing required fields: title, price, nights, tour_summary, and tour_image.' });
  }

  try {
    const newTour = new Tour({
      title,
      price,
      nights,
      itinerary: itinerary || {}, // Default to empty object if not provided
      itinerary_images: itinerary_images || {}, // Default to empty object if not provided
      itinerary_titles: itinerary_titles || {}, // Default to empty object if not provided
      tour_image,
      inclusions: inclusions || [], // Default to empty array if not provided
      exclusions: exclusions || [], // Default to empty array if not provided
      tour_summary,
    });

    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (error) {
    console.error("Error saving tour:", error.message);
    res.status(500).json({ message: 'Failed to save tour', details: error.message });
  }
});

// Get all tours
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    if (!tours.length) {
      return res.status(404).json({ message: 'No tours found' });
    }
    res.status(200).json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error.message);
    res.status(500).json({ error: 'Failed to retrieve tours', details: error.message });
  }
});

// Get a tour by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid tour ID' });
  }

  try {
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error.message);
    res.status(500).json({ error: 'Failed to retrieve tour', details: error.message });
  }
});

// Update an existing tour
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    title, price, nights, itinerary, itinerary_images,
    itinerary_titles, inclusions, exclusions, tour_summary, tour_image,
  } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid tour ID' });
  }

  try {
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    // Parse the itinerary and itinerary_images if they are sent as strings
    const parsedItinerary = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;
    const parsedItineraryImages = typeof itinerary_images === 'string' ? JSON.parse(itinerary_images) : itinerary_images;
    const parsedItineraryTitles = typeof itinerary_titles === 'string' ? JSON.parse(itinerary_titles) : itinerary_titles;

    // Log the parsed values for debugging
    console.log('Parsed Itinerary:', parsedItinerary);
    console.log('Parsed Itinerary Images:', parsedItineraryImages);
    console.log('Parsed Itinerary Titles:', parsedItineraryTitles);

    // Update only the provided fields
    tour.title = title || tour.title;
    tour.price = price || tour.price;
    tour.nights = nights || tour.nights;
    tour.itinerary = parsedItinerary || tour.itinerary;
    tour.itinerary_images = parsedItineraryImages || tour.itinerary_images;
    tour.itinerary_titles = parsedItineraryTitles || tour.itinerary_titles;
    tour.tour_image = tour_image || tour.tour_image;
    tour.inclusions = inclusions || tour.inclusions;
    tour.exclusions = exclusions || tour.exclusions;
    tour.tour_summary = tour_summary || tour.tour_summary;

    const updatedTour = await tour.save();
    res.status(200).json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error.message);
    res.status(500).json({ message: 'Failed to update tour', details: error.message });
  }
});

// Delete a tour (Admin only)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid tour ID' });
  }

  try {
    const deletedTour = await Tour.findByIdAndDelete(id);
    if (!deletedTour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error.message);
    res.status(500).json({ message: 'Failed to delete tour', details: error.message });
  }
});

module.exports = router;