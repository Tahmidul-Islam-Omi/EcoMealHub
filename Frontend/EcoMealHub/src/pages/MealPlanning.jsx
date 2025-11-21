import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  ShoppingCart, 
  Target,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Clock,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { MEAL_TYPES, QUICK_ADD_MEALS, SHOPPING_LIST } from '../utills/mealPlanData';
import { MealPlanAPI } from '../services/api';

const MealPlanning = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealPlan, setMealPlan] = useState({});
  const [mealPlanData, setMealPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ date: null, mealType: null });
  const [shoppingList, setShoppingList] = useState(SHOPPING_LIST);

  // Fetch active meal plan on component mount
  useEffect(() => {
    fetchActiveMealPlan();
  }, []);

  // Fetch active meal plan from backend
  const fetchActiveMealPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await MealPlanAPI.getActiveMealPlan();
      if (response.success && response.data) {
        setMealPlanData(response.data);
        transformMealPlanData(response.data);
      }
    } catch (err) {
      console.error('Error fetching meal plan:', err);
      if (err.response?.status === 404) {
        setError('No meal plan found. Generate one to get started!');
      } else {
        setError('Failed to load meal plan');
      }
    } finally {
      setLoading(false);
    }
  };

  // Transform backend meal plan data to component state format
  const transformMealPlanData = (data) => {
    const { meals } = data;
    const transformed = {};
    
    meals.forEach(meal => {
      // Normalize date to YYYY-MM-DD format (remove time if present)
      const dateKey = meal.meal_date.split('T')[0];
      if (!transformed[dateKey]) {
        transformed[dateKey] = {};
      }
      transformed[dateKey][meal.meal_type] = {
        title: meal.meal_title,
        calories: meal.calories,
        id: meal.id
      };
    });
    
    setMealPlan(transformed);
  };

  // Generate new meal plan
  const handleGenerateMealPlan = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await MealPlanAPI.generateMealPlan();
      if (response.success && response.data) {
        setMealPlanData(response.data);
        transformMealPlanData(response.data);
      }
    } catch (err) {
      console.error('Error generating meal plan:', err);
      setError(err.response?.data?.message || 'Failed to generate meal plan');
    } finally {
      setGenerating(false);
    }
  };

  // Regenerate meal plan
  const handleRegenerateMealPlan = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await MealPlanAPI.regenerateMealPlan();
      if (response.success && response.data) {
        setMealPlanData(response.data);
        transformMealPlanData(response.data);
      }
    } catch (err) {
      console.error('Error regenerating meal plan:', err);
      setError(err.response?.data?.message || 'Failed to regenerate meal plan');
    } finally {
      setGenerating(false);
    }
  };

  // Get week dates (Saturday to Friday to match backend)
  const getWeekDates = (date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    // Calculate days since last Saturday (0=Sun, 6=Sat)
    const daysSinceSaturday = (day + 1) % 7;
    startDate.setDate(startDate.getDate() - daysSinceSaturday);
    startDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      week.push(weekDate);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const weekdays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Format date for meal plan keys
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Add meal to plan (kept for modal functionality)
  const addMealToPlan = (date, mealType, meal) => {
    // Note: This is for manual additions, not AI-generated plans
    const dateKey = formatDateKey(date);
    setMealPlan(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [mealType]: meal
      }
    }));
    setShowAddMealModal(false);
  };

  // Calculate weekly nutrition
  const calculateWeeklyNutrition = () => {
    let totalCalories = 0;
    let mealCount = 0;

    weekDates.forEach(date => {
      const dateKey = formatDateKey(date);
      const dayMeals = mealPlan[dateKey];
      
      if (dayMeals) {
        MEAL_TYPES.forEach(mealType => {
          if (dayMeals[mealType]) {
            totalCalories += dayMeals[mealType].calories || 0;
            mealCount++;
          }
        });
      }
    });

    return {
      calories: totalCalories,
      averagePerMeal: mealCount > 0 ? Math.round(totalCalories / mealCount) : 0,
      mealsPlanned: mealCount,
      totalSlots: weekDates.length * MEAL_TYPES.length
    };
  };

  const weeklyNutrition = calculateWeeklyNutrition();

  // Toggle shopping list item
  const toggleShoppingItem = (id) => {
    // TODO: Replace with API call
    // await updateShoppingListItem(id, { checked: !item.checked });
    
    setShoppingList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const openAddMealModal = (date, mealType) => {
    setSelectedSlot({ date, mealType });
    setShowAddMealModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-10 h-10 text-purple-400" />
                <h1 className="text-4xl font-bold text-slate-200">Meal Planning</h1>
              </div>
              <p className="text-slate-400 max-w-2xl">
                Plan your meals, track nutrition, and generate shopping lists for sustainable eating
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* <button className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg border border-purple-500/30 hover:bg-purple-500/30 transition-colors">
                <ShoppingCart className="w-4 h-4" />
                Shopping List
              </button> */}
              {mealPlanData ? (
                <button 
                  onClick={handleRegenerateMealPlan}
                  disabled={generating}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Regenerate Plan
                    </>
                  )}
                </button>
              ) : (
                <button 
                  onClick={handleGenerateMealPlan}
                  disabled={generating}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate AI Plan
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading meal plan...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !mealPlanData && !error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-slate-200 mb-2">No Meal Plan Yet</h3>
              <p className="text-slate-400 mb-6">
                Generate an AI-powered meal plan based on your preferences, budget, and available inventory.
              </p>
              <button 
                onClick={handleGenerateMealPlan}
                disabled={generating}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI Meal Plan
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Meal Plan Grid */}
        {!loading && mealPlanData && (
        <div className="grid grid-cols-1 gap-8">
          {/* Main Meal Plan */}
          <div>
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={goToPreviousWeek}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-slate-200">
                  Week of {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </h2>
                <button
                  onClick={goToNextWeek}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors"
              >
                Today
              </button>
            </div>

            {/* Meal Plan Grid */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
              {/* Header Row */}
              <div className="grid grid-cols-8 border-b border-slate-700">
                <div className="p-4 text-slate-400 font-medium">Meal</div>
                {weekDates.map((date, index) => (
                  <div key={index} className="p-4 text-center border-l border-slate-700">
                    <div className="text-slate-400 text-sm">{weekdays[index]}</div>
                    <div className="text-slate-200 font-semibold">{date.getDate()}</div>
                  </div>
                ))}
              </div>

              {/* Meal Rows */}
              {MEAL_TYPES.map(mealType => (
                <div key={mealType} className="grid grid-cols-8 border-b border-slate-700 last:border-b-0">
                  <div className="p-4 border-r border-slate-700 bg-slate-700/30">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-200 font-medium capitalize">{mealType}</span>
                    </div>
                  </div>
                  {weekDates.map((date, dateIndex) => {
                    const dateKey = formatDateKey(date);
                    const meal = mealPlan[dateKey]?.[mealType];
                    
                    return (
                      <div key={dateIndex} className="p-2 border-l border-slate-700 min-h-[100px] relative group">
                        {meal ? (
                          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 h-full relative">
                            <h4 className="text-slate-200 font-medium text-sm mb-1">{meal.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <span>{meal.calories} cal</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-600 rounded-lg">
                            <span className="text-slate-500 text-xs">No meal</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Commented out for future implementation */}
          {/* <div className="space-y-6">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Weekly Overview
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Calories</span>
                  <span className="text-slate-200 font-semibold">{weeklyNutrition.calories.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Avg per Meal</span>
                  <span className="text-slate-200 font-semibold">{weeklyNutrition.averagePerMeal} cal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Meals Planned</span>
                  <span className="text-slate-200 font-semibold">
                    {weeklyNutrition.mealsPlanned}/{weeklyNutrition.totalSlots}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Planning Progress</span>
                    <span className="text-slate-300">
                      {Math.round((weeklyNutrition.mealsPlanned / weeklyNutrition.totalSlots) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: `${(weeklyNutrition.mealsPlanned / weeklyNutrition.totalSlots) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-purple-400" />
                  Shopping List
                </h3>
                <button className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                  View All
                </button>
              </div>
              
              <div className="space-y-2">
                {shoppingList.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded-lg transition-colors">
                    <button
                      onClick={() => toggleShoppingItem(item.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        item.checked
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-500 hover:border-slate-400'
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3" />}
                    </button>
                    <div className="flex-1">
                      <div className={`text-sm ${item.checked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.quantity} {item.unit} • ${item.estimatedPrice}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Estimated Total</span>
                  <span className="text-slate-200 font-semibold">
                    ${shoppingList.reduce((sum, item) => sum + item.estimatedPrice, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        )}
      </div>

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-200">
                Add {selectedSlot.mealType} for {selectedSlot.date?.toLocaleDateString()}
              </h2>
              <button
                onClick={() => setShowAddMealModal(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">Quick Add Options</h3>
              {QUICK_ADD_MEALS
                .filter(meal => meal.type === selectedSlot.mealType)
                .map(meal => (
                  <button
                    key={meal.id}
                    onClick={() => addMealToPlan(selectedSlot.date, selectedSlot.mealType, meal)}
                    className="w-full text-left p-4 bg-slate-700/60 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-200">{meal.title}</h4>
                      <span className="text-slate-400 text-sm">{meal.calories} cal</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.prepTime}m
                      </div>
                      <div className="flex items-center gap-1">
                        {meal.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-slate-600/60 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-700">
              <button className="w-full p-3 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors">
                Browse All Recipes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanning;
