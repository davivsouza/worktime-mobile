// utilitários para formatação de dados

export const formatarData = (data: string): string => {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatarDuracao = (duracao?: number): string => {
  if (!duracao) return '-';
  const horas = Math.floor(duracao / 3600);
  const minutos = Math.floor((duracao % 3600) / 60);
  if (horas > 0) {
    return `${horas}h ${minutos}m`;
  }
  return `${minutos}m`;
};

export const formatarDataSimples = (data: string): string => {
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

