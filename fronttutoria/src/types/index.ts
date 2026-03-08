export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  perfil: 'ADMIN' | 'PROFESSOR';
}

export interface Aluno {
  ra: number;
  nome: string;
  email?: string;
  dataNasc?: string;
  idade?: number;
  telefone?: number;
  transporte?: string;
  projetoVida?: string;
  serie?: string;
  endereco?: string;
  imgUrl?: string;
  usuario?: Usuario;
  usuarioId?: number;
  dadoFamilia?: {
    pai?: string;
    mae?: string;
    responsavel?: string;
    estruturaFamiliar?: string;
    numPai?: number;
    numMae?: number;
    numResponsavel?: number;
  };
}

export interface Avaliacao {
  id: number;
  materia: string;
  tipo: string;
  periodo: string;
  numQuestoes: number;
  numAcertos: number;
  bimestre?: number;
}

export interface Participacao {
  id: number;
  liderTurma1: boolean;
  liderTurma2: boolean;
  alunoGremista1: boolean;
  alunoGremista2: boolean;
  jovemAcolhedor1: boolean;
  jovemAcolhedor2: boolean;
  eletiva1?: string;
  eletiva2?: string;
  clubeJuvenil1?: string;
  clubeJuvenil2?: string;
}

export interface Leitura {
  id: number;
  livro: string;
  bimestre: number;
}

export interface RegistroAtendimento {
  id: number;
  data: string;
  assunto: string;
  observacoesProfessor: string;
}

export interface Tutoria {
  id: number;
  data: string;
  avaliacoes: boolean;
  leitura: boolean;
  redacao: boolean;
  provaPaulista: boolean;
  tarefacmsp: boolean;
  dificuldades: boolean;
  outros: boolean;
  observacoesProfessor: string;
}
