// Meal Planning Data
export const SAMPLE_MEAL_PLANS = {
  "2024-11-18": {
    breakfast: {
      id: 1,
      title: "Overnight Oats with Berries",
      calories: 320,
      prepTime: 5
    },
    lunch: {
      id: 2,
      title: "Sustainable Veggie Stir Fry",
      calories: 280,
      prepTime: 25
    },
    dinner: {
      id: 4,
      title: "Sustainable Fish Tacos",
      calories: 320,
      prepTime: 40
    }
  },
  "2024-11-19": {
    breakfast: {
      id: 5,
      title: "Avocado Toast with Egg",
      calories: 350,
      prepTime: 10
    },
    lunch: {
      id: 3,
      title: "Leftover Vegetable Soup",
      calories: 120,
      prepTime: 45
    },
    dinner: {
      id: 6,
      title: "Lentil Curry Bowl",
      calories: 410,
      prepTime: 35
    }
  },
  "2024-11-20": {
    breakfast: null,
    lunch: {
      id: 7,
      title: "Quinoa Salad Bowl",
      calories: 380,
      prepTime: 20
    },
    dinner: null
  },
  "2024-11-21": {
    breakfast: {
      id: 8,
      title: "Green Smoothie Bowl",
      calories: 290,
      prepTime: 10
    },
    lunch: null,
    dinner: {
      id: 9,
      title: "Roasted Veggie Pasta",
      calories: 450,
      prepTime: 45
    }
  }
};

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

export const QUICK_ADD_MEALS = [
  {
    id: 'quick1',
    title: "Greek Yogurt with Granola",
    type: 'breakfast',
    calories: 250,
    prepTime: 2,
    tags: ['quick', 'healthy', 'vegetarian']
  },
  {
    id: 'quick2',
    title: "Peanut Butter Sandwich",
    type: 'lunch',
    calories: 380,
    prepTime: 5,
    tags: ['quick', 'vegetarian']
  },
  {
    id: 'quick3',
    title: "Caesar Salad",
    type: 'lunch',
    calories: 320,
    prepTime: 15,
    tags: ['healthy', 'vegetarian']
  },
  {
    id: 'quick4',
    title: "Grilled Chicken Breast",
    type: 'dinner',
    calories: 450,
    prepTime: 25,
    tags: ['protein', 'healthy']
  },
  {
    id: 'quick5',
    title: "Vegetable Omelet",
    type: 'breakfast',
    calories: 280,
    prepTime: 12,
    tags: ['protein', 'vegetarian', 'quick']
  },
  {
    id: 'quick6',
    title: "Turkey Wrap",
    type: 'lunch',
    calories: 340,
    prepTime: 8,
    tags: ['quick', 'protein']
  }
];

export const SHOPPING_LIST = [
  {
    id: 1,
    name: "Organic Spinach",
    category: "vegetables",
    quantity: 2,
    unit: "bags",
    priority: "high",
    checked: false,
    estimatedPrice: 6.98
  },
  {
    id: 2,
    name: "Greek Yogurt",
    category: "dairy",
    quantity: 1,
    unit: "container",
    priority: "medium",
    checked: false,
    estimatedPrice: 5.99
  },
  {
    id: 3,
    name: "Quinoa",
    category: "grains",
    quantity: 1,
    unit: "bag",
    priority: "low",
    checked: true,
    estimatedPrice: 4.49
  },
  {
    id: 4,
    name: "Bell Peppers",
    category: "vegetables",
    quantity: 4,
    unit: "pieces",
    priority: "high",
    checked: false,
    estimatedPrice: 3.96
  },
  {
    id: 5,
    name: "Olive Oil",
    category: "oils",
    quantity: 1,
    unit: "bottle",
    priority: "medium",
    checked: false,
    estimatedPrice: 8.99
  }
];

export const NUTRITION_GOALS = {
  daily: {
    calories: 2000,
    protein: 150, // grams
    carbs: 250, // grams
    fat: 67, // grams
    fiber: 25, // grams
    sugar: 50 // grams
  },
  weekly: {
    calories: 14000,
    protein: 1050,
    carbs: 1750,
    fat: 469,
    fiber: 175,
    sugar: 350
  }
};

// API service functions (commented out for demo - uncomment when backend is ready)
/*
export const fetchMealPlan = async (startDate, endDate) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/meal-plan?start=${startDate}&end=${endDate}`);
    if (!response.ok) throw new Error('Failed to fetch meal plan');
    return await response.json();
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return SAMPLE_MEAL_PLANS; // Fallback to dummy data
  }
};

export const addMealToPlan = async (date, mealType, recipeId) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/meal-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, mealType, recipeId })
    });
    if (!response.ok) throw new Error('Failed to add meal to plan');
    return await response.json();
  } catch (error) {
    console.error('Error adding meal to plan:', error);
    throw error;
  }
};

export const removeMealFromPlan = async (date, mealType) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/meal-plan/${date}/${mealType}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to remove meal from plan');
    return await response.json();
  } catch (error) {
    console.error('Error removing meal from plan:', error);
    throw error;
  }
};

export const generateShoppingList = async (startDate, endDate) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/shopping-list/generate?start=${startDate}&end=${endDate}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to generate shopping list');
    return await response.json();
  } catch (error) {
    console.error('Error generating shopping list:', error);
    return SHOPPING_LIST; // Fallback to dummy data
  }
};

export const updateShoppingListItem = async (id, updates) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/shopping-list/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update shopping list item');
    return await response.json();
  } catch (error) {
    console.error('Error updating shopping list item:', error);
    throw error;
  }
};
*/