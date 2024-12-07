const {
	insertCategory,
	retrieveCategories,
	retrieveCategory,
	insertProduct,
	retrieveAllProducts,
	getCategoryProducts,
	retrieveOneProduct,
	retrieveIdCategory,
} = require('../db/queries')

const getHome = async (req, res) => {
	const allCats = await retrieveCategories()
	const catProducts = {}

	for (const cat of allCats) {
		const relatedProducts = await getCategoryProducts(cat)
		const name = cat.name
		catProducts[cat.name] = [...relatedProducts]
	}

	// res.locals.categories = allCats
	// console.log(catProducts)
	res.render('home', { categories: allCats, catProducts: catProducts })
}

const getCreateCategory = (req, res) => {
	res.render('catform')
}

const createCategory = async (req, res) => {
	const catCreated = await insertCategory(req.body.name, req.body.description)
	res.redirect('/')
}

const getCategories = async (req, res) => {
	// const allCats = await retrieveCategories()
	// res.locals.categories = allCats
	console.log(res.locals)
	// res.render('home')
}

const getCreateProduct = async (req, res) => {
	const categories = await retrieveCategories()
	res.render('productform', { categories: categories })
}

const createProduct = async (req, res) => {
	const category = await retrieveCategory(req.body.category)
	const product = await insertProduct(req.body, category.id)
	res.redirect('/products')
}

const getProduct = async (req, res) => {
	const product = await retrieveOneProduct(req.params.id)
	const productCat = await retrieveIdCategory(product.category_id)
	console.log({ ...product, category: productCat.name })
	res.render('productpage', {
		product: { ...product, category: productCat.name },
	})
}

const getAllProducts = async (req, res) => {
	const allProducts = await retrieveAllProducts()
	res.render('allproducts', { products: allProducts })
}

const getOneProduct = async (req, res) => {}
module.exports = {
	getHome,
	getCreateCategory,
	createCategory,
	getCategories,
	getCreateProduct,
	createProduct,
	getProduct,
	getAllProducts,
}
