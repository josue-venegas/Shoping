const Category = require('../models/category');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(201).json({ message: categories });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Get a single category
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: req.i18n.t('categoryNotFound') });
        }
        res.status(201).json({ message: category });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Create a new category
const createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({ message: req.i18n.t('categoryCreated') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Update a category
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) {
            return res.status(404).json({ error: req.i18n.t('categoryNotFound') });
        }
        res.status(201).json({ message: req.i18n.t('categoryUpdated') });
    }
    catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: req.i18n.t('categoryNotFound') });
        }
        res.status(201).json({ message: req.i18n.t('categoryDeleted') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};