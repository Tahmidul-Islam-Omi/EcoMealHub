import { useState, useMemo, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  Calendar,
  Edit3,
  Trash2,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  Camera,
  Upload,
  X,
  Clock,
  Image as ImageIcon,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';

import { InventoryAPI } from '../services/api';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  
  // Global items state
  const [globalItems, setGlobalItems] = useState([]);
  const [globalItemsLoading, setGlobalItemsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGlobalItem, setSelectedGlobalItem] = useState(null);
  
  // Form states
  const [newItem, setNewItem] = useState({
    item_id: '',
    quantity: '',
    unit: '',
    custom_cost: ''
  });
  
  const [newGlobalItem, setNewGlobalItem] = useState({
    item_name: '',
    category: '',
    expiration_days: '',
    cost: '',
    image: null
  });

  // Fetch inventory items from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await InventoryAPI.getInventory(1);
        const inventoryArray = Array.isArray(data) ? data : data.data || data.inventory || [];
        setItems(inventoryArray);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setError(err.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Fetch global inventory items
  const fetchGlobalItems = async () => {
    try {
      setGlobalItemsLoading(true);
      const data = await InventoryAPI.getGlobalInventoryItems();
      const globalItemsArray = Array.isArray(data) ? data : data.data || [];
      setGlobalItems(globalItemsArray);
    } catch (err) {
      console.error('Error fetching global items:', err);
    } finally {
      setGlobalItemsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Get unique categories from items
  const categories = useMemo(() => ['all', ...new Set(items.map(i => i.category || ''))], [items]);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, selectedCategory]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = items.length;
    const expiringWarning = items.filter(item => item.expiration_days <= 7 && item.expiration_days > 0).length;
    const expired = items.filter(item => item.expiration_days <= 0).length;
    const totalValue = items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    
    return { totalItems, expiringWarning, expired, totalValue };
  }, [items]);

  const handleAddItem = async () => {
    try {
      if (!selectedGlobalItem) return;
      
      const inventoryData = {
        item_id: selectedGlobalItem.id,
        quantity: parseFloat(newItem.quantity),
        unit: newItem.unit,
        custom_cost: newItem.custom_cost ? parseFloat(newItem.custom_cost) : null
      };
      
      await InventoryAPI.createInventoryItem(inventoryData);
      
      // Refresh inventory
      const data = await InventoryAPI.getInventory(1);
      const inventoryArray = Array.isArray(data) ? data : data.data || data.inventory || [];
      setItems(inventoryArray);
      
      // Reset form
      setNewItem({ item_id: '', quantity: '', unit: '', custom_cost: '' });
      setSelectedGlobalItem(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item. Please try again.');
    }
  };

  const handleAddNewGlobalItem = async () => {
    try {
      const formData = new FormData();
      formData.append('item_name', newGlobalItem.item_name);
      formData.append('category', newGlobalItem.category);
      formData.append('expiration_days', parseInt(newGlobalItem.expiration_days));
      formData.append('cost', parseFloat(newGlobalItem.cost));
      if (newGlobalItem.image) {
        formData.append('image', newGlobalItem.image);
      }
      console.log(formData);
      
      const response = await InventoryAPI.createGlobalInventoryItem(newGlobalItem);
      console.log(response);

      const data = await InventoryAPI.getGlobalInventoryItems();
      const globalItemsArray = Array.isArray(data) ? data : data.data || [];
      setGlobalItems(globalItemsArray);
      
      
      // Reset form
      setNewGlobalItem({
        item_name: '',
        category: '',
        expiration_days: '',
        cost: '',
        image: null
      });
      setShowNewItemForm(false);
      setShowAddForm(false);
      
      alert('New item added successfully! It will be available after admin approval.');
    } catch (err) {
      console.error('Error adding new global item:', err);
      alert('Failed to add new item. Please try again.');
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      item_id: item.item_id.toString(),
      quantity: item.quantity.toString(),
      unit: item.unit,
      custom_cost: item.cost ? item.cost.toString() : ''
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = async () => {
    // TODO: Replace with API call
    // await updateInventoryItem(editingItem.item_id, newItem);
    const updatedItem = {
      ...editingItem,
      ...newItem,
      quantity: parseFloat(newItem.quantity),
      custom_cost: newItem.custom_cost ? parseFloat(newItem.custom_cost) : null,
      unit: newItem.unit ? newItem.unit : "piece"
    };

    const data = await InventoryAPI.updateInventoryItem(editingItem.item_id, {
      quantity: updatedItem.quantity, 
      custom_cost: updatedItem.custom_cost,
      unit: updatedItem.unit
    });

    console.log("Updated Item:", data);
    
    // setItems(items.map(item => item.item_id === editingItem.item_id ? updatedItem : item));
    setItems(data);
        
    setEditingItem(null);
    setNewItem({ item_id: '', quantity: '', unit: '', custom_cost: '' });
    setShowAddForm(false);
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await InventoryAPI.deleteInventoryItem(itemId);
      setItems(items.filter(item => item.item_id !== itemId));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const getExpiryStatus = (expirationDays) => {
    if (expirationDays <= 0) return { label: 'Expired', color: 'red', icon: AlertCircle };
    if (expirationDays <= 3) return { label: `${expirationDays} day${expirationDays !== 1 ? 's' : ''} left`, color: 'red', icon: AlertTriangle };
    if (expirationDays <= 7) return { label: `${expirationDays} day${expirationDays !== 1 ? 's' : ''} left`, color: 'yellow', icon: AlertTriangle };
    return { label: `${expirationDays} day${expirationDays !== 1 ? 's' : ''} left`, color: 'green', icon: Clock };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-gradient-to-r from-green-500/10 to-indigo-500/10 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-10 h-10 text-green-400" />
              <h1 className="text-4xl font-bold text-slate-200">Food Inventory</h1>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Loading inventory...</h3>
            <p className="text-slate-500">Please wait while we fetch your items</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-gradient-to-r from-green-500/10 to-indigo-500/10 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-10 h-10 text-green-400" />
              <h1 className="text-4xl font-bold text-slate-200">Food Inventory</h1>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Error loading inventory</h3>
            <p className="text-slate-500 mb-5">{error}</p>
            <button onClick={() => window.location.reload()} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors hover:underline">
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

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
                Track your food items and monitor expiration dates
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
                <div className="text-2xl font-bold text-slate-200">{stats.expiringWarning}</div>
                <div className="text-sm text-slate-400">Expiring Soon</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-slate-200">{stats.expired}</div>
                <div className="text-sm text-slate-400">Expired</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-slate-200">${stats.totalValue}</div>
                <div className="text-sm text-slate-400">Total Value</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Inventory Items */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const expiryStatus = getExpiryStatus(item.expiration_days);
              const StatusIcon = expiryStatus.icon;
              const colorClass = {
                red: 'text-red-400',
                yellow: 'text-yellow-400',
                green: 'text-green-400'
              }[expiryStatus.color];

              return (
                <div key={item.item_id} className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-800/80 transition-all">
                  {/* Item Image */}
                  <div className="h-40 bg-slate-700/50 flex items-center justify-center border-b border-slate-700">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-slate-600" />
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-200">{item.item_name}</h3>
                        <p className="text-sm text-slate-400 capitalize">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.item_id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expiry Status */}
                    <div className={`flex items-center gap-2 mb-4 text-sm ${colorClass}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{expiryStatus.label}</span>
                    </div>

                    {/* Quantity and Cost */}
                    <div className="space-y-2 text-sm border-t border-slate-700 pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Quantity:</span>
                        <span className="text-slate-300 font-medium">{item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Cost:</span>
                        <span className="text-slate-300 font-medium">${(item.custom_cost || item.cost)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Total:</span>
                        <span className="text-slate-200 font-semibold">${((item.custom_cost || item.cost) * item.quantity)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Added:</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No items found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      {/* Add/Edit Modal */}
      {showAddForm && !showNewItemForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-slate-200 mb-6">
              {editingItem ? 'Edit Item' : 'Add Item'}
            </h2>
            
            <div className="space-y-4">
              {!editingItem && (
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Select Item</label>
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => {
                        setShowDropdown(!showDropdown);
                        if (!showDropdown && globalItems.length === 0) {
                          fetchGlobalItems();
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-between"
                    >
                      {selectedGlobalItem ? (
                        <div className="flex items-center gap-2">
                          {selectedGlobalItem.image_url && (
                            <img 
                              src={selectedGlobalItem.image_url} 
                              alt={selectedGlobalItem.item_name}
                              className="w-6 h-6 rounded object-cover"
                            />
                          )}
                          <span>{selectedGlobalItem.item_name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Select an item...</span>
                      )}
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                    
                    {showDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        {globalItemsLoading ? (
                          <div className="p-4 text-center text-slate-400">Loading items...</div>
                        ) : globalItems.length > 0 ? (
                          <>
                            {globalItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setSelectedGlobalItem(item);
                                  setShowDropdown(false);
                                }}
                                className="w-full px-3 py-2 text-left hover:bg-slate-600 transition-colors flex items-center gap-2"
                              >
                                {item.image_url && (
                                  <img 
                                    src={item.image_url} 
                                    alt={item.item_name}
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                )}
                                <div>
                                  <div className="text-slate-200 font-medium">{item.item_name}</div>
                                  <div className="text-slate-400 text-sm capitalize">{item.category}</div>
                                </div>
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                setShowDropdown(false);
                                setShowNewItemForm(true);
                              }}
                              className="w-full px-3 py-2 text-left border-t border-slate-600 hover:bg-slate-600 transition-colors text-green-400 font-medium flex items-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add New Item
                            </button>
                          </>
                        ) : (
                          <div className="p-4">
                            <div className="text-center text-slate-400 mb-2">No items available</div>
                            <button
                              onClick={() => {
                                setShowDropdown(false);
                                setShowNewItemForm(true);
                              }}
                              className="w-full px-3 py-2 text-center hover:bg-slate-600 transition-colors text-green-400 font-medium flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              Add New Item
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Quantity</label>
                <input
                  type="number"
                  step="0.1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Unit</label>
                <input
                  type="text"
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., kg, L, pieces"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Custom Cost (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.custom_cost}
                  onChange={(e) => setNewItem({...newItem, custom_cost: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Leave empty to use default cost"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                  setSelectedGlobalItem(null);
                  setNewItem({ item_id: '', quantity: '', unit: '', custom_cost: '' });
                  setShowDropdown(false);
                }}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                disabled={!editingItem && !selectedGlobalItem}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingItem ? 'Update' : 'Add'} Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Global Item Modal */}
      {showNewItemForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setShowNewItemForm(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-xl font-semibold text-slate-200">Add New Item</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Item Name</label>
                <input
                  type="text"
                  value={newGlobalItem.item_name}
                  onChange={(e) => {

                    setNewGlobalItem({...newGlobalItem, item_name: e.target.value})                    
                  }}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter item name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Category</label>
                <input
                  type="text"
                  value={newGlobalItem.category}
                  onChange={(e) => setNewGlobalItem({...newGlobalItem, category: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., fruits, vegetables, dairy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Expiration Days</label>
                <input
                  type="number"
                  value={newGlobalItem.expiration_days}
                  onChange={(e) => setNewGlobalItem({...newGlobalItem, expiration_days: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Days until expiration"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Cost</label>
                <input
                  type="number"
                  step="0.01"
                  value={newGlobalItem.cost}
                  onChange={(e) => setNewGlobalItem({...newGlobalItem, cost: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Item Picture</label>
                <div className="relative">
                  {newGlobalItem.image ? (
                    <div className="relative">
                      <img 
                        src={URL.createObjectURL(newGlobalItem.image)} 
                        alt="Item preview" 
                        className="w-full h-32 object-cover rounded-lg border border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => setNewGlobalItem({...newGlobalItem, image: null})}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 text-slate-500 mb-2" />
                        <p className="text-sm text-slate-400">
                          <span className="font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG or WebP (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && file.size <= 5 * 1024 * 1024) {
                            setNewGlobalItem({...newGlobalItem, image: file});
                          } else if (file) {
                            alert('File size must be less than 5MB');
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowNewItemForm(false);
                  setNewGlobalItem({
                    item_name: '',
                    category: '',
                    expiration_days: '',
                    cost: '',
                    image: null
                  });
                }}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewGlobalItem}
                disabled={!newGlobalItem.item_name || !newGlobalItem.category || !newGlobalItem.expiration_days || !newGlobalItem.cost}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;