const pool = require('./db')

// CATEGORY QUERIES

async function insertCategory(name, description) {
	const query = `
    INSERT INTO categories ("name", "description")
    VALUES ($1, $2)
  `

	const values = [name, description]
	const result = await pool.query(query, values)
	return result.rows[0]
}

async function retrieveCategories() {
	const query = `SELECT * FROM categories`
	const { rows } = await pool.query(query)
	return rows
}

async function retrieveCategory(name) {
	const query = `SELECT id FROM categories WHERE "name" = $1`
	const result = await pool.query(query, [name])
	return result.rows[0]
}

async function retrieveIdCategory(id) {
	const query = `SELECT * FROM categories WHERE id = $1`
	const result = await pool.query(query, [id])
	return result.rows[0]
}

async function insertProduct(product, category) {
	const query = `
	  INSERT INTO products ("name", "description", price, category_id, image)
    VALUES ($1, $2, $3, $4, $5)
	`
	const values = [
		product.name,
		product.description,
		product.price,
		category,
		product.image,
	]
	const result = await pool.query(query, values)
	return result.rows
}

async function retrieveAllProducts() {
	const query = `SELECT * FROM products`
	const result = await pool.query(query)

	return result.rows
}

async function retrieveOneProduct(id) {
	const query = `SELECT * FROM products WHERE id = $1`
	const result = await pool.query(query, [id])
	return result.rows[0]
}

async function getCategoryProducts(category) {
	const query = `
	  SELECT
	    c.name AS category,
      p.id AS id,
	    p.name AS name,
      p.image AS image,
	    p.price
	  FROM
	    categories c
	  JOIN
	    products p
	  ON
	    c.id = p.category_id
	  WHERE
	    c.name = $1
	`
	// console.log(categoryName)
	// const query = `
	//   SELECT * FROM products WHERE category_id = $1
	// `
	const result = await pool.query(query, [category.name])
	return result.rows
}
module.exports = {
	insertCategory,
	retrieveCategories,
	retrieveCategory,
	insertProduct,
	retrieveAllProducts,
	getCategoryProducts,
	retrieveOneProduct,
  retrieveIdCategory
}
