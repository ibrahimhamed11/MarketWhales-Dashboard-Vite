/**
 * Text utility functions for handling Arabic text detection and font selection
 */

/**
 * Detects if text contains Arabic characters
 * @param {string} text - The text to check
 * @returns {boolean} - True if text contains Arabic characters
 */
export const hasArabic = (text) => {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicRegex.test(text);
};

/**
 * Returns appropriate font family based on text content
 * @param {string} text - The text to check
 * @returns {string} - Font family name
 */
export const getFontFamily = (text) => {
  return hasArabic(text) ? 'Droid' : 'inherit';
};
