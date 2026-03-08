import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { Usuario } from '@/types';

// Pages - apenas essenciais
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Alunos from './pages/Alunos';
import Professores from './pages/Professores';
import EditarProfessor from './pages/EditarProfessor';
import CadastroAluno from './pages/CadastroAluno';
import Menu from './pages/Menu';
import InformacoesAdicionais from './pages/InformacoesAdicionais';
import Resultados from './pages/Resultados';
import Participacao from './pages/Participacao';
import Atendimentos from './pages/Atendimentos';
import Tutoria from './pages/Tutoria';

// Páginas adicionais
import AcaoRapida from './pages/AcaoRapida';
import Acompanhamento from './pages/Acompanhamento';
import AlunoDetalhes from './pages/AlunoDetalhes';
import Avaliacoes from './pages/Avaliacoes';
import Dashboard from './pages/Dashboard';
import Leituras from './pages/Leituras';
import Ocorrencias from './pages/Ocorrencias';
import Usuarios from './pages/Usuarios';

// Hook para verificar autenticação
function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) {
      setUsuario(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  return { usuario, loading, isAuthenticated: !!usuario };
}

// Rota protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4a9eff]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function App() {
  const location = useLocation();
  const isPublicRoute = ['/login', '/cadastro'].includes(location.pathname);

  // Rotas públicas (login/cadastro)
  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    );
  }

  // Rotas privadas
  return (
    <div className="min-h-screen bg-[#0f1525] text-white">
      <Routes>
        <Route path="/" element={<Navigate to="/alunos" replace />} />
        <Route 
          path="/alunos" 
          element={
            <ProtectedRoute>
              <Alunos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/professores" 
          element={
            <ProtectedRoute>
              <Professores />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/editar-professor/:id" 
          element={
            <ProtectedRoute>
              <EditarProfessor />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/informacoes" 
          element={
            <ProtectedRoute>
              <InformacoesAdicionais />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resultados" 
          element={
            <ProtectedRoute>
              <Resultados />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/participacao-aluno" 
          element={
            <ProtectedRoute>
              <Participacao />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cadastro-aluno" 
          element={
            <ProtectedRoute>
              <CadastroAluno />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tutoria" 
          element={
            <ProtectedRoute>
              <Tutoria />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/atendimentos" 
          element={
            <ProtectedRoute>
              <Atendimentos />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/alunos" replace />} />
        {/* Rotas adicionais */}
        <Route path="/acao-rapida" element={<ProtectedRoute><AcaoRapida /></ProtectedRoute>} />
        <Route path="/acompanhamento" element={<ProtectedRoute><Acompanhamento /></ProtectedRoute>} />
        <Route path="/aluno/:ra" element={<ProtectedRoute><AlunoDetalhes /></ProtectedRoute>} />
        <Route path="/avaliacoes" element={<ProtectedRoute><Avaliacoes /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leituras" element={<ProtectedRoute><Leituras /></ProtectedRoute>} />
        <Route path="/ocorrencias" element={<ProtectedRoute><Ocorrencias /></ProtectedRoute>} />
        <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

// Wrapper com Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
