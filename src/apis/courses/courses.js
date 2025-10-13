/**
 * Legacy courses API - redirects to new unified service
 * @deprecated Use ../videoCoursesService.js instead
 */

import { courseAPI } from '../videoCoursesService';

// Re-export all course API functions from the new service
export const getAllcourses = courseAPI.getAll;
export const deletecourse = courseAPI.delete;
export const addcourse = courseAPI.create;
export const updateCourse = courseAPI.update;

// For backward compatibility
export default {
  getAllcourses,
  deletecourse,
  addcourse,
  updateCourse,
};
