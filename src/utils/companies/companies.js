import axios from '../axios';

const getTokenFromLocalStorage = () => {
  return localStorage.getItem('token');
}

const token = getTokenFromLocalStorage();
export const getAllCompanies = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get('/companies', {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });


    return response.data;

  } catch (error) {
    throw error;
  }
}

export const updateCompany = async (companyId, updatedCompanyData) => {
  const token = getTokenFromLocalStorage();

  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token not found");
  }

  try {
    const response = await axios.put(`/companies/${companyId}`, updatedCompanyData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });


    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Failed to update company. Status: ${error.response.status} - ${
          error.response.data.message || "Unknown error"
        }`
      );
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw new Error(`Error in request setup: ${error.message}`);
    }
  }
};





export const getCompany = async (companyId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get(`/companies/${companyId}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}





export const deleteCompany = async (companyId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/companies/${companyId}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    

    return response.data;
  } catch (error) {
    throw error;
  }
}






export const addCompany = async (companyData) => {
  try {
    const token = getTokenFromLocalStorage();
    const response = await axios.post('/companies', companyData, {
      headers: {
        'Authorization': `Bearer ${token}` ,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};




export const getAllReviews = async (companyId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get(`/review/${companyId}/all`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}



export const deleteReview = async (companyId, reviewId) => {
  const token = getTokenFromLocalStorage();

  try {


    const response = await axios.delete(`/review/${companyId}/${reviewId}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data; // Optionally, you can return the response data
  } catch (error) {
    throw error;
  }
}