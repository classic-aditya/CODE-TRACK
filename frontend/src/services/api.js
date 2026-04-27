import axios from 'axios'
import { auth } from '../config/firebase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  function(config) {
    const user = auth.currentUser
    if (user) {
      config.headers['x-user-id'] = user.uid
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function getProblems(params) {
  return api.get('/problems', { params })
}

export function getProblemById(id) {
  return api.get('/problems/' + id)
}

export function createProblem(data) {
  return api.post('/problems', data)
}

export function updateProblem(id, data) {
  return api.put('/problems/' + id, data)
}

export function deleteProblem(id) {
  return api.delete('/problems/' + id)
}

export function getProblemSets() {
  return api.get('/problem-sets')
}

export function getProblemSetById(id) {
  return api.get('/problem-sets/' + id)
}

export function createProblemSet(data) {
  return api.post('/problem-sets', data)
}

export function updateProblemSet(id, data) {
  return api.put('/problem-sets/' + id, data)
}

export function deleteProblemSet(id) {
  return api.delete('/problem-sets/' + id)
}

export function addProblemToSet(setId, problemId) {
  return api.post('/problem-sets/' + setId + '/add-problem', { problemId })
}

export function removeProblemFromSet(setId, problemId) {
  return api.delete('/problem-sets/' + setId + '/remove-problem/' + problemId)
}

export function getUserProfile() {
  return api.get('/users/profile')
}

export function updateUserProfile(data) {
  return api.put('/users/profile', data)
}

export default api
