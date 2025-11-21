# 🌱 EcoMealHub

**EcoMealHub** is a comprehensive food inventory management system that helps users track their food items, monitor expiration dates, and reduce food waste. The platform features OCR-based receipt scanning, meal planning, and resource sharing to promote sustainable food consumption.

## 🚀 Tech Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **PostgreSQL** with **Supabase** - Cloud database service
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Resend** - Email service integration
- **Zod** - Schema validation
- **Helmet & CORS** - Security middleware

### Frontend
- **React 19** - User interface library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Tesseract.js** - OCR (Optical Character Recognition)
- **Recharts** - Data visualization

## 📋 Features

- **Food Inventory Management** - Track food items with quantities, costs, and expiration dates
- **OCR Receipt Scanning** - Extract food items from receipt images automatically
- **Expiration Monitoring** - Visual alerts for expiring and expired items
- **Resource Sharing** - Community platform for sharing food-related resources
- **Meal Planning** - Plan meals using your inventory
- **Recipe Management** - Store and organize recipes
- **Activity Logging** - Track all inventory changes and activities
- **Google OAuth** - Social authentication
- **Email Notifications** - Password reset and notifications

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (Supabase account)
- **Google OAuth** credentials (optional)
- **Resend API** key (for emails)

### 1. Clone the Repository
```bash
git clone https://github.com/Tahmidul-Islam-Omi/EcoMealHub.git
cd EcoMealHub
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd Backend
npm install
```

#### Environment Configuration
Create a `.env` file in the `Backend` directory with the following variables:

```env
# Database Configuration (Supabase)
host=your-supabase-host
port=5432
database=postgres
user=your-supabase-user
password=your-supabase-password
pool_mode=session

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
SERVER_PORT=3000
NODE_ENV=development

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=your_from_email@domain.com

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

#### Database Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create the following tables in your Supabase database:

**Users Table:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Global Inventory Table:**
```sql
CREATE TABLE global_inventory (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    expiration_days INTEGER,
    cost DECIMAL(10,2),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**User Inventory Table:**
```sql
CREATE TABLE user_inventory (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    item_id INTEGER REFERENCES global_inventory(id),
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50),
    custom_cost DECIMAL(10,2),
    expiration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Resources Table:**
```sql
CREATE TABLE resources (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    url TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Logs Table:**
```sql
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Password Reset Table:**
```sql
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    reset_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server will start on `http://localhost:3000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../Frontend/EcoMealHub
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

#### Build for Production
```bash
npm run build
npm run preview
```

## 🌱 Seed Data Usage

### Sample Global Inventory Items
To populate your database with sample food items, you can insert the following data into the `global_inventory` table:

```sql
INSERT INTO global_inventory (item_name, category, expiration_days, cost) VALUES
('Bananas', 'fruits', 7, 2.50),
('Milk', 'dairy', 5, 3.99),
('Bread', 'grains', 3, 2.99),
('Chicken Breast', 'meat', 2, 8.99),
('Lettuce', 'vegetables', 7, 1.99),
('Eggs', 'dairy', 14, 4.49),
('Tomatoes', 'vegetables', 5, 3.29),
('Rice', 'grains', 365, 5.99),
('Yogurt', 'dairy', 10, 4.99),
('Apples', 'fruits', 14, 3.99);
```

### Sample Resources
```sql
INSERT INTO resources (user_id, title, description, category, url) VALUES
(1, 'Food Waste Reduction Tips', 'Learn how to reduce food waste at home', 'sustainability', 'https://example.com/food-waste-tips'),
(1, 'Meal Prep Guide', 'Complete guide to meal preparation', 'cooking', 'https://example.com/meal-prep'),
(1, 'Seasonal Produce Calendar', 'Know when fruits and vegetables are in season', 'seasonal', 'https://example.com/seasonal-produce');
```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/google` - Google OAuth
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Inventory
- `GET /api/v1/inventory` - Get user inventory
- `POST /api/v1/inventory` - Add inventory item
- `PUT /api/v1/inventory/:id` - Update inventory item
- `DELETE /api/v1/inventory/:id` - Delete inventory item
- `GET /api/v1/inventory/global` - Get global inventory items
- `POST /api/v1/inventory/text-analysis` - OCR text analysis
- `POST /api/v1/inventory/add-ocr-items` - Add OCR extracted items

### Resources
- `GET /api/v1/resources` - Get all resources
- `POST /api/v1/resources` - Create resource
- `PUT /api/v1/resources/:id` - Update resource
- `DELETE /api/v1/resources/:id` - Delete resource

### Logs
- `GET /api/v1/logs` - Get user activity logs
- `POST /api/v1/logs` - Create log entry

## 🔐 Environment Variables

### Required Backend Variables
- `host` - Database host
- `port` - Database port
- `database` - Database name
- `user` - Database user
- `password` - Database password
- `JWT_SECRET` - JWT signing secret
- `SERVER_PORT` - Server port (default: 3000)

### Optional Backend Variables
- `RESEND_API_KEY` - For email functionality
- `FROM_EMAIL` - Email sender address
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL

## 🚦 Health Check

Visit `http://localhost:3000/health` to check if the backend server is running properly.

## 📱 Usage

1. **Register/Login** - Create an account or sign in
2. **Add Items** - Manually add food items or scan receipts using OCR
3. **Monitor Expiration** - View items expiring soon on the dashboard
4. **Plan Meals** - Use your inventory to plan meals
5. **Share Resources** - Share food-related tips and resources
6. **Track Activity** - View logs of all your inventory changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

