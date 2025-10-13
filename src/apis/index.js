/**
 * Main API exports - centralized access to all API services
 */

// Main services
export { default as videoCoursesService, courseAPI, adminVideoAPI, userVideoAPI, muxAPI, handleApiError } from './videoCoursesService';
export { default as axiosInstance, API_URL } from './axios';
export { default as config, API_ENDPOINTS, getAuthHeaders, getVideoAuthHeaders, REQUEST_CONFIG } from './config';

// Legacy exports for backward compatibility
export { getAllcourses, deletecourse, addcourse, updateCourse } from './courses';
export { videoService } from './mux/videoApi';

// Re-export course APIs from videosCourses for compatibility
export { courseAPI as legacyCourseAPI, adminVideoAPI as legacyAdminVideoAPI, userVideoAPI as legacyUserVideoAPI } from './courses/videosCourses';

export default {
  videoCoursesService: () => import('./videoCoursesService'),
  axios: () => import('./axios'),
  config: () => import('./config'),
};
