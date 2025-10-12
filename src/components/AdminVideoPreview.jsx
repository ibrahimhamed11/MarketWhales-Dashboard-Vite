import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
  IconButton,
  useColorModeValue
} from '@chakra-ui/react';
import { MdClose, MdRefresh } from 'react-icons/md';
import { videoService } from '../../apis/mux/videoApi';
import Card from '../card/Card';
import MuxPlayer from './MuxPlayer';

const AdminVideoPreview = ({ videoId, onClose }) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgColor = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card bg={bgColor} border="1px solid" borderColor={borderColor} minW="600px" maxW="90vw">
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <HStack w="100%" justify="space-between" pb={4} borderBottom="1px solid" borderColor={borderColor}>
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            Video Preview
          </Text>
          <IconButton
            icon={<MdClose />}
            onClick={onClose}
            variant="ghost"
            size="sm"
            aria-label="Close preview"
          />
        </HStack>
        
        {/* Video Player */}
        <Box position="relative" w="100%" maxW="800px" mx="auto">
          <MuxPlayer
            videoId={videoId}
            onError={(e) => console.error('Admin Preview Error:', e)}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16/9',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          />
        </Box>
      </VStack>
    </Card>
  );
};

export default AdminVideoPreview;
