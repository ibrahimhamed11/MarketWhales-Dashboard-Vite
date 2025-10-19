import React from 'react';
import { Box, Text, Badge, Flex } from '@chakra-ui/react';
import { ENV_INFO } from '../../apis/config';

const EnvironmentIndicator = ({ showDetails = false }) => {
  const isLocal = ENV_INFO.apiUrl.includes('localhost');
  const colorScheme = isLocal ? 'green' : 'blue';
  const environmentName = isLocal ? 'LOCAL' : 'PRODUCTION';

  if (!ENV_INFO.isDevelopment && !showDetails) {
    return null; // Don't show in production builds unless explicitly requested
  }

  return (
    <Box position="fixed" top="4" right="4" zIndex="9999">
      <Flex align="center" gap={2}>
        <Badge colorScheme={colorScheme} variant="solid" fontSize="xs">
          {environmentName}
        </Badge>
        {showDetails && (
          <Text fontSize="xs" color="gray.500">
            {ENV_INFO.apiUrl}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default EnvironmentIndicator;
