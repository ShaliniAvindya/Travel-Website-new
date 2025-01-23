const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    days: { type: Number, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('Tour', tourSchema);
