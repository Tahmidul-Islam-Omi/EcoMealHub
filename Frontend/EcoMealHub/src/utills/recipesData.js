// Recipe Management Data
export const SAMPLE_RECIPES = [
  {
    id: 1,
    title: "Sustainable Veggie Stir Fry",
    description: "A quick and healthy stir fry using seasonal vegetables to minimize waste and maximize nutrition.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    difficulty: "easy",
    tags: ["vegetarian", "quick", "low-waste", "healthy"],
    category: "main-course",
    cuisine: "asian",
    ingredients: [
      { name: "Mixed vegetables (broccoli, carrots, bell peppers)", amount: "4", unit: "cups", category: "vegetables" },
      { name: "Garlic cloves", amount: "3", unit: "pieces", category: "aromatics" },
      { name: "Fresh ginger", amount: "1", unit: "tbsp", category: "aromatics" },
      { name: "Soy sauce", amount: "3", unit: "tbsp", category: "condiments" },
      { name: "Sesame oil", amount: "2", unit: "tbsp", category: "oils" },
      { name: "Brown rice", amount: "2", unit: "cups", category: "grains" },
      { name: "Green onions", amount: "2", unit: "stalks", category: "vegetables" }
    ],
    instructions: [
      {
        step: 1,
        title: "Prepare ingredients",
        description: "Wash and chop all vegetables into bite-sized pieces. Mince garlic and ginger.",
        time: 10
      },
      {
        step: 2,
        title: "Heat the pan",
        description: "Heat sesame oil in a large wok or skillet over medium-high heat.",
        time: 2
      },
      {
        step: 3,
        title: "Cook aromatics",
        description: "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
        time: 1
      },
      {
        step: 4,
        title: "Add vegetables",
        description: "Add harder vegetables first (carrots, broccoli), then softer ones (bell peppers). Stir-fry for 5-7 minutes.",
        time: 7
      },
      {
        step: 5,
        title: "Season and serve",
        description: "Add soy sauce and green onions. Toss everything together and serve over brown rice.",
        time: 2
      }
    ],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 52,
      fat: 6,
      fiber: 8,
      sugar: 12
    },
    sustainability: {
      carbonFootprint: "low",
      wasteReduction: "high",
      seasonalIngredients: true,
      localSourcing: true
    },
    notes: "This recipe is perfect for using up leftover vegetables. Feel free to substitute with whatever vegetables you have on hand.",
    createdBy: "EcoMealHub",
    createdAt: "2024-11-15",
    rating: 4.8,
    reviews: 24
  },
  {
    id: 2,
    title: "Zero-Waste Banana Bread",
    description: "Transform overripe bananas into delicious bread, reducing food waste while creating a nutritious treat.",
    image: "https://images.unsplash.com/photo-1586985289906-406988974504?w=400",
    prepTime: 20,
    cookTime: 60,
    servings: 12,
    difficulty: "easy",
    tags: ["vegetarian", "zero-waste", "breakfast", "snack"],
    category: "dessert",
    cuisine: "american",
    ingredients: [
      { name: "Overripe bananas", amount: "4", unit: "large", category: "fruits" },
      { name: "Whole wheat flour", amount: "2", unit: "cups", category: "grains" },
      { name: "Brown sugar", amount: "3/4", unit: "cup", category: "sweeteners" },
      { name: "Eggs", amount: "2", unit: "large", category: "dairy" },
      { name: "Melted butter", amount: "1/3", unit: "cup", category: "dairy" },
      { name: "Baking soda", amount: "1", unit: "tsp", category: "leavening" },
      { name: "Salt", amount: "1/2", unit: "tsp", category: "seasonings" },
      { name: "Vanilla extract", amount: "1", unit: "tsp", category: "flavorings" },
      { name: "Chopped walnuts (optional)", amount: "1/2", unit: "cup", category: "nuts" }
    ],
    instructions: [
      {
        step: 1,
        title: "Preheat and prepare",
        description: "Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.",
        time: 5
      },
      {
        step: 2,
        title: "Mash bananas",
        description: "In a large bowl, mash the overripe bananas until smooth with some small chunks remaining.",
        time: 5
      },
      {
        step: 3,
        title: "Mix wet ingredients",
        description: "Add melted butter, brown sugar, eggs, and vanilla to the mashed bananas. Mix well.",
        time: 5
      },
      {
        step: 4,
        title: "Combine dry ingredients",
        description: "In a separate bowl, whisk together flour, baking soda, and salt.",
        time: 3
      },
      {
        step: 5,
        title: "Combine and bake",
        description: "Fold dry ingredients into wet ingredients until just combined. Add nuts if using. Pour into prepared pan and bake for 55-60 minutes.",
        time: 62
      }
    ],
    nutrition: {
      calories: 195,
      protein: 4,
      carbs: 38,
      fat: 5,
      fiber: 3,
      sugar: 18
    },
    sustainability: {
      carbonFootprint: "low",
      wasteReduction: "very high",
      seasonalIngredients: false,
      localSourcing: true
    },
    notes: "The riper the bananas, the sweeter your bread will be. Brown or black bananas work perfectly!",
    createdBy: "EcoMealHub",
    createdAt: "2024-11-10",
    rating: 4.9,
    reviews: 18
  },
  {
    id: 3,
    title: "Leftover Vegetable Soup",
    description: "A hearty soup that transforms leftover vegetables into a comforting and nutritious meal.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400",
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: "easy",
    tags: ["vegetarian", "soup", "zero-waste", "comfort-food"],
    category: "soup",
    cuisine: "international",
    ingredients: [
      { name: "Mixed leftover vegetables", amount: "4", unit: "cups", category: "vegetables" },
      { name: "Vegetable broth", amount: "6", unit: "cups", category: "liquids" },
      { name: "Onion", amount: "1", unit: "medium", category: "vegetables" },
      { name: "Garlic cloves", amount: "3", unit: "pieces", category: "aromatics" },
      { name: "Olive oil", amount: "2", unit: "tbsp", category: "oils" },
      { name: "Dried herbs (thyme, oregano)", amount: "2", unit: "tsp", category: "seasonings" },
      { name: "Salt and pepper", amount: "to taste", unit: "", category: "seasonings" },
      { name: "Canned diced tomatoes", amount: "1", unit: "can", category: "vegetables" }
    ],
    instructions: [
      {
        step: 1,
        title: "Prepare vegetables",
        description: "Chop onion and garlic. Cut leftover vegetables into uniform pieces.",
        time: 10
      },
      {
        step: 2,
        title: "Sauté aromatics",
        description: "Heat olive oil in a large pot. Sauté onion and garlic until fragrant, about 3-4 minutes.",
        time: 4
      },
      {
        step: 3,
        title: "Add vegetables",
        description: "Add leftover vegetables and herbs. Cook for 5 minutes, stirring occasionally.",
        time: 5
      },
      {
        step: 4,
        title: "Add liquids",
        description: "Pour in vegetable broth and diced tomatoes. Bring to a boil, then reduce heat and simmer.",
        time: 5
      },
      {
        step: 5,
        title: "Finish and serve",
        description: "Simmer for 20 minutes until vegetables are tender. Season with salt and pepper to taste.",
        time: 22
      }
    ],
    nutrition: {
      calories: 120,
      protein: 4,
      carbs: 24,
      fat: 3,
      fiber: 6,
      sugar: 8
    },
    sustainability: {
      carbonFootprint: "very low",
      wasteReduction: "very high",
      seasonalIngredients: true,
      localSourcing: true
    },
    notes: "This recipe is extremely flexible - use whatever vegetables you have on hand. Root vegetables work especially well.",
    createdBy: "EcoMealHub",
    createdAt: "2024-11-12",
    rating: 4.6,
    reviews: 31
  },
  {
    id: 4,
    title: "Sustainable Fish Tacos",
    description: "Delicious fish tacos using sustainably sourced fish and seasonal vegetables.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    prepTime: 25,
    cookTime: 15,
    servings: 4,
    difficulty: "medium",
    tags: ["pescatarian", "mexican", "healthy", "sustainable"],
    category: "main-course",
    cuisine: "mexican",
    ingredients: [
      { name: "Sustainable white fish fillets", amount: "1", unit: "lb", category: "protein" },
      { name: "Corn tortillas", amount: "12", unit: "pieces", category: "grains" },
      { name: "Cabbage", amount: "2", unit: "cups", category: "vegetables" },
      { name: "Lime", amount: "2", unit: "pieces", category: "fruits" },
      { name: "Cilantro", amount: "1/2", unit: "cup", category: "herbs" },
      { name: "Greek yogurt", amount: "1/2", unit: "cup", category: "dairy" },
      { name: "Cumin", amount: "1", unit: "tsp", category: "spices" },
      { name: "Chili powder", amount: "1", unit: "tsp", category: "spices" },
      { name: "Olive oil", amount: "2", unit: "tbsp", category: "oils" }
    ],
    instructions: [
      {
        step: 1,
        title: "Prepare fish",
        description: "Season fish fillets with cumin, chili powder, salt, and pepper.",
        time: 5
      },
      {
        step: 2,
        title: "Make slaw",
        description: "Thinly slice cabbage and mix with lime juice and cilantro. Set aside.",
        time: 10
      },
      {
        step: 3,
        title: "Cook fish",
        description: "Heat olive oil in a skillet. Cook fish for 3-4 minutes per side until flaky.",
        time: 8
      },
      {
        step: 4,
        title: "Warm tortillas",
        description: "Warm tortillas in a dry skillet or microwave until pliable.",
        time: 2
      },
      {
        step: 5,
        title: "Assemble tacos",
        description: "Flake fish into chunks. Fill tortillas with fish, cabbage slaw, and a dollop of yogurt.",
        time: 5
      }
    ],
    nutrition: {
      calories: 320,
      protein: 28,
      carbs: 32,
      fat: 8,
      fiber: 4,
      sugar: 5
    },
    sustainability: {
      carbonFootprint: "medium",
      wasteReduction: "medium",
      seasonalIngredients: true,
      localSourcing: true
    },
    notes: "Look for MSC-certified fish for the most sustainable option. Mahi-mahi or cod work great for this recipe.",
    createdBy: "EcoMealHub",
    createdAt: "2024-11-08",
    rating: 4.7,
    reviews: 22
  }
];

