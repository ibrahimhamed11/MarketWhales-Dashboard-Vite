import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getFontFamily } from '../../utils/textUtils';

/**
 * CourseHeader Component
 * Displays course name and navigation back button
 */
const CourseHeader = ({ courseName, videoCount, onBack, t }) => {
  const getVideoCountText = () => {
    const videoText = videoCount !== 1 ? t('common.videos') : t('common.video');
    const availableText = t('user.coursePage.videosAvailable').split(' ')[1] || 'available';
    return `${videoCount} ${videoText} ${availableText}`;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 4,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
      }}
    >
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{
          mr: { sm: 2 },
          textTransform: 'capitalize',
        }}
      >
        {t('navigation.backToCourses')}
      </Button>

      {/* Course Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 1,
            fontWeight: 700,
            wordWrap: 'break-word',
            overflow: 'visible',
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            fontFamily: getFontFamily(courseName),
          }}
        >
          {courseName}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            wordWrap: 'break-word',
            overflow: 'visible',
            fontFamily: getFontFamily(getVideoCountText()),
          }}
        >
          {getVideoCountText()}
        </Typography>
      </Box>
    </Box>
  );
};

export default CourseHeader;
