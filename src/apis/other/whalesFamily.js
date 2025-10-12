import axios from '../axios';

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
};

// Fetch all WhalesFamily entries
export const getAll = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get('/whalesfamily/all', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error fetching all entries:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update the status of a specific WhalesFamily entry
export const updateStatus = async (id, status) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.patch(
      `/whalesfamily/${id}/status`,
      { status },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    console.error('Error updating status:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Delete a specific WhalesFamily entry
export const deleteWhalesFamily = async (id) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/whalesfamily/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error deleting entry:', error.response ? error.response.data : error.message);
    throw error;
  }
};
