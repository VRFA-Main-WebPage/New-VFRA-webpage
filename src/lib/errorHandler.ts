/**
 * Error Handler Utility
 * Maps technical error messages to user-friendly messages
 * to prevent information leakage about database structure
 */

export const mapErrorToUserMessage = (error: unknown, operation: string): string => {
  // Log full error for debugging (only in development)
  if (import.meta.env.DEV) {
    console.error('Detailed error:', error);
  }
  
  // Get error message string safely
  const errorString = (
    error instanceof Error ? error.message : 
    typeof error === 'object' && error !== null && 'message' in error ? 
      String((error as { message: unknown }).message) : 
      String(error)
  ).toLowerCase();
  
  // Map to safe user messages
  if (errorString.includes('row-level security') || errorString.includes('rls')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (errorString.includes('unique constraint') || errorString.includes('duplicate')) {
    return 'This record already exists.';
  }
  
  if (errorString.includes('foreign key')) {
    return 'Cannot complete operation due to related records.';
  }
  
  if (errorString.includes('not found') || errorString.includes('pgrst116')) {
    return `${operation} not found.`;
  }
  
  if (errorString.includes('invalid') && errorString.includes('credentials')) {
    return 'Invalid email or password.';
  }
  
  if (errorString.includes('email') && errorString.includes('confirm')) {
    return 'Please check your email for verification.';
  }
  
  if (errorString.includes('network') || errorString.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (errorString.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  // Generic fallback - don't expose technical details
  return `Failed to ${operation.toLowerCase()}. Please try again.`;
};

/**
 * Auth-specific error handler
 * For login/signup error messages that shouldn't reveal account existence
 */
export const mapAuthErrorToUserMessage = (error: unknown): string => {
  const errorString = (
    error instanceof Error ? error.message : 
    typeof error === 'object' && error !== null && 'message' in error ? 
      String((error as { message: unknown }).message) : 
      String(error)
  ).toLowerCase();
  
  // Always use generic message to prevent account enumeration
  if (
    errorString.includes('invalid') || 
    errorString.includes('credentials') ||
    errorString.includes('password') ||
    errorString.includes('user not found') ||
    errorString.includes('email')
  ) {
    return 'Invalid email or password.';
  }
  
  if (errorString.includes('rate limit') || errorString.includes('too many')) {
    return 'Too many attempts. Please try again later.';
  }
  
  if (errorString.includes('network') || errorString.includes('fetch')) {
    return 'Network error. Please check your connection.';
  }
  
  return 'Authentication failed. Please try again.';
};
