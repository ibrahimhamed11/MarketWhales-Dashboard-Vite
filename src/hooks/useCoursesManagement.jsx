import { useEffect, useMemo, useState, useCallback } from 'react';
import { getAllcourses, deletecourse, addcourse, updateCourse as updateCourseAPI } from '../utils/courses/courses';

// Encapsulates fetching, filtering, and simple stats for courses list
const useCoursesManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    level: 'all',
    category: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Fetch all courses
  const fetchCourses = useCallback(async (additionalFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch courses from API
      const response = await getAllcourses();
      let coursesData = response.data || response || [];
      
      // Transform API data to match our expected format
      const transformedCourses = coursesData.map(course => ({
        id: course._id || course.id,
        title: course.name || course.title,
        description: course.description || '',
        instructor: course.instructor || 'Unknown',
        level: course.level || 'beginner',
        category: course.courseType || course.type || 'trading',
        duration: course.duration || '0h 0m',
        price: course.price || 0,
        status: course.status || 'published',
        thumbnail: course.image || course.thumbnail || '/src/assets/img/course-default.svg',
        videoCount: course.videoCount || 0,
        studentsEnrolled: course.studentsEnrolled || 0,
        createdAt: course.createdAt || new Date().toISOString(),
        updatedAt: course.updatedAt || new Date().toISOString(),
        playlistId: course.playlistId,
        vip: course.vip || false,
        ownerId: course.ownerId,
        startgie: course.startgie
      }));
      
      // Apply additional filters client-side
      let filteredCourses = [...transformedCourses];
      const allFilters = { ...filters, ...additionalFilters };
      
      if (allFilters.status && allFilters.status !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.status === allFilters.status);
      }
      
      if (allFilters.level && allFilters.level !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.level === allFilters.level);
      }
      
      if (allFilters.category && allFilters.category !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.category === allFilters.category);
      }
      
      if (allFilters.search) {
        const searchTerm = allFilters.search.toLowerCase();
        filteredCourses = filteredCourses.filter(course =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          course.instructor.toLowerCase().includes(searchTerm)
        );
      }
      
      setCourses(filteredCourses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create new course
  const createCourse = useCallback(async (courseData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform data to match API expected format
      const apiCourseData = {
        name: courseData.title || courseData.name,
        description: courseData.description || '',
        type: courseData.category || courseData.type || 'trading',
        price: courseData.price || 0,
        playlistId: courseData.playlistId || '',
        ownerId: courseData.ownerId || '',
        courseType: courseData.category || courseData.courseType || 'trading',
        vip: courseData.vip || false,
        startgie: courseData.startgie || '',
        image: courseData.thumbnail || courseData.image
      };
      
      const response = await addcourse(apiCourseData);
      const newCourse = response.data || response;
      
      // Transform response to match our format
      const transformedCourse = {
        id: newCourse._id || newCourse.id,
        title: newCourse.name || newCourse.title,
        description: newCourse.description || '',
        instructor: newCourse.instructor || 'Unknown',
        level: newCourse.level || 'beginner',
        category: newCourse.courseType || newCourse.type || 'trading',
        duration: newCourse.duration || '0h 0m',
        price: newCourse.price || 0,
        status: newCourse.status || 'draft',
        thumbnail: newCourse.image || newCourse.thumbnail || '/src/assets/img/course-default.svg',
        videoCount: newCourse.videoCount || 0,
        studentsEnrolled: newCourse.studentsEnrolled || 0,
        createdAt: newCourse.createdAt || new Date().toISOString(),
        updatedAt: newCourse.updatedAt || new Date().toISOString(),
        playlistId: newCourse.playlistId,
        vip: newCourse.vip || false,
        ownerId: newCourse.ownerId,
        startgie: newCourse.startgie
      };
      
      setCourses(prev => [transformedCourse, ...prev]);
      return transformedCourse;
    } catch (err) {
      console.error('Error creating course:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create course';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update course
  const updateCourse = useCallback(async (courseId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform updates to match API expected format
      const apiUpdateData = {
        name: updates.title || updates.name,
        description: updates.description,
        type: updates.category || updates.type,
        price: updates.price,
        playlistId: updates.playlistId,
        courseType: updates.category || updates.courseType,
        vip: updates.vip,
        image: updates.thumbnail || updates.image
      };
      
      // Remove undefined values
      Object.keys(apiUpdateData).forEach(key => {
        if (apiUpdateData[key] === undefined) {
          delete apiUpdateData[key];
        }
      });
      
      const response = await updateCourseAPI(courseId, apiUpdateData);
      const updatedCourse = response.data || response;
      
      // Transform response to match our format
      const transformedCourse = {
        id: updatedCourse._id || updatedCourse.id || courseId,
        title: updatedCourse.name || updatedCourse.title,
        description: updatedCourse.description || '',
        instructor: updatedCourse.instructor || 'Unknown',
        level: updatedCourse.level || 'beginner',
        category: updatedCourse.courseType || updatedCourse.type || 'trading',
        duration: updatedCourse.duration || '0h 0m',
        price: updatedCourse.price || 0,
        status: updatedCourse.status || 'published',
        thumbnail: updatedCourse.image || updatedCourse.thumbnail || '/src/assets/img/course-default.svg',
        videoCount: updatedCourse.videoCount || 0,
        studentsEnrolled: updatedCourse.studentsEnrolled || 0,
        createdAt: updatedCourse.createdAt || new Date().toISOString(),
        updatedAt: updatedCourse.updatedAt || new Date().toISOString(),
        playlistId: updatedCourse.playlistId,
        vip: updatedCourse.vip || false,
        ownerId: updatedCourse.ownerId,
        startgie: updatedCourse.startgie
      };
      
      setCourses(prev => prev.map(course => 
        course.id === courseId ? transformedCourse : course
      ));
      
      return transformedCourse;
    } catch (err) {
      console.error('Error updating course:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update course';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete course
  const deleteCourse = useCallback(async (courseId) => {
    try {
      setLoading(true);
      setError(null);
      
      await deletecourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
      
      return true;
    } catch (err) {
      console.error('Error deleting course:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete course';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtered and sorted courses
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(course => course.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'videoCount':
          aValue = a.videoCount;
          bValue = b.videoCount;
          break;
        case 'studentsEnrolled':
          aValue = a.studentsEnrolled;
          bValue = b.studentsEnrolled;
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default: // createdAt
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [courses, filters]);

  // Course statistics
  const stats = useMemo(() => ({
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status === 'draft').length,
    paid: courses.filter(c => (c.price || 0) > 0).length,
    free: courses.filter(c => (c.price || 0) === 0).length,
    totalStudents: courses.reduce((acc, course) => acc + (course.studentsEnrolled || 0), 0),
    totalVideos: courses.reduce((acc, course) => acc + (course.videoCount || 0), 0)
  }), [courses]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Get course by ID
  const getCourse = useCallback((courseId) => {
    return courses.find(course => course.id === courseId);
  }, [courses]);

  // Get course by ID from API
  const getCourseById = useCallback(async (courseId) => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, fetch all courses and find the one we need
      // In a real implementation, you'd have a dedicated API endpoint
      const response = await getAllcourses();
      const coursesData = response.data || response || [];
      
      const course = coursesData.find(c => (c._id || c.id) === courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      
      return {
        id: course._id || course.id,
        title: course.name || course.title,
        description: course.description || '',
        instructor: course.instructor || 'Unknown',
        level: course.level || 'beginner',
        category: course.courseType || course.type || 'trading',
        duration: course.duration || '0h 0m',
        price: course.price || 0,
        status: course.status || 'published',
        thumbnail: course.image || course.thumbnail || '/src/assets/img/course-default.svg',
        videoCount: course.videoCount || 0,
        studentsEnrolled: course.studentsEnrolled || 0,
        createdAt: course.createdAt || new Date().toISOString(),
        updatedAt: course.updatedAt || new Date().toISOString(),
        playlistId: course.playlistId,
        vip: course.vip || false,
        ownerId: course.ownerId,
        startgie: course.startgie
      };
    } catch (err) {
      console.error('Error fetching course by ID:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch course';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle course status (publish/unpublish)
  const toggleCourseStatus = useCallback(async (courseId) => {
    try {
      const course = courses.find(c => c.id === courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      
      const newStatus = course.status === 'published' ? 'draft' : 'published';
      return await updateCourse(courseId, { status: newStatus });
    } catch (err) {
      console.error('Error toggling course status:', err);
      throw err;
    }
  }, [courses, updateCourse]);

  // Get courses by category
  const getCoursesByCategory = useCallback(async (category) => {
    try {
      await fetchCourses({ category });
      return courses.filter(course => course.category === category);
    } catch (err) {
      console.error('Error fetching courses by category:', err);
      throw err;
    }
  }, [fetchCourses, courses]);

  // Get popular courses (based on student enrollment)
  const getPopularCourses = useCallback(async (limit = 5) => {
    try {
      await fetchCourses();
      return courses
        .filter(course => course.status === 'published')
        .sort((a, b) => (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0))
        .slice(0, limit);
    } catch (err) {
      console.error('Error fetching popular courses:', err);
      throw err;
    }
  }, [fetchCourses, courses]);

  // Refresh courses data
  const refreshCourses = useCallback(() => {
    return fetchCourses();
  }, [fetchCourses]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses: filteredCourses,
    allCourses: courses,
    loading,
    error,
    filters,
    stats,
    
    // Course CRUD operations
    fetchCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    toggleCourseStatus,
    
    // Specialized queries
    getCoursesByCategory,
    getPopularCourses,
    
    // Utility functions
    refreshCourses,
    clearError,
    updateFilters,
    getCourse,
    
    // Legacy actions object for backward compatibility
    actions: {
      fetchCourses,
      createCourse,
      updateCourse,
      deleteCourse,
      updateFilters,
      getCourse,
      getCourseById,
      toggleCourseStatus,
      refreshCourses,
      clearError
    }
  };
};

export default useCoursesManagement;
