import axios from '../axios';

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
}


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



export const getSignalrById = async (userId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get(`/signals/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}





export const deleteSignal = async (userId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/signals/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    

    return response.data;
  } catch (error) {
    throw error;
  }
}




export const addSignal = async (newSignalData) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.post('/signals', newSignalData, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const updateSignal = async (id, signalData) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.patch(`/signals/${id}`, signalData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating signal:', error.response ? error.response.data : error.message);
    throw error;
  }
}
