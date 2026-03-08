import axios from 'axios';
import type { Usuario, Aluno, Avaliacao } from '@/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Usuarios
export const usuarioService = {
  getAll: () => api.get<Usuario[]>('/usuarios').then(r => r.data),
  getById: (id: number) => api.get<Usuario>(`/usuarios/${id}`).then(r => r.data),
  create: (usuario: Omit<Usuario, 'id'>) => 
    api.post<Usuario>('/usuarios', usuario).then(r => r.data),
  update: (id: number, usuario: Partial<Usuario>) => 
    api.put<Usuario>(`/usuarios/${id}`, usuario).then(r => r.data),
  delete: (id: number) => api.delete(`/usuarios/${id}`),
  login: (nome: string, cpf: string) => 
    api.post<Usuario>('/usuarios/login', { nome, cpf }).then(r => r.data),
};

// Alunos
export const alunoService = {
  getAll: () => api.get<Aluno[]>('/alunos').then(r => r.data),
  getByRa: (ra: number) => api.get<Aluno>(`/alunos/${ra}`).then(r => r.data),
  create: (aluno: Omit<Aluno, 'usuario'>) => 
    api.post<Aluno>('/alunos', aluno).then(r => r.data),
  update: (ra: number, aluno: Partial<Aluno>) => 
    api.put<Aluno>(`/alunos/${ra}`, aluno).then(r => r.data),
  delete: (ra: number) => api.delete(`/alunos/${ra}`),
  getByUsuario: (usuarioId: number) => 
    api.get<Aluno[]>(`/alunos/usuario/${usuarioId}`).then(r => r.data),
};

// Avaliacoes
export const avaliacaoService = {
  getAll: (ra: number) => api.get<Avaliacao[]>(`/alunos/${ra}/avaliacoes`).then(r => r.data),
  create: (ra: number, avaliacao: Omit<Avaliacao, 'id'>) => 
    api.post<Avaliacao>(`/alunos/${ra}/avaliacoes`, avaliacao).then(r => r.data),
};

// Participacao
export const participacaoService = {
  get: (ra: number) => api.get(`/alunos/${ra}/participacao`).then(r => r.data),
  create: (ra: number, data: unknown) => 
    api.post(`/alunos/${ra}/participacao`, data).then(r => r.data),
  update: (ra: number, data: unknown) => 
    api.put(`/alunos/${ra}/participacao`, data).then(r => r.data),
};

// Leituras
export const leituraService = {
  getAll: (ra: number) => api.get(`/alunos/${ra}/leituras`).then(r => r.data),
  create: (ra: number, data: { livro: string; bimestre: number }) => 
    api.post(`/alunos/${ra}/leituras`, data).then(r => r.data),
  update: (ra: number, id: number, data: unknown) => 
    api.put(`/alunos/${ra}/leituras/${id}`, data).then(r => r.data),
};

// Registro Atendimento
export const atendimentoService = {
  getAll: (ra: number) => api.get(`/alunos/${ra}/registroAtendimentos`).then(r => r.data),
  create: (ra: number, data: unknown) => 
    api.post(`/alunos/${ra}/registroAtendimentos`, data).then(r => r.data),
  update: (ra: number, id: number, data: unknown) => 
    api.put(`/alunos/${ra}/registroAtendimentos/${id}`, data).then(r => r.data),
  delete: (ra: number, id: number) => 
    api.delete(`/alunos/${ra}/registroAtendimentos/${id}`),
};

// Tutoria
export const tutoriaService = {
  getAll: (ra: number) => api.get(`/alunos/${ra}/tutoria`).then(r => r.data),
  create: (ra: number, data: unknown) => 
    api.post(`/alunos/${ra}/tutoria`, data).then(r => r.data),
  update: (ra: number, id: number, data: unknown) => 
    api.put(`/alunos/${ra}/tutoria/${id}`, data).then(r => r.data),
};

export default api;
