/**
 * Legacy MUX Video API - redirects to new unified service
 * @deprecated Use ../videoCoursesService.js instead
 */

import { muxAPI, adminVideoAPI, userVideoAPI } from '../videoCoursesService';

// Legacy service redirecting to new unified service
export const videoService = {
  // Admin: Upload video by URL (for migration)
  uploadByUrl: muxAPI.uploadByUrl,

  // Admin: Check upload status
  checkUploadStatus: muxAPI.checkUploadStatus,

  // Admin: Get course videos
  getCourseVideos: muxAPI.getCourseVideos,

  // Admin: Update video details
  updateVideo: muxAPI.updateVideo,

  // Admin: Delete video
  deleteVideo: muxAPI.deleteVideo,

  // Admin: Reorder videos
  reorderVideos: muxAPI.reorderVideos,

  // User: Get course videos (public)
  getUserCourseVideos: userVideoAPI.getCourseVideos,

  // User: Get video details
  getVideoDetails: userVideoAPI.getVideoDetails,

  // User: Get video stream URL
  getVideoStreamUrl: async (videoId, deviceFingerprint, watchTime = 0) => {
    try {
      const result = await userVideoAPI.getVideoStreamUrl(videoId, deviceFingerprint, watchTime);
      
      // Validate the stream URL before returning it
      if (result && result.streamUrl) {
        try {
          new URL(result.streamUrl);
          return result;
        } catch (urlError) {
          console.error('Invalid stream URL received:', result.streamUrl);
          throw new Error('Invalid video stream URL received from server');
        }
      } else {
        throw new Error('No stream URL received from server');
      }
    } catch (error) {
      console.error('Error getting video stream URL:', error);
      throw error;
    }
  },

  // Get Mux service status
  getMuxStatus: muxAPI.getStatus,

  // Migration functions
  migrateToMux: muxAPI.migrateToMux,
  migrateAllToMux: muxAPI.migrateAllToMux,

  // Admin: Get video stream URL for preview
  getAdminVideoStream: async (videoId) => {
    try {
      const result = await adminVideoAPI.getVideoStream(videoId);
      
      // Validate the stream URL before returning it
      if (result && result.streamUrl) {
        try {
          new URL(result.streamUrl);
          return result;
        } catch (urlError) {
          console.error('Invalid admin stream URL received:', result.streamUrl);
          throw new Error('Invalid video stream URL received from server');
        }
      } else {
        throw new Error('No stream URL received from server');
      }
    } catch (error) {
      console.error('Error getting admin video stream:', error);
      throw error;
    }
  },

  // Admin: Test video stream connectivity
  testVideoStream: async (streamUrl) => {
    try {
      const response = await fetch(streamUrl, {
        method: 'HEAD',
        headers: {
          'Range': 'bytes=0-1'
        }
      });
      return {
        success: response.ok,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default videoService;
