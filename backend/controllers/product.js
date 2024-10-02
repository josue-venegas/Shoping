const Product = require('../models/product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Get a single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: req.i18n.t('productNotFound') });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Create a new product
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: req.i18n.t('productCreated') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Update a product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ error: req.i18n.t('productNotFound') });
        }
        res.json({ message: req.i18n.t('productUpdated') });
    }
    catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: req.i18n.t('productNotFound') });
        }
        res.json({ message: req.i18n.t('productDeleted') });
    } catch (error) {
        res.status(500).json({ error: req.i18n.t('internalServerError') });
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};