const mongoose = require('mongoose');
const Item = require('./models/Item');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Mongo connected');

    await Item.deleteMany({}); // Clear old items

    await Item.insertMany([
  { name: 'Denim Jacket', price: 50, category: 'Clothing', description: 'Stylish denim jacket', images: '/images/denim-jacket.png' },
  { name: 'Classic Perfume', price: 40, category: 'Perfume', description: 'Elegant fragrance', images: '/images/classic-perfume.png' },
  { name: 'Leather Wallet', price: 35, category: 'Accessory', description: 'Premium leather wallet', images: '/images/leather-wallet.png' },
  { name: 'Running Shoes', price: 60, category: 'Footwear', description: 'Comfortable running shoes', images: '/images/running-shoes.png' }
]);


    console.log('Items seeded with your products');
    process.exit();
  })
  .catch(err => console.error('Seed error', err));
