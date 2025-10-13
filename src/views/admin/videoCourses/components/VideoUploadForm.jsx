import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Box,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
  Switch,
  Alert,
  AlertIcon,
  Progress,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Divider,
  Icon,
  Badge,
  Container
} from '@chakra-ui/react';
import { MdUpload, MdVideoFile, MdCheckCircle, MdArrowBack } from 'react-icons/md';
import Card from '../../../../components/card/Card';
import { adminVideoAPI } from '../../../../apis/courses/videosCourses';

const VideoUploadForm = () => {
  const history = useHistory();
  const { courseId } = useParams();  // Get courseId from URL params instead of search params

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1,
    isActive: true
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  // Utility functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateVideoFile = (file) => {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const maxSize = 500 * 1024 * 1024; // 500MB
    
    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please select a valid video file (MP4, WebM, OGG, MOV)'
      };
    }
    
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 500MB'
      };
    }
    
    return { isValid: true, error: null };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setSelectedFile(file);
    setError(''); // Clear any previous errors
  };

  const handleFileUpload = async (event) => {
    handleFileSelect(event);
  };

  const handleUpload = async () => {
    // Validate all required fields
    const errors = [];
    if (!formData.title.trim()) errors.push('Video title is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!selectedFile) errors.push('Video file is required');
    
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadProgress(0);

      // Regular upload without Mux
      const uploadData = new FormData();
      uploadData.append('video', selectedFile);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('order', formData.order.toString());
      uploadData.append('isActive', formData.isActive.toString());

      const result = await adminVideoAPI.uploadVideo(
        courseId,
        uploadData,
        (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          } else {
            setUploadProgress(50);
          }
        }
      );

      setUploadComplete(true);

      // Navigate back to video courses management after 2 seconds
      setTimeout(() => {
        history.push('/admin/video-courses');
      }, 2000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed. Please try again.';
      setError(errorMessage);
      
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
      order: 1,
      isActive: true
    });
    setError('');
    setUploadComplete(false);
    setUploadProgress(0);
  };

  const handleGoBack = () => {
    history.push('/admin/video-courses');
  };

  const handleGoToDashboard = () => {
    history.push('/admin/video-courses');
  };

  if (!courseId) {
    return (
      <Container maxWidth="xl" centerContent pt={{ xs: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
        <Card p="20px">
          <VStack spacing="20px" align="center" py="40px">
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              No course selected. Please select a course first.
            </Alert>
            <Button onClick={handleGoBack} leftIcon={<Icon as={MdArrowBack} />}>
              Back to Courses
            </Button>
          </VStack>
        </Card>
      </Container>
    );
  }

  if (uploadComplete) {
    return (
      <Container maxWidth="xl" centerContent pt={{ xs: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
        <Card p="20px">
          <VStack spacing="20px" align="center" py="40px">
            <Icon as={MdCheckCircle} w="80px" h="80px" color="green.500" />
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              Upload Complete!
            </Text>
            <Text color="secondaryGray.600" textAlign="center">
              Your video "{formData.title}" has been uploaded successfully.
            </Text>
            <HStack spacing="20px">
              <Button 
                colorScheme="blue" 
                onClick={handleReset}
                leftIcon={<Icon as={MdUpload} />}
              >
                Upload Another Video
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGoToDashboard}
                leftIcon={<Icon as={MdArrowBack} />}
              >
                Back to Courses
              </Button>
            </HStack>
          </VStack>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" pt={{ xs: "130px", md: "80px", xl: "80px" }} px={{ xs: 1, sm: 1 }}>
      <Card p="20px">
        <VStack spacing="20px" align="stretch">
          {/* Header with Back Button */}
          <HStack justify="space-between">
            <HStack spacing="10px">
              <Icon as={MdVideoFile} w="24px" h="24px" color={brandColor} />
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Upload Video
              </Text>
            </HStack>
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              leftIcon={<Icon as={MdArrowBack} />}
              size="sm"
            >
              Back to Courses
            </Button>
          </HStack>

          <Divider />

          {/* Error Alert */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* File Upload Section */}
          <Card p="20px" bg="gray.50">
            <VStack spacing="15px">
              <Icon as={MdUpload} w="40px" h="40px" color={brandColor} />
              <Text fontWeight="bold" color={textColor}>
                Select Video File
              </Text>
              
              <Input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                size="lg"
                p="10px"
                disabled={uploading}
              />
              
              {selectedFile && (
                <Box w="100%" p="15px" bg="white" borderRadius="md" border="1px solid" borderColor="gray.200">
                  <HStack justify="space-between">
                    <VStack align="start" spacing="2px">
                      <Text fontSize="sm" fontWeight="bold" color={textColor}>
                        {selectedFile.name}
                      </Text>
                      <Text fontSize="xs" color="secondaryGray.600">
                        {formatFileSize(selectedFile.size)}
                      </Text>
                    </VStack>
                    <Badge colorScheme="green">Selected</Badge>
                  </HStack>
                </Box>
              )}
              
              <Text fontSize="xs" color="secondaryGray.600" textAlign="center">
                Supported formats: MP4, WebM, OGG, MOV • Max size: 500MB
              </Text>
            </VStack>
          </Card>

          {/* Video Details Form */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
            <FormControl isRequired>
              <FormLabel color={textColor}>Video Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter video title"
                disabled={uploading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color={textColor}>Display Order</FormLabel>
              <Input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="1"
                disabled={uploading}
              />
            </FormControl>
          </SimpleGrid>

          <FormControl isRequired>
            <FormLabel color={textColor}>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter video description"
              rows="4"
              disabled={uploading}
            />
          </FormControl>

          <FormControl>
            <HStack justify="space-between">
              <FormLabel color={textColor} mb="0">
                Publish Immediately
              </FormLabel>
              <Switch
                name="isActive"
                isChecked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                colorScheme="blue"
                disabled={uploading}
              />
            </HStack>
            <Text fontSize="xs" color="secondaryGray.600" mt="5px">
              When enabled, video will be immediately available to students
            </Text>
          </FormControl>

          {/* Upload Progress */}
          {uploading && (
            <Box>
              <HStack justify="space-between" mb="10px">
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  Uploading... {uploadProgress}%
                </Text>
                <Text fontSize="sm" color="secondaryGray.600">
                  {selectedFile ? formatFileSize((selectedFile.size * uploadProgress) / 100) : '0'} / {selectedFile ? formatFileSize(selectedFile.size) : '0'}
                </Text>
              </HStack>
              <Progress 
                value={uploadProgress} 
                colorScheme="blue" 
                size="lg" 
                borderRadius="md"
              />
            </Box>
          )}

          {/* Action Buttons */}
          <Divider />
          <HStack justify="end" spacing="15px">
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              disabled={uploading}
              leftIcon={<Icon as={MdArrowBack} />}
            >
              Back to Courses
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpload}
              isLoading={uploading}
              loadingText="Uploading..."
              leftIcon={<Icon as={MdUpload} />}
              disabled={uploading}
            >
              Upload Video
            </Button>
          </HStack>
        </VStack>
      </Card>
    </Container>
  );
};

export default VideoUploadForm;
