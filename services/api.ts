import { Pausa, PausaCreate, PausaListResponse, PausaUpdate } from '@/types/pausa';
import { storage } from '@/utils/storage';
import axios from 'axios';

// url base da api - pode ser configurada via .env ou nas configurações do app
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.20:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// interceptador para adicionar token nas requisições
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptador para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // token inválido ou expirado
        throw new Error('sessão expirada. faça login novamente.');
      }
      throw new Error(error.response.data?.message || 'erro ao processar requisição');
    } else if (error.request) {
      throw new Error('sem resposta do servidor. verifique sua conexão.');
    } else {
      throw new Error('erro ao configurar requisição');
    }
  }
);

export const pausaService = {
  // listar todas as pausas com paginação
  listar: async (page = 0, size = 100, sort = 'inicio,DESC'): Promise<PausaListResponse> => {
    const response = await api.get<PausaListResponse>('/pausas', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // obter pausa por id
  obterPorId: async (id: string): Promise<Pausa> => {
    const response = await api.get<Pausa>(`/pausas/${id}`);
    return response.data;
  },

  // criar nova pausa
  criar: async (pausa: PausaCreate = {}): Promise<Pausa> => {
    const response = await api.post<Pausa>('/pausas', pausa);
    return response.data;
  },

  // atualizar pausa
  atualizar: async (id: string, pausa: PausaUpdate): Promise<Pausa> => {
    const response = await api.put<Pausa>(`/pausas/${id}`, pausa);
    return response.data;
  },

  // deletar pausa
  deletar: async (id: string): Promise<void> => {
    await api.delete(`/pausas/${id}`);
  },
};

export default api;

