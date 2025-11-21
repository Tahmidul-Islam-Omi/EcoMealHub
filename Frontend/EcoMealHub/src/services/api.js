const API_BASE_URL = "http://localhost:3000/api/v1";

import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20 seconds timeout for AI processing
});

// Add request interceptor to include auth token and debug logging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug logging for all API requests
  console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  // console.log(`📤 Request data:`, config.data);
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

  createGlobalInventoryItem: (itemData) => api.post('/inventory/global', itemData)
};

const ResourceAPI = {
  getAllResources: () => api.get('/resources'),

  getAllResourcesLimited: (limit) => api.get(`/resources?limit=${limit}`),

  createResource: (resourceData) => api.post('/resources', resourceData),

  updateResource: (resourceId, resourceData) => api.put(`/resources/${resourceId}`, resourceData),

  deleteResource: (resourceId) => api.delete(`/resources/${resourceId}`)
};


const LogAPI = {
  getLogsByUserId: () => api.get('/logs'),
  
  createLogEntry: (logData) => api.post('/logs', logData)
};



export { InventoryAPI, ResourceAPI, LogAPI, API_BASE_URL };