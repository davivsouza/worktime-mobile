import axios from 'axios';
import { LoginRequest, LoginResponse, UsuarioCreate, Usuario } from '@/types/auth';
import api from './api';

const getBaseURL = () => {
  return api.defaults.baseURL || process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8080/api';
};

export const authService = {
  // login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${getBaseURL()}/auth/login`,
      credentials
    );
    return response.data;
  },

  // criar usuário
  criarUsuario: async (usuario: UsuarioCreate): Promise<Usuario> => {
    const response = await axios.post<Usuario>(
      `${getBaseURL()}/usuarios`,
      usuario
    );
    return response.data;
  },

  // obter perfil do usuário logado
  obterPerfil: async (): Promise<Usuario> => {
    const response = await api.get<Usuario>('/usuarios/me');
    return response.data;
  },
};

