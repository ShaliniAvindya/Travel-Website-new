const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  nights: { type: Number, required: true },
  tour_summary: { type: String, required: true },
  tour_image: { type: String, required: true },
  inclusions: { type: [String], required: true },
  exclusions: { type: [String], required: true },
  itinerary: { type: Map, of: [String], required: true },
  itinerary_images: { type: Map, of: [String], required: true },
  itinerary_titles: { type: Map, of: String, required: true },
});

module.exports = mongoose.model('Tour', TourSchema);