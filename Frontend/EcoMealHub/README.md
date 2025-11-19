# EcoMealHub Frontend

A modern, responsive web application for sustainable eating and food waste reduction resources.

## 🌱 Features Implemented

### Pages
- **Home Page** - Landing page with hero section, statistics, and feature highlights
- **Resources Page** - Browse and filter sustainability resources with search functionality
- **Add Resource Page** - Form to submit new resources (with validation)
- **Login Page** - User authentication interface
- **Sign Up Page** - User registration with form validation
- **Profile Page** - User profile management and activity summary

### Components
- **Navigation** - Responsive navigation bar with mobile menu
- **ResourceCard** - Display individual resource items
- **FilterChip** - Interactive filter buttons for categories and types

### Features
- 🎨 **Modern UI Design** - Built with Tailwind CSS for consistent, responsive design
- 🔍 **Search & Filter** - Advanced filtering by category, type, and search terms
- 📱 **Mobile Responsive** - Optimized for all device sizes
- 🌙 **Dark Theme** - Modern dark theme throughout the application
- ⚡ **Fast Performance** - Built with Vite for optimal development and build performance
- 🔐 **Authentication UI** - Complete login/signup flow (demo mode)
- 📊 **User Profiles** - Personal dashboard with activity tracking

## 🛠 Tech Stack

- **React 19** - Latest React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Vite** - Build tool and dev server

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Navigate to frontend directory
cd Frontend/EcoMealHub

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔗 Backend Integration

### API Endpoints (Ready for Integration)
The frontend is prepared to connect to these backend endpoints:

- `GET /api/v1/resources` - Fetch all resources
- `POST /api/v1/resources` - Create new resource
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Connecting to Backend
1. Uncomment API service functions in `src/utills/resourcesData.js`
2. Update API endpoints to match your backend server (currently set to `http://localhost:3000`)
3. Replace dummy data with actual API calls
4. Add authentication token handling

---

Built with ❤️ for sustainable living and reduced food waste.
