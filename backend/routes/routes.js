const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const categoryController = require('../controllers/category');
const productController = require('../controllers/product');
const reviewController = require('../controllers/review');

const express = require('express');
const router = express.Router();

// Middleware to check the role of the user
const hasToBe = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: req.i18n.t('invalidRole') });
        }
        next();
    };
};

// Auth routes
router.post('/refresh-token', authController.refreshAccessToken);
router.post('/logout', authController.logout);

// CRUD users
router.get('/users', hasToBe('Admin'), userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// CRUD categories
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', hasToBe('Admin'), categoryController.createCategory);
router.put('/categories/:id', hasToBe('Admin'), categoryController.updateCategory);
router.delete('/categories/:id', hasToBe('Admin'), categoryController.deleteCategory);

// CRUD products
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', hasToBe('Admin'), productController.createProduct);
router.put('/products/:id', hasToBe('Admin'), productController.updateProduct);
router.delete('/products/:id', hasToBe('Admin'), productController.deleteProduct);

// CRUD reviews
router.get('/reviews', reviewController.getReviews);
router.get('/reviews/:id', reviewController.getReviewById);
router.post('/reviews', reviewController.createReview);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;
