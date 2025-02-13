import axios from 'axios';
import { message } from 'antd';

const BASE_URL = 'https://apphere.in/demo-post/public/api';

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['Accept'] = 'application/json';
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message.error('Unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403:
                    message.error('You are not authorized to perform this action.');
                    break;
                case 404:
                    message.error('Requested resource not found.');
                    break;
                case 500:
                    message.error('Server error. Please try again later.');
                    break;
                default:
                    message.error(error.response.data.message || 'An error occurred');
            }
        } else if (error.request) {
            message.error('No response received from server');
        } else {
            message.error('Error setting up the request');
        }
        return Promise.reject(error);
    }
);

export const signup = (name, email, password) =>
    api.post('/signup', { name, email, password });

export const login = (email, password) =>
    api.post('/login', { email, password });

export const logout = () =>
    api.post('/logout');

export const createPost = (formData) =>
    api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const updatePost = (postId, formData) =>
    api.post(`/posts-update/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const fetchPostById = (postId) =>
    api.get(`/posts/${postId}`);

export const deletePost = (postId) =>
    api.delete(`/posts-delete/${postId}`);

export const fetchUser = () =>
    api.get('/user');

export const fetchPosts = () =>
    api.get('/user/posts/1');

export const likePost = (postId) =>
    api.post(`/posts/${postId}/like`);

export const dislikePost = (postId) =>
    api.post(`/posts/${postId}/dislike`);

export default api;