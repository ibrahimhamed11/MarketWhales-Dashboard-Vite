import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

/**
 * VideoFilters Component
 * Provides search and sort functionality for videos
 */
const VideoFilters = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  searchPlaceholder,
  sortLabel,
  sortOptions = [],
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        mt: 4,
        flexWrap: 'wrap',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
      }}
    >
      {/* Search Field */}
      <TextField
        size="small"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{
          minWidth: { xs: '100%', sm: 250 },
          flex: { xs: 1, sm: 'none' },
        }}
      />

      {/* Sort Select */}
      <FormControl
        size="small"
        sx={{
          minWidth: { xs: '100%', sm: 150 },
          flex: { xs: 1, sm: 'none' },
        }}
      >
        <InputLabel>{sortLabel}</InputLabel>
        <Select
          value={sortBy}
          label={sortLabel}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default VideoFilters;
