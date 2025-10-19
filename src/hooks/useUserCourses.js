import { useState, useCallback, useEffect, useMemo } from 'react';
import { userVideoAPI, courseAPI } from '../apis/videoCoursesService';

const useUserCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const logActivity = useCallback((level, message, data = {}) => {
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      hook: 'useUserCourses',
      userId: localStorage.getItem('userId') || 'unknown',
      sessionId: sessionStorage.getItem('sessionId') || 'unknown',
      ...data
    };
    
    console[level](`[useUserCourses] ${message}`, logData);
    
    if (level === 'error' || level === 'warn') {
      const existingLogs = JSON.parse(sessionStorage.getItem('userCoursesLogs') || '[]');
      existingLogs.push(logData);
      const recentLogs = existingLogs.slice(-50);
      sessionStorage.setItem('userCoursesLogs', JSON.stringify(recentLogs));
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      logActivity('info', 'Starting to fetch user courses');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      logActivity('info', 'Authentication token found, proceeding with API call');
      
      const coursesData = await courseAPI.getAll();
      
      logActivity('info', 'Courses API call successful', {
        responseType: typeof coursesData,
        isArray: Array.isArray(coursesData),
        dataLength: Array.isArray(coursesData) ? coursesData.length : 'N/A',
        sample: Array.isArray(coursesData) && coursesData[0] ? {
          id: coursesData[0]._id,
          name: coursesData[0].name,
          hasImage: !!coursesData[0].image,
          type: coursesData[0].type
        } : null
      });
      
      const activeCourses = Array.isArray(coursesData) 
        ? coursesData.filter(course => {
            const isActive = course.isActive !== false;
            if (!isActive) {
              logActivity('debug', 'Filtering out inactive course', {
                courseId: course._id,
                courseName: course.name
              });
            }
            return isActive;
          })
        : [];
      
      logActivity('info', 'Courses filtered successfully', {
        totalCourses: Array.isArray(coursesData) ? coursesData.length : 0,
        activeCourses: activeCourses.length,
        filteredOut: Array.isArray(coursesData) ? coursesData.length - activeCourses.length : 0
      });
      
      setCourses(activeCourses);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      
      logActivity('error', 'Failed to fetch courses', {
        error: errorMessage,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
        method: err.config?.method,
        stack: err.stack?.split('\n').slice(0, 5)
      });
      
      setError(errorMessage);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [logActivity]);

  useEffect(() => {
    if (!sessionStorage.getItem('sessionId')) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    
    logActivity('info', 'useUserCourses hook initialized', {
      sessionId: sessionStorage.getItem('sessionId'),
      hasToken: !!localStorage.getItem('token'),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    fetchCourses();
  }, [fetchCourses, logActivity]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesSearch = !q || 
        course.name?.toLowerCase().includes(q) || 
        course.description?.toLowerCase().includes(q) ||
        course.courseType?.toLowerCase().includes(q);
      
      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'paid' && course.type === 'Paid') ||
        (typeFilter === 'free' && course.type === 'Free');
      
      return matchesSearch && matchesType;
    });
  }, [courses, search, typeFilter]);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const paidCourses = courses.filter(c => c.type === 'Paid').length;
    const freeCourses = courses.filter(c => c.type === 'Free').length;
    const totalVideos = courses.reduce((sum, course) => {
      return sum + (course.videoCount || course.videos?.length || 0);
    }, 0);

    return {
      totalCourses,
      paidCourses,
      freeCourses,
      totalVideos
    };
  }, [courses]);

  const fetchCourseVideos = useCallback(async (courseId) => {
    try {
      logActivity('info', 'Fetching videos for course', { courseId });
      
      const videos = await userVideoAPI.getCourseVideos(courseId);
      
      logActivity('info', 'Course videos fetched successfully', {
        courseId,
        videosCount: Array.isArray(videos) ? videos.length : 'unknown',
        videosType: typeof videos,
        hasVideos: Array.isArray(videos) && videos.length > 0,
        sampleVideo: Array.isArray(videos) && videos[0] ? {
          id: videos[0]._id,
          title: videos[0].title,
          hasPlaybackId: !!videos[0].playbackId,
          isActive: videos[0].isActive
        } : null
      });
      
      return videos;
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch course videos';
      
      logActivity('error', 'Failed to fetch course videos', {
        courseId,
        error: errorMessage,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url
      });
      
      throw err;
    }
  }, [logActivity]);

  const getVideoDetails = useCallback(async (videoId) => {
    try {
      logActivity('info', 'Fetching video details', { videoId });
      
      const videoDetails = await userVideoAPI.getVideoDetails(videoId);
      
      logActivity('info', 'Video details fetched successfully', {
        videoId,
        hasPlaybackId: !!videoDetails.playbackId,
        hasStreamUrl: !!videoDetails.streamUrl,
        videoTitle: videoDetails.title
      });
      
      return videoDetails;
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch video details';
      
      logActivity('error', 'Failed to fetch video details', {
        videoId,
        error: errorMessage,
        status: err.response?.status
      });
      
      throw err;
    }
  }, [logActivity]);

  const getDebugLogs = useCallback(() => {
    const logs = JSON.parse(sessionStorage.getItem('userCoursesLogs') || '[]');
    logActivity('info', 'Debug logs requested', { logsCount: logs.length });
    return logs;
  }, [logActivity]);

  const clearError = useCallback(() => {
    setError(null);
    logActivity('info', 'Error state cleared');
  }, [logActivity]);

  return {
    courses,
    filteredCourses,
    stats,
    loading,
    error,
    
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    
    refetch: fetchCourses,
    fetchCourseVideos,
    getVideoDetails,
    clearError,
    
    getDebugLogs,
    logActivity
  };
};

export default useUserCourses;