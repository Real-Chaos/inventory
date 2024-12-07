

// Add quantity field to cart items
let cart = [] // [{ id, name, price, image, quantity }]

function toggleCart() {
	const cartDrawer = document.getElementById('cartDrawer')
	cartDrawer.classList.toggle('open')
}

function openCart() {
	const cartDrawer = document.getElementById('cartDrawer')
	cartDrawer.classList.add('open')
}

// Add item to cart
function addToCart(id, name, price, image) {
	const existingItem = cart.find((item) => item.id === id)

	if (existingItem) {
		openCart()
		updateQuantity(id, 1)
	} else {
		cart.push({ id, name, price: parseFloat(price), image, quantity: 1 })
		updateCartUI()
		updateCartCount()
		openCart()
	}
}

// Update quantity and total dynamically
function updateQuantity(id, change) {
	const item = cart.find((item) => item.id === id)

	if (item) {
		item.quantity += change

		// Prevent quantity from dropping below 1
		if (item.quantity < 1) {
			item.quantity = 1
		}

		updateCartUI()
	}
}

function removeQuantity(id) {
	const item = cart.find((item) => item.id === id)
	if (item) {
		item.quantity = 0

		cart = cart.filter((item) => item.id !== id)
		updateCartUI()
	}
}

// Update the cart drawer UI
function updateCartUI() {
	const cartContent = document.querySelector('.cart-content')
	const cartTotalElement = document.getElementById('cartTotal')

	// Clear the current cart items
	cartContent.innerHTML = ''

	let total = 0

	// Render all cart items
	cart.forEach((item) => {
		const cartItem = document.createElement('div')
		cartItem.classList.add('cart-item')

		cartItem.innerHTML = `
   
        <div style="display: flex">
        <div data-id="${item.id}" class="delete-item">x</div>
        <img src="${item.image}" alt="${item.name}">
        <div class="info">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
        </div></div>
        <div class="quantity-control">
          <button class="quantity-decrease" data-id="${item.id}">-</button>
          <input type="text" class="quantity-input" value="${
						item.quantity
					}" data-id="${item.id}" readonly>
          <button class="quantity-increase" data-id="${item.id}">+</button>
        </div>
      
    `

		cartContent.appendChild(cartItem)
		total += item.price * item.quantity
	})

	// Update total price in the UI
	cartTotalElement.textContent = `$${total.toFixed(2)}`
}

// Update the cart count in the navbar
function updateCartCount() {
	const cartCountElement = document.querySelector('.cart-count')
	const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
	cartCountElement.textContent = itemCount
}

// Event delegation for quantity controls
document.addEventListener('click', (event) => {
	if (event.target.classList.contains('quantity-increase')) {
		const id = event.target.dataset.id
		updateQuantity(id, 1)
	} else if (event.target.classList.contains('quantity-decrease')) {
		const id = event.target.dataset.id
		updateQuantity(id, -1)
	} else if (event.target.classList.contains('add-to-cart')) {
		const button = event.target
		const id = button.dataset.id
		const name = button.dataset.name
		const price = button.dataset.price
		const image = button.dataset.image

		addToCart(id, name, price, image)
	} else if (event.target.classList.contains('delete-item')) {
		const button = event.target
		const id = button.dataset.id
		removeQuantity(id)
	}
})

async function checkout() {
	const response = await fetch('/checkout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ cart }), // Sending the cart data
	})

	const { url } = await response.json()

	// 	// Redirect the user to the Stripe Checkout page
	window.location.href = url
}
