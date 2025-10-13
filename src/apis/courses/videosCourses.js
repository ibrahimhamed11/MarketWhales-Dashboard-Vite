/**
 * Legacy courses/videosCourses API - redirects to new unified service
 * @deprecated Use ../videoCoursesService.js instead
 */

import { courseAPI as newCourseAPI, adminVideoAPI as newAdminVideoAPI, userVideoAPI as newUserVideoAPI } from '../videoCoursesService';

// ========================
// Course Management APIs
// ========================

export const courseAPI = {
  // Get all courses with sales data
  getAllCourses: newCourseAPI.getAll,

  // Get course by ID
  getCourseById: newCourseAPI.getById,

  // Create new course
  createCourse: newCourseAPI.create,

  // Update course
  updateCourse: newCourseAPI.update,

  // Delete course
  deleteCourse: newCourseAPI.delete,
};

// ========================
// Admin Video Management APIs
// ========================

export const adminVideoAPI = {
  // Upload video directly
  uploadVideo: newAdminVideoAPI.uploadVideo,

  // Get presigned URL for large file uploads
  getPresignedUrl: newAdminVideoAPI.getPresignedUrl,

  // Confirm upload after using presigned URL
  confirmUpload: newAdminVideoAPI.confirmUpload,

  // Get course videos (admin view)
  getCourseVideos: newAdminVideoAPI.getCourseVideos,

  // Update video details
  updateVideo: newAdminVideoAPI.updateVideo,

  // Update video metadata (for quick updates like isActive)
  updateVideoMetadata: newAdminVideoAPI.updateVideo,

  // Delete video
  deleteVideo: newAdminVideoAPI.deleteVideo,

  // Reorder videos
  reorderVideos: newAdminVideoAPI.reorderVideos,

  // Get admin video stream
  getAdminVideoStream: newAdminVideoAPI.getVideoStream,

  // Get video by ID
  getVideoById: newAdminVideoAPI.getVideoById,

  // Refresh video token
  refreshVideoToken: newAdminVideoAPI.refreshVideoToken,

  // Check if admin video stream is available (for testing/demo purposes)
  checkAdminVideoStreamAvailability: async (videoId) => {
    try {
      // Use the new video details API to check availability
      await newAdminVideoAPI.getVideoDetails(videoId);
      return { available: true, status: 200 };
    } catch (error) {
      return { 
        available: false, 
        status: error.response?.status || 0,
        message: error.response?.statusText || error.message
      };
    }
  }
};

// ========================
// User Video Access APIs
// ========================

export const userVideoAPI = {
  // Get course videos (user view)
  getCourseVideos: newUserVideoAPI.getCourseVideos,

  // Get video details
  getVideoDetails: newUserVideoAPI.getVideoDetails,

  // Get secure video stream URL
  getSecureVideoStream: newUserVideoAPI.getVideoStreamUrl,

  // Check if video stream is available (for testing/demo purposes)
  checkVideoStreamAvailability: async (videoId) => {
    try {
      // Use the new video details API to check availability
      await newUserVideoAPI.getVideoDetails(videoId);
      return { available: true, status: 200 };
    } catch (error) {
      return { 
        available: false, 
        status: error.response?.status || 0,
        message: error.response?.statusText || error.message
      };
    }
  },

  // Legacy compatibility - redirect to admin API for now
  refreshVideoToken: newAdminVideoAPI.refreshVideoToken,
};

// ========================
// Error Handler Utility (using new service)
// ========================

import { handleApiError as newHandleApiError } from '../videoCoursesService';

export const handleApiError = newHandleApiError;
