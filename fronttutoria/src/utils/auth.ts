import type { Usuario } from '@/types';

export type RouteAccess = 'ALL' | 'ADMIN' | 'PROFESSOR';

export interface RouteConfig {
  path: string;
  access: RouteAccess;
  label: string;
}

// Definição de rotas e seus níveis de acesso
export const ROUTES: RouteConfig[] = [
  { path: '/', access: 'ALL', label: 'Dashboard' },
  { path: '/alunos', access: 'ALL', label: 'Alunos' },
  { path: '/alunos/:ra', access: 'ALL', label: 'Detalhes do Aluno' },
  { path: '/acompanhamento', access: 'ALL', label: 'Estudos' },
  { path: '/participacao', access: 'ALL', label: 'Participação' },
  { path: '/avaliacoes', access: 'ALL', label: 'Avaliações' },
  { path: '/leituras', access: 'ALL', label: 'Leituras' },
  { path: '/tutoria', access: 'ALL', label: 'Tutoria' },
  { path: '/ocorrencias', access: 'ALL', label: 'Ocorrências' },
  { path: '/acao', access: 'ALL', label: 'Ação Rápida' },
  { path: '/usuarios', access: 'ADMIN', label: 'Usuários' },
];

// Verifica se usuário tem acesso à rota
export function hasAccess(usuario: Usuario | null, path: string): boolean {
  if (!usuario) return false;
  
  const route = ROUTES.find(r => {
    // Converte padrão de rota para regex
    const pattern = r.path.replace(/:\w+/g, '\\w+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
  
  if (!route) return true; // Rota não definida = permite
  
  if (route.access === 'ALL') return true;
  if (route.access === 'ADMIN' && usuario.perfil?.toUpperCase() === 'ADMIN') return true;
  if (route.access === 'PROFESSOR' && usuario.perfil?.toUpperCase() === 'PROFESSOR') return true;
  
  return false;
}

// Retorna menu items baseado no perfil
export function getMenuItems(usuario: Usuario | null) {
  if (!usuario) return [];
  
  const allItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/alunos', label: 'Alunos', icon: 'GraduationCap' },
    { path: '/acompanhamento', label: 'Estudos', icon: 'BookOpen' },
    { path: '/tutoria', label: 'Tutoria', icon: 'ClipboardList' },
    { path: '/participacao', label: 'Participação', icon: 'User' },
    { path: '/avaliacoes', label: 'Avaliações', icon: 'BookOpen' },
    { path: '/leituras', label: 'Leituras', icon: 'BookOpen' },
    { path: '/ocorrencias', label: 'Ocorrências', icon: 'AlertTriangle' },
    { path: '/usuarios', label: 'Usuários', icon: 'User', adminOnly: true },
  ];
  
  return allItems.filter(item => !item.adminOnly || usuario.perfil?.toUpperCase() === 'ADMIN');
}

// Verifica se é admin (case insensitive)
export function isAdmin(usuario: Usuario | null): boolean {
  return usuario?.perfil?.toUpperCase() === 'ADMIN';
}

// Verifica se é professor (case insensitive)
export function isProfessor(usuario: Usuario | null): boolean {
  return usuario?.perfil?.toUpperCase() === 'PROFESSOR';
}
