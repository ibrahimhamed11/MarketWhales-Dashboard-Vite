import axios from '../axios';

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};

// Fetch all permissions
export const getAllPermissions = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get('/permissions/admin/all', {
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

// Add permissions to a user
export const addPermissions = async (userId, permissions) => {

  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.post('/permissions/add', {
      userId,
      permissions
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding permissions:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Delete permissions from a user
export const deletePermissions = async (userId, permissions) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.post('/permissions/delete', {
      userId,
      permissions
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting permissions:', error.response ? error.response.data : error.message);
    throw error;
  }
};
