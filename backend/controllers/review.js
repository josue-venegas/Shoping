const Review = require('../models/review');

// Get all reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(201).json({ message: reviews });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Get a single review
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: req.i18n.t('reviewNotFound') });
        }
        res.status(201).json({ message: review });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Create a new review
const createReview = async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json({ message: req.i18n.t('reviewCreated') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Update a review
// An user can edit only his own reviews
// An admin can edit any review
const updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) {
            return res.status(404).json({ error: req.i18n.t('reviewNotFound') });
        }

        // Verificar si el usuario es Admin o si está accediendo a su propia reseña
        if (req.user.role !== 'Admin' && req.user.email !== user.email) {
            return res.status(403).json({ error: req.i18n.t('forbidden') });
        }
        res.status(201).json({ message: req.i18n.t('reviewUpdated') });
    }
    catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Delete a review
// An user can delete only his own reviews
// An admin can delete any review
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            return res.status(404).json({ error: req.i18n.t('reviewNotFound') });
        }

        // Verificar si el usuario es Admin o si está accediendo a su propia reseña
        if (req.user.role !== 'Admin' && req.user.email !== user.email) {
            return res.status(403).json({ error: req.i18n.t('forbidden') });
        }
        res.status(201).json({ message: req.i18n.t('reviewDeleted') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

module.exports = {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
};