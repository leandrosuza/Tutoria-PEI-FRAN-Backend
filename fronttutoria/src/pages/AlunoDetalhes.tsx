import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { alunoService } from '../services/api';
import type { Aluno } from '../types';
import { User, Mail, Phone, MapPin, Calendar, BookOpen, ChevronLeft, Award, ClipboardList, BookMarked } from 'lucide-react';

export default function AlunoDetalhes() {
  const { ra } = useParams<{ ra: string }>();
  const navigate = useNavigate();
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ra) {
      loadAluno(parseInt(ra));
    }
  }, [ra]);

  const loadAluno = async (ra: number) => {
    try {
      setLoading(true);
      const data = await alunoService.getByRa(ra);
      setAluno(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex justify-center items-center text-gray-500">
        Aluno nao encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-2">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </button>
        <h1 className="text-xl font-bold text-white">Detalhes do Aluno</h1>
      </div>

      {/* Card Principal */}
      <div className="bg-[#1a1f2e] rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <User className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{aluno.nome}</h2>
            <p className="text-sm text-gray-400">RA: {aluno.ra}</p>
          </div>
        </div>
        {aluno.serie && (
          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">
            {aluno.serie}
          </span>
        )}
      </div>

      {/* Informacoes */}
      <div className="space-y-3 mb-6">
        {aluno.email && (
          <div className="bg-[#1a1f2e] p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Mail className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">{aluno.email}</p>
            </div>
          </div>
        )}
        
        {aluno.telefone && (
          <div className="bg-[#1a1f2e] p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Phone className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Telefone</p>
              <p className="text-white">{aluno.telefone}</p>
            </div>
          </div>
        )}
        
        {aluno.dataNasc && (
          <div className="bg-[#1a1f2e] p-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Nascimento</p>
              <p className="text-white">{aluno.dataNasc}</p>
            </div>
          </div>
        )}
      </div>

      {/* Acoes */}
      <div className="bg-[#1a1f2e] rounded-2xl p-5">
        <h3 className="font-semibold text-white mb-4">Acompanhamento</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="p-4 bg-blue-500/10 rounded-xl text-center">
            <Award className="h-6 w-6 mx-auto mb-2 text-blue-400" />
            <span className="text-sm text-blue-400">Avaliacoes</span>
          </button>
          <button className="p-4 bg-green-500/10 rounded-xl text-center">
            <ClipboardList className="h-6 w-6 mx-auto mb-2 text-green-400" />
            <span className="text-sm text-green-400">Participacao</span>
          </button>
          <button className="p-4 bg-purple-500/10 rounded-xl text-center">
            <BookMarked className="h-6 w-6 mx-auto mb-2 text-purple-400" />
            <span className="text-sm text-purple-400">Leituras</span>
          </button>
          <button className="p-4 bg-orange-500/10 rounded-xl text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-orange-400" />
            <span className="text-sm text-orange-400">Tutoria</span>
          </button>
        </div>
      </div>
    </div>
  );
}
