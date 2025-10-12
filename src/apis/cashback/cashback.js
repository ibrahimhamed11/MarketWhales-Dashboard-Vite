import axios from '../axios';
const getTokenFromLocalStorage = () => {
    return localStorage.getItem('token');
  }
  
  
  export const allPayments= async () => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.get('/payments/all', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
  
  
      return response.data;
  
    } catch (error) {
      throw error;
    }
  }
  
  
  

  export const allTradinAccounts= async () => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.get('/tradingAccounts/all', {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
  
  
      return response.data;
  
    } catch (error) {
      throw error;
    }
  }
  
  


  // Additional code for retrieving cashbackProfit by account ID
export const getCashbackProfitByAccountId = async (accountId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get(`/tradingAccounts/${accountId}/cashbackProfit`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });


    return response.data;

  } catch (error) {
    throw error;
  }
}



  export const handleUpdateStatus = async (orderId, status) => {
    const token = getTokenFromLocalStorage();
  
    try {
      const response = await axios.put(
        `tradingAccounts/updateStatus/${orderId}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
  
      return response.data;
  
    } catch (error) {
      throw error;
    }
  }
  






export const removeAccount = async (id) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`tradingAccounts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });


    return response.data;

  } catch (error) {
    throw error;
  }
}





export const updatePaymentstatus = async (paymentId, status) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.patch(
      `payments/status/${paymentId}`,
      { status },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );


    return response.data;

  } catch (error) {
    throw error;
  }
}




export const subtractFromWallet = async (accountId, amount) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.put(
      `/tradingAccounts/${accountId}/subtract-wallet`,
      { amount },  // Send the amount as the data in the request body
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
  } catch (error) {
    console.error('Error subtracting from wallet:', error.message);
  }
};




//Add Cashback to Account
export const addCashbackMony = async (accountId, profitData) => {
 
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.post(
      `/tradingAccounts/${accountId}/profit`,
      profitData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response;

  } catch (error) {
    throw error;
  }
};
