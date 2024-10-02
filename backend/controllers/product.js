const Product = require('../models/product');

// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ message: products });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Get a single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: req.i18n.t('productNotFound') });
        }
        return res.status(200).json({ message: product });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Create a new product
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        return res.status(201).json({ message: req.i18n.t('productCreated') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Update a product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ error: req.i18n.t('productNotFound') });
        }
        return res.status(200).json({ message: req.i18n.t('productUpdated') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: req.i18n.t('productNotFound') });
        }
        return res.status(200).json({ message: req.i18n.t('productDeleted') });
    } catch (error) {
        console.error(req.i18n.t('internalServerError'), error.message);
        return res.status(500).json({ error: `${req.i18n.t('internalServerError')}: ${error.message}` });
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};