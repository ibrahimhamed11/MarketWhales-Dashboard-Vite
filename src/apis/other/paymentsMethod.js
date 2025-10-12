import axios from '../axios';

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};

// Fetch all payment methods
export const getAllPayments = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get('/paymentsMethods/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error fetching all payment methods:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Add a new payment method
export const addPaymentMethod = async (paymentMethod) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.post('/paymentsMethods', paymentMethod, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error adding payment method:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Delete a payment method by ID
export const deletePaymentMethod = async (id) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/paymentsMethods/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error deleting payment method:', error.response ? error.response.data : error.message);
    throw error;
  }
};
