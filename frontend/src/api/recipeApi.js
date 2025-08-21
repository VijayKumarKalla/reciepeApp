import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api'
});

export const fetchRecipes = async (page = 1, limit = 15) => {
  const { data } = await API.get('/recipes', { params: { page, limit } });
  return data;
};

export const searchRecipes = async (filters = {}) => {
  const { data } = await API.get('/recipes/search', { params: filters });
  return data;
};
//check

