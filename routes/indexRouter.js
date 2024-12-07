const {Router} = require('express')
const {getHome, getProduct, getCreateCategory, createCategory, getCategories, getCreateProduct, createProduct, getAllProducts} = require('../controllers/home')

const indexRouter = Router()
indexRouter.get('/', getHome)
indexRouter.get('/category', getCategories)
indexRouter.get('/category/new', getCreateCategory)
indexRouter.post('/category/new', createCategory)
indexRouter.get('/products', getAllProducts)
indexRouter.get('/products/new', getCreateProduct)
indexRouter.post('/products/new', createProduct)
indexRouter.get('/products/all', getProduct)
indexRouter.get('/products/:id', getProduct)

module.exports = indexRouter