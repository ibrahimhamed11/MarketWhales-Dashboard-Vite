import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Stack,
  List,
  ListItem,
  CircularProgress,
  Alert,
  Button,
  Paper
} from '@mui/material';
import { videoService } from '../../apis/mux/videoApi';
import Card from '../card/Card';

const MuxStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError('');
      const statusData = await videoService.getMuxStatus();
      setStatus(statusData);
    } catch (err) {
      console.error('Failed to load Mux status:', err);
      setError('Failed to load Mux status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Stack spacing={4} sx={{ p: 8, alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
        <Typography>Loading Mux status...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ alignItems: 'center' }}>
        {error}
        <Button sx={{ ml: 2 }} onClick={loadStatus} size="small" variant="outlined">
          Retry
        </Button>
      </Alert>
    );
  }

  if (!status) {
    return (
      <Alert severity="warning">
        Status unavailable
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 6 }}>
        Mux Service Status
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Service Status
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip 
                label={status.status === 'operational' ? '✅' : '❌'}
                color={status.status === 'operational' ? 'success' : 'error'}
                size="small"
              />
              <Typography variant="h6" fontWeight="bold">
                {status.status}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Total Videos
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {status.statistics?.totalVideos || 0}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Mux Videos
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {status.statistics?.muxVideos || 0}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Migration Progress
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="secondary.main">
              {status.statistics?.migrationProgress || 0}%
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Configuration
            </Typography>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip 
                  label={status.configuration?.muxConfigured ? '✅' : '❌'}
                  color={status.configuration?.muxConfigured ? 'success' : 'error'}
                  size="small"
                />
                <Typography>Mux Configured</Typography>
              </Stack>
              
              <Stack direction="row" spacing={2} alignItems="center">
                <Chip 
                  label={status.configuration?.signingKeysConfigured ? '✅' : '❌'}
                  color={status.configuration?.signingKeysConfigured ? 'success' : 'error'}
                  size="small"
                />
                <Typography>Signing Keys</Typography>
              </Stack>
              
              {status.configuration?.webhookEndpoint && (
                <Box>
                  <Typography variant="body2" color="text.secondary">Webhook:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {status.configuration.webhookEndpoint}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        </Grid>
        
        {status.statistics?.muxStatusBreakdown && (
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Video Status Breakdown
              </Typography>
              <List>
                {Object.entries(status.statistics.muxStatusBreakdown).map(([statusType, count]) => (
                  <ListItem key={statusType} sx={{ justifyContent: 'space-between', display: 'flex' }}>
                    <Typography sx={{ textTransform: 'capitalize' }}>{statusType}</Typography>
                    <Chip label={count} color="primary" size="small" />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MuxStatus;
