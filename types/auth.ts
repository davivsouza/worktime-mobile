export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UsuarioCreate {
  nome: string;
  email: string;
  senha: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
}

