import React from 'react';
import { Alert, Button } from '@mui/material';

/**
 * ErrorState Component
 * Displays an error message with optional retry action
 */
const ErrorState = ({ message, onRetry, retryText = 'Try Again' }) => {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            {retryText}
          </Button>
        )
      }
    >
      {message}
    </Alert>
  );
};

export default ErrorState;
