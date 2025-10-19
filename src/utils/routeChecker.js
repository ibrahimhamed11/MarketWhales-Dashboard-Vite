/**
 * Backend Route Checker
 * This file tests which routes are actually available on the backend
 */

import { API_URL } from '../apis/config';

// Use centralized BASE_URL from config
const BASE_URL = API_URL;

// Test routes to check what's available
const testRoutes = [
  '/admin/videos',
  '/admin/videos/courses/test/videos', 
  '/admin/videos/courses/test',
  '/admin/videos/test',
  '/admin/videos/system/status',
  '/admin/videos/mux-status',
  '/courses',
  '/api/videos/courses/test'
];

async function checkRoute(route) {
  try {
    const response = await fetch(`${BASE_URL}${route}`, { method: 'HEAD' });
    return {
      route,
      status: response.status,
      available: response.status !== 404
    };
  } catch (error) {
    return {
      route,
      status: 'ERROR',
      available: false,
      error: error.message
    };
  }
}

async function checkAllRoutes() {
  console.log('🔍 Checking backend routes...');
  
  const results = [];
  for (const route of testRoutes) {
    const result = await checkRoute(route);
    results.push(result);
    console.log(`${result.available ? '✅' : '❌'} ${route} (${result.status})`);
  }
  
  console.log('\n📊 Summary:');
  console.log('Available routes:', results.filter(r => r.available).length);
  console.log('Unavailable routes:', results.filter(r => !r.available).length);
  
  return results;
}

// Run if in browser console
if (typeof window !== 'undefined') {
  window.checkBackendRoutes = checkAllRoutes;
  console.log('Run checkBackendRoutes() in console to test backend routes');
}

export { checkAllRoutes, checkRoute };
