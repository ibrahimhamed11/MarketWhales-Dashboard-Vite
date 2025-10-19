import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, ThemeProvider } from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';

// Custom Hooks
import useUserCourses from '../../hooks/useUserCourses';

// Theme
import muiTheme from '../../theme/muiTheme';

// Shared Components
import {
  LoadingState,
  ErrorState,
  EmptyState,
  PageHeader,
  CourseFilters,
  CourseGrid
} from '../../components/shared';

// Styles
import * as styles from './UserPages.styles';

/**
 * UserCoursesPage Component
 * Displays all courses enrolled by the current user with filtering and search capabilities
 */
const UserCoursesPage = () => {
  const { t } = useTranslation();
  const history = useHistory();

  // Fetch user courses data
  const {
    filteredCourses,
    loading,
    error,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    refetch
  } = useUserCourses();

  // Handlers
  const handleCourseSelect = (course) => {
    history.push(`/admin/my-course/${course._id}`);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
  };

  // Render loading state
  if (loading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <LoadingState message={t('user.courses.loadingCourses')} />
      </ThemeProvider>
    );
  }

  // Render error state
  if (error) {
    return (
      <ThemeProvider theme={muiTheme}>
        <ErrorState
          message={error}
          onRetry={refetch}
          retryText={t('common.tryAgain')}
        />
      </ThemeProvider>
    );
  }

  // Determine empty state messages
  const emptyTitle = search 
    ? t('user.courses.noCoursesMatch') 
    : t('user.courses.noCoursesEnrolled');
  
  const emptyDescription = search 
    ? t('user.courses.adjustSearchTerms') 
    : t('user.courses.enrollToBrowse');

  return (
    <ThemeProvider theme={muiTheme}>
      <Box sx={styles.maxWidthContainerStyles}>
        
        {/* Page Header */}
        <PageHeader
          title={t('user.courses.title')}
          subtitle={t('user.courses.subtitle')}
        />

        {/* Courses Section */}
        <Box sx={styles.coursesBoxStyles}>
          
          {/* Filters and Search */}
          <CourseFilters
            search={search}
            onSearchChange={handleSearchChange}
            typeFilter={typeFilter}
            onTypeFilterChange={handleTypeFilterChange}
            totalCourses={filteredCourses.length}
          />

          {/* Courses Grid or Empty State */}
          {filteredCourses.length === 0 ? (
            <EmptyState
              icon={SchoolIcon}
              title={emptyTitle}
              description={emptyDescription}
            />
          ) : (
            <CourseGrid
              courses={filteredCourses}
              onCourseSelect={handleCourseSelect}
            />
          )}
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default UserCoursesPage;
