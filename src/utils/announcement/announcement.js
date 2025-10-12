import axios from "../axios"; // Import your axios instance

// Function to retrieve the token from local storage
const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

// Function to fetch all announcements
export const getAllAnnouncements = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get("/announcements", {
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
export const deleteAnnouncement = async (announcementId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/announcements/${announcementId}`, {
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

// Function to add a new announcement
export const addAnnouncement = async (newAnnouncement, imageFile) => {
  const token = getTokenFromLocalStorage();

  try {
    const formData = new FormData(); // Create a FormData object

    // Append announcement data to formData
    formData.append("message", newAnnouncement.message);
    formData.append("timeToShowInSeconds", newAnnouncement.timeToShowInSeconds);
    formData.append("enabled", newAnnouncement.enabled);

    // Append image file if provided
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.post("/announcements", formData, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
        "Content-Type": "multipart/form-data", // Indicate content type
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error adding announcement:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add announcement'); // Descriptive error
  }
};

export const updateAnnouncement = async (
  announcementId,
  updatedAnnouncement,
  imageFile // New parameter for the image file
) => {
  const token = getTokenFromLocalStorage();

  try {
    const formData = new FormData(); // Create a FormData object


    // Append updated announcement data to formData
    formData.append("message", updatedAnnouncement.message);
    formData.append("timeToShowInSeconds", updatedAnnouncement.timeToShowInSeconds);
    formData.append("enabled", updatedAnnouncement.enabled);

    // Append image file if provided
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await axios.put(
      `/announcements/${announcementId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
          "Content-Type": "multipart/form-data", // Indicate content type
        },
      }
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating announcement:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update announcement');
  }
};
