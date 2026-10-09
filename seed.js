const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Sample products data
const sampleProducts = [
  // Men's Products
  {
    name: "Classic White Dress Shirt",
    description: "Premium cotton dress shirt perfect for business and formal occasions",
    price: 45.99,
    category: "male",
    subcategory: "shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Navy"],
    images: ["https://via.placeholder.com/400x400?text=White+Dress+Shirt"],
    stock: 50,
    featured: true
  },
  {
    name: "Slim Fit Jeans",
    description: "Comfortable slim fit jeans made from premium denim",
    price: 59.99,
    category: "male",
    subcategory: "pants",
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Dark Blue", "Black", "Light Blue"],
    images: ["https://via.placeholder.com/400x400?text=Slim+Fit+Jeans"],
    stock: 40,
    featured: true
  },
  {
    name: "Leather Bomber Jacket",
    description: "Stylish leather bomber jacket for a cool, casual look",
    price: 149.99,
    category: "male",
    subcategory: "jackets",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    images: ["https://via.placeholder.com/400x400?text=Leather+Bomber"],
    stock: 25,
    featured: true
  },
  {
    name: "Casual Polo Shirt",
    description: "Comfortable polo shirt perfect for casual outings",
    price: 34.99,
    category: "male",
    subcategory: "shirts",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Navy", "Red", "Green"],
    images: ["https://via.placeholder.com/400x400?text=Casual+Polo"],
    stock: 60,
    featured: false
  },
  {
    name: "Running Sneakers",
    description: "High-performance running shoes with excellent cushioning",
    price: 89.99,
    category: "male",
    subcategory: "shoes",
    sizes: ["8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Blue"],
    images: ["https://via.placeholder.com/400x400?text=Running+Sneakers"],
    stock: 35,
    featured: true
  },
  {
    name: "Chino Pants",
    description: "Versatile chino pants perfect for smart casual looks",
    price: 49.99,
    category: "male",
    subcategory: "pants",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Gray"],
    images: ["https://via.placeholder.com/400x400?text=Chino+Pants"],
    stock: 45,
    featured: false
  },

  // Women's Products
  {
    name: "Elegant Black Dress",
    description: "Sophisticated black dress perfect for evening events",
    price: 79.99,
    category: "female",
    subcategory: "dresses",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Red"],
    images: ["https://via.placeholder.com/400x400?text=Elegant+Black+Dress"],
    stock: 30,
    featured: true
  },
  {
    name: "Summer Floral Dress",
    description: "Light and breezy floral dress perfect for summer days",
    price: 54.99,
    category: "female",
    subcategory: "dresses",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral", "Blue", "Pink"],
    images: ["https://via.placeholder.com/400x400?text=Summer+Floral+Dress"],
    stock: 40,
    featured: true
  },
  {
    name: "Silk Blouse",
    description: "Luxurious silk blouse for professional and elegant looks",
    price: 69.99,
    category: "female",
    subcategory: "tops",
    sizes: ["XS", "S", "M", "L"],
    colors: ["White", "Black", "Blush"],
    images: ["https://via.placeholder.com/400x400?text=Silk+Blouse"],
    stock: 35,
    featured: true
  },
  {
    name: "High-Waisted Skirt",
    description: "Trendy high-waisted skirt that flatters any figure",
    price: 39.99,
    category: "female",
    subcategory: "skirts",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Pink"],
    images: ["https://via.placeholder.com/400x400?text=High+Waisted+Skirt"],
    stock: 50,
    featured: false
  },
  {
    name: "Designer Heels",
    description: "Elegant high heels perfect for special occasions",
    price: 99.99,
    category: "female",
    subcategory: "shoes",
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Black", "Nude", "Red"],
    images: ["https://via.placeholder.com/400x400?text=Designer+Heels"],
    stock: 25,
    featured: true
  },
  {
    name: "Casual T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    price: 24.99,
    category: "female",
    subcategory: "tops",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray", "Pink"],
    images: ["https://via.placeholder.com/400x400?text=Casual+T+Shirt"],
    stock: 70,
    featured: false
  },
  {
    name: "Denim Jacket",
    description: "Classic denim jacket that never goes out of style",
    price: 64.99,
    category: "female",
    subcategory: "jackets",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue", "Black", "White"],
    images: ["https://via.placeholder.com/400x400?text=Denim+Jacket"],
    stock: 30,
    featured: false
  },
  {
    name: "Comfortable Flats",
    description: "Stylish and comfortable flats for all-day wear",
    price: 49.99,
    category: "female",
    subcategory: "shoes",
    sizes: ["6", "7", "8", "9", "10"],
    colors: ["Black", "Brown", "Navy"],
    images: ["https://via.placeholder.com/400x400?text=Comfortable+Flats"],
    stock: 45,
    featured: false
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onlinestore');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} sample products`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();
