import axios from '../axios';

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
}


export const getAllTickets = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get('/ticket/all', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });


    return response.data;

  } catch (error) {
    throw error;
  }
}



export const getUserTickets = async (userId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get(`/ticket/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}



export const updateTicket = async (ticketId, Data) => {
  const token = getTokenFromLocalStorage();

  try {

    const response = await axios.post(`/ticket/${ticketId}/replay`, Data, {
      headers: {
        'Authorization': `Bearer ${token}` ,
        'Content-Type': 'multipart/form-data', 

      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}



// New function to delete a ticket
export const deleteTicket = async (ticketId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/ticket/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data; // Optionally, you can return the response data
  } catch (error) {
    console.error(`Error deleting ticket with ID ${ticketId}:`, error);
    throw error;
  }
}