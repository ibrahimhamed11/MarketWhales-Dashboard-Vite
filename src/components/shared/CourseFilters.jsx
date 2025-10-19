import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Search as SearchIcon, School as SchoolIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { getFontFamily } from '../../utils/textUtils';
import * as styles from '../../views/user/UserPages.styles';

/**
 * CourseFilters Component
 * Displays search and filter controls for courses
 */
const CourseFilters = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  totalCourses = 0
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={styles.filterBoxStyles}>
      {/* Course Count */}
      <Typography
        variant="body1"
        sx={{
          ...styles.allCoursesTextStyles,
          fontFamily: getFontFamily(`${t('user.courses.allCourses')} (${totalCourses})`)
        }}
      >
        <SchoolIcon sx={styles.schoolIconStyles} />
        {t('user.courses.allCourses')} ({totalCourses})
      </Typography>

      {/* Filter Controls */}
      <Box sx={styles.filterControlsBoxStyles}>
        {/* Search Field */}
        <TextField
          size="small"
          placeholder={t('user.courses.searchPlaceholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={styles.searchIconStyles} />
          }}
          sx={styles.searchFieldStyles}
        />

        {/* Type Filter */}
        <FormControl size="small" sx={styles.selectFieldStyles}>
          <InputLabel>{t('user.courses.courseType')}</InputLabel>
          <Select
            value={typeFilter}
            label={t('user.courses.courseType')}
            onChange={(e) => onTypeFilterChange(e.target.value)}
          >
            <MenuItem value="all">{t('common.allTypes')}</MenuItem>
            <MenuItem value="paid">{t('common.paidOnly')}</MenuItem>
            <MenuItem value="free">{t('common.freeOnly')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default CourseFilters;
