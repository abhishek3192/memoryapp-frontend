import axios from 'axios';

const API_ENDPOINT = axios.create({ baseURL: 'https://memoryapp-backend.herokuapp.com/' });

API_ENDPOINT.interceptors.request.use((req) => {
  const userToken = JSON.parse(localStorage.getItem('token'));
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${userToken?.token}`;
  }

  return req;
});

export const fetchPosts = (page) => API_ENDPOINT.get(`/posts?page=${page}`);
export const fetchPost = (id) => API_ENDPOINT.get(`/posts/${id}`);
export const fetchPostsBySearch = (searchQuery) =>
  API_ENDPOINT.get(
    `/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${
      searchQuery.tags
    }`
  );
export const createPost = (newPost) => API_ENDPOINT.post('/posts', newPost);
export const updatePost = (id, updatedPost) =>
  API_ENDPOINT.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API_ENDPOINT.delete(`/posts/${id}`);
export const likedPost = (id) => API_ENDPOINT.patch(`/posts/${id}/likePost`);
export const comment = (value, id) =>
  API_ENDPOINT.post(`posts/${id}/commentPost`, { value });

export const signIn = (formData) => API_ENDPOINT.post('/user/signin', formData);
export const signUp = (formData) => API_ENDPOINT.post('/user/signup', formData);
