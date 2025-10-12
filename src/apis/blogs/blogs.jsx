import axiosInstance from "../axios"; // Corrected the path

export const fetchBlogPosts = async () => {
  try {
    const response = await axiosInstance.get(`/blogs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog posts", error);
    throw error;
  }
};

export const fetchBlogPostById = async (id) => {
  try {
    const response = await axiosInstance.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog post", error);
    throw error;
  }
};

export const createBlogPost = async ({ title, content, userId, image, blogType,vip}) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("userId", userId);

  formData.append("vip", vip);

  formData.append("blogType", blogType);


  if (image) {
    formData.append("image", image);
  }

  try {
    const response = await axiosInstance.post(`/blogs`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating blog post", error);
    throw error;
  }
};

export const updateBlogPost = async (id, { title, content, image,blogType,vip }) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("vip", vip);

  formData.append("blogType", blogType);

  if (image) {
    formData.append("image", image);
  }

  try {
    const response = await axiosInstance.put(`/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating blog post", error);
    throw error;
  }
};

export const deleteBlogPost = async (id) => {
  try {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting blog post", error);
    throw error;
  }
};
export const addComment = async (postId, { userId, commentText }) => {
  try {
    const response = await axiosInstance.post(`/blogs/${postId}/comments`, {
      userId,
      commentText,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error adding comment",
      error.response?.data || error.message
    ); // Log detailed error
    throw error; // Rethrow the error for further handling in the calling function
  }
};

export const updateComment = async (postId, commentId, { commentText }) => {
  try {
    const response = await axiosInstance.put(
      `/blogs/${postId}/comments/${commentId}`,
      {
        commentText: commentText,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    const response = await axiosInstance.delete(
      `/blogs/${postId}/comments/${commentId}`
    );
    return response.data; // Return response data
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

export const getCommnets = async (postId) => {
  try {
    const response = await axiosInstance.get(`/blogs/${postId}/comments`);

    return response.data;
  } catch (error) {
    console.error("Error fetching blog posts", error);
    throw error;
  }
};

export const addReaction = async (postId, { userId, reactionType }) => {
  try {
    const response = await axiosInstance.post(`/blogs/${postId}/reactions`, {
      userId,
      reactionType,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding reaction:", error.message || error);

    throw error;
  }
};

export const deleteReaction = async (postId, userId) => {
  try {
    const response = await axiosInstance.delete(`/blogs/${postId}/reactions`, {
      data: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting reaction", error);
    throw error;
  }
};
