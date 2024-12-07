const express = require('express')
const app = express()
const path = require('node:path')


require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// ROUTES
app.use(express.json())
const indexRouter = require('./routes/indexRouter')

// VIEWS

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// GET DATA FROM FORMS
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// CSS, IMAGES

const assetsPath = path.join(__dirname, 'public')
app.use(express.static(assetsPath))

// USING ROUTES

app.post('/checkout', async (req, res) => {
	const { cart } = req.body

	const lineItems = cart.map((item) => ({
		price_data: {
			currency: 'usd',
			product_data: {
				name: item.name,
				images: [item.image],
			},
			unit_amount: Math.round(item.price * 100),
		},
		quantity: item.quantity,
	}))
	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		mode: 'payment',
		shipping_address_collection: {
			allowed_countries:['US']
		},
		success_url: `http://localhost:3000/complete?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: 'http://localhost:3000/',
	})

	// res.redirect(session.url)
	res.json({ url: session.url });
	// res.redirect(session.url)
})

app.get('/complete', async (req, res) => {
	const sessionId = req.query.session_id
	const session = await stripe.checkout.sessions.retrieve(sessionId, {
		expand: ['line_items.data.price.product'], 
	});
	 // Extract order details
	 const lineItems = session.line_items.data.map((item) => ({
		name: item.price.product.name,
		quantity: item.quantity,
		price: item.price.unit_amount / 100, // Convert from cents to dollars
		total: (item.price.unit_amount / 100) * item.quantity, // Calculate total for the item
	}));

	const orderSummary = {
		customerEmail: session.customer_details.email,
		totalAmount: session.amount_total / 100, // Convert from cents to dollars
		items: lineItems,
	};

	res.render('complete', {orderSummary})
})

app.use('/', indexRouter)

// CREATING AND LAUNCHING A SERVER

const PORT = 3000
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!`)
})
