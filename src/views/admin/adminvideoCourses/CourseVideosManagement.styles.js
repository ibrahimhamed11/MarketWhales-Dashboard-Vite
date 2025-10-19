/**
 * Styles for CourseVideosManagement component
 */

export const containerStyles = {
  pt: { xs: "130px", md: "80px", xl: "80px" }, 
  px: { xs: 1, sm: 1 }
};

export const headerSectionStyles = {
  display: 'flex', 
  alignItems: { xs: 'flex-start', sm: 'center' }, 
  mb: 4,
  flexDirection: { xs: 'column', sm: 'row' },
  gap: { xs: 2, sm: 0 }
};

export const backButtonStyles = {
  mr: { sm: 2 },
  textTransform: 'capitalize'
};

export const titleContainerStyles = {
  flex: 1, 
  minWidth: 0
};

export const titleStyles = {
  mb: 1, 
  fontWeight: 700, 
  wordWrap: 'break-word',
  overflow: 'visible',
  fontSize: { xs: '1.25rem', sm: '1.5rem' }
};

export const subtitleStyles = {
  wordWrap: 'break-word',
  overflow: 'visible'
};

export const actionButtonsStyles = {
  direction: "row", 
  spacing: 2, 
  sx: { width: { xs: '100%', sm: 'auto' } }
};

export const uploadButtonStyles = {
  borderRadius: 2, 
  px: 2, 
  py: 1, 
  minWidth: '120px',
  fontSize: '0.875rem',
  textTransform: 'capitalize',
  width: { xs: '100%', sm: 'auto' }
};

export const filtersContainerStyles = {
  display: 'flex', 
  gap: 2, 
  alignItems: 'center', 
  mb: 4,
  mt: 4,
  flexWrap: 'wrap',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' }
};

export const searchFieldStyles = {
  minWidth: { xs: '100%', sm: 250 },
  flex: { xs: 1, sm: 'none' }
};

export const selectFieldStyles = {
  minWidth: { xs: '100%', sm: 150 },
  flex: { xs: 1, sm: 'none' }
};

export const loadingContainerStyles = {
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  py: 6
};

export const emptyStatePaperStyles = {
  p: 6, 
  textAlign: 'center'
};

export const emptyStateIconStyles = {
  fontSize: 80, 
  color: 'text.secondary', 
  mb: 2
};

export const emptyStateTitleStyles = {
  mb: 2
};

export const emptyStateDescriptionStyles = {
  mb: 3
};

export const emptyStateButtonStyles = {
  textTransform: 'capitalize'
};

// Video Card Styles
export const videoCardStyles = {
  height: '100%',
  '&:hover': { boxShadow: 4 }
};

export const videoThumbnailContainerStyles = (viewMode) => ({
  position: 'relative', 
  height: viewMode === 'grid' ? 200 : 120
});

export const videoThumbnailStyles = (viewMode) => ({
  objectFit: 'cover',
  height: viewMode === 'grid' ? 200 : 120
});

export const thumbnailFallbackStyles = (viewMode) => ({
  height: '100%',
  bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 1
});

export const fallbackIconStyles = (viewMode) => ({
  fontSize: viewMode === 'grid' ? 60 : 40, 
  color: 'white',
  opacity: 0.9
});

export const fallbackTextStyles = (viewMode) => ({
  opacity: 0.8,
  color: 'white',
  fontWeight: 600,
  variant: viewMode === 'grid' ? 'body1' : 'body2'
});

export const videoChipsContainerStyles = {
  position: 'absolute',
  top: 8,
  left: 8,
  display: 'flex',
  gap: 1
};

export const videoOrderChipStyles = {
  fontWeight: 600
};

export const videoStatusChipStyles = (isActive) => ({
  fontWeight: 600,
  color: isActive ? 'success' : 'default'
});

export const videoDurationBadgeStyles = {
  position: 'absolute',
  bottom: 8,
  right: 8,
  bgcolor: 'rgba(0,0,0,0.8)',
  color: 'white',
  px: 1,
  py: 0.5,
  borderRadius: 1,
  display: 'flex',
  alignItems: 'center'
};

export const durationIconStyles = {
  fontSize: 14, 
  mr: 0.5
};

export const playButtonOverlayStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'rgba(0,0,0,0.7)',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': { 
    bgcolor: 'rgba(0,0,0,0.9)',
    transform: 'translate(-50%, -50%) scale(1.1)'
  }
};

// Edit Mode Styles
export const editFormContainerStyles = {
  mb: 2
};

export const editFieldStyles = {
  mb: 2
};

export const editButtonsContainerStyles = {
  display: 'flex', 
  gap: 1, 
  justifyContent: 'flex-end'
};

export const editButtonStyles = {
  textTransform: 'capitalize'
};

// View Mode Styles
export const videoTitleContainerStyles = {
  display: 'flex', 
  alignItems: 'flex-start', 
  justifyContent: 'space-between', 
  mb: 1
};

export const videoTitleStyles = {
  fontWeight: 600, 
  wordWrap: 'break-word',
  overflow: 'visible',
  flex: 1,
  mr: 1
};

export const editIconButtonStyles = {
  p: 0.5,
  '&:hover': { bgcolor: 'action.hover' }
};

export const videoDescriptionStyles = {
  mb: 2,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

// Action Buttons Styles
export const videoActionsStyles = {
  p: 1, 
  gap: 0.5, 
  flexWrap: 'wrap',
  justifyContent: { xs: 'center', sm: 'flex-start' }
};

export const actionButtonBaseStyles = {
  minWidth: { xs: '70px', sm: '75px' },
  fontSize: '0.75rem',
  px: 1,
  py: 0.5,
  height: '28px',
  textTransform: 'capitalize'
};

export const playModalButtonStyles = {
  ...actionButtonBaseStyles,
  minWidth: { xs: '70px', sm: '75px' }
};

export const playNewPageButtonStyles = {
  ...actionButtonBaseStyles,
  minWidth: { xs: '75px', sm: '80px' }
};

export const toggleStatusButtonStyles = {
  ...actionButtonBaseStyles,
  minWidth: { xs: '60px', sm: '65px' }
};

export const deleteButtonStyles = {
  ...actionButtonBaseStyles,
  minWidth: { xs: '60px', sm: '65px' }
};

// Snackbar Styles
export const snackbarAnchorOrigin = {
  vertical: 'bottom', 
  horizontal: 'right'
};

export const snackbarAlertStyles = {
  width: '100%'
};
