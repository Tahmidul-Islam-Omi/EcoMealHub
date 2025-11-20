import { useState, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Calendar, 
  MapPin,
  Edit3,
  Trash2,
  ShoppingCart,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { SAMPLE_INVENTORY_ITEMS, INVENTORY_CATEGORIES, STORAGE_LOCATIONS, UNITS } from '../utills/inventoryData';

const Inventory = () => {
  const [items, setItems] = useState(SAMPLE_INVENTORY_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    purchaseDate: '',
    expiryDate: '',
    location: '',
    price: ''
  });

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [items, searchQuery, selectedCategory, selectedLocation]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = items.length;
    const expiringSoon = items.filter(item => item.alerts.nearExpiry).length;
    const lowStock = items.filter(item => item.alerts.lowStock).length;
    const totalValue = items.reduce((sum, item) => sum + item.price, 0);
    
    return { totalItems, expiringSoon, lowStock, totalValue };
  }, [items]);

  const handleAddItem = () => {
    // TODO: Replace with API call
    // await createInventoryItem(newItem);
    
    const item = {
      ...newItem,
      id: Date.now(),
      quantity: parseFloat(newItem.quantity),
      price: parseFloat(newItem.price),
      nutritionalInfo: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fiber: 0,
        sugar: 0
      },
      alerts: {
        lowStock: parseFloat(newItem.quantity) < 3,
        nearExpiry: new Date(newItem.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        expired: new Date(newItem.expiryDate) < new Date()
      }
    };
    
    setItems([...items, item]);
    setNewItem({
      name: '',
      category: '',
      quantity: '',
      unit: '',
      purchaseDate: '',
      expiryDate: '',
      location: '',
      price: ''
    });
    setShowAddForm(false);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      unit: item.unit,
      purchaseDate: item.purchaseDate,
      expiryDate: item.expiryDate,
      location: item.location,
      price: item.price.toString()
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = () => {
    // TODO: Replace with API call
    // await updateInventoryItem(editingItem.id, newItem);
    
    const updatedItem = {
      ...editingItem,
      ...newItem,
      quantity: parseFloat(newItem.quantity),
      price: parseFloat(newItem.price),
      alerts: {
        lowStock: parseFloat(newItem.quantity) < 3,
        nearExpiry: new Date(newItem.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        expired: new Date(newItem.expiryDate) < new Date()
      }
    };
    
    setItems(items.map(item => item.id === editingItem.id ? updatedItem : item));
    setEditingItem(null);
    setNewItem({
      name: '',
      category: '',
      quantity: '',
      unit: '',
      purchaseDate: '',
      expiryDate: '',
      location: '',
      price: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteItem = (itemId) => {
    // TODO: Replace with API call
    // await deleteInventoryItem(itemId);
    
    setItems(items.filter(item => item.id !== itemId));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-500/10 to-indigo-500/10 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-10 h-10 text-green-400" />
                <h1 className="text-4xl font-bold text-slate-200">Food Inventory</h1>
              </div>
              <p className="text-slate-400 max-w-2xl">
                Track your food items, monitor expiry dates, and reduce waste with smart inventory management
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-indigo-600 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>
        </div>
      </header>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-slate-200">{stats.totalItems}</div>
                <div className="text-sm text-slate-400">Total Items</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-slate-200">{stats.expiringSoon}</div>
                <div className="text-sm text-slate-400">Expiring Soon</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-slate-200">{stats.lowStock}</div>
                <div className="text-sm text-slate-400">Low Stock</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-slate-200">${stats.totalValue.toFixed(2)}</div>
                <div className="text-sm text-slate-400">Total Value</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search inventory items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              {INVENTORY_CATEGORIES.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
            
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="all">All Locations</option>
              {STORAGE_LOCATIONS.map(location => (
                <option key={location} value={location} className="capitalize">
                  {location.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Inventory Items */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            
            return (
              <div key={item.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/80 transition-all">
                {/* Item Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-200 mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="capitalize">{item.category}</span>
                      <span>•</span>
                      <span>{item.quantity} {item.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Alerts */}
                <div className="mb-4">
                  {item.alerts.expired && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                      <AlertCircle className="w-4 h-4" />
                      Expired
                    </div>
                  )}
                  {item.alerts.nearExpiry && !item.alerts.expired && (
                    <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Expires in {daysUntilExpiry} days
                    </div>
                  )}
                  {item.alerts.lowStock && (
                    <div className="flex items-center gap-2 text-orange-400 text-sm mb-2">
                      <TrendingUp className="w-4 h-4" />
                      Low stock
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location:</span>
                    <div className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3" />
                      <span className="capitalize">{item.location.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Purchased:</span>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.purchaseDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Expires:</span>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(item.expiryDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Price:</span>
                    <span className="text-slate-300 font-medium">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No items found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      {/* Add/Edit Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-slate-200 mb-6">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter item name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select category</option>
                    {INVENTORY_CATEGORIES.map(category => (
                      <option key={category} value={category} className="capitalize">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Location</label>
                  <select
                    value={newItem.location}
                    onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select location</option>
                    {STORAGE_LOCATIONS.map(location => (
                      <option key={location} value={location} className="capitalize">
                        {location.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Unit</label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select unit</option>
                    {UNITS.map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={newItem.purchaseDate}
                    onChange={(e) => setNewItem({...newItem, purchaseDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                  setNewItem({
                    name: '',
                    category: '',
                    quantity: '',
                    unit: '',
                    purchaseDate: '',
                    expiryDate: '',
                    location: '',
                    price: ''
                  });
                }}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-indigo-600 transition-all"
              >
                {editingItem ? 'Update' : 'Add'} Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;