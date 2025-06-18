// API service for making requests to the backend

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Helper function to handle fetch responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: `HTTP error! Status: ${response.status}`
    }));
    throw error;
  }
  
  // Check if response is empty (for 204 No Content)
  if (response.status === 204) {
    return { success: true };
  }
  
  return response.json();
};

// Get auth token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token;
};

// API methods
const api = {
  // Auth endpoints
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    },
    
    register: async (userData) => {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
  },
  
  // User endpoints
  users: {
    getProfile: async (userId) => {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
    
    updateProfile: async (userId, userData) => {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
  },
  
  // Provider endpoints
  providers: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/providers`);
      return handleResponse(response);
    },
    
    getById: async (providerId) => {
      const response = await fetch(`${API_URL}/providers/${providerId}`);
      return handleResponse(response);
    },
    
    getRequests: async (providerId) => {
      const response = await fetch(`${API_URL}/providers/${providerId}/requests`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
    
    create: async (providerData) => {
      const response = await fetch(`${API_URL}/providers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(providerData),
      });
      return handleResponse(response);
    },
    
    acceptRequest: async (requestData) => {
      const response = await fetch(`${API_URL}/providers/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(requestData),
      });
      return handleResponse(response);
    },
  },
  
  // Request endpoints
  requests: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/requests`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
    
    getActive: async () => {
      const response = await fetch(`${API_URL}/requests/active`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
    
    getById: async (requestId) => {
      const response = await fetch(`${API_URL}/requests/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
    
    create: async (requestData) => {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(requestData),
      });
      return handleResponse(response);
    },
    
    updateStatus: async (requestData) => {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(requestData),
      });
      return handleResponse(response);
    },
  },
  
  // Stats endpoints
  stats: {
    getStats: async () => {
      const response = await fetch(`${API_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
  },
  
  // Appointment endpoints
  appointments: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/appointments`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
    
    getById: async (appointmentId) => {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
    
    create: async (appointmentData) => {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(appointmentData),
      });
      return handleResponse(response);
    },
    
    update: async (appointmentId, appointmentData) => {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(appointmentData),
      });
      return handleResponse(response);
    },
    
    updateStatus: async (appointmentId, status) => {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },
    
    delete: async (appointmentId) => {
      const response = await fetch(`${API_URL}/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      return handleResponse(response);
    },
  },
};

export default api;