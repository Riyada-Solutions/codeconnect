/**
 * Types when the real `expo-local-authentication` package is not yet installed.
 * Once the dependency is present under node_modules, those types take precedence.
 */
declare module "expo-local-authentication" {
  export function hasHardwareAsync(): Promise<boolean>;
  export function isEnrolledAsync(): Promise<boolean>;
  export function authenticateAsync(options?: {
    promptMessage?: string;
    cancelLabel?: string;
  }): Promise<{ success: boolean }>;
}
