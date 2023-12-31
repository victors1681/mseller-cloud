export default {
  meEndpoint: '/auth/me',
  loginEndpoint:
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC96VLYQFjkTKpEKpNELMQW0MktV4L3LlY',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
}
