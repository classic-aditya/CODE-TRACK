import axios from 'axios';
import { auth } from '../config/firebase';


const api = axios.create({
   baseURL: '/api',
   timeout: 10000,
   headers: {
    'Content-Type': 'application/json', }
  });

api.interceptors.request.use(
  (config) => {
  const uid = auth.currentUser?.uid;
  if (uid) config.headers['x-user-id'] = uid;
  return config;
},
 (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getProblems = (params) => api.get('/problems', { params });
export const getProblemById = (id) => api.get(`/problems/${id}`);
export const createProblem = (data) => api.post('/problems', data);
export const updateProblem = (id, data) => api.put(`/problems/${id}`, data);
export const deleteProblem = (id) => api.delete(`/problems/${id}`);

export const getProblemSets = () => api.get('/problem-sets');
export const getProblemSetById = (id) => api.get(`/problem-sets/${id}`);
export const createProblemSet = (data) => api.post('/problem-sets', data);
export const updateProblemSet = (id, data) => api.put(`/problem-sets/${id}`, data);
export const deleteProblemSet = (id) => api.delete(`/problem-sets/${id}`);

export const addProblemToSet = (setId, problemId) =>
  api.post(`/problem-sets/${setId}/add-problem`, { problemId });

export const removeProblemFromSet = (setId, problemId) =>
  api.delete(`/problem-sets/${setId}/remove-problem/${problemId}`);

export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.put('/users/profile', data);


export default api;
