const Category = require('../models/category');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ message: categories });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Get a single category
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: req.i18n.t('categoryNotFound') });
        }
        return res.status(200).json({ message: category });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Create a new category
const createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        return res.status(201).json({ message: req.i18n.t('categoryCreated') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Update a category
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ error: req.i18n.t('categoryNotFound') });
        }
        return res.status(200).json({ message: req.i18n.t('categoryUpdated') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: req.i18n.t('categoryNotFound') });
        }
        return res.status(200).json({ message: req.i18n.t('categoryDeleted') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};