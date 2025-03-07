// Model File: models/Tour.js
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  expiry_date: { type: Date, required: true },
  valid_from: { type: Date, required: true },
  valid_to: { type: Date, required: true },
  food_category: { type: String, required: true },
  nights: { type: Number, required: true },
  country: { type: String, required: true },
  markets: { type: [Number], default: [] },
  activity_images: { type: [String], default: [] },
  destination_images: { type: [String], default: [] },
  hotel_images: { type: [String], default: [] },
  exclusions: { type: [String], default: [] },
  inclusions: { type: [String], default: [] },
  tour_summary: { type: String, required: true },
  itinerary: { type: Map, of: [String], default: {} },
  tour_image: { type: String, required: true },
  itinerary_images: { type: Map, of: [String], default: {} },
  oldPrice: { type: String, default: '' },
  itinerary_titles: { type: Map, of: String, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);