import axios from "../axios";

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};
export const getAllcourses = async () => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.get("/courses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletecourse = async (courseId) => {
  const token = getTokenFromLocalStorage();

  try {
    const response = await axios.delete(`/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addcourse = async (newCourseData) => {
  const token = getTokenFromLocalStorage();

  try {
    const formData = new FormData();

    formData.append("name", newCourseData.name);
    formData.append("description", newCourseData.description);
    formData.append("type", newCourseData.type);
    formData.append("price", newCourseData.price);
    formData.append("playlistId", newCourseData.playlistId);
    formData.append("ownerId", newCourseData.ownerId);
    formData.append("courseType", newCourseData.courseType);
    formData.append("vip", newCourseData.vip);
    formData.append("startgie", newCourseData.startgie);





    formData.append("image", newCourseData.image);

    const response = await axios.post("/courses", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (courseId, updatedCourseData) => {
  const token = getTokenFromLocalStorage();
  if (!token) {
    console.error("No token found");
    throw new Error("Authentication token not found");
  }

  try {
    const formData = new FormData();

    formData.append("name", updatedCourseData.name);
    formData.append("description", updatedCourseData.description);
    formData.append("type", updatedCourseData.type);
    formData.append("price", updatedCourseData.price);
    formData.append("playlistId", updatedCourseData.playlistId);

        
    // Append vip and courseType if they exist
    if (updatedCourseData.vip !== undefined) {
      formData.append("vip", updatedCourseData.vip ? 'true' : 'false'); // Assuming vip is a boolean
    }

    if (updatedCourseData.courseType) {
      formData.append("courseType", updatedCourseData.courseType);
    }


    if (updatedCourseData.image) {
      formData.append("image", updatedCourseData.image);
    }

    const response = await axios.put(`/courses/${courseId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });


    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Failed to update course. Status: ${error.response.status} - ${
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
