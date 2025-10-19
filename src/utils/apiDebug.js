import { ENV_INFO, API_URL } from '../apis/config';

/**
 * Debug utility for API configuration
 * Logs environment information in development mode
 */
export const debugApiConfig = () => {
  if (ENV_INFO.isDevelopment || import.meta.env.VITE_DEBUG_API === 'true') {
    console.group('🔧 API Configuration Debug');
    console.log('Environment Mode:', ENV_INFO.mode);
    console.log('Is Development:', ENV_INFO.isDevelopment);
    console.log('Is Production:', ENV_INFO.isProduction);
    console.log('API Base URL:', API_URL);
    console.log('Manual Override:', ENV_INFO.manualOverride);
    console.log('Full ENV_INFO:', ENV_INFO);
    console.groupEnd();
  }
};

/**
 * Test API connectivity
 */
export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection to:', API_URL);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 5 second timeout
    
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('✅ API connection successful');
      return { success: true, status: response.status };
    } else {
      console.warn('⚠️ API responded with error:', response.status);
      return { success: false, status: response.status, error: 'HTTP Error' };
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('⏰ API connection timeout');
      return { success: false, error: 'Timeout' };
    } else {
      console.error('❌ API connection failed:', error.message);
      return { success: false, error: error.message };
    }
  }
};

// Auto-run debug in development
if (ENV_INFO.isDevelopment) {
  debugApiConfig();
}
