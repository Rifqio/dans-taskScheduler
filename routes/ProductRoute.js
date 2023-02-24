const { GetProducts, AddProduct, UpdateProduct, DeleteProduct } = require('../controller/ProductController');

const router = require('express').Router();

router.get('/', GetProducts)
router.post('/', AddProduct)
router.patch('/:id', UpdateProduct)
router.delete('/:id', DeleteProduct)

module.exports = router;