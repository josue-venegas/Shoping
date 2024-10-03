const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:               { type: String, required: true },
    description:        { type: String, required: true },
    richDescription:    { type: String, default: '' },
    image:              { type: String, default: '' },
    images:             [{ type: String }],
    brand:              { type: String, default: '' },
    price:              { type: Number, default: 0 },
    categories:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true }],
    isFeatured:         { type: Boolean, default: false },
    isStockLimited:     { type: Boolean, default: false },
    countInStock:       { type: Number, required: false, min: 0, max: 255 },
    isDateLimited:      { type: Boolean, default: false },
    dateExpires:        { type: Date, required: false },
    meanRating:         { type: Number, default: 0 },
    numReviews:         { type: Number, default: 0 },
    dateCreated:        { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);