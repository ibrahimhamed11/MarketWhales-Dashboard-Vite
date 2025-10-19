import React from 'react';
import { Box, Typography } from '@mui/material';
import { getFontFamily } from '../../utils/textUtils';
import * as styles from '../../views/user/UserPages.styles';

/**
 * PageHeader Component
 * Displays a page header with title and subtitle
 */
const PageHeader = ({ title, subtitle }) => {
  return (
    <Box sx={styles.headerBoxStyles}>
      <Box sx={styles.headerFlexStyles}>
        <Box sx={styles.headerTitleBoxStyles}>
          <Typography
            variant="h5"
            sx={{
              ...styles.titleStyles,
              fontFamily: getFontFamily(title)
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                ...styles.subtitleStyles,
                fontFamily: getFontFamily(subtitle)
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;
