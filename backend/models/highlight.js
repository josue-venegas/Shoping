const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
    title:          { type: String, required: true },
    description:    { type: String, required: true },
    image:          { type: String, required: true },
    link:           { type: String, required: false },
    dateCreated:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('Highlight', highlightSchema);