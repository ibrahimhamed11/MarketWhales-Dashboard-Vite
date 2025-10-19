import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  Box,
  Chip
} from '@mui/material';
import {
  Group as GroupIcon,
  VideoLibrary as VideoLibraryIcon,
  AttachMoney as AttachMoneyIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../apis/config';
import { getFontFamily } from '../../utils/textUtils';
import * as styles from '../../views/user/UserPages.styles';

/**
 * CourseCard Component
 * Displays a course card with image, title, metadata, and actions
 */
const CourseCard = ({ course, onCourseSelect }) => {
  const { t } = useTranslation();

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.parentElement.querySelector('.course-icon-fallback');
    if (fallback) fallback.style.display = 'flex';
  };

  return (
    <Card
      sx={styles.courseCardStyles}
      onClick={() => onCourseSelect(course)}
    >
      {/* Course Image/Thumbnail */}
      <CardMedia sx={styles.courseMediaStyles}>
        {course.image && (
          <img
            src={`${API_URL}${course.image}`}
            alt={course.name}
            style={styles.courseImageInlineStyles}
            onError={handleImageError}
          />
        )}

        {/* Fallback Icon */}
        <Box
          className="course-icon-fallback"
          sx={{
            ...styles.courseFallbackIconBoxStyles,
            ...styles.courseFallbackDisplayStyles(course.image)
          }}
        >
          <SchoolIcon sx={styles.courseFallbackIconStyles} />
        </Box>

        {/* Course Type Badge */}
        <Box sx={styles.courseChipContainerStyles}>
          <Chip
            label={course.type}
            size="small"
            sx={styles.courseTypeChipStyles(course.type)}
          />
        </Box>

        {/* Price Badge */}
        {course.price && course.type === 'Paid' && (
          <Box sx={styles.coursePriceBoxStyles}>
            <AttachMoneyIcon sx={styles.coursePriceIconStyles} />
            <Typography
              variant="body2"
              sx={{
                ...styles.coursePriceTextStyles,
                fontFamily: getFontFamily(course.price)
              }}
            >
              {course.price}
            </Typography>
          </Box>
        )}
      </CardMedia>

      {/* Course Content */}
      <CardContent sx={styles.courseContentStyles}>
        <Typography
          variant="body1"
          sx={{
            ...styles.courseTitleStyles,
            fontFamily: getFontFamily(course.name)
          }}
        >
          {course.name}
        </Typography>

        {course.courseType && (
          <Chip
            label={course.courseType}
            size="small"
            variant="outlined"
            sx={styles.courseChipMobileStyles}
          />
        )}

        {/* Course Metadata */}
        <Box sx={styles.courseMetaBoxStyles}>
          {/* Students Count */}
          <Box sx={styles.courseStudentsBoxStyles}>
            <GroupIcon sx={styles.courseStudentsIconStyles} />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                ...styles.courseStudentsTextStyles,
                fontFamily: getFontFamily(`${course.totalSalesCount || 0} ${t('common.students')}`)
              }}
            >
              {course.totalSalesCount || 0} {t('common.students')}
            </Typography>
          </Box>

          {/* Course Type */}
          <Box sx={styles.courseTypeBoxStyles}>
            <VideoLibraryIcon sx={styles.courseTypeIconStyles} />
            <Typography
              variant="caption"
              color="primary.main"
              fontWeight={600}
              sx={{
                ...styles.courseTypeTextStyles,
                fontFamily: getFontFamily(course.type)
              }}
            >
              {course.type}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Course Actions */}
      <CardActions sx={styles.courseActionsStyles}>
        <Button
          size="small"
          startIcon={<PlayCircleFilledIcon />}
          onClick={(e) => {
            e.stopPropagation();
            onCourseSelect(course);
          }}
          variant="contained"
          sx={{
            ...styles.courseActionButtonStyles,
            ...styles.courseActionButtonMobileStyles
          }}
        >
          {t('user.courses.startLearning')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourseCard;
