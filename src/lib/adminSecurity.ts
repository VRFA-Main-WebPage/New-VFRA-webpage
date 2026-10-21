// Forensic Admin 2FA Security Management
// Provides second-factor PIN verification on top of OAuth 2.0 and credentials login.

const STORAGE_PREFIX = "vfra_2fa_auth_";
const ATTEMPTS_PREFIX = "vfra_2fa_attempts_";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// Default Admin 2FA PIN (can be overridden via VITE_ADMIN_2FA_PIN in .env or Railway)
const CONFIGURED_PIN = import.meta.env.VITE_ADMIN_2FA_PIN || "983433";

export interface SecurityStatus {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutRemainingMs: number;
}

export function getSecurityStatus(userId: string): SecurityStatus {
  try {
    const rawAttempts = sessionStorage.getItem(ATTEMPTS_PREFIX + userId);
    if (!rawAttempts) {
      return { isLocked: false, remainingAttempts: MAX_ATTEMPTS, lockoutRemainingMs: 0 };
    }

    const { count, lockUntil } = JSON.parse(rawAttempts);
    const now = Date.now();

    if (lockUntil && now < lockUntil) {
      return {
        isLocked: true,
        remainingAttempts: 0,
        lockoutRemainingMs: lockUntil - now,
      };
    }

    // Lockout expired, reset
    if (lockUntil && now >= lockUntil) {
      sessionStorage.removeItem(ATTEMPTS_PREFIX + userId);
      return { isLocked: false, remainingAttempts: MAX_ATTEMPTS, lockoutRemainingMs: 0 };
    }

    return {
      isLocked: false,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - (count || 0)),
      lockoutRemainingMs: 0,
    };
  } catch {
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS, lockoutRemainingMs: 0 };
  }
}

export function recordFailedAttempt(userId: string): SecurityStatus {
  try {
    const current = getSecurityStatus(userId);
    const count = MAX_ATTEMPTS - current.remainingAttempts + 1;

    if (count >= MAX_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
      sessionStorage.setItem(
        ATTEMPTS_PREFIX + userId,
        JSON.stringify({ count, lockUntil })
      );
      return { isLocked: true, remainingAttempts: 0, lockoutRemainingMs: LOCKOUT_MINUTES * 60 * 1000 };
    }

    sessionStorage.setItem(
      ATTEMPTS_PREFIX + userId,
      JSON.stringify({ count, lockUntil: null })
    );
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS - count, lockoutRemainingMs: 0 };
  } catch {
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS - 1, lockoutRemainingMs: 0 };
  }
}

export function verifyAdminSecurityPin(userId: string, inputPin: string): boolean {
  const status = getSecurityStatus(userId);
  if (status.isLocked) {
    return false;
  }

  const cleanInput = inputPin.trim();
  const isValid = cleanInput === CONFIGURED_PIN;

  if (isValid) {
    // Reset failed attempts on success
    sessionStorage.removeItem(ATTEMPTS_PREFIX + userId);
    // Mark session as 2FA verified for this user
    set2FASessionVerified(userId);
    return true;
  } else {
    recordFailedAttempt(userId);
    return false;
  }
}

export function set2FASessionVerified(userId: string): void {
  try {
    const payload = {
      verified: true,
      timestamp: Date.now(),
      userId,
    };
    sessionStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(payload));
  } catch (e) {
    console.error("Could not persist 2FA session verification:", e);
  }
}

export function is2FASessionVerified(userId: string): boolean {
  try {
    const data = sessionStorage.getItem(STORAGE_PREFIX + userId);
    if (!data) return false;
    const parsed = JSON.parse(data);
    return parsed.verified === true && parsed.userId === userId;
  } catch {
    return false;
  }
}

export function clear2FASession(userId?: string): void {
  try {
    if (userId) {
      sessionStorage.removeItem(STORAGE_PREFIX + userId);
      sessionStorage.removeItem(ATTEMPTS_PREFIX + userId);
    } else {
      // Clear all 2FA keys
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith(STORAGE_PREFIX) || key.startsWith(ATTEMPTS_PREFIX))) {
          sessionStorage.removeItem(key);
        }
      }
    }
  } catch {
    // ignore
  }
}
