const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name:           { type: String, required: true },
    user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product:        { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating:         { type: Number, required: true, min: 1, max: 10 },
    comment:        { type: String, required: false },
    dateCreated:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);