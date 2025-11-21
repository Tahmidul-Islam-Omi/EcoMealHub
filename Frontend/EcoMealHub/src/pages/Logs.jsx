import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Download,
  Eye,
  Plus,
  Clock
} from 'lucide-react';

const Logs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // list or grid

  const { t, i18n } = useTranslation();

  // Sample consumption logs data
  const consumptionLogs = [
    {
      id: 1,
      date: '2024-11-20',
      meals: [
        { time: '08:00', type: 'breakfast', items: [
          { name: 'Oatmeal', quantity: '1 bowl', category: 'grains', calories: 150 },
          { name: 'Banana', quantity: '1 piece', category: 'fruits', calories: 95 },
          { name: 'Milk', quantity: '200ml', category: 'dairy', calories: 120 }
        ]},
        { time: '13:00', type: 'lunch', items: [
          { name: 'Grilled Chicken', quantity: '150g', category: 'protein', calories: 280 },
          { name: 'Rice', quantity: '1 cup', category: 'grains', calories: 200 },
          { name: 'Mixed Vegetables', quantity: '1 cup', category: 'vegetables', calories: 80 }
        ]},
        { time: '19:30', type: 'dinner', items: [
          { name: 'Salmon', quantity: '200g', category: 'protein', calories: 350 },
          { name: 'Quinoa', quantity: '1 cup', category: 'grains', calories: 220 },
          { name: 'Broccoli', quantity: '1 cup', category: 'vegetables', calories: 25 }
        ]}
      ],
      totalCalories: 1520,
      totalCost: 32.50,
      wasteGenerated: 0.2
    },
    {
      id: 2,
      date: '2024-11-19',
      meals: [
        { time: '08:30', type: 'breakfast', items: [
          { name: 'Greek Yogurt', quantity: '1 cup', category: 'dairy', calories: 150 },
          { name: 'Berries', quantity: '0.5 cup', category: 'fruits', calories: 40 },
          { name: 'Granola', quantity: '2 tbsp', category: 'grains', calories: 80 }
        ]},
        { time: '12:30', type: 'lunch', items: [
          { name: 'Turkey Sandwich', quantity: '1 sandwich', category: 'protein', calories: 320 },
          { name: 'Apple', quantity: '1 piece', category: 'fruits', calories: 80 }
        ]},
        { time: '20:00', type: 'dinner', items: [
          { name: 'Pasta', quantity: '1 cup', category: 'grains', calories: 180 },
          { name: 'Tomato Sauce', quantity: '0.5 cup', category: 'vegetables', calories: 30 },
          { name: 'Parmesan', quantity: '2 tbsp', category: 'dairy', calories: 40 }
        ]}
      ],
      totalCalories: 920,
      totalCost: 18.75,
      wasteGenerated: 0.1
    }
  ];

  const categories = ['all', 'grains', 'protein', 'vegetables', 'fruits', 'dairy'];

  const getCategoryColor = (category) => {
    const colors = {
      grains: 'bg-yellow-500/20 text-yellow-400',
      protein: 'bg-red-500/20 text-red-400',
      vegetables: 'bg-green-500/20 text-green-400',
      fruits: 'bg-orange-500/20 text-orange-400',
      dairy: 'bg-blue-500/20 text-blue-400'
    };
    return colors[category] || 'bg-slate-500/20 text-slate-400';
  };

  const getMealTypeIcon = (type) => {
    switch(type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      default: return '🍽️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-400" />
              <div>
                <h1 className="text-3xl font-bold text-slate-200">{t('Consumption Logs')}</h1>
                <p className="text-slate-400">{t('Track and analyze your food consumption history')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">
                <Plus className="w-4 h-4" />
                {t('Add Entry')}
              </button>
              <button className="flex items-center gap-2 bg-slate-700/60 text-slate-300 px-4 py-2 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors">
                <Download className="w-4 h-4" />
                {t('Export')}
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
                <option value="day">{t('Today')}</option>
                <option value="week">{t('This Week')}</option>
                <option value="month">{t('This Month')}</option>
                <option value="year">{t('This Year')}</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-700/60 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-700/40 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-500/30 text-indigo-300' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-500/30 text-indigo-300' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">{t('Total Entries')}</span>
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-slate-200">{consumptionLogs.length}</div>
            <div className="text-sm text-green-400">+2 this week</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">{t('Avg Calories/Day')}</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-slate-200">1,220</div>
            <div className="text-sm text-slate-400">{t('Last 7 days')}</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">{t('Total Cost')}</span>
              <span className="text-lg">💰</span>
            </div>
            <div className="text-2xl font-bold text-slate-200">$51.25</div>
            <div className="text-sm text-orange-400">+15% from last week</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">{t('Food Waste')}</span>
              <span className="text-lg">♻️</span>
            </div>
            <div className="text-2xl font-bold text-slate-200">0.3kg</div>
            <div className="text-sm text-green-400">-20% reduction</div>
          </div>
        </div>

        {/* Consumption Logs */}
        <div className="space-y-6">
          {consumptionLogs.map(log => (
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
                        {log.totalCalories} {t('calories')}
                      </span>
                      <span className="text-slate-400 text-sm">
                        ${log.totalCost.toFixed(2)}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {log.wasteGenerated}{t('kg waste')}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {/* Meals */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {log.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="bg-slate-700/40 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMealTypeIcon(meal.type)}</span>
                        <span className="font-medium text-slate-200 capitalize">{meal.type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Clock className="w-4 h-4" />
                        {meal.time}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {meal.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-slate-600/50 last:border-b-0">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-slate-200 text-sm font-medium">{item.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                                {item.category}
                              </span>
                            </div>
                            <div className="text-slate-400 text-xs">
                              {item.quantity} • {item.calories} cal
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-600/50">
                      <div className="text-slate-300 text-sm font-medium">
                        Total: {meal.items.reduce((sum, item) => sum + item.calories, 0)} {t('calories')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-slate-700/60 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-lg border border-slate-600 transition-colors">
            {t('Load More Entries')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logs;
