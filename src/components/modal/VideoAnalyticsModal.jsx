import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as ViewsIcon,
  AccessTime as TimeIcon,
  TrendingUp as TrendingIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

const VideoAnalyticsModal = ({ open, onClose, analytics, videoTitle }) => {
  if (!analytics) return null;

  const {
    totalViews = 0,
    totalWatchTime = 0,
    avgWatchTime = 0,
    completionRate = 0,
    uniqueViewers = 0,
    repeatViewers = 0,
    deviceBreakdown = {},
    viewsByDate = [],
    engagementMetrics = {}
  } = analytics;

  // Format duration helper
  const formatDuration = (seconds) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Device data for display
  const deviceData = Object.entries(deviceBreakdown || {}).map(([device, count]) => ({
    name: device,
    value: count,
    percentage: totalViews > 0 ? ((count / totalViews) * 100).toFixed(1) : 0
  }));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
          maxWidth: '1000px',
          bgcolor: 'background.paper',
          borderRadius: '12px',
          boxShadow: 24,
          p: 0,
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          bgcolor: 'primary.main', 
          color: 'white',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              Video Analytics
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {videoTitle || 'Video Performance Metrics'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Analytics Content */}
        <Box sx={{ p: 3 }}>
          {/* Key Metrics Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <ViewsIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {totalViews.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Views
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <PersonIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {uniqueViewers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unique Viewers
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <TimeIcon sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {formatDuration(avgWatchTime)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Watch Time
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <TrendingIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {completionRate.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completion Rate
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Charts Section */}
          <Grid container spacing={3}>
            {/* Device Breakdown */}
            {deviceData.length > 0 && (
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Device Breakdown
                  </Typography>
                  <Box sx={{ p: 2 }}>
                    {deviceData.map((device, index) => (
                      <Box key={device.name} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{device.name}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {device.value} ({device.percentage}%)
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={parseFloat(device.percentage)} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            )}

            {/* Engagement Metrics */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Engagement Metrics
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Watch Time</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {formatDuration(avgWatchTime)}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((avgWatchTime / 3600) * 100, 100)} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Completion Rate</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {completionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={completionRate} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Repeat Viewers</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {repeatViewers} ({totalViews > 0 ? ((repeatViewers / totalViews) * 100).toFixed(1) : 0}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={totalViews > 0 ? (repeatViewers / totalViews) * 100 : 0} 
                    color="warning"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Card>
            </Grid>

            {/* Additional Stats */}
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Additional Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <ScheduleIcon sx={{ fontSize: 24, color: 'info.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Total Watch Time
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatDuration(totalWatchTime)}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <PlayIcon sx={{ fontSize: 24, color: 'success.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Views per User
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {uniqueViewers > 0 ? (totalViews / uniqueViewers).toFixed(1) : 0}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Engagement Score
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: completionRate > 50 ? 'success.main' : 'warning.main' }}>
                        {completionRate > 75 ? 'Excellent' : completionRate > 50 ? 'Good' : completionRate > 25 ? 'Average' : 'Low'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Performance
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold', 
                        color: totalViews > 100 ? 'success.main' : totalViews > 50 ? 'warning.main' : 'error.main' 
                      }}>
                        {totalViews > 100 ? 'High' : totalViews > 50 ? 'Medium' : 'Low'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default VideoAnalyticsModal;
