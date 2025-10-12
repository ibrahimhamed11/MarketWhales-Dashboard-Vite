import React, { useState, useCallback } from 'react';
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
  useToast
} from '@chakra-ui/react';
import { MdUpload, MdVideoFile, MdCheckCircle, MdArrowBack } from 'react-icons/md';
import Card from '../card/Card';
import { videoService } from '../../apis/mux/videoApi';

const MuxVideoUpload = () => {
  const history = useHistory();
  const { courseId } = useParams();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (uploadUrl, file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.send(file);
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!formData.title) {
      setError('Please enter a video title');
      return;
    }

    try {
      setUploading(true);
      setUploadStatus('Creating upload URL...');
      setUploadProgress(0);
      setError('');

      // Step 1: Create direct upload URL
      const uploadResponse = await videoService.createDirectUpload(courseId, formData);
      const { uploadUrl, videoId } = uploadResponse;

      setUploadStatus('Uploading video...');

      // Step 2: Upload file to Mux
      await uploadFile(uploadUrl, file);

      setUploadStatus('Processing video...');

      // Step 3: Poll for upload completion
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes (5 second intervals)

      const pollStatus = async () => {
        try {
          const statusResponse = await videoService.checkUploadStatus(videoId);
          const { video, asset } = statusResponse;

          if (asset && asset.status === 'ready') {
            setUploadStatus('Video ready!');
            setUploadProgress(100);
            setUploadComplete(true);
            
            toast({
              title: 'Upload Successful',
              description: `Video "${formData.title}" has been uploaded successfully!`,
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
            
            // Reset form
            setFormData({ title: '', description: '', order: 1 });
            event.target.value = '';
            
            setTimeout(() => {
              setUploading(false);
              setUploadStatus('');
              setUploadProgress(0);
            }, 2000);
            
          } else if (asset && asset.status === 'errored') {
            throw new Error('Video processing failed');
          } else {
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(pollStatus, 5000); // Check every 5 seconds
              setUploadStatus(`Processing video... (${attempts}/${maxAttempts})`);
            } else {
              throw new Error('Video processing timeout');
            }
          }
        } catch (error) {
          console.error('Status check error:', error);
          throw error;
        }
      };

      // Start polling
      setTimeout(pollStatus, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`Upload failed: ${error.message}`);
      setError(error.message);
      setUploading(false);
      
      toast({
        title: 'Upload Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setTimeout(() => {
        setUploadStatus('');
        setUploadProgress(0);
      }, 5000);
    }
  };

  const handleGoBack = () => {
    history.push('/admin/video-courses');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFormData({
      title: '',
      description: '',
      order: 1
    });
    setError('');
    setUploadComplete(false);
    setUploadProgress(0);
    setUploadStatus('');
  };

  if (!courseId) {
    return (
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
    );
  }

  if (uploadComplete) {
    return (
      <Card p="20px">
        <VStack spacing="20px" align="center" py="40px">
          <Icon as={MdCheckCircle} w="80px" h="80px" color="green.500" />
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            Upload Complete!
          </Text>
          <Text color="secondaryGray.600" textAlign="center">
            Your video "{formData.title}" has been uploaded successfully and is being processed by Mux.
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
              onClick={handleGoBack}
              leftIcon={<Icon as={MdArrowBack} />}
            >
              Back to Courses
            </Button>
          </HStack>
        </VStack>
      </Card>
    );
  }

  return (
    <Card p="20px">
      <VStack spacing="20px" align="stretch">
        {/* Header with Back Button */}
        <HStack justify="space-between">
          <HStack spacing="10px">
            <Icon as={MdVideoFile} w="24px" h="24px" color={brandColor} />
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Upload Video (Mux Integration)
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
              Select Video File for Mux Upload
            </Text>
            
            <Input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
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
              Supported formats: MP4, WebM, OGG, MOV • Files will be processed by Mux for optimal streaming
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

          <FormControl>
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

        <FormControl>
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

        {/* Upload Progress */}
        {uploading && (
          <Box>
            <HStack justify="space-between" mb="10px">
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                {uploadStatus}
              </Text>
              <Text fontSize="sm" color="secondaryGray.600">
                {uploadProgress}%
              </Text>
            </HStack>
            <Progress 
              value={uploadProgress} 
              colorScheme="blue" 
              size="lg" 
              borderRadius="md"
            />
            <Text fontSize="xs" color="secondaryGray.600" mt="5px">
              Please do not close this window while uploading...
            </Text>
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
          <Text fontSize="sm" color={textColor} fontWeight="bold">
            Ready to upload? Select a file above to begin.
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
};

export default MuxVideoUpload;
