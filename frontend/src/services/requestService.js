// Service for handling request operations
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Get auth token from localStorage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.token;
};

// Helper function to handle fetch responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: `HTTP error! Status: ${response.status}`
    }));
    throw error;
  }
  
  return response.json();
};

const requestService = {
  create: async (requestData) => {
    console.log('Creating request with data:', requestData);
    
    const response = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(requestData)
    });
    
    return handleResponse(response);
  },
  
  // Add other request-related methods here
};

export default requestService;