import React from 'react';
import {
  Box,
  Alert,
  AlertIcon,
  Text,
  Button,
  VStack,
  useColorModeValue
} from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={6} maxW="600px" mx="auto" mt={10}>
          <Alert status="error" borderRadius="md" p={6}>
            <AlertIcon />
            <VStack align="start" spacing={3} flex={1}>
              <Text fontWeight="bold" fontSize="lg">
                Something went wrong
              </Text>
              <Text>
                {this.props.fallbackMessage || 'An error occurred while rendering this component.'}
              </Text>
              {import.meta.env.DEV && this.state.error && (
                <Box mt={4} p={4} bg="gray.100" borderRadius="md" fontSize="sm" fontFamily="mono">
                  <Text fontWeight="bold" mb={2}>Error Details:</Text>
                  <Text>{this.state.error.toString()}</Text>
                  {this.state.errorInfo && (
                    <Box mt={2}>
                      <Text fontWeight="bold">Stack Trace:</Text>
                      <Text whiteSpace="pre-wrap">{this.state.errorInfo.componentStack}</Text>
                    </Box>
                  )}
                </Box>
              )}
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                }}
              >
                Try Again
              </Button>
            </VStack>
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

// HOC to wrap components with error boundary
export const withErrorBoundary = (Component, fallbackMessage) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallbackMessage={fallbackMessage}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Hook for error handling
export const useErrorHandler = () => {
  const handleError = (error, errorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo);
  };

  return handleError;
};

export default ErrorBoundary;
