import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use this for Android emulator
const API_BASE_URL = 'http://10.0.2.2:3000';
// For physical device, use: const API_BASE_URL = 'http://192.168.100.229:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  signup: (email, password, phone, userType) =>
    apiClient.post('/auth/signup', { email, password, phone, userType }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  getProfile: () =>
    apiClient.get('/auth/me'),
  refreshToken: () =>
    apiClient.post('/auth/refresh'),
};

export const jobsAPI = {
  postJob: (data) =>
    apiClient.post('/jobs', data),
  getMyJobs: () =>
    apiClient.get('/jobs/my-posts'),
  getJobDetail: (jobId) =>
    apiClient.get(`/jobs/${jobId}`),
  acceptRequest: (jobId, driverId) =>
    apiClient.patch(`/jobs/${jobId}/accept`, { driverId }),
};

export default apiClient;
