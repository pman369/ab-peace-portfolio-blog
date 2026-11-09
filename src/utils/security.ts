/**
 * Security & Access Control Module for AB Peace Authoring Studio
 * Implements salted SHA-256 cryptographic hashing, session token expiration,
 * and progressive brute-force rate limiting.
 */

const HASH_KEY = 'abpeace_auth_hash';
const SALT_KEY = 'abpeace_auth_salt';
const SESSION_KEY = 'abpeace_auth_session';
const RATE_LIMIT_KEY = 'abpeace_auth_rate_limit';

// Default initial master passkey for zero-friction setup
export const DEFAULT_MASTER_KEY = 'abpeace2026';

interface SessionData {
  token: string;
  expiresAt: number;
  rememberMe: boolean;
}

interface RateLimitData {
  failedAttempts: number;
  lockedUntil: number | null;
}

/**
 * Generate a cryptographically secure random hex string
 */
function generateRandomHex(length = 16): string {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash a string with salt using Web Cryptography SHA-256
 */
async function hashPassphrase(passphrase: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + passphrase + '::abpeace::studio_security_v1');
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if the master access key has been configured
 */
export function isSecurityInitialized(): boolean {
  if (typeof window === 'undefined') return true;
  return Boolean(localStorage.getItem(HASH_KEY) && localStorage.getItem(SALT_KEY));
}

/**
 * Initialize or seed the master key
 */
export async function initializeMasterKey(passphrase: string): Promise<boolean> {
  if (!passphrase || passphrase.length < 4) return false;
  const salt = generateRandomHex(16);
  const hash = await hashPassphrase(passphrase, salt);
  localStorage.setItem(SALT_KEY, salt);
  localStorage.setItem(HASH_KEY, hash);
  return true;
}

/**
 * Ensure security is seeded if completely empty (seeds with DEFAULT_MASTER_KEY)
 */
export async function ensureSecuritySeeded(): Promise<void> {
  if (!isSecurityInitialized()) {
    await initializeMasterKey(DEFAULT_MASTER_KEY);
  }
}

/**
 * Get current rate limit status
 */
export function getRateLimitStatus(): RateLimitData {
  if (typeof window === 'undefined') return { failedAttempts: 0, lockedUntil: null };
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { failedAttempts: 0, lockedUntil: null };
    const data: RateLimitData = JSON.parse(raw);
    if (data.lockedUntil && Date.now() > data.lockedUntil) {
      // Cooldown expired
      return { failedAttempts: 0, lockedUntil: null };
    }
    return data;
  } catch {
    return { failedAttempts: 0, lockedUntil: null };
  }
}

/**
 * Calculate remaining seconds of lockout
 */
export function getLockoutRemainingSeconds(): number {
  const status = getRateLimitStatus();
  if (!status.lockedUntil) return 0;
  const remainingMs = status.lockedUntil - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

/**
 * Record a failed access attempt and apply progressive lockout backoff
 */
function recordFailedAttempt(): { lockedUntil: number | null; attempts: number } {
  const status = getRateLimitStatus();
  const newAttempts = status.failedAttempts + 1;
  let lockedUntil: number | null = null;

  if (newAttempts >= 5) {
    // 5 minutes lockout after 5 consecutive failures
    lockedUntil = Date.now() + 5 * 60 * 1000;
  } else if (newAttempts >= 3) {
    // 30 seconds cooldown after 3 consecutive failures
    lockedUntil = Date.now() + 30 * 1000;
  }

  const updated: RateLimitData = { failedAttempts: newAttempts, lockedUntil };
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota fail
  }

  return { lockedUntil, attempts: newAttempts };
}

/**
 * Clear failed attempts upon successful verification
 */
function clearRateLimit(): void {
  try {
    localStorage.removeItem(RATE_LIMIT_KEY);
  } catch {
    // Silent fail
  }
}

/**
 * Verify master passphrase and grant a signed session
 */
export async function verifyMasterKey(
  passphrase: string,
  rememberMe = false
): Promise<{ success: boolean; error?: string; lockedUntil?: number; attemptsRemaining?: number }> {
  // Check lockout
  const lockoutSec = getLockoutRemainingSeconds();
  if (lockoutSec > 0) {
    return {
      success: false,
      error: `Security cooldown active. Please wait ${lockoutSec} seconds before retrying.`,
      lockedUntil: Date.now() + lockoutSec * 1000,
    };
  }

  // Ensure initialized
  await ensureSecuritySeeded();

  const salt = localStorage.getItem(SALT_KEY);
  const storedHash = localStorage.getItem(HASH_KEY);

  if (!salt || !storedHash) {
    return { success: false, error: 'Security database not initialized.' };
  }

  const computedHash = await hashPassphrase(passphrase, salt);

  if (computedHash === storedHash) {
    clearRateLimit();

    // Create session (4 hours standard, 7 days if rememberMe)
    const duration = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000;
    const session: SessionData = {
      token: generateRandomHex(24),
      expiresAt: Date.now() + duration,
      rememberMe,
    };

    const sessionStr = JSON.stringify(session);
    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, sessionStr);
    } else {
      sessionStorage.setItem(SESSION_KEY, sessionStr);
    }

    return { success: true };
  }

  // Failed attempt
  const { lockedUntil, attempts } = recordFailedAttempt();
  const attemptsRemaining = Math.max(0, 3 - attempts);

  let errorMsg = 'Invalid master passphrase.';
  if (lockedUntil) {
    const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
    errorMsg = `Excessive failed attempts. Security cooldown active for ${secs}s.`;
  } else if (attemptsRemaining > 0) {
    errorMsg = `Invalid passphrase. ${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining before temporary lockout.`;
  }

  return {
    success: false,
    error: errorMsg,
    lockedUntil: lockedUntil || undefined,
    attemptsRemaining,
  };
}

/**
 * Check if the active session is valid
 */
export function isStudioAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // Check sessionStorage first, then localStorage
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (!raw) return false;

    const session: SessionData = JSON.parse(raw);
    if (!session || !session.expiresAt || !session.token) return false;

    if (Date.now() > session.expiresAt) {
      lockStudio();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Revoke session and lock Studio
 */
export function lockStudio(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event('abpeace_studio_locked'));
  } catch {
    // Silent fail
  }
}

/**
 * Change the master passphrase
 */
export async function changeMasterKey(
  currentPassphrase: string,
  newPassphrase: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPassphrase || newPassphrase.length < 6) {
    return { success: false, error: 'New passphrase must be at least 6 characters.' };
  }

  const verify = await verifyMasterKey(currentPassphrase);
  if (!verify.success) {
    return { success: false, error: 'Current master passphrase is incorrect.' };
  }

  await initializeMasterKey(newPassphrase);
  return { success: true };
}
