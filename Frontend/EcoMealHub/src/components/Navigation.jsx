import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  PlusCircle, 
  User, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  Leaf,
  Package,
  ChefHat,
  Calendar
} from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/add-resource', label: 'Add Resource', icon: PlusCircle },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/recipes', label: 'Recipes', icon: ChefHat },
    { path: '/meal-planning', label: 'Meal Planning', icon: Calendar },
  ];

  const authItems = [
    { path: '/login', label: 'Login', icon: LogIn },
    { path: '/signup', label: 'Sign Up', icon: UserPlus },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-slate-200">
            <Leaf className="w-8 h-8 text-green-400" />
            <span className="bg-gradient-to-r from-green-400 to-indigo-400 bg-clip-text text-transparent">
              EcoMealHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            
            <div className="h-6 w-px bg-slate-700"></div>
            
            <div className="flex items-center gap-4">
              {authItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <div className="flex flex-col gap-2">
              {[...navItems, ...authItems].map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
