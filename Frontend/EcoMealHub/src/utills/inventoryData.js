// Food Inventory Management Data
export const SAMPLE_INVENTORY_ITEMS = [
  {
    id: 1,
    name: "Organic Apples",
    category: "fruits",
    quantity: 8,
    unit: "pieces",
    purchaseDate: "2024-11-15",
    expiryDate: "2024-11-28",
    location: "refrigerator",
    price: 4.99,
    nutritionalInfo: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fiber: 2.4,
      sugar: 10.4
    },
    alerts: {
      lowStock: false,
      nearExpiry: true,
      expired: false
    }
  },
  {
    id: 2,
    name: "Whole Wheat Bread",
    category: "grains",
    quantity: 1,
    unit: "loaf",
    purchaseDate: "2024-11-18",
    expiryDate: "2024-11-25",
    location: "pantry",
    price: 3.49,
    nutritionalInfo: {
      calories: 69,
      protein: 3.6,
      carbs: 12,
      fiber: 1.9,
      sugar: 1.5
    },
    alerts: {
      lowStock: true,
      nearExpiry: false,
      expired: false
    }
  },
  {
    id: 3,
    name: "Greek Yogurt",
    category: "dairy",
    quantity: 3,
    unit: "containers",
    purchaseDate: "2024-11-17",
    expiryDate: "2024-12-01",
    location: "refrigerator",
    price: 5.99,
    nutritionalInfo: {
      calories: 100,
      protein: 17,
      carbs: 6,
      fiber: 0,
      sugar: 6
    },
    alerts: {
      lowStock: false,
      nearExpiry: false,
      expired: false
    }
  },
  {
    id: 4,
    name: "Carrots",
    category: "vegetables",
    quantity: 12,
    unit: "pieces",
    purchaseDate: "2024-11-16",
    expiryDate: "2024-12-05",
    location: "refrigerator",
    price: 2.99,
    nutritionalInfo: {
      calories: 41,
      protein: 0.9,
      carbs: 10,
      fiber: 2.8,
      sugar: 4.7
    },
    alerts: {
      lowStock: false,
      nearExpiry: false,
      expired: false
    }
  },
  {
    id: 5,
    name: "Chicken Breast",
    category: "protein",
    quantity: 2,
    unit: "lbs",
    purchaseDate: "2024-11-19",
    expiryDate: "2024-11-22",
    location: "freezer",
    price: 8.99,
    nutritionalInfo: {
      calories: 165,
      protein: 31,
      carbs: 0,
      fiber: 0,
      sugar: 0
    },
    alerts: {
      lowStock: false,
      nearExpiry: true,
      expired: false
    }
  },
  {
    id: 6,
    name: "Brown Rice",
    category: "grains",
    quantity: 2,
    unit: "lbs",
    purchaseDate: "2024-11-10",
    expiryDate: "2025-05-10",
    location: "pantry",
    price: 4.49,
    nutritionalInfo: {
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fiber: 1.8,
      sugar: 0.4
    },
    alerts: {
      lowStock: false,
      nearExpiry: false,
      expired: false
    }
  },
  {
    id: 7,
    name: "Spinach",
    category: "vegetables",
    quantity: 1,
    unit: "bag",
    purchaseDate: "2024-11-18",
    expiryDate: "2024-11-21",
    location: "refrigerator",
    price: 3.99,
    nutritionalInfo: {
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fiber: 2.2,
      sugar: 0.4
    },
    alerts: {
      lowStock: true,
      nearExpiry: true,
      expired: false
    }
  },
  {
    id: 8,
    name: "Olive Oil",
    category: "oils",
    quantity: 1,
    unit: "bottle",
    purchaseDate: "2024-10-15",
    expiryDate: "2025-10-15",
    location: "pantry",
    price: 12.99,
    nutritionalInfo: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fiber: 0,
      sugar: 0
    },
    alerts: {
      lowStock: false,
      nearExpiry: false,
      expired: false
    }
  }
];

export const INVENTORY_CATEGORIES = [
  'fruits',
  'vegetables',
  'grains',
  'protein',
  'dairy',
  'oils',
  'spices',
  'beverages',
  'frozen',
  'canned',
  'snacks',
  'condiments'
];

export const STORAGE_LOCATIONS = [
  'refrigerator',
  'freezer',
  'pantry',
  'counter',
  'cellar',
  'spice_rack'
];

export const UNITS = [
  'pieces',
  'lbs',
  'kg',
  'oz',
  'grams',
  'cups',
  'liters',
  'ml',
  'bottles',
  'cans',
  'boxes',
  'bags',
  'containers',
  'loaves',
  'bunches'
];

// API service functions (commented out for demo - uncomment when backend is ready)
/*

export const createInventoryItem = async (itemData) => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData)
    });
    if (!response.ok) throw new Error('Failed to create inventory item');
    return await response.json();
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

export const updateInventoryItem = async (id, itemData) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/inventory/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData)
    });
    if (!response.ok) throw new Error('Failed to update inventory item');
    return await response.json();
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

export const deleteInventoryItem = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/inventory/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete inventory item');
    return await response.json();
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};
*/