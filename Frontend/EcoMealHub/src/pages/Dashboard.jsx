import { useState } from 'react';
import { 
  LayoutDashboard,
  TrendingUp,
  Package,
  DollarSign,
  Target,
  Activity,
  AlertTriangle,
  Users,
  Calendar,
  Clock,
  Award,
  Lightbulb
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const Dashboard = () => {
  // Sample data for charts
  const [timeRange, setTimeRange] = useState('week');
  
  const consumptionData = [
    { name: 'Mon', calories: 2200, cost: 25 },
    { name: 'Tue', calories: 2400, cost: 30 },
    { name: 'Wed', calories: 2100, cost: 22 },
    { name: 'Thu', calories: 2300, cost: 28 },
    { name: 'Fri', calories: 2500, cost: 35 },
    { name: 'Sat', calories: 2600, cost: 40 },
    { name: 'Sun', calories: 2200, cost: 26 },
  ];

  const categoryData = [
    { name: 'Vegetables', value: 35, color: '#10b981' },
    { name: 'Grains', value: 25, color: '#f59e0b' },
    { name: 'Proteins', value: 20, color: '#ef4444' },
    { name: 'Dairy', value: 15, color: '#3b82f6' },
    { name: 'Others', value: 5, color: '#8b5cf6' },
  ];

  const inventoryAlerts = [
    { item: 'Tomatoes', status: 'expiring', days: 2, type: 'warning' },
    { item: 'Milk', status: 'low stock', quantity: '1 bottle', type: 'info' },
    { item: 'Bread', status: 'expired', days: -1, type: 'error' },
  ];

  const recommendations = [
    {
      type: 'meal',
      title: 'High Protein Breakfast',
      description: 'Based on your low protein intake yesterday',
      action: 'View Recipe'
    },
    {
      type: 'budget',
      title: 'Budget Alert',
      description: 'You\'re 15% over your weekly food budget',
      action: 'View Budget'
    },
    {
      type: 'sustainability',
      title: 'Reduce Food Waste',
      description: 'Use expiring tomatoes in today\'s meals',
      action: 'Get Ideas'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard className="w-8 h-8 text-blue-400" />
                <h1 className="text-3xl font-bold text-slate-200">Dashboard</h1>
              </div>
              <p className="text-slate-400">
                Welcome back! Here's your food consumption and sustainability overview
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-sm text-green-400 font-medium">+5.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-1">2,340</h3>
            <p className="text-slate-400 text-sm">Daily Calories</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-red-400 font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-1">$186</h3>
            <p className="text-slate-400 text-sm">Weekly Spending</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-slate-400 font-medium">42 items</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-1">89%</h3>
            <p className="text-slate-400 text-sm">Inventory Health</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-sm text-orange-400 font-medium">On track</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-1">78%</h3>
            <p className="text-slate-400 text-sm">Sustainability Goal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Consumption Trend */}
          <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-200">Consumption Trends</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-400">Calories</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-400">Cost ($)</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis yAxisId="left" stroke="#9ca3af" />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }} 
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Food Categories */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-6">Food Categories</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm text-slate-400">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inventory Alerts */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Inventory Alerts
              </h2>
              <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {inventoryAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.type === 'error' ? 'bg-red-500' : 
                      alert.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <h4 className="text-slate-200 font-medium">{alert.item}</h4>
                      <p className="text-slate-400 text-sm">
                        {alert.status} 
                        {alert.days && (alert.days > 0 ? ` in ${alert.days} days` : ' yesterday')}
                        {alert.quantity && ` - ${alert.quantity}`}
                      </p>
                    </div>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                    Action
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Recommendations
              </h2>
            </div>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 bg-slate-700/40 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-slate-200 font-medium">{rec.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.type === 'meal' ? 'bg-green-500/20 text-green-400' :
                      rec.type === 'budget' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {rec.type}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{rec.description}</p>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                    {rec.action} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-slate-800/60 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-200 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-slate-200">Log Today's Meal</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
              <Package className="w-5 h-5 text-green-400" />
              <span className="text-slate-200">Update Inventory</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-slate-200">Upload Receipt</span>
            </button>
            <button className="flex items-center gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-colors">
              <Award className="w-5 h-5 text-orange-400" />
              <span className="text-slate-200">View Goals</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
