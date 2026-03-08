import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, LogOut, ChevronRight, Plus, ChevronLeft } from 'lucide-react';
import { alunoService } from '@/services/api';
import type { Aluno, Usuario } from '@/types';
import { isAdmin } from '@/utils/auth';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

const ITENS_POR_PAGINA = 10;

// Modal de confirmação
function ConfirmModal({ isOpen, onClose, onConfirm, aluno }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; aluno: Aluno | null }) {
  if (!isOpen || !aluno) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Excluir Aluno?</h3>
          <p className="text-gray-500">
            Tem certeza que deseja excluir <span className="font-semibold text-gray-700">{aluno.nome}</span>?
          </p>
          <p className="text-sm text-gray-400 mt-1">Esta ação não pode ser desfeita.</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Alunos() {
  const navigate = useNavigate();
  const { showError, NotificationModalComponent } = useNotificationModal();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  
  // Estados do modal
  const [modalOpen, setModalOpen] = useState(false);
  const [professorVisualizando, setProfessorVisualizando] = useState<Usuario | null>(null);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState<Aluno | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    const storedProfessor = localStorage.getItem('professorSelecionado');
    
    if (stored) {
      const user = JSON.parse(stored);
      setUsuario(user);
      
      // Se admin selecionou um professor, carrega alunos desse professor
      if (storedProfessor && isAdmin(user)) {
        const professor = JSON.parse(storedProfessor);
        setProfessorVisualizando(professor);
        loadAlunosPorProfessor(professor.id);
      } else {
        loadAlunos(user);
      }
    }
  }, []);

  const loadAlunos = async (user: Usuario) => {
    try {
      let data: Aluno[];
      if (user.perfil === 'ADMIN') {
        data = await alunoService.getAll();
      } else {
        data = await alunoService.getByUsuario(user.id);
      }
      setAlunos(data);
      setFilteredAlunos(data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPaginaAtual(1);
    if (!term.trim()) {
      setFilteredAlunos(alunos);
      return;
    }
    const filtered = alunos.filter(aluno =>
      aluno.nome.toLowerCase().includes(term.toLowerCase()) ||
      aluno.ra.toString().includes(term)
    );
    setFilteredAlunos(filtered);
  };

  const handleSelectAluno = (aluno: Aluno) => {
    localStorage.setItem('alunoSelecionado', JSON.stringify(aluno));
    navigate('/menu');
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('alunoSelecionado');
    localStorage.removeItem('professorSelecionado');
    navigate('/login');
  };

  const handleDeleteAluno = async (aluno: Aluno) => {
    setAlunoParaExcluir(aluno);
    setModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!alunoParaExcluir) return;
    
    try {
      await alunoService.delete(alunoParaExcluir.ra);
      
      // Verificar se está visualizando alunos de um professor específico
      const storedProfessor = localStorage.getItem('professorSelecionado');
      if (storedProfessor && professorVisualizando) {
        // Recarregar alunos do mesmo professor
        loadAlunosPorProfessor(professorVisualizando.id);
      } else {
        // Caso contrário, recarregar alunos do usuário logado
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        loadAlunos(usuario);
      }
      
      setModalOpen(false);
      setAlunoParaExcluir(null);
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      showError('Erro', 'Erro ao excluir aluno');
    } finally {
      setModalOpen(false);
      setAlunoParaExcluir(null);
    }
  };

  // Paginação
  const totalPaginas = Math.ceil(filteredAlunos.length / ITENS_POR_PAGINA);
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const alunosPagina = filteredAlunos.slice(inicio, inicio + ITENS_POR_PAGINA);

  const loadAlunosPorProfessor = async (professorId: number) => {
    try {
      const data = await alunoService.getByUsuario(professorId);
      setAlunos(data);
      setFilteredAlunos(data);
    } catch (error) {
      console.error('Erro ao carregar alunos do professor:', error);
    } finally {
      setLoading(false);
    }
  };
  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handlePaginaProxima = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {professorVisualizando && (
              <button
                onClick={() => {
                  localStorage.removeItem('professorSelecionado');
                  navigate('/professores');
                }}
                className="flex items-center gap-1 px-2 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </button>
            )}
            <h1 className="text-3xl font-bold text-red-500">Alunos</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-1">
          {professorVisualizando 
            ? `Alunos de ${professorVisualizando.nome}` 
            : isAdmin(usuario) 
              ? 'Todos os alunos' 
              : 'Meus alunos'}
        </p>
      </div>

      {/* Search */}
      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar aluno..."
            className="w-full bg-gray-100 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-400 transition-colors"
          />
        </div>
      </div>

      {/* Lista de Alunos */}
      <div className="flex-1 px-6 pb-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : filteredAlunos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhum aluno encontrado</p>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 rounded-3xl p-4 space-y-3">
              {alunosPagina.map((aluno) => (
                <div
                  key={aluno.ra}
                  className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <button
                    onClick={() => handleSelectAluno(aluno)}
                    className="flex-1 flex items-center gap-4 text-left"
                  >
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{aluno.nome}</p>
                      <p className="text-sm text-gray-400">RA: {aluno.ra}</p>
                    </div>
                  </button>
                  
                  {/* Botões de Ação */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/cadastro-aluno?ra=${aluno.ra}&edit=true`)}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Editar"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteAluno(aluno)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={handlePaginaAnterior}
                  disabled={paginaAtual === 1}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  {paginaAtual} / {totalPaginas}
                </span>
                <button
                  onClick={handlePaginaProxima}
                  disabled={paginaAtual === totalPaginas}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            )}

            {/* Contador */}
            <p className="text-center text-xs text-gray-400 mt-2">
              Mostrando {alunosPagina.length} de {filteredAlunos.length} alunos
            </p>
          </>
        )}
      </div>

      {/* Botão Adicionar */}
      <div className="px-6 py-4">
        <button
          onClick={() => navigate('/cadastro-aluno')}
          className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center mx-auto transition-colors shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Modal de confirmação */}
      <ConfirmModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onConfirm={confirmarExclusao}
        aluno={alunoParaExcluir}
      />

      {/* Modal de Notificação */}
      <NotificationModalComponent />
    </div>
  );
}
