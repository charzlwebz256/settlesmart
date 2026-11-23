import { base44 } from '@/api/base44Client';

// The signed-in user, or null for a visitor browsing without an account.
// Any other error is a real failure and is left to bubble up.
export async function currentUser() {
  try {
    return await base44.auth.me();
  } catch (error) {
    if (error?.status === 401 || error?.status === 403) return null;
    throw error;
  }
}