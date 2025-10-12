import axios from '../axios';

const getTokenFromLocalStorage = () => {
    return localStorage.getItem('token');
  };
export const getAll = async () => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.get('/api/logging', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response;
    } catch (error) {
      console.error('Error fetching all permissions:', error.response ? error.response.data : error.message);
      throw error;
    }
  };