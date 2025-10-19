import React from 'react';
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
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { API_URL } from '../../apis/config';
import { getFontFamily } from '../../utils/textUtils';
import { formatDuration } from '../../utils/courses/videoUtils';

/**
 * VideoCard Component
 * Displays a video card with thumbnail, title, description, and action buttons
 */
const VideoCard = ({
  video,
  viewMode = 'grid',
  onPlayVideo,
  t,
}) => {
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

  const isGridView = viewMode === 'grid';
  const thumbnailHeight = isGridView ? 200 : 120;

  return (
    <Card
      sx={{
        height: '100%',
        '&:hover': { boxShadow: 4 },
      }}
    >
      {/* Video Thumbnail */}
      <Box sx={{ position: 'relative', height: thumbnailHeight }}>
        {video.thumbnailKey && (
          <CardMedia
            component="img"
            height={thumbnailHeight}
            image={getThumbnailUrl()}
            alt={video.title}
            sx={{ objectFit: 'cover' }}
            onError={handleThumbnailError}
          />
        )}

        {/* Fallback Thumbnail */}
        <Box
          className="thumbnail-fallback"
          sx={{
            height: '100%',
            bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: video.thumbnailKey ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <PlayArrowIcon
            sx={{
              fontSize: isGridView ? 60 : 40,
              color: 'white',
              opacity: 0.9,
            }}
          />
          <Typography
            variant={isGridView ? 'body1' : 'body2'}
            color="white"
            fontWeight={600}
            sx={{
              opacity: 0.8,
              fontFamily: getFontFamily(`Video ${video.order}`),
            }}
          >
            Video {video.order}
          </Typography>
        </Box>

        {/* Order Chip */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip
            label={`#${video.order}`}
            color="primary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Duration Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            bgcolor: 'rgba(0,0,0,0.8)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
          <Typography variant="caption" fontWeight={600}>
            {formatDuration(video.duration)}
          </Typography>
        </Box>

        {/* Play Button Overlay */}
        <IconButton
          onClick={() => onPlayVideo(video)}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'rgba(0,0,0,0.7)',
            color: 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.9)',
              transform: 'translate(-50%, -50%) scale(1.1)',
            },
          }}
        >
          <PlayArrowIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Video Content */}
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            mb: 1,
            fontFamily: getFontFamily(video.title),
            wordWrap: 'break-word',
            overflow: 'visible',
          }}
        >
          {video.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontFamily: getFontFamily(video.description),
          }}
        >
          {video.description || t('user.coursePage.noDescriptionAvailable')}
        </Typography>
      </CardContent>

      {/* Action Buttons */}
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: { xs: 'center', sm: 'flex-start' },
        }}
      >
        <Button
          onClick={() => onPlayVideo(video)}
          variant="contained"
          size="small"
          startIcon={<PlayArrowIcon />}
          color="primary"
          sx={{
            minWidth: { xs: '100px', sm: '110px' },
            textTransform: 'capitalize',
          }}
        >
          {t('user.coursePage.watchNow')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default VideoCard;
