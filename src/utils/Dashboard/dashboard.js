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



export const Registrationstats = async () => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.get('/user/statics/registration-stats', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }




  export const allOrders= async () => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.get('/orders/all', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
  
  
      return response.data;
  
    } catch (error) {
      throw error;
    }
  }
  
  
  export const getAllcourses = async () => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.get("/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  


  export const getAllsignals = async () => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.get('/signals/all', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
  
  
      return response.data;
  
    } catch (error) {
      throw error;
    }
  }
  