export const RECIPE_CATEGORIES = [
  'appetizer',
  'soup',
  'salad',
  'main-course',
  'side-dish',
  'dessert',
  'beverage',
  'snack',
  'breakfast'
];

export const RECIPE_CUISINES = [
  'american',
  'asian',
  'mediterranean',
  'mexican',
  'italian',
  'indian',
  'middle-eastern',
  'international'
];

export const DIFFICULTY_LEVELS = [
  'easy',
  'medium',
  'hard'
];

export const DIETARY_TAGS = [
  'vegetarian',
  'vegan',
  'pescatarian',
  'gluten-free',
  'dairy-free',
  'low-carb',
  'keto',
  'paleo',
  'whole30'
];

export const RECIPE_TAGS = [
  'quick',
  'healthy',
  'zero-waste',
  'low-waste',
  'comfort-food',
  'seasonal',
  'meal-prep',
  'one-pot',
  'no-cook',
  'budget-friendly'
];

// API service functions (commented out for demo - uncomment when backend is ready)
/*
export const fetchRecipes = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`http://localhost:3000/api/v1/recipes?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return SAMPLE_RECIPES; // Fallback to dummy data
  }
};

export const createRecipe = async (recipeData) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData)
    });
    if (!response.ok) throw new Error('Failed to create recipe');
    return await response.json();
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export const updateRecipe = async (id, recipeData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData)
    });
    if (!response.ok) throw new Error('Failed to update recipe');
    return await response.json();
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

export const deleteRecipe = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/recipes/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete recipe');
    return await response.json();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

export const rateRecipe = async (id, rating) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/recipes/${id}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating })
    });
    if (!response.ok) throw new Error('Failed to rate recipe');
    return await response.json();
  } catch (error) {
    console.error('Error rating recipe:', error);
    throw error;
  }
};
*/