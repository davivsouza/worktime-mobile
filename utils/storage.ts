import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  API_URL: '@worktime:api_url',
  THEME: '@worktime:theme',
  TOKEN: '@worktime:token',
  USER: '@worktime:user',
};

export const storage = {
  // salvar url da api
  salvarApiUrl: async (url: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.API_URL, url);
    } catch (error) {
      console.error('erro ao salvar url da api:', error);
    }
  },

  // obter url da api
  obterApiUrl: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.API_URL);
    } catch (error) {
      console.error('erro ao obter url da api:', error);
      return null;
    }
  },

  // salvar tema
  salvarTema: async (tema: 'light' | 'dark'): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, tema);
    } catch (error) {
      console.error('erro ao salvar tema:', error);
    }
  },

  // obter tema
  obterTema: async (): Promise<'light' | 'dark' | null> => {
    try {
      const tema = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return tema as 'light' | 'dark' | null;
    } catch (error) {
      console.error('erro ao obter tema:', error);
      return null;
    }
  },

  // salvar token
  salvarToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('erro ao salvar token:', error);
    }
  },

  // obter token
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('erro ao obter token:', error);
      return null;
    }
  },

  // remover token
  removerToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('erro ao remover token:', error);
    }
  },

  // salvar usuário
  salvarUsuario: async (usuario: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, usuario);
    } catch (error) {
      console.error('erro ao salvar usuário:', error);
    }
  },

  // obter usuário
  obterUsuario: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('erro ao obter usuário:', error);
      return null;
    }
  },
};

