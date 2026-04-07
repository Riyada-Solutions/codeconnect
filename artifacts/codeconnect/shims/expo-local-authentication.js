/**
 * Fallback when `expo-local-authentication` is not installed (e.g. pnpm EPERM on Windows).
 * Metro resolves here only if the real package is missing; see metro.config.js.
 */
"use strict";

async function hasHardwareAsync() {
  return false;
}

async function isEnrolledAsync() {
  return false;
}

async function authenticateAsync() {
  return { success: false };
}

module.exports = {
  hasHardwareAsync,
  isEnrolledAsync,
  authenticateAsync,
};
