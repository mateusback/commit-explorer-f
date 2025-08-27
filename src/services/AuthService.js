import BaseHttpClient from './BaseHttpClient';
import APIRoutes from '../constants/ApiRoutes';

const AuthService = {
  async login(credentials) {
    const response = await BaseHttpClient.post(APIRoutes.AUTH_LOGIN, credentials);
    return response;
  },

  async register(payload) {
    const response = await BaseHttpClient.post(APIRoutes.AUTH_REGISTER, payload);
    return response;
  },
};

export default AuthService;

