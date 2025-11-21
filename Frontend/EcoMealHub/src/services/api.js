const API_BASE_URL = "http://localhost:3000/api/v1";

import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for AI processing
});

// Add request interceptor to include auth token and debug logging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug logging for all API requests
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log(`📤 Request data:`, config.data);
  // console.log(`📋 Request headers:`, config.headers);
  
  return config;
});

// Add response interceptor for debug logging
api.interceptors.response.use(
  (response) => {
    // Success response logging
    console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log(`📥 Response data:`, response.data);
    return response.data;
  },
  (error) => {
    // Error response logging
    console.error(`❌ API Error: ${error.response?.status || 'Network Error'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
    console.error(`📥 Error response:`, error.response?.data);
    console.error(`🔥 Full error:`, error);
    return Promise.reject(error);
  }
);

const InventoryAPI = {
  getInventory: (userId) => api.get('/inventory'),
  
  updateInventoryItem: (itemId, updateData) => api.put(`/inventory/${itemId}`, { update_data: updateData }),

  deleteInventoryItem: (itemId) => api.delete(`/inventory/${itemId}`),

  createInventoryItem: (inventoryData) => api.post('/inventory', inventoryData),

  getGlobalInventoryItems: () => api.get('/inventory/global'),

  createGlobalInventoryItem: (itemData) => api.post('/inventory/global', itemData),

  analyzeInventoryText: (text) => api.post('/inventory/text-analysis', { text }),

  addOcrItems: (items) => api.post('/inventory/add-ocr-items', { items })
};

const ResourceAPI = {
  getAllResources: () => api.get('/resources'),

  getAllResourcesLimited: (limit) => api.get(`/resources?limit=${limit}`),

  createResource: (resourceData) => api.post('/resources', resourceData),

  updateResource: (resourceId, resourceData) => api.put(`/resources/${resourceId}`, resourceData),

  deleteResource: (resourceId) => api.delete(`/resources/${resourceId}`)
};

const ChatBotAPI = { 
  chatbotItem: (memory, messages) => api.post('/chat', { memory, messages }),
};

const LogAPI = {
  getLogsByUserId: () => api.get('/logs'),
  
  createLogEntry: (logData) => api.post('/logs', logData)
};

const MealPlanAPI = {
  generateMealPlan: () => api.post('/meal-plans/generate'),
  
  getActiveMealPlan: () => api.get('/meal-plans/active'),
  
  regenerateMealPlan: () => api.post('/meal-plans/regenerate')
};

const UserAPI ={
  getProfileById : (userId) => api.get(`/user/${userId}`),
  updateProfileById : (userId, updateData) => api.put(`/user/${userId}`, updateData) ,

  analyzeAiPattern : ()=> api.get('/user/analyze')
}

const SDGAPI = {
  getSDGScore: () => api.get('/sdg/score'),
  
  getWeeklyInsights: () => api.get('/sdg/insights'),
  
  getSDGTargets: () => api.get('/sdg/targets'),
  
  getSDGHistory: () => api.get('/sdg/history')
};

export { InventoryAPI, ResourceAPI, LogAPI,MealPlanAPI,ChatBotAPI, SDGAPI, UserAPI, API_BASE_URL };
