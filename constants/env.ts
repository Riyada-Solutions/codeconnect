export const ENV = {
  USE_MOCK_DATA: process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false',
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
}
