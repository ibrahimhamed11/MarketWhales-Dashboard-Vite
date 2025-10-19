import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getFontFamily } from '../../utils/textUtils';

/**
 * LoadingState Component
 * Displays a centered loading spinner with optional message
 */
const LoadingState = ({ message, size = 60 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
      }}
    >
      <CircularProgress size={size} sx={{ mb: 2 }} />
      {message && (
        <Typography
          variant="h6"
          sx={{ fontFamily: getFontFamily(message) }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingState;
