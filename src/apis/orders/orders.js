import axios from '../axios';
const getTokenFromLocalStorage = () => {
    return localStorage.getItem('token');
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
  
  
  
  export const addBoughtCourse = async (userId, courseId) => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.post(`/user/${userId}/boughtCourses/${courseId}`, null, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
  
  
      return response.data;
  
    } catch (error) {
      throw error;
    }
  }

  export const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`/orders/${orderId}`, { status });
  
  
      return response.data;
  
    } catch (error) {
      throw error;
    }
  }
  


  export const removeBoughtCourse = async (userId, courseId) => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.delete(`/user/${userId}/boughtCourses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
  
  
      return response.data;
  
    } catch (error) {
      throw error;
    }
  }
  



export const removeOrder = async (orderId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });


    return response.data;

  } catch (error) {
    throw error;
  }
}
