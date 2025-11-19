export const SAMPLE_RESOURCES = [
  {
    id: 1,
    title: "10 Ways to Reduce Food Waste at Home",
    description: "Learn practical strategies to minimize food waste in your household, from proper storage to creative leftover recipes.",
    url: "https://example.com/reduce-waste",
    category: "waste reduction",
    type: "article"
  },
  {
    id: 2,
    title: "Smart Meal Planning on a Budget",
    description: "Master the art of planning nutritious meals while staying within your budget constraints.",
    url: "https://example.com/meal-planning",
    category: "budget tips",
    type: "article"
  },
  {
    id: 3,
    title: "Complete Guide to Food Storage",
    description: "Comprehensive video guide on proper food storage techniques to extend shelf life and maintain freshness.",
    url: "https://example.com/storage-guide",
    category: "storage tips",
    type: "video"
  },
  {
    id: 4,
    title: "Understanding Expiration Dates",
    description: "Decode 'best by', 'use by', and 'sell by' dates to reduce unnecessary food disposal.",
    url: "https://example.com/expiration-dates",
    category: "waste reduction",
    type: "article"
  },
  {
    id: 5,
    title: "Composting Basics for Beginners",
    description: "Start your composting journey with this beginner-friendly guide to turning food scraps into nutrient-rich soil.",
    url: "https://example.com/composting",
    category: "composting",
    type: "video"
  },
  {
    id: 6,
    title: "Seasonal Eating Guide",
    description: "Save money and eat better by choosing seasonal produce. Includes monthly buying guides.",
    url: "https://example.com/seasonal-eating",
    category: "sustainable shopping",
    type: "guide"
  },
  {
    id: 7,
    title: "Batch Cooking Strategies",
    description: "Learn how to prepare meals in bulk to save time and reduce waste throughout the week.",
    url: "https://example.com/batch-cooking",
    category: "meal planning",
    type: "article"
  },
  {
    id: 8,
    title: "Dairy Storage Best Practices",
    description: "Maximize the shelf life of milk, cheese, and other dairy products with proper storage techniques.",
    url: "https://example.com/dairy-storage",
    category: "storage tips",
    type: "article"
  },
  {
    id: 9,
    title: "Nutrition on a Budget",
    description: "Expert nutritionist explains how to maintain a balanced diet without overspending.",
    url: "https://example.com/nutrition-budget",
    category: "nutrition",
    type: "video"
  },
  {
    id: 10,
    title: "Zero Waste Kitchen Tips",
    description: "Transform your kitchen into a zero-waste zone with these practical, easy-to-implement tips.",
    url: "https://example.com/zero-waste",
    category: "waste reduction",
    type: "article"
  },
  {
    id: 11,
    title: "One-Pot Pasta Recipes",
    description: "Delicious and sustainable one-pot pasta recipes that minimize cleanup and maximize flavor.",
    url: "https://example.com/one-pot-pasta",
    category: "cooking tips",
    type: "recipe"
  },
  {
    id: 12,
    title: "Weekly Meal Prep Tutorial",
    description: "Step-by-step video tutorial for preparing a week's worth of healthy meals in just 2 hours.",
    url: "https://example.com/meal-prep",
    category: "meal planning",
    type: "video"
  },
  {
    id: 13,
    title: "Sustainable Shopping Guide",
    description: "Create effective shopping habits that support local farmers and reduce environmental impact.",
    url: "https://example.com/sustainable-shopping",
    category: "sustainable shopping",
    type: "guide"
  },
  {
    id: 14,
    title: "Vegetable Garden Starter Kit",
    description: "Start growing your own vegetables with this beginner-friendly gardening guide and tool recommendations.",
    url: "https://example.com/garden-starter",
    category: "sustainable shopping",
    type: "tool"
  },
  {
    id: 15,
    title: "Leftover Transformation Recipes",
    description: "Creative recipes that turn yesterday's dinner into today's delicious new meal.",
    url: "https://example.com/leftover-recipes",
    category: "cooking tips",
    type: "recipe"
  },
  {
    id: 16,
    title: "Understanding Food Labels",
    description: "Educational video on reading nutrition labels and ingredient lists to make informed choices.",
    url: "https://example.com/food-labels",
    category: "nutrition",
    type: "video"
  },
  {
    id: 17,
    title: "Pantry Organization System",
    description: "Optimize your pantry space and visibility to prevent food from being forgotten and wasted.",
    url: "https://example.com/pantry-organization",
    category: "storage tips",
    type: "tool"
  },
  {
    id: 18,
    title: "Plant-Based Protein Sources",
    description: "Discover affordable and sustainable plant-based protein options for every diet.",
    url: "https://example.com/plant-proteins",
    category: "nutrition",
    type: "guide"
  },
  {
    id: 19,
    title: "Food Waste Impact Documentary",
    description: "Eye-opening documentary about the global impact of food waste and what we can do about it.",
    url: "https://example.com/waste-documentary",
    category: "waste reduction",
    type: "video"
  },
  {
    id: 20,
    title: "Monthly Meal Planning Template",
    description: "Downloadable template and guide for planning an entire month of meals efficiently.",
    url: "https://example.com/monthly-planning",
    category: "meal planning",
    type: "tool"
  },
  {
    id: 21,
    title: "Home Composting System Setup",
    description: "Complete guide to setting up and maintaining a home composting system for food scraps.",
    url: "https://example.com/composting-setup",
    category: "composting",
    type: "guide"
  },
  {
    id: 22,
    title: "Quick 15-Minute Healthy Meals",
    description: "Fast, nutritious meal ideas for busy weeknights that don't compromise on sustainability.",
    url: "https://example.com/quick-meals",
    category: "cooking tips",
    type: "recipe"
  },
  {
    id: 23,
    title: "Local Farmers Market Finder",
    description: "Interactive tool to find farmers markets and local food sources in your area.",
    url: "https://example.com/market-finder",
    category: "sustainable shopping",
    type: "tool"
  },
  {
    id: 24,
    title: "Sustainable Seafood Guide",
    description: "Learn which seafood choices are environmentally responsible and how to identify them.",
    url: "https://example.com/sustainable-seafood",
    category: "sustainable shopping",
    type: "guide"
  }
];

// API service functions (commented out for demo - uncomment when backend is ready)
/*
export const fetchResources = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/resources');
    if (!response.ok) throw new Error('Failed to fetch resources');
    return await response.json();
  } catch (error) {
    console.error('Error fetching resources:', error);
    return SAMPLE_RESOURCES; // Fallback to dummy data
  }
};

export const createResource = async (resourceData) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData)
    });
    if (!response.ok) throw new Error('Failed to create resource');
    return await response.json();
  } catch (error) {
    console.error('Error creating resource:', error);
    throw error;
  }
};
*/
