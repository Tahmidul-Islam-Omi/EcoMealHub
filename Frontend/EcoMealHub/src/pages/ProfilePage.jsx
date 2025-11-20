import { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  BookOpen, 
  Edit3, 
  Save, 
  X,
  DollarSign,
  Scale,
  Ruler,
  Activity,
  Target,
  TrendingUp
} from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState(() => {
    // Initialize user data from localStorage with extended profile
    const userData = localStorage.getItem('user');
    const defaultUser = {
      name: 'John Doe',
      email: 'john@example.com',
      height: 175, // cm
      weight: 70, // kg
      age: 30,
      gender: 'male',
      activityLevel: 'moderate',
      budgetPreference: 50,
      dietaryRestrictions: ['vegetarian'],
      sustainabilityGoals: ['reduce-waste', 'local-sourcing']
    };
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Ensure all required fields exist with defaults
      return {
        ...defaultUser,
        ...parsedUser,
        dietaryRestrictions: parsedUser.dietaryRestrictions || [],
        sustainabilityGoals: parsedUser.sustainabilityGoals || []
      };
    }
    
    return defaultUser;
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const [editData, setEditData] = useState({
    name: user.name || '',
    email: user.email || '',
    height: user.height || 175,
    weight: user.weight || 70,
    age: user.age || 30,
    gender: user.gender || 'male',
    activityLevel: user.activityLevel || 'moderate',
    budgetPreference: user.budgetPreference || 50,
    dietaryRestrictions: user.dietaryRestrictions || [],
    sustainabilityGoals: user.sustainabilityGoals || []
  });

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Get BMI category and dietary suggestion
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-400', suggestion: 'Focus on nutrient-dense, calorie-rich foods' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-400', suggestion: 'Maintain balanced nutrition and regular exercise' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-400', suggestion: 'Consider portion control and increased physical activity' };
    return { category: 'Obese', color: 'text-red-400', suggestion: 'Consult healthcare provider for personalized diet plan' };
  };

  // Calculate daily calorie needs
  const calculateDailyCalories = () => {
    const { weight, height, age, gender, activityLevel } = editData;
    let bmr;
    
    // Harris-Benedict Equation
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    return Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        height: user.height || 175,
        weight: user.weight || 70,
        age: user.age || 30,
        gender: user.gender || 'male',
        activityLevel: user.activityLevel || 'moderate',
        budgetPreference: user.budgetPreference || 50,
        dietaryRestrictions: user.dietaryRestrictions || [],
        sustainabilityGoals: user.sustainabilityGoals || []
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...editData
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);

    // TODO: Add API call to update user profile
    // await fetch(`http://localhost:3000/api/users/${user.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(editData)
    // });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'dietaryRestrictions' || name === 'sustainabilityGoals') {
        setEditData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo'];
  const sustainabilityOptions = ['reduce-waste', 'local-sourcing', 'organic', 'minimal-packaging', 'plant-based'];

  const currentBMI = calculateBMI(user.weight, user.height);
  const bmiInfo = getBMICategory(currentBMI);
  const dailyCalories = calculateDailyCalories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-200 mb-2">Profile & Health</h1>
                <p className="text-slate-400">Manage your dietary preferences and health goals</p>
              </div>
            </div>
            <button
              onClick={handleEditToggle}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-600 text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold text-slate-200 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                      <User className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-200">{user.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                      <Mail className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-200">{user.email}</span>
                    </div>
                  )}
                </div>

                {/* Height */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Height (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="height"
                      value={editData.height}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                      <Ruler className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-200">{user.height} cm</span>
                    </div>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Weight (kg)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="weight"
                      value={editData.weight}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                      <Scale className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-200">{user.weight} kg</span>
                    </div>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={editData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                      <Calendar className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-200">{user.age} years</span>
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                      <User className="w-5 h-5 text-slate-500" />
                      <span className="text-slate-200 capitalize">{user.gender}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Level */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-200 mb-2">Activity Level</label>
                {isEditing ? (
                  <select
                    name="activityLevel"
                    value={editData.activityLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (light exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                    <option value="active">Active (hard exercise 6-7 days/week)</option>
                    <option value="very_active">Very Active (physical job + exercise)</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                    <Activity className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-200 capitalize">{(user.activityLevel || 'moderate').replace('_', ' ')}</span>
                  </div>
                )}
              </div>

              {/* Budget Preference */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-200 mb-2">Weekly Food Budget ($)</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="budgetPreference"
                    value={editData.budgetPreference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-700/30 border border-slate-700 rounded-lg">
                    <DollarSign className="w-5 h-5 text-slate-500" />
                    <span className="text-slate-200">${user.budgetPreference}/week</span>
                  </div>
                )}
              </div>

              {/* Dietary Restrictions */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-200 mb-3">Dietary Restrictions</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dietaryOptions.map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="dietaryRestrictions"
                          value={option}
                          checked={editData.dietaryRestrictions.includes(option)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-slate-200 text-sm capitalize">{option.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.dietaryRestrictions && user.dietaryRestrictions.length > 0 ? (
                      user.dietaryRestrictions.map(restriction => (
                        <span key={restriction} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                          {restriction.replace('-', ' ')}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">No restrictions</span>
                    )}
                  </div>
                )}
              </div>

              {/* Sustainability Goals */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-200 mb-3">Sustainability Goals</label>
                {isEditing ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sustainabilityOptions.map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="sustainabilityGoals"
                          value={option}
                          checked={editData.sustainabilityGoals.includes(option)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-slate-200 text-sm capitalize">{option.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.sustainabilityGoals && user.sustainabilityGoals.length > 0 ? (
                      user.sustainabilityGoals.map(goal => (
                        <span key={goal} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                          {goal.replace('-', ' ')}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">No goals set</span>
                    )}
                  </div>
                )}
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Health Analytics */}
          <div className="space-y-6">
            {/* BMI Card */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Health Metrics
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-200 mb-1">{currentBMI}</div>
                  <div className={`text-sm font-medium ${bmiInfo.color} mb-2`}>{bmiInfo.category}</div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full ${
                        currentBMI < 18.5 ? 'bg-blue-500' :
                        currentBMI < 25 ? 'bg-green-500' :
                        currentBMI < 30 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((currentBMI / 35) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-sm">{bmiInfo.suggestion}</p>
                </div>
                
                <div className="border-t border-slate-700 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">Daily Calories</span>
                    <span className="text-slate-200 font-semibold">{dailyCalories}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Weekly Budget</span>
                    <span className="text-slate-200 font-semibold">${user.budgetPreference}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Activity Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300 text-sm">Resources Viewed</span>
                  </div>
                  <span className="text-slate-200 font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-400" />
                    <span className="text-slate-300 text-sm">Goals Achieved</span>
                  </div>
                  <span className="text-slate-200 font-semibold">3</span>
                </div>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Award className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-green-300">Health Tracker</div>
                    <div className="text-xs text-green-400/80">Updated BMI information</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm font-medium text-indigo-300">Knowledge Seeker</div>
                    <div className="text-xs text-indigo-400/80">Viewed 10+ resources</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
