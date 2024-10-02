const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const categoryController = require('../controllers/category');
const productController = require('../controllers/product');
const reviewController = require('../controllers/review');

const express = require('express');
const router = express.Router();

// Middleware para verificar el rol
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.sendStatus(403); // Forbidden
        }
        next();
    };
};

router.get('/hello', authController.helloworld);

// Rutas para CRUD de usuarios
router.get('/users', authorizeRole('Admin'), userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Rutas para CRUD de categorías
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', authorizeRole('Admin'), categoryController.createCategory);
router.put('/categories/:id', authorizeRole('Admin'), categoryController.updateCategory);
router.delete('/categories/:id', authorizeRole('Admin'), categoryController.deleteCategory);

// Rutas para CRUD de productos
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authorizeRole('Admin'), productController.createProduct);
router.put('/products/:id', authorizeRole('Admin'), productController.updateProduct);
router.delete('/products/:id', authorizeRole('Admin'), productController.deleteProduct);

// Rutas para CRUD de reseñas
router.get('/reviews', reviewController.getReviews);
router.get('/reviews/:id', reviewController.getReviewById);
router.post('/reviews', reviewController.createReview);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);

module.exports = router;
