import axios from "../axios"; // Import your axios instance

// Function to retrieve the token from local storage
const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// Function to fetch all announcements
export const getAll = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get("/Competition/getAll", {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });

    return response.data; // Return the data from the response
  } catch (error) {
    console.error("Error fetching announcements:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch announcements'); // Descriptive error
  }
};


// Function to delete an announcement by ID
export const deleteCompetition= async (competitionId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/competition/${competitionId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error deleting announcement:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete announcement'); // Descriptive error
  }
};

// Function to add a competition
export const addCompetition = async (formData) => {
    const token = getTokenFromLocalStorage();
    const competitionData = new FormData();
  
    Object.keys(formData).forEach((key) => {
      if (key === "poster" && formData.poster) {
        competitionData.append("poster", formData.poster);
      } else {
        competitionData.append(key, formData[key]);
      }
    });
  
    try {
      const response = await axios.post("/competition", competitionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error adding competition:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to add competition");
    }
  };

  export const deleteComment = async (competitionId, commentId) => {
    const token = getTokenFromLocalStorage();
  
    try {
      await axios.delete(`/competition/${competitionId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  // Function to update a competition
export const updateCompetition = async (competitionId, formData) => {
    const token = getTokenFromLocalStorage();
    const competitionData = new FormData();
  
    Object.keys(formData).forEach((key) => {
      if (key === "poster" && formData.poster) {
        competitionData.append("poster", formData.poster);
      } else {
        competitionData.append(key, formData[key]);
      }
    });
  
    try {
      const response = await axios.put(`/competition/${competitionId}`, competitionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error updating competition:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update competition");
    }
  };

  