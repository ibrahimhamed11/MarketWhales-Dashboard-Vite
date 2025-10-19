import { useCallback, useEffect, useMemo, useState } from 'react';
import { courseAPI, adminVideoAPI, userVideoAPI } from '../apis/courses/videosCourses';
import { videoService } from '../apis/mux/videoApi';

export default function useCourseVideos(courseId, isAdminMode = true) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);

  const [muxStatus, setMuxStatus] = useState(null);
  const [muxLoading, setMuxLoading] = useState(false);

  // UI filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | inactive
  const [sortBy, setSortBy] = useState('order'); // order | title | uploadedAt

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    
    let isMounted = true;
    
    try {
      if (isMounted) setLoading(true);
      const data = await courseAPI.getCourseById(courseId);
      if (isMounted) {
        setCourse(data);
        setError(null);
      }
    } catch (err) {
      if (isMounted) setError(err?.message || 'Failed to load course');
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const fetchCourseVideos = useCallback(async () => {
    if (!courseId) return;
    
    let isMounted = true;
    
    try {
      if (isMounted) setVideosLoading(true);
      
      // Use appropriate API based on mode
      const data = isAdminMode 
        ? await adminVideoAPI.getCourseVideos(courseId)
        : await userVideoAPI.getCourseVideos(courseId);
      
      const sorted = Array.isArray(data) ? data.sort((a, b) => a.order - b.order) : [];
      if (isMounted) setVideos(sorted);
    } catch (err) {
      // no-op; UI can show empty state
      console.error('Error fetching course videos:', err);
    } finally {
      if (isMounted) setVideosLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [courseId, isAdminMode]);

  const fetchMuxStatus = useCallback(async () => {
    let isMounted = true;
    
    try {
      if (isMounted) setMuxLoading(true);
      const status = await videoService.getMuxStatus();
      if (isMounted) setMuxStatus(status);
    } catch {
      // ignore
    } finally {
      if (isMounted) setMuxLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    fetchCourse();
    fetchCourseVideos();
    fetchMuxStatus();
  }, [fetchCourse, fetchCourseVideos, fetchMuxStatus]);

  const filteredVideos = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = videos.filter((v) => {
      const matchesSearch = !q || v.title?.toLowerCase().includes(q) || v.description?.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all'
        || (statusFilter === 'active' && v.isActive)
        || (statusFilter === 'inactive' && !v.isActive);
      return matchesSearch && matchesStatus;
    });

    switch (sortBy) {
      case 'title':
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      case 'uploadedAt':
        return [...list].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      case 'order':
      default:
        return [...list].sort((a, b) => a.order - b.order);
    }
  }, [videos, search, statusFilter, sortBy]);

  const toggleVideoStatus = useCallback(async (videoId, isActive) => {
    await adminVideoAPI.updateVideoMetadata(videoId, { isActive: !isActive });
    await fetchCourseVideos();
  }, [fetchCourseVideos]);

  const deleteVideo = useCallback(async (videoId) => {
    await adminVideoAPI.deleteVideo(videoId);
    await fetchCourseVideos();
  }, [fetchCourseVideos]);

  const updateVideo = useCallback(async (videoId, updateData) => {
    await adminVideoAPI.updateVideo(videoId, updateData);
    await fetchCourseVideos();
  }, [fetchCourseVideos]);

  return {
    // data
    course,
    videos,
    filteredVideos,
    muxStatus,
    // loading
    loading,
    error,
    videosLoading,
    muxLoading,
    // filters
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    // actions
    refetchCourse: fetchCourse,
    refetchVideos: fetchCourseVideos,
    toggleVideoStatus,
    deleteVideo,
    updateVideo,
  };
}
