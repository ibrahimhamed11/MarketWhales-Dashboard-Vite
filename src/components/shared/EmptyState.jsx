import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import { PlayCircleFilled as PlayCircleFilledIcon } from '@mui/icons-material';

/**
 * EmptyState Component
 * Displays an empty state with icon, title, and description
 */
const EmptyState = ({ icon: Icon = PlayCircleFilledIcon, title, description, iconSize = 80 }) => {
  return (
    <Card sx={{ p: 6, textAlign: 'center' }}>
      <Icon sx={{ fontSize: iconSize, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
    </Card>
  );
};

export default EmptyState;
