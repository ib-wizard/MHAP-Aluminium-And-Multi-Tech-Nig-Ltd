import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({ baseURL });

// Attach the admin JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mhap_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token has expired or is invalid, bounce back to the admin login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('mhap_admin_token');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ---- Public endpoints -------------------------------------------------
export const getCompany = () => api.get('/company').then((r) => r.data);
export const getServices = () => api.get('/services').then((r) => r.data);
export const getService = (slug) => api.get(`/services/${slug}`).then((r) => r.data);
export const getProjects = (params) => api.get('/projects', { params }).then((r) => r.data);
export const getProject = (slug) => api.get(`/projects/${slug}`).then((r) => r.data);
export const getProjectCategories = () => api.get('/projects/categories').then((r) => r.data);
export const getGallery = (params) => api.get('/gallery', { params }).then((r) => r.data);
export const getTestimonials = () => api.get('/testimonials').then((r) => r.data);
export const submitQuoteRequest = (formData) =>
  api.post('/quotes', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const submitContactMessage = (payload) => api.post('/contact', payload).then((r) => r.data);

// ---- Admin endpoints ----------------------------------------------------
export const adminLogin = (email, password) => api.post('/auth/login', { email, password }).then((r) => r.data);
export const adminMe = () => api.get('/auth/me').then((r) => r.data);
export const adminChangePassword = (payload) => api.post('/auth/change-password', payload).then((r) => r.data);

export const adminUpdateCompany = (payload) => api.put('/company', payload).then((r) => r.data);
export const adminUploadBranding = (file) => {
  const fd = new FormData();
  fd.append('image', file);
  return api.post('/uploads/branding', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
};

export const adminGetAllServices = () => api.get('/services/admin').then((r) => r.data);
export const adminCreateService = (payload) => api.post('/services', payload).then((r) => r.data);
export const adminUpdateService = (id, payload) => api.put(`/services/${id}`, payload).then((r) => r.data);
export const adminDeleteService = (id) => api.delete(`/services/${id}`).then((r) => r.data);

export const adminGetAllProjects = () => api.get('/projects/admin/all').then((r) => r.data);
export const adminCreateProject = (payload) => api.post('/projects', payload).then((r) => r.data);
export const adminUpdateProject = (id, payload) => api.put(`/projects/${id}`, payload).then((r) => r.data);
export const adminDeleteProject = (id) => api.delete(`/projects/${id}`).then((r) => r.data);
export const adminUploadProjectImages = (id, files) => {
  const fd = new FormData();
  Array.from(files).forEach((f) => fd.append('images', f));
  return api.post(`/projects/${id}/images`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
};
export const adminDeleteProjectImage = (imageId) => api.delete(`/projects/images/${imageId}`).then((r) => r.data);

export const adminUploadGalleryImages = (files, title, category) => {
  const fd = new FormData();
  Array.from(files).forEach((f) => fd.append('images', f));
  if (title) fd.append('title', title);
  if (category) fd.append('category', category);
  return api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
};
export const adminDeleteGalleryImage = (id) => api.delete(`/gallery/${id}`).then((r) => r.data);

export const adminGetAllTestimonials = () => api.get('/testimonials/admin').then((r) => r.data);
export const adminCreateTestimonial = (payload) => api.post('/testimonials', payload).then((r) => r.data);
export const adminUpdateTestimonial = (id, payload) => api.put(`/testimonials/${id}`, payload).then((r) => r.data);
export const adminDeleteTestimonial = (id) => api.delete(`/testimonials/${id}`).then((r) => r.data);

export const adminGetQuotes = (status) => api.get('/quotes', { params: status ? { status } : {} }).then((r) => r.data);
export const adminUpdateQuoteStatus = (id, status, admin_notes) =>
  api.patch(`/quotes/${id}/status`, { status, admin_notes }).then((r) => r.data);
export const adminDeleteQuote = (id) => api.delete(`/quotes/${id}`).then((r) => r.data);

export const adminGetMessages = () => api.get('/contact').then((r) => r.data);
export const adminMarkMessageRead = (id) => api.patch(`/contact/${id}/read`).then((r) => r.data);
export const adminDeleteMessage = (id) => api.delete(`/contact/${id}`).then((r) => r.data);
