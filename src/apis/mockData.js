// Mock data for development when API endpoints are not available
export const mockCourses = [
  {
    _id: '1',
    id: '1',
    name: 'Introduction to Trading',
    description: 'Learn the basics of trading with this comprehensive course.',
    type: 'Free',
    price: 0,
    courseType: 'Trading',
    thumbnail: '/assets/img/course-default.svg',
    duration: '4 hours',
    level: 'Beginner',
    instructor: 'John Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    videos: [
      {
        _id: 'v1',
        title: 'Course Introduction',
        description: 'Welcome to the trading course',
        duration: 600,
        order: 1,
        playbackId: 'sample-playback-id-1',
        thumbnailUrl: '/assets/img/video-default.svg'
      },
      {
        _id: 'v2',
        title: 'Market Basics',
        description: 'Understanding market fundamentals',
        duration: 900,
        order: 2,
        playbackId: 'sample-playback-id-2',
        thumbnailUrl: '/assets/img/video-default.svg'
      }
    ]
  },
  {
    _id: '2',
    id: '2',
    name: 'Advanced Trading Strategies',
    description: 'Master advanced trading techniques and strategies.',
    type: 'Paid',
    price: 99.99,
    courseType: 'Trading',
    thumbnail: '/assets/img/course-default.svg',
    duration: '8 hours',
    level: 'Advanced',
    instructor: 'Jane Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    videos: [
      {
        _id: 'v3',
        title: 'Advanced Chart Analysis',
        description: 'Deep dive into technical analysis',
        duration: 1200,
        order: 1,
        playbackId: 'sample-playback-id-3',
        thumbnailUrl: '/assets/img/video-default.svg'
      },
      {
        _id: 'v4',
        title: 'Risk Management',
        description: 'Managing risk in trading',
        duration: 1800,
        order: 2,
        playbackId: 'sample-playback-id-4',
        thumbnailUrl: '/assets/img/video-default.svg'
      }
    ]
  },
  {
    _id: '3',
    id: '3',
    name: 'Cryptocurrency Trading',
    description: 'Learn how to trade cryptocurrencies effectively.',
    type: 'Paid',
    price: 149.99,
    courseType: 'Crypto',
    thumbnail: '/assets/img/course-default.svg',
    duration: '6 hours',
    level: 'Intermediate',
    instructor: 'Mike Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    videos: [
      {
        _id: 'v5',
        title: 'Crypto Market Overview',
        description: 'Understanding cryptocurrency markets',
        duration: 1000,
        order: 1,
        playbackId: 'sample-playback-id-5',
        thumbnailUrl: '/assets/img/video-default.svg'
      }
    ]
  }
];

export const mockVideos = [
  {
    _id: 'v1',
    title: 'Course Introduction',
    description: 'Welcome to the trading course',
    duration: 600,
    order: 1,
    courseId: '1',
    playbackId: 'sample-playback-id-1',
    thumbnailUrl: '/assets/img/video-default.svg',
    uploadStatus: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'v2',
    title: 'Market Basics',
    description: 'Understanding market fundamentals',
    duration: 900,
    order: 2,
    courseId: '1',
    playbackId: 'sample-playback-id-2',
    thumbnailUrl: '/assets/img/video-default.svg',
    uploadStatus: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'v3',
    title: 'Advanced Chart Analysis',
    description: 'Deep dive into technical analysis',
    duration: 1200,
    order: 1,
    courseId: '2',
    playbackId: 'sample-playback-id-3',
    thumbnailUrl: '/assets/img/video-default.svg',
    uploadStatus: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'v4',
    title: 'Risk Management',
    description: 'Managing risk in trading',
    duration: 1800,
    order: 2,
    courseId: '2',
    playbackId: 'sample-playback-id-4',
    thumbnailUrl: '/assets/img/video-default.svg',
    uploadStatus: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'v5',
    title: 'Crypto Market Overview',
    description: 'Understanding cryptocurrency markets',
    duration: 1000,
    order: 1,
    courseId: '3',
    playbackId: 'sample-playback-id-5',
    thumbnailUrl: '/assets/img/video-default.svg',
    uploadStatus: 'ready',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Utility function to simulate API delay
export const simulateDelay = (ms = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Mock API responses
export const mockApiResponses = {
  courses: {
    success: true,
    data: mockCourses,
    message: 'Courses retrieved successfully'
  },
  videos: {
    success: true,
    data: mockVideos,
    message: 'Videos retrieved successfully'
  },
  createCourse: {
    success: true,
    message: 'Course created successfully'
  },
  updateCourse: {
    success: true,
    message: 'Course updated successfully'
  },
  deleteCourse: {
    success: true,
    message: 'Course deleted successfully'
  },
  uploadVideo: {
    success: true,
    data: {
      uploadUrl: 'https://storage.googleapis.com/mux-uploads/fake-upload-url',
      videoId: 'mock-video-id-' + Date.now()
    },
    message: 'Upload URL generated successfully'
  },
  videoStatus: {
    success: true,
    data: {
      status: 'ready',
      playbackId: 'mock-playback-id-' + Date.now(),
      thumbnailUrl: '/assets/img/video-default.svg'
    },
    message: 'Video processing completed'
  }
};

export default {
  mockCourses,
  mockVideos,
  simulateDelay,
  mockApiResponses
};
