export async function authenticateAsync() {
  return { success: true };
}
export async function hasHardwareAsync() {
  return false;
}
export async function isEnrolledAsync() {
  return false;
}
export async function supportedAuthenticationTypesAsync() {
  return [];
}
export const AuthenticationType = {
  FINGERPRINT: 1,
  FACIAL_RECOGNITION: 2,
  IRIS: 3,
};
