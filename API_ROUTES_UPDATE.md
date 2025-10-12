# API Routes Update Summary

## Updated Frontend APIs to Match Backend Router

The frontend API calls have been updated to match the Express.js backend router you provided. Here are the key changes:

### Admin Video Management APIs (`adminVideoAPI`)

#### Updated Endpoints:
1. **Upload Video**: 
   - OLD: `/admin/videos/courses/${courseId}/videos/upload`
   - NEW: `/admin/courses/${courseId}/videos/upload`

2. **Get Presigned URL**: 
   - OLD: `/admin/videos/courses/${courseId}/videos/presigned-url`
   - NEW: `/admin/courses/${courseId}/videos/presigned-url`

3. **Confirm Upload**: 
   - OLD: `/admin/videos/courses/${courseId}/videos/confirm-upload`
   - NEW: `/admin/courses/${courseId}/videos/confirm-upload`

4. **Get Course Videos**: 
   - OLD: `/admin/videos/courses/${courseId}/videos`
   - NEW: `/admin/courses/${courseId}/videos`

5. **Update Video**: 
   - OLD: `/admin/videos/videos/${videoId}`
   - NEW: `/admin/videos/${videoId}`

6. **Delete Video**: 
   - OLD: `/admin/videos/videos/${videoId}`
   - NEW: `/admin/videos/${videoId}`

7. **Reorder Videos**: 
   - OLD: `/admin/videos/courses/${courseId}/videos/reorder`
   - NEW: `/admin/courses/${courseId}/videos/reorder`

8. **Get Admin Video Stream**: 
   - OLD: `/admin/videos/videos/${videoId}/stream`
   - NEW: `/admin/videos/${videoId}/stream`

9. **Get Video Analytics**: 
   - OLD: `/admin/videos/videos/${videoId}/analytics`
   - NEW: `/admin/videos/${videoId}/analytics`

#### New Endpoints Added:
10. **Get Course Analytics**: 
    - NEW: `/admin/courses/${courseId}/analytics`

### Backend Router Structure
Your backend router should be mounted at `/admin` prefix, so the full URLs will be:
- `/admin/courses/:courseId/videos/upload`
- `/admin/courses/:courseId/videos/presigned-url`
- `/admin/courses/:courseId/videos/confirm-upload`
- `/admin/courses/:courseId/videos`
- `/admin/videos/:videoId`
- `/admin/videos/:videoId` (DELETE)
- `/admin/courses/:courseId/videos/reorder`
- `/admin/videos/:videoId/stream`
- `/admin/videos/:videoId/analytics`
- `/admin/courses/:courseId/analytics`

### Files Updated:
1. `src/apis/courses/videosCourses.js` - Main API file
2. `src/apis/mux/videoApi.js` - Mux video service
3. `API_ROUTES_UPDATE.md` - This documentation

### Backend Integration Required:
To complete the integration, you need to:

1. **Set up Express.js backend server** with your provided router
2. **Mount the router** at `/admin` prefix:
   ```javascript
   app.use('/admin', yourVideoRouter);
   ```
3. **Implement the required middleware**:
   - `authMiddleware` - Authentication
   - `adminMiddleware` - Admin role check
   - `courseOwnerOrAdminMiddleware` - Course ownership/admin check
   - `multipleUpload` - Multer file upload configuration

4. **Implement the controller methods**:
   - `courseVideoController.uploadVideo`
   - `courseVideoController.getPresignedUploadUrl`
   - `courseVideoController.confirmVideoUpload`
   - `courseVideoController.getCourseVideos`
   - `courseVideoController.updateVideo`
   - `courseVideoController.deleteVideo`
   - `courseVideoController.reorderVideos`
   - `courseVideoController.getVideoAnalytics`

5. **Set up required models and utilities**:
   - `CourseVideo` model
   - Video S3 utilities
   - Mux utilities
   - Database connection

### Environment Variables Needed:
```env
AWS_BUCKET_NAME=your-s3-bucket
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret
JWT_SECRET=your-jwt-secret
MONGODB_URI=your-mongodb-connection-string
```

The frontend is now properly configured to work with your backend router implementation!
