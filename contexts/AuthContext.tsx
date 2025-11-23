import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '@/types/auth';
import { storage } from '@/utils/storage';

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (usuario: Usuario, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setUsuario: (usuario: Usuario | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    try {
      const usuarioStr = await storage.obterUsuario();
      if (usuarioStr) {
        setUsuarioState(JSON.parse(usuarioStr));
      }
    } catch (error) {
      console.error('erro ao carregar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (usuarioData: Usuario, token: string) => {
    await storage.salvarToken(token);
    await storage.salvarUsuario(JSON.stringify(usuarioData));
    setUsuarioState(usuarioData);
  };

  const logout = async () => {
    await storage.removerToken();
    setUsuarioState(null);
  };

  const setUsuario = (usuarioData: Usuario | null) => {
    setUsuarioState(usuarioData);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated: !!usuario,
        isLoading,
        login,
        logout,
        setUsuario,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

