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

  async getCurrentUser() {
    const response = await BaseHttpClient.get(APIRoutes.USER_PROFILE);
    return response;
  },

  async promoteToProfessor(email) {
    const response = await BaseHttpClient.post(APIRoutes.PROMOTE_PROFESSOR, { email });
    return response;
  },
};

export default AuthService;

