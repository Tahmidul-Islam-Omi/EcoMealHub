import { useState, useEffect } from 'react';
import { 
  FileText,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Download,
  Eye,
  Plus,
  Clock,
  X
} from 'lucide-react';

import { LogAPI, InventoryAPI } from '../services/api';

const Logs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [showAddForm, setShowAddForm] = useState(false);
  const [logs, setLogs] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newLog, setNewLog] = useState({
    meal_type: 'breakfast',
    items: [],
    log_date: new Date().toISOString().split('T')[0]
  });
  const [selectedItem, setSelectedItem] = useState({
    item_id: '',
    quantity: '',
    waste: ''
  });

  // Fetch logs and inventory
  useEffect(() => {
    fetchLogs();
    fetchInventory();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await LogAPI.getLogsByUserId();
      console.log('Raw API data:', data);
      
      // Group logs by date
      const groupedByDate = data.reduce((acc, log) => {
        const date = new Date(log.log_date).toISOString().split('T')[0];
        
        if (!acc[date]) {
          acc[date] = {
            id: date,
            date: date,
            meals: [],
            totalCalories: 0,
            totalCost: 0,
            totalWaste: 0
          };
        }
        
        const time = new Date(log.created_at).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
        
        acc[date].meals.push({
          meal_type: log.meal_type,
          calories: log.calory,
          cost: log.cost,
          waste: log.waste,
          time: time,
          food_items: log.food_items || []
        });
        
        acc[date].totalCalories += log.calory;
        acc[date].totalCost += log.cost;
        acc[date].totalWaste += log.waste;
        
        return acc;
      }, {});
      
      // Convert to array and sort by date (newest first)
      const logsArray = Object.values(groupedByDate).sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      console.log('Grouped logs:', logsArray);
      setLogs(logsArray);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    }
  };

  const fetchInventory = async () => {
    try {
      const data = await InventoryAPI.getInventory();
      console.log('Fetched inventory:', data);
      setInventoryItems(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventoryItems([]);
    }
  };

  const handleAddItemToLog = () => {
    if (!selectedItem.item_id || !selectedItem.quantity) return;
    
    const item = inventoryItems.find(i => i.item_id === parseInt(selectedItem.item_id));
    if (!item) return;

    const itemCost = (item.custom_cost || item.cost) * parseFloat(selectedItem.quantity);
    const itemWaste = parseFloat(selectedItem.waste) || 0;
    const itemCalories = (item.calories || 0) * parseFloat(selectedItem.quantity);
    
    console.log('Item calories:', item.calories, 'Quantity:', selectedItem.quantity, 'Total:', itemCalories);
    
    setNewLog(prev => ({
      ...prev,
      items: [...prev.items, {
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: parseFloat(selectedItem.quantity),
        waste: itemWaste,
        cost: itemCost,
        calories: itemCalories
      }]
    }));

    setSelectedItem({ item_id: '', quantity: '', waste: '' });
  };

  const handleRemoveItem = (index) => {
    setNewLog(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitLog = async () => {
    const totalCalories = newLog.items.reduce((sum, item) => sum + item.calories, 0);
    const totalCost = newLog.items.reduce((sum, item) => sum + item.cost, 0);
    const totalWaste = newLog.items.reduce((sum, item) => sum + item.waste, 0);
    const foodItemIds = newLog.items.map(item => item.item_id);

    const logData = {
      meal_type: newLog.meal_type,
      calory: totalCalories,
      cost: totalCost,
      waste: totalWaste,
      log_date: newLog.log_date,
      food_items: foodItemIds
    };

    try {

      console.log(logData);
      
      await LogAPI.createLogEntry(logData);
      fetchLogs();
      setShowAddForm(false);
      setNewLog({ meal_type: 'breakfast', items: [], log_date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error('Error adding log:', error);
      alert('Failed to add log entry. Please try again.');
    }
  };

  const getMealTypeIcon = (type) => {
    switch(type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snacks': return '🍿';
      default: return '🍽️';
    }
  };

  const getFoodNames = (foodItemIds) => {
    if (!foodItemIds || foodItemIds.length === 0) return 'No items tracked';
    
    const names = foodItemIds
      .map(id => {
        const item = inventoryItems.find(inv => inv.item_id === id);
        return item ? item.item_name : null;
      })
      .filter(Boolean);
    
    return names.length > 0 ? names.join(', ') : 'Items not found';
  };

  // Calculate statistics from logs
  const calculateStats = () => {
    const totalDays = logs.length;
    const totalCalories = logs.reduce((sum, log) => sum + log.totalCalories, 0);
    const totalCost = logs.reduce((sum, log) => sum + log.totalCost, 0);
    const totalWaste = logs.reduce((sum, log) => sum + log.totalWaste, 0);
    
    const avgCaloriesPerDay = totalDays > 0 ? Math.round(totalCalories / totalDays) : 0;
    
    // Calculate week-over-week changes (last 7 days vs previous 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const lastWeekLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= sevenDaysAgo && logDate <= now;
    });
    
    const previousWeekLogs = logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= fourteenDaysAgo && logDate < sevenDaysAgo;
    });
    
    const lastWeekEntries = lastWeekLogs.length;
    const previousWeekEntries = previousWeekLogs.length;
    const entriesChange = lastWeekEntries - previousWeekEntries;
    
    const lastWeekCost = lastWeekLogs.reduce((sum, log) => sum + log.totalCost, 0);
    const previousWeekCost = previousWeekLogs.reduce((sum, log) => sum + log.totalCost, 0);
    const costChangePercent = previousWeekCost > 0 
      ? Math.round(((lastWeekCost - previousWeekCost) / previousWeekCost) * 100) 
      : 0;
    
    const lastWeekWaste = lastWeekLogs.reduce((sum, log) => sum + log.totalWaste, 0);
    const previousWeekWaste = previousWeekLogs.reduce((sum, log) => sum + log.totalWaste, 0);
    const wasteChangePercent = previousWeekWaste > 0 
      ? Math.round(((lastWeekWaste - previousWeekWaste) / previousWeekWaste) * 100) 
      : 0;
    
    return {
      totalEntries: totalDays,
      avgCaloriesPerDay,
      totalCost: totalCost.toFixed(2),
      totalWaste: totalWaste.toFixed(2),
      entriesChange,
      costChangePercent,
      wasteChangePercent
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-400" />
              <div>
                <h1 className="text-3xl font-bold text-slate-200">Consumption Logs</h1>
                <p className="text-slate-400">Track and analyze your food consumption history</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
              <button className="flex items-center gap-2 bg-slate-700/60 text-slate-300 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search food items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Period Filter */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Total Entries</span>
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-slate-200">{stats.totalEntries}</div>
            <div className={`text-sm ${stats.entriesChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.entriesChange >= 0 ? '+' : ''}{stats.entriesChange} this week
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Avg Calories/Day</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-slate-200">{stats.avgCaloriesPerDay}</div>
            <div className="text-sm text-slate-400">Last {stats.totalEntries} days</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Total Cost</span>
              <span className="text-lg">💰</span>
            </div>
            <div className="text-2xl font-bold text-slate-200">${stats.totalCost}</div>
            <div className={`text-sm ${stats.costChangePercent > 0 ? 'text-orange-400' : stats.costChangePercent < 0 ? 'text-green-400' : 'text-slate-400'}`}>
              {stats.costChangePercent > 0 ? '+' : ''}{stats.costChangePercent}% from last week
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Food Waste</span>
              <span className="text-lg">♻️</span>
            </div>
            <div className="text-2xl font-bold text-slate-200">{stats.totalWaste}kg</div>
            <div className={`text-sm ${stats.wasteChangePercent < 0 ? 'text-green-400' : stats.wasteChangePercent > 0 ? 'text-red-400' : 'text-slate-400'}`}>
              {stats.wasteChangePercent > 0 ? '+' : ''}{stats.wasteChangePercent}% {stats.wasteChangePercent < 0 ? 'reduction' : 'from last week'}
            </div>
          </div>
        </div>

        {/* Consumption Logs */}
        <div className="space-y-6">
          {logs.map(log => (
            <div key={log.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              {/* Log Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-200">
                      {new Date(log.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-slate-400 text-sm">
                        {log.totalCalories} calories
                      </span>
                      <span className="text-slate-400 text-sm">
                        ${log.totalCost }
                      </span>
                      <span className="text-slate-400 text-sm">
                        {log.totalWaste }kg waste
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meals */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {log.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="bg-slate-700/40 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMealTypeIcon(meal.meal_type)}</span>
                        <span className="font-medium text-slate-200 capitalize">{meal.meal_type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Clock className="w-4 h-4" />
                        {meal.time}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {meal.food_items && meal.food_items.length > 0 && (
                        <div className="pb-2 mb-2 border-b border-slate-600">
                          <span className="text-slate-400 text-xs">Items:</span>
                          <p className="text-slate-300 text-sm mt-1">{getFoodNames(meal.food_items)}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 text-sm">Calories:</span>
                        <span className="text-slate-200 font-medium">{meal.calories} cal</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 text-sm">Cost:</span>
                        <span className="text-slate-200 font-medium">${meal.cost }</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-slate-400 text-sm">Waste:</span>
                        <span className="text-slate-200 font-medium">{meal.waste }kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Log Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-200">Add Consumption Log</h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Date</label>
                  <input
                    type="date"
                    value={newLog.log_date}
                    onChange={(e) => setNewLog({...newLog, log_date: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Meal Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Meal Type</label>
                  <select
                    value={newLog.meal_type}
                    onChange={(e) => setNewLog({...newLog, meal_type: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>

                {/* Add Items from Inventory */}
                <div className="border border-slate-600 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-slate-200 mb-4">Select Items from Inventory</h3>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Item</label>
                      <select
                        value={selectedItem.item_id}
                        onChange={(e) => setSelectedItem({...selectedItem, item_id: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select item</option>
                        {inventoryItems.map(item => (
                          <option key={item.item_id} value={item.item_id}>
                            {item.item_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Quantity ({inventoryItems.find(i => i.item_id === parseInt(selectedItem.item_id))?.unit || 'unit'})</label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedItem.quantity}
                        onChange={(e) => setSelectedItem({...selectedItem, quantity: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="0.0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Waste (kg)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={selectedItem.waste}
                        onChange={(e) => setSelectedItem({...selectedItem, waste: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleAddItemToLog}
                    className="w-full px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors text-sm"
                  >
                    Add Item
                  </button>

                  {/* Added Items List */}
                  {newLog.items.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium text-slate-400">Added Items:</p>
                      {newLog.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-700/40 px-3 py-2 rounded">
                          <div className="text-sm text-slate-200">
                            {item.item_name} - {item.quantity}kg - {Math.round(item.calories)} cal - ${item.cost.toFixed(2)} - {item.waste}kg waste
                          </div>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary */}
                {newLog.items.length > 0 && (
                  <div className="bg-slate-700/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-slate-200 mb-3">Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Calories:</span>
                        <span className="text-slate-200 font-medium">
                          {Math.round(newLog.items.reduce((sum, item) => sum + item.calories, 0))} cal
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Cost:</span>
                        <span className="text-slate-200 font-medium">
                          ${newLog.items.reduce((sum, item) => sum + item.cost, 0) }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Waste:</span>
                        <span className="text-slate-200 font-medium">
                          {newLog.items.reduce((sum, item) => sum + item.waste, 0) }kg
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewLog({ meal_type: 'breakfast', items: [], log_date: new Date().toISOString().split('T')[0] });
                  }}
                  className="px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitLog}
                  disabled={newLog.items.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add Log Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-lg border border-slate-600 transition-colors">
            Load More Entries
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logs;
