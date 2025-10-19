import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

import { getFontFamily } from '../../utils/textUtils';
import * as styles from '../../views/admin/adminvideoCourses/CourseVideosManagement.styles';

/**
 * CourseVideoHeader Component
 * Header section with navigation, title, and action buttons
 */
const CourseVideoHeader = ({
  courseName,
  videosCount,
  onBackClick,
  onUploadClick,
}) => {
  const { t } = useTranslation();

  const getVideosCountText = () => {
    if (videosCount === 1) {
      return `(${videosCount} ${t('courseVideoManagement.videoCount')})`;
    }
    return `(${videosCount} ${t('courseVideoManagement.videosCount')})`;
  };

  return (
    <Box sx={styles.headerSectionStyles}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBackClick}
        sx={styles.backButtonStyles}
      >
        {t('courseVideoManagement.backToCourses')}
      </Button>

      <Box sx={styles.titleContainerStyles}>
        <Typography
          variant="h5"
          sx={{
            ...styles.titleStyles,
            fontFamily: getFontFamily(courseName),
          }}
        >
          {courseName} - {t('courseVideoManagement.videosManagement')}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            ...styles.subtitleStyles,
            fontFamily: getFontFamily(
              `${t('courseVideoManagement.manageVideosFor')} ${getVideosCountText()}`
            ),
          }}
        >
          {t('courseVideoManagement.manageVideosFor')} {getVideosCountText()}
        </Typography>
      </Box>

      <Stack {...styles.actionButtonsStyles}>
        <Button
          variant="contained"
          size="medium"
          startIcon={<UploadIcon />}
          onClick={onUploadClick}
          sx={styles.uploadButtonStyles}
        >
          {t('courseVideoManagement.uploadNewVideo')}
        </Button>
      </Stack>
    </Box>
  );
};

export default CourseVideoHeader;
