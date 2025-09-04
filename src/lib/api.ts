// API endpoints for frontend
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-deployment-url.com' // Replace with actual deployment
  : 'http://localhost:5000'; // Local development

export const api = {
  // Contact form submission
  contact: `${API_BASE_URL}/api/contact`,

  // Application form submission
  apply: `${API_BASE_URL}/api/apply`,

  // Course data
  courses: `${API_BASE_URL}/api/courses`,
};

export default api;