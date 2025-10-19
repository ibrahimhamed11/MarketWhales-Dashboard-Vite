import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

import { API_URL } from '../../apis/config';
import { getFontFamily } from '../../utils/textUtils';
import { formatDuration } from '../../utils/courses/videoUtils';
import * as styles from '../../views/admin/adminvideoCourses/CourseVideosManagement.styles';

/**
 * AdminVideoCard Component
 * Video card with admin controls for editing, deleting, and status management
 */
const AdminVideoCard = ({
  video,
  viewMode = 'grid',
  editingVideo,
  editedTitle,
  editedDescription,
  saving,
  onPlayVideo,
  onPlayVideoNewPage,
  onToggleStatus,
  onDelete,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onTitleChange,
  onDescriptionChange,
}) => {
  const { t } = useTranslation();

  const handleThumbnailError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.parentElement.querySelector('.thumbnail-fallback');
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  const getThumbnailUrl = () => {
    if (!video.thumbnailKey) return null;
    return video.thumbnailKey.startsWith('http')
      ? video.thumbnailKey
      : `${API_URL}/api/files/${video.thumbnailKey}`;
  };

  const isEditing = editingVideo === video._id;

  return (
    <Card sx={styles.videoCardStyles}>
      {/* Video Thumbnail */}
      <Box sx={styles.videoThumbnailContainerStyles(viewMode)}>
        {video.thumbnailKey && (
          <CardMedia
            component="img"
            image={getThumbnailUrl()}
            alt={video.title}
            sx={styles.videoThumbnailStyles(viewMode)}
            onError={handleThumbnailError}
          />
        )}

        {/* Fallback Thumbnail */}
        <Box
          className="thumbnail-fallback"
          sx={{
            ...styles.thumbnailFallbackStyles(viewMode),
            display: video.thumbnailKey ? 'none' : 'flex',
          }}
        >
          <PlayCircleFilledIcon sx={styles.fallbackIconStyles(viewMode)} />
          <Typography
            {...styles.fallbackTextStyles(viewMode)}
            sx={{
              ...styles.fallbackTextStyles(viewMode),
              fontFamily: getFontFamily(`${t('common.video')} ${video.order}`),
            }}
          >
            {t('common.video')} {video.order}
          </Typography>
        </Box>

        {/* Status and Order Chips */}
        <Box sx={styles.videoChipsContainerStyles}>
          <Chip
            label={`#${video.order}`}
            color="primary"
            size="small"
            sx={styles.videoOrderChipStyles}
          />
          <Chip
            label={video.isActive ? t('courseVideoManagement.active') : t('courseVideoManagement.inactive')}
            color={video.isActive ? 'success' : 'default'}
            size="small"
            sx={styles.videoStatusChipStyles(video.isActive)}
          />
        </Box>

        {/* Duration Badge */}
        <Box sx={styles.videoDurationBadgeStyles}>
          <AccessTimeIcon sx={styles.durationIconStyles} />
          <Typography variant="caption" fontWeight={600}>
            {formatDuration(video.duration)}
          </Typography>
        </Box>

        {/* Play Button Overlay */}
        <IconButton
          onClick={() => onPlayVideo(video)}
          sx={styles.playButtonOverlayStyles}
        >
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Video Content */}
      <CardContent>
        {isEditing ? (
          // Edit Mode
          <Box>
            <TextField
              fullWidth
              size="small"
              label={t('courseVideoManagement.videoTitle')}
              value={editedTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              sx={{
                ...styles.editFieldStyles,
                '& .MuiOutlinedInput-root': {
                  fontFamily: getFontFamily(editedTitle),
                },
              }}
              inputProps={{ maxLength: 100 }}
              helperText={`${editedTitle.length}/100 ${t('courseVideoManagement.charactersLimit')}`}
            />
            <TextField
              fullWidth
              size="small"
              label={t('courseVideoManagement.videoDescription')}
              multiline
              rows={3}
              value={editedDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              sx={{
                ...styles.editFieldStyles,
                '& .MuiOutlinedInput-root': {
                  fontFamily: getFontFamily(editedDescription),
                },
              }}
              inputProps={{ maxLength: 500 }}
              helperText={`${editedDescription.length}/500 ${t('courseVideoManagement.charactersLimit')}`}
            />
            <Box sx={styles.editButtonsContainerStyles}>
              <Button
                size="small"
                onClick={() => onCancelEdit()}
                startIcon={<CancelIcon />}
                sx={styles.editButtonStyles}
              >
                {t('courseVideoManagement.cancel')}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => onSaveEdit(video._id)}
                startIcon={saving ? <CircularProgress size={14} /> : <SaveIcon />}
                disabled={saving || !editedTitle.trim()}
                sx={styles.editButtonStyles}
              >
                {t('courseVideoManagement.save')}
              </Button>
            </Box>
          </Box>
        ) : (
          // View Mode
          <Box>
            <Box sx={styles.videoTitleContainerStyles}>
              <Typography
                variant="body1"
                sx={{
                  ...styles.videoTitleStyles,
                  fontFamily: getFontFamily(video.title),
                }}
              >
                {video.title}
              </Typography>
              <IconButton
                size="small"
                onClick={() => onEdit(video)}
                sx={styles.editIconButtonStyles}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                ...styles.videoDescriptionStyles,
                fontFamily: getFontFamily(video.description),
              }}
            >
              {video.description || t('courseVideoManagement.noDescriptionProvided')}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={styles.videoActionsStyles}>
        <Button
          onClick={() => onPlayVideo(video)}
          variant="contained"
          size="small"
          startIcon={<PlayArrowIcon />}
          color="primary"
          sx={styles.playModalButtonStyles}
        >
          {t('courseVideoManagement.playModal')}
        </Button>

        <Button
          onClick={() => onPlayVideoNewPage(video)}
          variant="outlined"
          size="small"
          startIcon={<PlayCircleFilledIcon />}
          color="primary"
          sx={styles.playNewPageButtonStyles}
        >
          {t('courseVideoManagement.newPage')}
        </Button>

        <Button
          onClick={() => onToggleStatus(video._id, video.isActive)}
          variant="outlined"
          size="small"
          startIcon={video.isActive ? <VisibilityOffIcon /> : <VisibilityIcon />}
          color={video.isActive ? 'warning' : 'success'}
          sx={styles.toggleStatusButtonStyles}
        >
          {video.isActive ? t('courseVideoManagement.hide') : t('courseVideoManagement.show')}
        </Button>

        <Button
          onClick={() => onDelete(video._id)}
          variant="outlined"
          size="small"
          startIcon={<DeleteIcon />}
          color="error"
          sx={styles.deleteButtonStyles}
        >
          {t('courseVideoManagement.delete')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default AdminVideoCard;
