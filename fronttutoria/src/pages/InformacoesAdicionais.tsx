import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Aluno } from '@/types';
import api, { leituraService } from '@/services/api';
import { useNotificationModal } from '@/utils/notificationModal.tsx';

interface InfoAdicional {
  leituras: {
    primeiro: string;
    segundo: string;
    terceiro: string;
    quarto: string;
  };
  ocorrencias: {
    primeiro: number;
    segundo: number;
    terceiro: number;
    quarto: number;
  };
  leituraIds: {
    primeiro: number | null;
    segundo: number | null;
    terceiro: number | null;
    quarto: number | null;
  };
}

interface ModalState {
  isOpen: boolean;
  tipo: 'leitura' | 'ocorrencia' | null;
  bimestre?: keyof InfoAdicional['leituras'] | keyof InfoAdicional['ocorrencias'];
  valor: string;
  titulo: string;
}

export default function InformacoesAdicionais() {
  const navigate = useNavigate();
  const { showSuccess, showError, NotificationModalComponent } = useNotificationModal();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<InfoAdicional>({
    leituras: {
      primeiro: '',
      segundo: '',
      terceiro: '',
      quarto: '',
    },
    ocorrencias: {
      primeiro: 0,
      segundo: 0,
      terceiro: 0,
      quarto: 0,
    },
    leituraIds: {
      primeiro: null,
      segundo: null,
      terceiro: null,
      quarto: null,
    },
  });
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    tipo: null,
    valor: '',
    titulo: ''
  });
  const [inputModal, setInputModal] = useState('');

  useEffect(() => {
    const alunoSelecionado = localStorage.getItem('alunoSelecionado');
    if (alunoSelecionado) {
      const alunoData = JSON.parse(alunoSelecionado);
      setAluno(alunoData);
      carregarDados(alunoData.ra);
    } else {
      navigate('/alunos');
    }
  }, [navigate]);

  const carregarDados = async (ra: number) => {
    try {
      setLoading(true);
      // Carregar ocorrências
      const ocorrenciasRes = await api.get(`/alunos/${ra}/ocorrencias`);
      if (ocorrenciasRes.data) {
        setInfo(prev => ({
          ...prev,
          ocorrencias: {
            primeiro: ocorrenciasRes.data.numBi1 || 0,
            segundo: ocorrenciasRes.data.numBi2 || 0,
            terceiro: ocorrenciasRes.data.numBi3 || 0,
            quarto: ocorrenciasRes.data.numBi4 || 0,
          }
        }));
      }
      
      // Carregar leituras
      const leiturasRes = await leituraService.getAll(ra);
      if (leiturasRes && Array.isArray(leiturasRes)) {
        const novasLeituras = { ...info.leituras };
        const novosIds = { ...info.leituraIds };
        
        leiturasRes.forEach((leitura: { bimestre: number; livro: string; id: number }) => {
          const bimestreMap: { [key: number]: keyof InfoAdicional['leituras'] } = {
            1: 'primeiro',
            2: 'segundo',
            3: 'terceiro',
            4: 'quarto'
          };
          const key = bimestreMap[leitura.bimestre];
          if (key) {
            novasLeituras[key] = leitura.livro || '';
            novosIds[key] = leitura.id;
          }
        });
        
        setInfo(prev => ({
          ...prev,
          leituras: novasLeituras,
          leituraIds: novosIds
        }));
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeituraChange = (bimestre: keyof InfoAdicional['leituras'], value: string) => {
    setInfo(prev => ({
      ...prev,
      leituras: {
        ...prev.leituras,
        [bimestre]: value,
      },
    }));
  };

  const handleOcorrenciaChange = (bimestre: keyof InfoAdicional['ocorrencias'], value: string) => {
    const numValue = parseInt(value) || 0;
    setInfo(prev => ({
      ...prev,
      ocorrencias: {
        ...prev.ocorrencias,
        [bimestre]: numValue,
      },
    }));
  };

  const abrirModal = (
    tipo: 'leitura' | 'ocorrencia',
    titulo: string,
    valorAtual: string | number,
    bimestre?: keyof InfoAdicional['leituras'] | keyof InfoAdicional['ocorrencias']
  ) => {
    const valorString = valorAtual === 0 || valorAtual === '' ? '' : String(valorAtual);
    setModal({
      isOpen: true,
      tipo,
      bimestre,
      valor: valorString,
      titulo
    });
    setInputModal(valorString);
  };

  const fecharModal = () => {
    setModal({
      isOpen: false,
      tipo: null,
      valor: '',
      titulo: ''
    });
    setInputModal('');
  };

  const salvarModal = async () => {
    if (modal.tipo === 'leitura' && modal.bimestre) {
      handleLeituraChange(modal.bimestre as keyof InfoAdicional['leituras'], inputModal);
    } else if (modal.tipo === 'ocorrencia' && modal.bimestre) {
      handleOcorrenciaChange(modal.bimestre as keyof InfoAdicional['ocorrencias'], inputModal);
    }

    // Salvar imediatamente
    if (aluno) {
      try {
        if (modal.tipo === 'ocorrencia' && modal.bimestre) {
          // Salvar ocorrências
          const updatedOcorrencias = { ...info.ocorrencias, [modal.bimestre]: parseInt(inputModal) || 0 };
          const ocorrenciasData = {
            numBi1: updatedOcorrencias.primeiro,
            numBi2: updatedOcorrencias.segundo,
            numBi3: updatedOcorrencias.terceiro,
            numBi4: updatedOcorrencias.quarto,
          };
          await api.put(`/alunos/${aluno.ra}/ocorrencias`, ocorrenciasData);
          showSuccess('Sucesso!', 'Ocorrência salva com sucesso!');
        } else if (modal.tipo === 'leitura' && modal.bimestre) {
          // Salvar leitura
          const bimestreMap: { [key: string]: number } = {
            'primeiro': 1,
            'segundo': 2,
            'terceiro': 3,
            'quarto': 4
          };
          const bimestre = bimestreMap[modal.bimestre as string];
          const leituraId = info.leituraIds[modal.bimestre as keyof InfoAdicional['leituraIds']];

          if (inputModal.trim() !== '') {
            if (leituraId) {
              await leituraService.update(aluno.ra, leituraId, { livro: inputModal, bimestre });
            } else {
              await leituraService.create(aluno.ra, { livro: inputModal, bimestre });
            }
          }
          showSuccess('Sucesso!', 'Leitura salva com sucesso!');
          // Recarregar para atualizar IDs
          await carregarDados(aluno.ra);
        }
      } catch (error) {
        console.error('Erro ao salvar:', error);
        showError('Erro', 'Erro ao salvar informação');
      }
    }

    fecharModal();
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-50 px-4 pt-12 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/menu')}
            className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="text-red-500 font-semibold text-lg">Info Adicional</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <>
            {/* Aluno info */}
            {aluno && (
              <div className="mb-6 p-4 bg-[#3d4a6b] rounded-xl shadow-md">
                <p className="text-white font-semibold text-base">{aluno.nome}</p>
                <p className="text-gray-300 text-sm mt-1">RA: {aluno.ra}</p>
              </div>
            )}

            {/* Leituras realizadas */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-800 mb-3">
            Leituras realizadas pelo aluno:
          </h2>
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-2 text-center text-xs font-medium text-gray-700 border-r border-gray-200 w-1/4 truncate">
                    1º<br />Bimestre
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-medium text-gray-700 border-r border-gray-200 w-1/4 truncate">
                    2º<br />Bimestre
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-medium text-gray-700 border-r border-gray-200 w-1/4 truncate">
                    3º<br />Bimestre
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-medium text-gray-700 w-1/4">
                    4º<br />Bimestre
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td 
                    className="border-r border-gray-200 h-16 p-0 cursor-pointer hover:bg-gray-50 max-w-0"
                    onClick={() => abrirModal('leitura', 'Leituras - 1º Bimestre', info.leituras.primeiro, 'primeiro')}
                  >
                    <div className="w-full h-full flex items-center justify-center px-2">
                      <span className="text-sm text-black truncate max-w-full block">{info.leituras.primeiro || '-'}</span>
                    </div>
                  </td>
                  <td 
                    className="border-r border-gray-200 h-16 p-0 cursor-pointer hover:bg-gray-50 max-w-0"
                    onClick={() => abrirModal('leitura', 'Leituras - 2º Bimestre', info.leituras.segundo, 'segundo')}
                  >
                    <div className="w-full h-full flex items-center justify-center px-2">
                      <span className="text-sm text-black truncate max-w-full block">{info.leituras.segundo || '-'}</span>
                    </div>
                  </td>
                  <td 
                    className="border-r border-gray-200 h-16 p-0 cursor-pointer hover:bg-gray-50 max-w-0"
                    onClick={() => abrirModal('leitura', 'Leituras - 3º Bimestre', info.leituras.terceiro, 'terceiro')}
                  >
                    <div className="w-full h-full flex items-center justify-center px-2">
                      <span className="text-sm text-black truncate max-w-full block">{info.leituras.terceiro || '-'}</span>
                    </div>
                  </td>
                  <td 
                    className="h-16 p-0 cursor-pointer hover:bg-gray-50 max-w-0"
                    onClick={() => abrirModal('leitura', 'Leituras - 4º Bimestre', info.leituras.quarto, 'quarto')}
                  >
                    <div className="w-full h-full flex items-center justify-center px-2">
                      <span className="text-sm text-black truncate max-w-full block">{info.leituras.quarto || '-'}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Ocorrências Disciplinares */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-800 mb-3">
            Ocorrências Disciplinares (quantidade total):
          </h2>
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-2 text-center text-xs font-medium text-gray-700 border-r border-gray-200 w-1/4 truncate">
                    1º<br />Bimestre
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-medium text-gray-700 border-r border-gray-200 w-1/4 truncate">
                    2º<br />Bimestre
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-medium text-gray-700 border-r border-gray-200 w-1/4 truncate">
                    3º<br />Bimestre
                  </th>
                  <th className="py-3 px-2 text-center text-xs font-medium text-gray-700 w-1/4">
                    4º<br />Bimestre
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td 
                    className="border-r border-gray-200 h-16 p-0 cursor-pointer hover:bg-gray-50"
                    onClick={() => abrirModal('ocorrencia', 'Ocorrências - 1º Bimestre', info.ocorrencias.primeiro, 'primeiro')}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm text-black">{info.ocorrencias.primeiro || '0'}</span>
                    </div>
                  </td>
                  <td 
                    className="border-r border-gray-200 h-16 p-0 cursor-pointer hover:bg-gray-50"
                    onClick={() => abrirModal('ocorrencia', 'Ocorrências - 2º Bimestre', info.ocorrencias.segundo, 'segundo')}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm text-black">{info.ocorrencias.segundo || '0'}</span>
                    </div>
                  </td>
                  <td 
                    className="border-r border-gray-200 h-16 p-0 cursor-pointer hover:bg-gray-50"
                    onClick={() => abrirModal('ocorrencia', 'Ocorrências - 3º Bimestre', info.ocorrencias.terceiro, 'terceiro')}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm text-black">{info.ocorrencias.terceiro || '0'}</span>
                    </div>
                  </td>
                  <td 
                    className="h-16 p-0 cursor-pointer hover:bg-gray-50"
                    onClick={() => abrirModal('ocorrencia', 'Ocorrências - 4º Bimestre', info.ocorrencias.quarto, 'quarto')}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-sm text-black">{info.ocorrencias.quarto || '0'}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}
      </div>

      {/* Modal de Edição */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            {/* Header do Modal */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black">{modal.titulo}</h3>
            </div>
            
            {/* Conteúdo do Modal */}
            <div className="p-4">
              <label className="block text-sm font-medium text-black mb-2">
                Valor
              </label>
              <input
                type="text"
                autoFocus
                value={inputModal}
                onChange={(e) => setInputModal(e.target.value)}
                className="w-full px-4 py-3 text-center text-lg text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={modal.tipo === 'leitura' ? 'Nome do livro' : '0'}
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

      {/* Modal de Notificação */}
      <NotificationModalComponent />
    </div>
  );
}
