import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
} from '@mui/material';
import { VideoLibrary as VideoLibraryIcon } from '@mui/icons-material';
import { API_URL } from '../../apis/config';
import { getFontFamily } from '../../utils/textUtils';

/**
 * CourseInfoCard Component
 * Displays course information with image, title, description, and metadata
 */
const CourseInfoCard = ({ course }) => {
  if (!course) return null;

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallbackIcon = e.target.nextSibling;
    if (fallbackIcon) {
      fallbackIcon.style.display = 'flex';
    }
  };

  const getImageUrl = () => {
    if (!course.image) return null;
    return course.image.startsWith('http')
      ? course.image
      : `${API_URL}/${course.image}`;
  };

  return (
    <Card sx={{ mb: 5, bgcolor: 'primary.50' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Course Image/Icon */}
          <Box
            sx={{
              width: '80px',
              height: '80px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              bgcolor: 'primary.100',
              border: '2px solid',
              borderColor: 'primary.200',
            }}
          >
            {course.image && (
              <img
                src={getImageUrl()}
                alt={course.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={handleImageError}
              />
            )}
            <VideoLibraryIcon
              sx={{
                fontSize: 40,
                color: 'primary.main',
                display: course.image ? 'none' : 'flex',
              }}
            />
          </Box>

          {/* Course Details */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontFamily: getFontFamily(course.name),
                wordWrap: 'break-word',
                overflow: 'visible',
              }}
            >
              {course.name}
            </Typography>

            {course.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 2,
                  fontFamily: getFontFamily(course.description),
                  wordWrap: 'break-word',
                  overflow: 'visible',
                }}
              >
                {course.description}
              </Typography>
            )}

            {/* Course Chips */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={course.type}
                color={course.type === 'Paid' ? 'primary' : 'secondary'}
                size="small"
              />
              {course.courseType && (
                <Chip
                  label={course.courseType}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseInfoCard;
