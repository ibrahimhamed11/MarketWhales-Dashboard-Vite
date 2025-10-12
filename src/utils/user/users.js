import axios from '../axios';

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
}

export const getAllUsers = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get('/user/all', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateUser = async (userId, updatedUserData) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.patch(`/user/${userId}`, updatedUserData, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getUserById = async (userId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get(`/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}





export const deleteUser = async (userId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    

    return response.data;
  } catch (error) {
    throw error;
  }
}




export const addUser = async (newUserData) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.post('/user/register', newUserData, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}



export const blockUser = async (userId, isBlocked) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.put(
      `/user/${userId}`,  
      { isBlocked },  
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; 
  } catch (error) {
    throw error;
  }
};
