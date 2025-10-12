import { useEffect, useMemo, useState, useCallback } from 'react';
import { courseAPI, handleApiError } from '../apis/courses/videosCourses';

// Encapsulates fetching, filtering, and simple stats for courses list
export default function useCoursesManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'paid' | 'free'

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getAllCourses();
      setCourses(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(handleApiError(err, 'Failed to load courses'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesSearch = !q
        || course.name?.toLowerCase().includes(q)
        || course.description?.toLowerCase().includes(q);

      const matchesType =
        typeFilter === 'all'
        || (typeFilter === 'paid' && course.type === 'Paid')
        || (typeFilter === 'free' && course.type === 'Free');

      return matchesSearch && matchesType;
    });
  }, [courses, search, typeFilter]);

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const paidCourses = courses.filter((c) => c.type === 'Paid').length;
    const freeCourses = courses.filter((c) => c.type === 'Free').length;
    const totalVideos = courses.reduce((sum, c) => sum + (c.videoCount || 0), 0);
    return { totalCourses, paidCourses, freeCourses, totalVideos };
  }, [courses]);

  return {
    // data
    courses,
    filteredCourses,
    stats,
    // loading & error
    loading,
    error,
    // filters
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    // actions
    refetch: fetchCourses,
  };
}
