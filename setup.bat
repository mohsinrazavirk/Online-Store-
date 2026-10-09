@echo off
echo 🚀 Setting up Online Store Backend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/onlinestore
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-%RANDOM%
        echo NODE_ENV=development
    ) > .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

REM Seed the database
echo 🌱 Seeding database with sample products...
call npm run seed

REM Create admin user
echo 👤 Creating admin user...
call npm run create-admin

echo.
echo 🎉 Backend setup complete!
echo.
echo 📋 Next steps:
echo 1. Start the backend server: npm run dev
echo 2. The API will be available at: http://localhost:5000/api
echo 3. Admin credentials:
echo    Email: admin@fashionstore.com
echo    Password: admin123
echo.
echo 🔗 API Endpoints:
echo • GET /api/products - Get all products
echo • GET /api/products?category=male - Get men's products
echo • GET /api/products?category=female - Get women's products
echo • POST /api/users/register - Register new user
echo • POST /api/users/login - Login user
echo • POST /api/cart/add - Add item to cart
echo.
echo 📚 Check README.md for complete documentation
pause
