import React from 'react';
import { Grid, IconButton, Avatar } from '@mui/material';
import CloudUploadOutlined from '@mui/icons-material/CloudUploadOutlined';

const LogoUpload = ({ editMode, logoUrl, logoFile, handleLogoChange }) => {
  return (
    <Grid item container xs={12} md={6} alignItems="center" spacing={2}>
      {/* Logo Upload Button */}
      <Grid item>
        <label htmlFor="logo-upload">
          <IconButton
            color="primary"
            aria-label="upload logo"
            component="span"
            sx={{
              borderRadius: 12,
              width: 100,
              height: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed', // Optional: visual cue for upload
              borderColor: 'primary.main',
              bgcolor: 'background.default',
              '&:hover': {
                bgcolor: 'background.paper',
              },
            }}
          >
            <CloudUploadOutlined fontSize="large" />
          </IconButton>
        </label>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="logo-upload"
          type="file"
          onChange={handleLogoChange}
        />
      </Grid>

      {/* Display Existing Logo (if in edit mode) */}
      {editMode && logoUrl && (
        <Grid item>
          <Avatar
            alt="Company Logo"
            src={logoUrl}
            sx={{
              borderRadius: 12,
              width: 100,
              height: 100,
              marginRight: 2,
            }}
          />
        </Grid>
      )}

      {/* Display Uploaded Logo */}
      {logoFile && (
        <Grid item>
          <Avatar
            alt="Uploaded Image"
            src={URL.createObjectURL(logoFile)}
            sx={{
              width: 100,
              height: 100,
              border: '1px solid #ccc',
              borderRadius: 12,
            }}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default LogoUpload;
