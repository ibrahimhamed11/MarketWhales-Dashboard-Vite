import axios from "../axios"; 


const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};


export const createTradingProduct = async (newProductData) => {
  const token = getTokenFromLocalStorage();


  try {
    const response = await axios.post(
      "/tradinproduct",
      newProductData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating trading product:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create trading product');
  }
};



export const getAllTradingProducts = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get("/tradinproduct/all", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching trading products:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch trading products'); 
  }
};



export const deleteTradingProduct = async (productId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/tradinproduct/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; 
  } catch (error) {
    console.error("Error deleting trading product:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete trading product'); 
  }
};



export const updateTradingProduct = async (productId, updatedData) => {
  const token = getTokenFromLocalStorage();

  // Form data to handle file uploads (e.g., images)
  const formData = new FormData();

  // Append updated fields to the FormData object
  for (const key in updatedData) {
    if (updatedData[key]) {
      formData.append(key, updatedData[key]);
    }
  }

  try {
    const response = await axios.put(
      `/tradinproduct/${productId}`,
      formData, // Send form data to handle file uploads
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating trading product:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update trading product"
    );
  }
};