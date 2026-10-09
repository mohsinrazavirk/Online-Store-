# Online Store - Complete Setup Guide

## Project Overview
This is a complete online clothing store with both frontend and backend components, featuring male and female clothing categories.

## Features
- **Frontend**: Modern responsive website with vanilla JavaScript
- **Backend**: Node.js/Express.js API with MongoDB
- **Categories**: Men's and Women's clothing
- **Shopping Cart**: Add, remove, and manage cart items
- **User Authentication**: Login and registration system
- **Product Management**: View products, filter by category/subcategory
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with responsive design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone/Download the Project
```bash
# If using git
git clone <repository-url>
cd online-store

# Or extract the downloaded files to a folder
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup
- Install MongoDB locally or use MongoDB Atlas
- Create a database named `onlinestore`
- Update the MongoDB connection string in `backend/env.example` and rename to `.env`

### 4. Environment Configuration
```bash
# In the backend folder, create .env file
cd backend
cp env.example .env

# Edit .env file with your MongoDB connection string
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/onlinestore
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# NODE_ENV=development
```

### 5. Quick Setup (Recommended)
```bash
# For Linux/Mac users
cd backend
chmod +x setup.sh
./setup.sh

# For Windows users
cd backend
setup.bat
```

### 6. Manual Setup (Alternative)
```bash
# Create environment file
cd backend
cp env.example .env
# Edit .env with your MongoDB connection string

# Install dependencies
npm install

# Seed database with sample products
npm run seed

# Create admin user
npm run create-admin
```

### 7. Start the Application

#### Option 1: Start Both Frontend and Backend Together
```bash
# From the root directory
npm run dev
```

#### Option 2: Start Separately
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm start
```

### 8. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### 9. Default Admin Credentials
- **Email**: admin@fashionstore.com
- **Password**: admin123

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products?category=male` - Filter by category
- `GET /api/products?featured=true` - Get featured products
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update user profile

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear/:userId` - Clear cart

## Sample Data
The application includes 14 sample products for both male and female categories:

### Men's Products (6 items)
- Classic White Dress Shirt - $45.99
- Slim Fit Jeans - $59.99
- Leather Bomber Jacket - $149.99
- Casual Polo Shirt - $34.99
- Running Sneakers - $89.99
- Chino Pants - $49.99

### Women's Products (8 items)
- Elegant Black Dress - $79.99
- Summer Floral Dress - $54.99
- Silk Blouse - $69.99
- High-Waisted Skirt - $39.99
- Designer Heels - $99.99
- Casual T-Shirt - $24.99
- Denim Jacket - $64.99
- Comfortable Flats - $49.99

All products include multiple sizes, colors, and stock quantities.

## Usage Guide

### For Customers
1. **Browse Products**: Visit the homepage to see featured products
2. **Filter by Category**: Use the filter buttons to view specific categories
3. **View Product Details**: Click "View Details" to see product information
4. **Add to Cart**: Select size, color, and quantity, then add to cart
5. **Manage Cart**: Click the cart icon to view and manage cart items
6. **Register/Login**: Create an account or login to save cart and profile

### For Administrators
1. **Product Management**: Use the API endpoints to add/edit products
2. **User Management**: Monitor user registrations and profiles
3. **Order Management**: Implement checkout and order processing

## Customization

### Adding New Products
Use the API endpoint `POST /api/products` with the following structure:
```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "category": "male" or "female",
  "subcategory": "shirts", "pants", "dresses", etc.,
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Red", "Blue", "Green"],
  "images": ["image-url-1", "image-url-2"],
  "stock": 50,
  "featured": true
}
```

### Styling Customization
- Edit `frontend/styles.css` to customize colors, fonts, and layout
- Modify the CSS variables at the top of the file for easy theme changes

### Adding New Features
- **Frontend**: Add new JavaScript functions in `frontend/script.js`
- **Backend**: Create new routes in `backend/routes/` directory
- **Database**: Add new models in `backend/models/` directory

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Ensure MongoDB is running and connection string is correct
2. **Port Already in Use**: Change the PORT in .env file or kill the process using the port
3. **CORS Errors**: The backend includes CORS middleware, but check if frontend URL is correct
4. **API Not Responding**: Check if backend server is running on port 5000

### Development Tips
- Use browser developer tools to debug frontend issues
- Check backend console for API errors
- Use Postman or similar tools to test API endpoints
- Enable MongoDB logging for database debugging

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Use a strong JWT secret key
4. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Build the frontend for production
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages
3. Update API_BASE_URL in script.js to point to production backend

## Support
For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check network connectivity between frontend and backend

## License
This project is open source and available under the MIT License.
