/**
 * CourseManagementDashboard Styles
 * Material-UI sx prop styles for the Course Management Dashboard
 */

// ============================================================================
// CONTAINER STYLES
// ============================================================================

export const containerStyles = {
  pt: { xs: "130px", md: "80px", xl: "80px" },
  px: { xs: 1, sm: 1 }
};

// ============================================================================
// HEADER SECTION STYLES
// ============================================================================

export const headerBoxStyles = {
  mb: 4
};

export const headerFlexStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: { xs: 'flex-start', md: 'flex-start' },
  mb: 3,
  flexDirection: { xs: 'column', sm: 'row' },
  gap: { xs: 2, sm: 0 }
};

export const headerTitleBoxStyles = {
  flex: 1,
  minWidth: 0
};

export const titleStyles = {
  mb: 1,
  fontWeight: 700,
  color: 'primary.main',
  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
};

export const subtitleStyles = {
  fontSize: { xs: '0.875rem', sm: '1rem' }
};

export const createButtonStyles = {
  borderRadius: 3,
  px: 3,
  py: 1.5,
  fontSize: { xs: '0.875rem', sm: '1rem' },
  fontWeight: 600,
  textTransform: 'none',
  whiteSpace: 'nowrap',
  minWidth: { xs: '100%', sm: 'auto' }
};

// ============================================================================
// STATISTICS GRID STYLES
// ============================================================================

export const statisticsGridStyles = {
  columns: { base: 1, sm: 2, lg: 4 },
  gap: { base: "15px", md: "20px" },
  mb: "20px"
};

export const iconBoxStyles = {
  w: "56px",
  h: "56px"
};

export const iconStyles = {
  w: "32px",
  h: "32px"
};

// ============================================================================
// COURSES SECTION STYLES
// ============================================================================

export const coursesBoxStyles = {
  mb: 4
};

export const filterBoxStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: { xs: 'flex-start', sm: 'center' },
  mb: 3,
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 2
};

export const allCoursesTextStyles = {
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  fontSize: { xs: '1rem', sm: '1.125rem' }
};

export const schoolIconStyles = {
  mr: 1,
  color: 'primary.main'
};

export const filterControlsBoxStyles = {
  display: 'flex',
  gap: 2,
  alignItems: 'center',
  flexDirection: { xs: 'column', sm: 'row' },
  width: { xs: '100%', sm: 'auto' }
};

export const searchFieldStyles = {
  minWidth: { xs: '100%', sm: '250px' },
  width: { xs: '100%', sm: 'auto' }
};

export const searchIconStyles = {
  mr: 1,
  color: 'text.secondary'
};

export const selectFieldStyles = {
  minWidth: { xs: '100%', sm: '120px' },
  width: { xs: '100%', sm: 'auto' }
};

// ============================================================================
// COURSE CARD STYLES
// ============================================================================

export const courseGridStyles = {
  container: true,
  spacing: { xs: 2, sm: 3 }
};

export const courseGridItemStyles = {
  xs: 12,
  sm: 6,
  md: 4,
  xl: 3
};

export const courseCardStyles = {
  cursor: 'pointer',
  height: '100%',
  border: '1px solid',
  borderColor: 'divider',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: 4,
    borderColor: 'primary.main'
  }
};

export const courseMediaStyles = {
  height: { xs: 140, sm: 160 },
  position: 'relative',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
};

export const courseImageInlineStyles = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0
};

export const courseFallbackIconBoxStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
};

export const courseFallbackDisplayStyles = (hasImage) => ({
  display: hasImage ? 'none' : 'flex'
});

export const courseFallbackIconStyles = {
  fontSize: 60,
  color: 'white',
  opacity: 0.8
};

export const courseChipContainerStyles = {
  position: 'absolute',
  top: 8,
  right: 8,
  display: 'flex',
  gap: 1
};

export const courseTypeChipStyles = (type) => ({
  bgcolor: type === 'Paid' ? 'success.main' : 'info.main',
  color: 'white',
  fontWeight: 600
});

export const coursePriceBoxStyles = {
  position: 'absolute',
  bottom: 8,
  left: 8,
  bgcolor: 'rgba(0,0,0,0.7)',
  color: 'white',
  px: 1.5,
  py: 0.5,
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center'
};

export const coursePriceIconStyles = {
  fontSize: 16,
  mr: 0.5
};

export const coursePriceTextStyles = {
  fontWeight: 600
};

export const courseContentStyles = {
  pb: 1,
  px: { xs: 1.5, sm: 2 },
  pt: { xs: 1.5, sm: 2 }
};

export const courseTitleStyles = {
  fontWeight: 600,
  mb: 1,
  wordWrap: 'break-word',
  overflow: 'visible',
  fontSize: { xs: '0.875rem', sm: '1rem' },
  lineHeight: 1.4
};

export const courseChipMobileStyles = {
  mb: 1
};

export const courseMetaBoxStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mt: 1,
  flexWrap: 'wrap',
  gap: 1
};

export const courseStudentsBoxStyles = {
  display: 'flex',
  alignItems: 'center'
};

export const courseStudentsIconStyles = {
  fontSize: 16,
  color: 'text.secondary',
  mr: 0.5
};

export const courseStudentsTextStyles = {
  fontSize: { xs: '0.7rem', sm: '0.75rem' }
};

export const courseTypeBoxStyles = {
  display: 'flex',
  alignItems: 'center'
};

export const courseTypeIconStyles = {
  fontSize: 16,
  color: 'primary.main',
  mr: 0.5
};

export const courseTypeTextStyles = {
  fontWeight: 600,
  fontSize: { xs: '0.7rem', sm: '0.75rem' }
};

export const courseActionsStyles = {
  pt: 0,
  px: 2,
  pb: 2,
  flexDirection: { xs: 'column', sm: 'row' },
  gap: { xs: 1, sm: 0 },
  flexWrap: 'wrap'
};

export const courseActionButtonStyles = {
  mr: { xs: 0, sm: 1 },
  mb: { xs: 1, sm: 0 },
  textTransform: 'none',
  width: { xs: '100%', sm: 'auto' }
};

// ============================================================================
// EMPTY STATE STYLES
// ============================================================================

export const emptyStateCardStyles = {
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
  textTransform: 'none'
};
