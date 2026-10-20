import axios from "axios";

const API_BASE = "/api";

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach JWT token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("agrivision_token") || localStorage.getItem("agritwin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Direct Axios Passthroughs
  get: (url: string, config?: any) => apiClient.get(url, config),
  post: (url: string, data?: any, config?: any) => apiClient.post(url, data, config),
  put: (url: string, data?: any, config?: any) => apiClient.put(url, data, config),
  delete: (url: string, config?: any) => apiClient.delete(url, config),

  // Auth
  register: (data: any) => apiClient.post("/auth/register", data),
  signup: (data: any) => apiClient.post("/auth/signup", data),
  login: (data: any) => apiClient.post("/auth/login", data),
  logout: () => apiClient.post("/auth/logout"),
  getMe: () => apiClient.get("/auth/me"),

  // Profile
  getProfile: () => apiClient.get("/profile"),
  updateProfile: (data: any) => apiClient.put("/profile", data),

  // Farm
  getFarms: () => apiClient.get("/farms"),
  getFarm: (id: string = "primary") => apiClient.get(`/farms/${id}`),
  createFarm: (data: any) => apiClient.post("/farms", data),
  updateFarm: (id: string, data: any) => apiClient.put(`/farms/${id}`, data),

  // Fields
  getFields: (farmId: string = "default") => apiClient.get(`/fields/${farmId}`),
  createField: (data: any) => apiClient.post("/fields", data),
  getFieldDetail: (id: string) => apiClient.get(`/fields/detail/${id}`),
  updateField: (id: string, data: any) => apiClient.put(`/fields/${id}`, data),

  // Dashboard & Quality
  getDashboard: (farmId: string = "default") => apiClient.get(`/dashboard/${farmId}`),
  getDataQuality: (farmId: string = "default") => apiClient.get(`/data-quality/${farmId}`),

  // Telemetry
  getSoilData: (farmId: string = "default") => apiClient.get(`/soil/${farmId}`),
  getWeatherData: (farmId: string = "default") => apiClient.get(`/weather/${farmId}`),
  getSatelliteData: (farmId: string = "default") => apiClient.get(`/satellite/${farmId}`),
  getCropHealth: (farmId: string = "default") => apiClient.get(`/crop-health/${farmId}`),

  // Predictions
  predictYield: (data: any) => apiClient.post("/predictions/yield", data),
  getPredictions: (farmId: string = "default") => apiClient.get(`/predictions/${farmId}`),
  getModelInfo: () => apiClient.get("/model-info"),

  // Simulation
  runSimulation: (data: any) => apiClient.post("/simulation", data),
  getSimulation: (id: string) => apiClient.get(`/simulation/${id}`),

  // Recommendations
  getRecommendations: (farmId: string = "default") => apiClient.get(`/recommendations/${farmId}`),
  updateRecommendation: (id: string, data: any) => apiClient.put(`/recommendations/${id}`, data),

  // Risks
  getRisks: (farmId: string = "default") => apiClient.get(`/risks/${farmId}`),

  // Irrigation
  getIrrigation: (farmId: string = "default") => apiClient.get(`/irrigation/${farmId}`),
  logIrrigation: (data: any) => apiClient.post("/irrigation", data),

  // History
  getHistory: (farmId: string = "default") => apiClient.get(`/history/${farmId}`)
};
