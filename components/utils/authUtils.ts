// Authentication utility functions
import AuthService from '@/components/service/AuthService';

/**
 * Check if user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  return AuthService.isAuthenticated();
};

/**
 * Get current user
 * @returns User object or null
 */
export const getCurrentUser = () => {
  return AuthService.getCurrentUser();
};

/**
 * Get authentication token
 * @returns string or null
 */
export const getAuthToken = (): string | null => {
  return AuthService.getToken();
};

/**
 * Logout user
 * @returns Promise
 */
export const logout = async (): Promise<void> => {
  await AuthService.logout();
};

/**
 * Check if route requires authentication
 * @param path Current path
 * @returns boolean
 */
export const isProtectedRoute = (path: string): boolean => {
  const protectedRoutes = [
    '/account',
    '/orders',
    '/wishlist',
    '/cart',
    '/checkout',
  ];
  
  return protectedRoutes.some(route => path.startsWith(route));
};

/**
 * Redirect to login if not authenticated
 * @param path Current path
 * @returns boolean - true if redirected, false otherwise
 */
export const redirectIfNotAuthenticated = (path: string): boolean => {
  if (isProtectedRoute(path) && !isAuthenticated()) {
    // Store the current path to redirect back after login
    localStorage.setItem('redirectAfterLogin', path);
    
    // Redirect to login page
    window.location.href = '/';
    return true;
  }
  
  return false;
};

/**
 * Get redirect path after login
 * @returns string or null
 */
export const getRedirectPath = (): string | null => {
  const path = localStorage.getItem('redirectAfterLogin');
  localStorage.removeItem('redirectAfterLogin');
  return path;
}; 