#!/bin/bash

# Online Store Setup Script
echo "🚀 Setting up Online Store Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. Make sure MongoDB is running or use MongoDB Atlas."
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/onlinestore
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-$(date +%s)
NODE_ENV=development
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Start MongoDB connection test
echo "🔌 Testing MongoDB connection..."
timeout 10s node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onlinestore')
  .then(() => {
    console.log('✅ MongoDB connection successful');
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message);
    console.log('💡 Make sure MongoDB is running or check your connection string');
    process.exit(1);
  });
" 2>/dev/null || echo "⚠️  MongoDB connection test timed out"

# Seed the database
echo "🌱 Seeding database with sample products..."
npm run seed

# Create admin user
echo "👤 Creating admin user..."
npm run create-admin

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server: npm run dev"
echo "2. The API will be available at: http://localhost:5000/api"
echo "3. Admin credentials:"
echo "   Email: admin@fashionstore.com"
echo "   Password: admin123"
echo ""
echo "🔗 API Endpoints:"
echo "• GET /api/products - Get all products"
echo "• GET /api/products?category=male - Get men's products"
echo "• GET /api/products?category=female - Get women's products"
echo "• POST /api/users/register - Register new user"
echo "• POST /api/users/login - Login user"
echo "• POST /api/cart/add - Add item to cart"
echo ""
echo "📚 Check README.md for complete documentation"
