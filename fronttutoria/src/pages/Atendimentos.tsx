import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import type { Aluno } from '@/types';
import { atendimentoService } from '@/services/api';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

interface Atendimento {
  id?: number;
  data: string;
  assunto: string; // 'Academico' | 'Pessoal'
  observacoesProfessor: string;
}

interface ModalState {
  isOpen: boolean;
  index: number | null;
  valor: string;
}

export default function Atendimentos() {
  const navigate = useNavigate();
  const { showSuccess, showError, NotificationModalComponent } = useNotificationModal();
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  // Filtros
  const [filtroData, setFiltroData] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'academico' | 'pessoal'>('todos');
  const [filtroObservacao, setFiltroObservacao] = useState('');
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    index: null,
    valor: ''
  });
  const [inputModal, setInputModal] = useState('');
  
  // Modal de confirmação de exclusão
  const [modalExcluir, setModalExcluir] = useState({
    isOpen: false,
    index: null as number | null,
    atendimento: null as Atendimento | null
  });

  useEffect(() => {
    const alunoStored = localStorage.getItem('alunoSelecionado');
    if (alunoStored) {
      const aluno = JSON.parse(alunoStored);
      setAlunoSelecionado(aluno);
      carregarAtendimentos(aluno.ra);
    } else {
      setLoading(false);
    }
  }, []);

  const carregarAtendimentos = async (ra: number) => {
    try {
      setLoading(true);
      const data = await atendimentoService.getAll(ra);
      const atendimentosMapeados = (data || []).map((item: any) => ({
        id: item.id,
        data: item.data,
        assunto: item.assunto || '',
        observacoesProfessor: item.observacoesProfessor || ''
      }));
      
      if (atendimentosMapeados.length === 0) {
        setAtendimentos([{
          data: new Date().toISOString().split('T')[0],
          assunto: '',
          observacoesProfessor: ''
        }]);
      } else {
        setAtendimentos(atendimentosMapeados);
      }
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
      // Adicionar atendimento vazio em caso de erro
      setAtendimentos([{
        data: new Date().toISOString().split('T')[0],
        assunto: '',
        observacoesProfessor: ''
      }]);
    } finally {
      setLoading(false);
    }
  };

  const adicionarAtendimento = () => {
    const novoAtendimento: Atendimento = {
      data: new Date().toISOString().split('T')[0],
      assunto: '',
      observacoesProfessor: ''
    };
    setAtendimentos([...atendimentos, novoAtendimento]);
  };

  const removerAtendimentoLocal = (index: number) => {
    if (atendimentos.length === 1) {
      setAtendimentos([{
        data: new Date().toISOString().split('T')[0],
        assunto: '',
        observacoesProfessor: ''
      }]);
      return;
    }
    const novosAtendimentos = atendimentos.filter((_, i) => i !== index);
    setAtendimentos(novosAtendimentos);
  };

  const abrirModalExcluir = (index: number) => {
    const atendimento = atendimentos[index];
    // Só abre modal se tiver ID (já salvo no backend)
    if (atendimento.id) {
      setModalExcluir({
        isOpen: true,
        index,
        atendimento
      });
    } else {
      // Se não tiver ID, remove direto da UI
      removerAtendimentoLocal(index);
    }
  };

  const fecharModalExcluir = () => {
    setModalExcluir({
      isOpen: false,
      index: null,
      atendimento: null
    });
  };

  const confirmarExclusao = async () => {
    if (modalExcluir.index === null || !modalExcluir.atendimento || !alunoSelecionado) {
      fecharModalExcluir();
      return;
    }

    const atendimento = modalExcluir.atendimento;
    const index = modalExcluir.index;

    try {
      if (atendimento.id) {
        await atendimentoService.delete(alunoSelecionado.ra, atendimento.id);
        showSuccess('Sucesso!', 'Atendimento excluído com sucesso!');
      }
      removerAtendimentoLocal(index);
    } catch (error) {
      console.error('Erro ao excluir:', error);
      showError('Erro', 'Erro ao excluir atendimento');
    }

    fecharModalExcluir();
  };

  const atualizarAtendimento = (index: number, campo: keyof Atendimento, valor: string) => {
    const novosAtendimentos = atendimentos.map((a, i) => 
      i === index ? { ...a, [campo]: valor } : a
    );
    setAtendimentos(novosAtendimentos);
  };

  const abrirModal = (index: number, valorAtual: string) => {
    setModal({
      isOpen: true,
      index,
      valor: valorAtual
    });
    setInputModal(valorAtual);
  };

  const fecharModal = () => {
    setModal({
      isOpen: false,
      index: null,
      valor: ''
    });
    setInputModal('');
  };

  const salvarModal = async () => {
    if (modal.index === null || !alunoSelecionado) return;

    const atendimento = atendimentos[modal.index];
    const novosAtendimentos = atendimentos.map((a, i) =>
      i === modal.index ? { ...a, observacoesProfessor: inputModal } : a
    );
    setAtendimentos(novosAtendimentos);

    // Salvar imediatamente
    try {
      const ra = alunoSelecionado.ra;
      const payload = {
        data: atendimento.data,
        assunto: atendimento.assunto,
        observacoesProfessor: inputModal
      };
      
      if (atendimento.id) {
        await atendimentoService.update(ra, atendimento.id, payload);
      } else {
        await atendimentoService.create(ra, payload);
      }
      showSuccess('Sucesso!', 'Observação salva com sucesso!');
      await carregarAtendimentos(ra);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      showError('Erro', 'Erro ao salvar observação');
    }

    fecharModal();
  };

  // Filtros aplicados
  const atendimentosFiltrados = atendimentos.filter((a) => {
    // Filtro por data
    if (filtroData && a.data !== filtroData) return false;
    
    // Filtro por tipo (assunto)
    if (filtroTipo === 'academico' && a.assunto !== 'Academico') return false;
    if (filtroTipo === 'pessoal' && a.assunto !== 'Pessoal') return false;
    
    // Filtro por observação
    if (filtroObservacao && !a.observacoesProfessor?.toLowerCase().includes(filtroObservacao.toLowerCase())) return false;
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b sticky top-0 z-10">
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <h1 className="text-xl font-bold text-red-500">Atendimentos Realizados</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Filtros */}
          <div className="bg-white rounded-lg shadow p-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Filtro por Data */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={filtroData}
                  onChange={(e) => setFiltroData(e.target.value)}
                  className="w-full text-sm text-black border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>
              {/* Filtro por Tipo */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as 'todos' | 'academico' | 'pessoal')}
                  className="w-full text-sm text-black border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="todos">Todos</option>
                  <option value="academico">Acadêmico</option>
                  <option value="pessoal">Pessoal</option>
                </select>
              </div>
            </div>
            {/* Filtro por Observação */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Buscar em observações</label>
              <input
                type="text"
                value={filtroObservacao}
                onChange={(e) => setFiltroObservacao(e.target.value)}
                placeholder="Digite para buscar..."
                className="w-full text-sm text-black border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            {/* Botão Limpar Filtros */}
            {(filtroData || filtroTipo !== 'todos' || filtroObservacao) && (
              <button
                onClick={() => {
                  setFiltroData('');
                  setFiltroTipo('todos');
                  setFiltroObservacao('');
                }}
                className="w-full py-2 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors"
              >
                Limpar Filtros
              </button>
            )}
          </div>

          {/* Subtítulo */}
          <h2 className="text-center text-sm font-semibold text-black">
            Breve Registro do Atendimento Realizado
          </h2>

          {/* Lista de Atendimentos */}
          {atendimentosFiltrados.map((atendimento, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-x-auto">
              {/* Tabela de Atendimento */}
              <div className="grid grid-cols-[225px_1fr_1fr_40px] text-sm">
                {/* Header */}
                <div className="bg-gray-100 border border-gray-300 px-2 py-3 font-medium text-black text-xs text-center">
                  Data
                </div>
                <div className="bg-gray-100 border border-gray-300 border-l-0 px-1 py-3 font-medium text-black text-xs text-center">
                  Assunto<br />(A = Acadêmico | P = Pessoal)
                </div>
                <div className="bg-gray-100 border border-gray-300 border-l-0 px-2 py-3 font-medium text-black text-xs text-center">
                  Observações do Tutor
                </div>
                <div className="bg-gray-100 border border-gray-300 border-l-0 px-1 py-3 font-medium text-black text-xs text-center">
                  Ações
                </div>

                {/* Dados */}
                <div className="border border-gray-300 border-t-0 p-2">
                  <input
                    type="date"
                    value={atendimento.data}
                    onChange={async (e) => {
                      const newData = e.target.value;
                      atualizarAtendimento(index, 'data', newData);
                      if (alunoSelecionado) {
                        try {
                          const ra = alunoSelecionado.ra;
                          const payload = {
                            data: newData,
                            assunto: atendimento.assunto,
                            observacoesProfessor: atendimento.observacoesProfessor
                          };
                          if (atendimento.id) {
                            await atendimentoService.update(ra, atendimento.id, payload);
                          } else {
                            await atendimentoService.create(ra, payload);
                            await carregarAtendimentos(ra);
                          }
                        } catch (error) {
                          console.error('Erro ao salvar data:', error);
                        }
                      }
                    }}
                    className="w-full text-sm text-black border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[38px]"
                  />
                </div>
                <div className="border border-gray-300 border-t-0 border-l-0 p-2 flex items-center justify-center gap-3">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={atendimento.assunto === 'Academico'}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        const newAssunto = checked ? 'Academico' : '';
                        atualizarAtendimento(index, 'assunto', newAssunto);
                        if (alunoSelecionado) {
                          try {
                            const ra = alunoSelecionado.ra;
                            const payload = {
                              data: atendimento.data,
                              assunto: newAssunto,
                              observacoesProfessor: atendimento.observacoesProfessor
                            };
                            if (atendimento.id) {
                              await atendimentoService.update(ra, atendimento.id, payload);
                            } else {
                              await atendimentoService.create(ra, payload);
                              await carregarAtendimentos(ra);
                            }
                          } catch (error) {
                            console.error('Erro ao salvar:', error);
                          }
                        }
                      }}
                      className="w-4 h-4 accent-red-500"
                    />
                    <span className="text-sm text-black font-medium">A</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={atendimento.assunto === 'Pessoal'}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        const newAssunto = checked ? 'Pessoal' : '';
                        atualizarAtendimento(index, 'assunto', newAssunto);
                        if (alunoSelecionado) {
                          try {
                            const ra = alunoSelecionado.ra;
                            const payload = {
                              data: atendimento.data,
                              assunto: newAssunto,
                              observacoesProfessor: atendimento.observacoesProfessor
                            };
                            if (atendimento.id) {
                              await atendimentoService.update(ra, atendimento.id, payload);
                            } else {
                              await atendimentoService.create(ra, payload);
                              await carregarAtendimentos(ra);
                            }
                          } catch (error) {
                            console.error('Erro ao salvar:', error);
                          }
                        }
                      }}
                      className="w-4 h-4 accent-red-500"
                    />
                    <span className="text-sm text-black font-medium">P</span>
                  </label>
                </div>
                <div
                  className="border border-gray-300 border-t-0 border-l-0 p-2 cursor-pointer hover:bg-gray-50 min-h-[60px] flex items-center"
                  onClick={() => abrirModal(index, atendimento.observacoesProfessor)}
                >
                  <span className="text-sm text-black whitespace-pre-wrap truncate">
                    {atendimento.observacoesProfessor
                      ? atendimento.observacoesProfessor.length > 30
                        ? atendimento.observacoesProfessor.substring(0, 30) + '...'
                        : atendimento.observacoesProfessor
                      : 'Clique para adicionar observação...'}
                  </span>
                </div>
                <div className="border border-gray-300 border-t-0 border-l-0 flex items-center justify-center">
                  <button
                    onClick={() => abrirModalExcluir(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Botão Adicionar */}
          <button
            onClick={adicionarAtendimento}
            className="w-full py-4 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          >
            <Plus className="h-8 w-8" />
          </button>

          <div className="h-8"></div>
        </div>
      </div>

      {/* Modal de Edição */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            {/* Header do Modal */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black">Observações do Tutor</h3>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-4">
              <textarea
                autoFocus
                value={inputModal}
                onChange={(e) => setInputModal(e.target.value)}
                placeholder="Registro de observações..."
                rows={6}
                className="w-full text-sm text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Botões do Modal */}
            <div className="px-4 py-3 border-t border-gray-200 flex gap-3">
              <button
                onClick={fecharModal}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-black font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={salvarModal}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {modalExcluir.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            {/* Header do Modal */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black">Confirmar Exclusão</h3>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-4">
              <p className="text-sm text-gray-600">
                Tem certeza que deseja excluir este atendimento?
              </p>
              {modalExcluir.atendimento && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-black">
                  <p><strong>Data:</strong> {modalExcluir.atendimento.data}</p>
                  <p><strong>Assunto:</strong> {modalExcluir.atendimento.assunto || 'Não definido'}</p>
                </div>
              )}
            </div>

            {/* Botões do Modal */}
            <div className="px-4 py-3 border-t border-gray-200 flex gap-3">
              <button
                onClick={fecharModalExcluir}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-black font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Notificação */}
      <NotificationModalComponent />
    </div>
  );
}
