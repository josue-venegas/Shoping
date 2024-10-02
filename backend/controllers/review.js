const Review = require('../models/review');

// Get all reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        return res.status(200).json({ message: reviews });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Get a single review
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: req.i18n.t('reviewNotFound') });
        }
        return res.status(200).json({ message: review });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Create a new review
const createReview = async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        return res.status(201).json({ message: req.i18n.t('reviewCreated') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
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
        return res.status(200).json({ message: req.i18n.t('reviewUpdated') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
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
        return res.status(200).json({ message: req.i18n.t('reviewDeleted') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

module.exports = {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview
};