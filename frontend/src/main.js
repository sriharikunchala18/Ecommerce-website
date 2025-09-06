import { fetchItems, addToCart, getCart } from './api.js';

const listingContainer = document.getElementById('item-list');
const cartCountEl = document.getElementById('cart-count');

let cart = [];

async function updateCart() {
  const data = await getCart();
  cart = data.cart || [];
  cartCountEl.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

async function loadItems() {
  const items = await fetchItems();
  listingContainer.innerHTML = '';

  items.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';

    itemCard.innerHTML = `
      <img src="${item.image || '/images/default.jpg'}" alt="${item.name}" class="item-image"/>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p><strong>Price: $${item.price}</strong></p>
      <button class="add-cart-btn">Add to Cart</button>
    `;

    const addBtn = itemCard.querySelector('.add-cart-btn');
    addBtn.addEventListener('click', async () => {
      const res = await addToCart(item._id, 1);
      if (res.message) alert(res.message);
      await updateCart();
    });

    listingContainer.appendChild(itemCard);
  });
}

updateCart();
loadItems();
