export interface Pausa {
  id: string;
  inicio: string;
  fim?: string;
  duracao?: number;
  usuarioId: string;
}

export interface PausaCreate {
  inicio?: string;
}

export interface PausaUpdate {
  inicio?: string;
  fim?: string;
}

export interface PausaListResponse {
  content: Pausa[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
