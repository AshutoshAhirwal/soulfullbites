// ─────────────────────────────────────────────────────────────────────────────
// SoulfullBites — Input Validation Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validates an email address.
 * - Must be a string
 * - Max 254 characters (RFC 5321)
 * - Must match a basic email pattern
 */
export function validateEmail(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Validates and trims a text field with a max length.
 * Returns { valid: boolean, value: string }
 */
export function validateText(value, max = 500) {
  if (typeof value !== 'string') return { valid: false, value: '' };
  const trimmed = value.trim();
  if (trimmed.length > max) return { valid: false, value: trimmed };
  return { valid: true, value: trimmed };
}

/**
 * Validates a password for minimum strength:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number or symbol
 *
 * Returns an error message string, or null if valid.
 */
export function validatePassword(value) {
  if (typeof value !== 'string') return 'Password must be a string.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
  if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    return 'Password must contain at least one number or symbol.';
  }
  return null; // valid
}

/**
 * Validates a star rating (integer between 1 and 5).
 */
export function validateRating(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= 5;
}

/**
 * Validates a phone number string.
 * - Optional field — empty string is allowed
 * - Max 20 characters
 * - Must only contain digits, spaces, +, -, (, )
 */
export function validatePhone(value) {
  if (!value || value.trim() === '') return true; // optional
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (trimmed.length > 20) return false;
  return /^[\d\s+\-().]+$/.test(trimmed);
}
