import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import * as styles from '../../views/admin/adminvideoCourses/CourseVideosManagement.styles';

/**
 * AdminVideoFilters Component
 * Provides search and filter controls for admin video management
 */
const AdminVideoFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  videosCount = 0,
}) => {
  const { t } = useTranslation();

  if (videosCount === 0) return null;

  return (
    <Box sx={styles.filtersContainerStyles}>
      <TextField
        size="small"
        placeholder={t('courseVideoManagement.searchVideos')}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
        }}
        sx={styles.searchFieldStyles}
      />

      <FormControl size="small" sx={styles.selectFieldStyles}>
        <InputLabel>{t('courseVideoManagement.sortBy')}</InputLabel>
        <Select
          value={sortBy}
          label={t('courseVideoManagement.sortBy')}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <MenuItem value="order">{t('courseVideoManagement.order')}</MenuItem>
          <MenuItem value="title">{t('courseVideoManagement.title')}</MenuItem>
          <MenuItem value="uploadedAt">{t('courseVideoManagement.uploadDate')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={styles.selectFieldStyles}>
        <InputLabel>{t('courseVideoManagement.status')}</InputLabel>
        <Select
          value={statusFilter}
          label={t('courseVideoManagement.status')}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <MenuItem value="all">{t('courseVideoManagement.allVideos')}</MenuItem>
          <MenuItem value="active">{t('courseVideoManagement.activeOnly')}</MenuItem>
          <MenuItem value="inactive">{t('courseVideoManagement.inactiveOnly')}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default AdminVideoFilters;
