import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

import { LogAPI, InventoryAPI, UserAPI, SDGAPI } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');
  const [consumptionData, setConsumptionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    dailyCalories: 0,
    weeklySpending: 0,
    calorieChange: 0,
    spendingChange: 0
  });
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    healthPercentage: 0
  });
  const [categoryData, setCategoryData] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [sdgData, setSdgData] = useState({
    totalScore: 78,
    breakdown: {},
    insights: null,
    loading: true
  });

  const fetchSDGData = async () => {
    try {
      console.log('🔄 Fetching SDG data...');
      
      const [scoreResponse, insightsResponse] = await Promise.all([
        SDGAPI.getSDGScore(),
        SDGAPI.getWeeklyInsights()
      ]);
      
      console.log('📊 SDG Score Response:', scoreResponse);
      console.log('💡 SDG Insights Response:', insightsResponse);
      
      const sdgUpdate = {
        totalScore: scoreResponse.data.totalScore,
        breakdown: scoreResponse.data.breakdown,
        insights: insightsResponse.data,
        loading: false
      };
      
      console.log('🎯 Setting SDG Data:', sdgUpdate);
      setSdgData(sdgUpdate);
    } catch (error) {
      console.error('Error fetching SDG data:', error);
      // Keep default values if API fails
      setSdgData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchConsumptionData();
    fetchInventoryData();
    fetchSDGData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = userInfo.id;
      
      if (userId) {
        const profileData = await UserAPI.getProfileById(userId);
        setUserName(profileData.full_name || 'User');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchConsumptionData = async () => {
    try {
      const logs = await LogAPI.getLogsByUserId();
      
      // Group by date and sum calories/cost
      const grouped = logs.reduce((acc, log) => {
        const date = new Date(log.log_date).toLocaleDateString('en-US', { weekday: 'short' });
        
        if (!acc[date]) {
          acc[date] = { name: date, calories: 0, cost: 0 };
        }
        
        acc[date].calories += log.calory;
        acc[date].cost += log.cost;
        
        return acc;
      }, {});
      
      setConsumptionData(Object.values(grouped));
      
      // Calculate stats for last 7 days
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      
      const lastWeekLogs = logs.filter(log => new Date(log.log_date) >= sevenDaysAgo);
      const previousWeekLogs = logs.filter(log => {
        const logDate = new Date(log.log_date);
        return logDate >= fourteenDaysAgo && logDate < sevenDaysAgo;
      });
      
      const weeklySpending = lastWeekLogs.reduce((sum, log) => sum + log.cost, 0);
      const dailyCalories = lastWeekLogs.length > 0 
        ? Math.round(lastWeekLogs.reduce((sum, log) => sum + log.calory, 0) / lastWeekLogs.length)
        : 0;
      
      const prevWeekSpending = previousWeekLogs.reduce((sum, log) => sum + log.cost, 0);
      const prevDailyCalories = previousWeekLogs.length > 0
        ? Math.round(previousWeekLogs.reduce((sum, log) => sum + log.calory, 0) / previousWeekLogs.length)
        : 0;
      
      const spendingChange = prevWeekSpending > 0 
        ? Math.round(((weeklySpending - prevWeekSpending) / prevWeekSpending) * 100)
        : 0;
      
      const calorieChange = prevDailyCalories > 0
        ? Math.round(((dailyCalories - prevDailyCalories) / prevDailyCalories) * 100)
        : 0;
      
      setStats({
        dailyCalories,
        weeklySpending: weeklySpending.toFixed(0),
        calorieChange,
        spendingChange
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching consumption data:', error);
      setLoading(false);
    }
  };

  const fetchInventoryData = async () => {
    try {
      const inventory = await InventoryAPI.getInventory();
      
      const totalItems = inventory.length;
      const healthyItems = inventory.filter(item => {
        const expiryDays = item.expiration_days;
        return expiryDays > 7; // Items with more than 7 days are considered healthy
      }).length;
      
      const healthPercentage = totalItems > 0 
        ? Math.round((healthyItems / totalItems) * 100)
        : 0;
      
      setInventoryStats({
        totalItems,
        healthPercentage
      });

      // Calculate category distribution
      const categoryColors = {
        vegetables: '#10b981',
        grains: '#f59e0b',
        protein: '#ef4444',
        dairy: '#3b82f6',
        fruits: '#8b5cf6',
        other: '#6b7280'
      };

      const categoryCounts = inventory.reduce((acc, item) => {
        const category = item.category?.toLowerCase() || 'other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const total = inventory.length;
      const categories = Object.entries(categoryCounts).map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: Math.round((count / total) * 100),
        color: categoryColors[name] || categoryColors.other
      }));

      setCategoryData(categories);

      // Generate inventory alerts
      const alerts = inventory
        .map(item => {
          const expiryDays = item.expiration_days;
          const quantity = item.quantity || 0;
          
          if (expiryDays < 0) {
            return {
              item: item.item_name,
              status: 'expired',
              days: expiryDays,
              type: 'error'
            };
          } else if (expiryDays <= 3) {
            return {
              item: item.item_name,
              status: 'expiring soon',
              days: expiryDays,
              type: 'warning'
            };
          } else if (quantity < 2) {
            return {
              item: item.item_name,
              status: 'low stock',
              quantity: `${quantity} ${item.unit || 'unit'}`,
              type: 'info'
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(0, 5); // Show top 5 alerts

      setInventoryAlerts(alerts);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  // Dynamic recommendations from SDG insights + static fallbacks
  const recommendations = [
    ...(sdgData.insights?.actionableSteps?.slice(0, 2).map(step => {
      const title = typeof step === 'string' ? step : 
                   typeof step === 'object' && step?.title ? step.title : 
                   'Sustainability Tip';
      const description = typeof step === 'object' && step?.description ? step.description : 
                         'AI-powered sustainability recommendation';
      
      return {
        type: 'sustainability',
        title: String(title), // Ensure it's a string
        description: String(description), // Ensure it's a string
        action: 'Take Action'
      };
    }) || []),
    {
      type: 'budget',
      title: 'Budget Alert',
      description: 'You\'re 15% over your weekly food budget',
      action: 'View Budget'
    }
  ].slice(0, 3); // Show max 3 recommendations

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
                Welcome back{userName ? `, ${userName.split(' ')[0]}` : ''}! Here's your food consumption and sustainability overview
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
              <span className={`text-sm font-medium ${stats.calorieChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.calorieChange >= 0 ? '+' : ''}{stats.calorieChange}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-1">
              {loading ? '...' : stats.dailyCalories}
            </h3>
            <p className="text-slate-400 text-sm">Daily Calories</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <span className={`text-sm font-medium ${stats.spendingChange >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                {stats.spendingChange >= 0 ? '+' : ''}{stats.spendingChange}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-1">
              {loading ? '...' : `$${stats.weeklySpending}`}
            </h3>
            <p className="text-slate-400 text-sm">Weekly Spending</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Package className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-slate-400 font-medium">
                {loading ? '...' : `${inventoryStats.totalItems} items`}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-1">
              {loading ? '...' : `${inventoryStats.healthPercentage}%`}
            </h3>
            <p className="text-slate-400 text-sm">Inventory Health</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-sm text-orange-400 font-medium">Good</span>
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
            {loading ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                Loading...
              </div>
            ) : consumptionData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No consumption data available
              </div>
            ) : (
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
            )}
          </div>

          {/* Food Categories */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-200 mb-6">Food Categories</h2>
            {categoryData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-slate-400">
                No category data available
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* SDG Impact Score & Insights */}
        <div className="mb-8 bg-slate-800/60 border border-slate-700 rounded-xl p-6">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              SDG Impact & AI Insights
            </h2>
            {!sdgData.loading && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-200">{sdgData.totalScore || 0}%</div>
                  <div className={`text-sm font-medium ${
                    (sdgData.totalScore || 0) >= 80 ? 'text-green-400' : 
                    (sdgData.totalScore || 0) >= 60 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {(sdgData.totalScore || 0) >= 80 ? 'SDG Champion' : 
                     (sdgData.totalScore || 0) >= 60 ? 'SDG Achiever' : 
                     (sdgData.totalScore || 0) >= 45 ? 'SDG Learner' : 'SDG Beginner'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {sdgData.loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-400">Loading SDG data...</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Breakdown */}
              {sdgData.breakdown && typeof sdgData.breakdown === 'object' && Object.keys(sdgData.breakdown).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-slate-200 mb-4">Impact Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(sdgData.breakdown)
                      .filter(([, data]) => data && typeof data === 'object')
                      .map(([key, data]) => (
                        <div key={key} className="bg-slate-700/40 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-slate-200 font-medium capitalize text-sm">
                              {String(key).replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h4>
                            <span className={`text-sm font-bold ${
                              (data?.score || 0) >= 80 ? 'text-green-400' : 
                              (data?.score || 0) >= 60 ? 'text-orange-400' : 'text-red-400'
                            }`}>
                              {String(data?.score || 0)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                (data?.score || 0) >= 80 ? 'bg-green-500' : 
                                (data?.score || 0) >= 60 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Number(data?.score || 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* AI Insights */}
              {sdgData.insights && typeof sdgData.insights === 'object' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weekly Insight */}
                  {sdgData.insights.weeklyInsight && typeof sdgData.insights.weeklyInsight === 'string' && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h3 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        AI Weekly Insight
                      </h3>
                      <p className="text-slate-300 text-sm">{String(sdgData.insights.weeklyInsight)}</p>
                    </div>
                  )}

                  {/* Achievements */}
                  {sdgData.insights.achievements && Array.isArray(sdgData.insights.achievements) && sdgData.insights.achievements.length > 0 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <h3 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Recent Achievements
                      </h3>
                      <ul className="text-slate-300 text-sm space-y-1">
                        {sdgData.insights.achievements.slice(0, 3).map((achievement, index) => {
                          let text = 'Achievement unlocked';
                          if (typeof achievement === 'string') {
                            text = achievement;
                          } else if (typeof achievement === 'object' && achievement) {
                            text = achievement.description || achievement.title || achievement.message || text;
                          }
                          return (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-400 mt-1">•</span>
                              <span>{String(text)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Next Steps */}
                  {sdgData.insights.nextSteps && Array.isArray(sdgData.insights.nextSteps) && sdgData.insights.nextSteps.length > 0 && (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                      <h3 className="text-orange-400 font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Next Steps
                      </h3>
                      <ul className="text-slate-300 text-sm space-y-1">
                        {sdgData.insights.nextSteps.slice(0, 3).map((step, index) => {
                          let text = 'Improvement suggestion';
                          if (typeof step === 'string') {
                            text = step;
                          } else if (typeof step === 'object' && step) {
                            text = step.title || step.description || step.suggestion || text;
                          }
                          return (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-orange-400 mt-1">•</span>
                              <span>{String(text)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {sdgData.insights.improvements && Array.isArray(sdgData.insights.improvements) && sdgData.insights.improvements.length > 0 && (
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                      <h3 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Areas for Improvement
                      </h3>
                      <ul className="text-slate-300 text-sm space-y-1">
                        {sdgData.insights.improvements.slice(0, 3).map((improvement, index) => {
                          let text = 'Improvement area';
                          if (typeof improvement === 'string') {
                            text = improvement;
                          } else if (typeof improvement === 'object' && improvement) {
                            text = improvement.suggestion || improvement.description || improvement.title || text;
                          }
                          return (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>{String(text)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inventory Alerts */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Inventory Alerts
              </h2>
              <button 
                onClick={() => navigate('/inventory')}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                View All
              </button>
            </div>
            {inventoryAlerts.length === 0 ? (
              <div className="p-4 bg-slate-700/40 rounded-lg text-center text-slate-400">
                No alerts - Your inventory is in good shape! 🎉
              </div>
            ) : (
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
                          {alert.days !== undefined && (alert.days > 0 ? ` in ${alert.days} days` : alert.days === 0 ? ' today' : ' expired')}
                          {alert.quantity && ` - ${alert.quantity}`}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/inventory')}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      Action
                    </button>
                  </div>
                ))}
              </div>
            )}
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
