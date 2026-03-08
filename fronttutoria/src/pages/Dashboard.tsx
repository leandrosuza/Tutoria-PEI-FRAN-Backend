import { useState, useEffect } from 'react';
import { usuarioService, alunoService } from '../services/api';
import { Users, GraduationCap, BookOpen, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Stats {
  usuarios: number;
  alunos: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ usuarios: 0, alunos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usuarios, alunos] = await Promise.all([
        usuarioService.getAll(),
        alunoService.getAll(),
      ]);
      setStats({
        usuarios: usuarios.length,
        alunos: alunos.length,
      });
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-4 pb-24">
      {/* Header */}
      <div className="pt-2 pb-6">
        <p className="text-sm text-gray-400 mb-1">Bem-vindo ao</p>
        <h1 className="text-2xl font-bold text-white">Sistema de Tutoria PEI</h1>
        <p className="text-sm text-gray-400 mt-1">Gerencie alunos, avaliacoes e acompanhamento</p>
      </div>

      {/* Cards estatisticas */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#1a1f2e] p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.usuarios}</p>
            <p className="text-sm text-gray-500 mt-1">Usuarios</p>
          </div>
          <div className="bg-[#1a1f2e] p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.alunos}</p>
            <p className="text-sm text-gray-500 mt-1">Alunos</p>
          </div>
        </div>
      )}

      {/* Acoes Rapidas */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-3">Acoes Rapidas</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/alunos"
            className="bg-[#1a1f2e] p-4 rounded-2xl flex items-center gap-3 hover:bg-[#242a3d] transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-medium text-white">Alunos</span>
            <ChevronRight className="h-5 w-5 text-gray-500 ml-auto" />
          </Link>

          <Link
            to="/avaliacoes"
            className="bg-[#1a1f2e] p-4 rounded-2xl flex items-center gap-3 hover:bg-[#242a3d] transition-colors"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="font-medium text-white">Avaliacoes</span>
            <ChevronRight className="h-5 w-5 text-gray-500 ml-auto" />
          </Link>

          <Link
            to="/tutoria"
            className="bg-[#1a1f2e] p-4 rounded-2xl flex items-center gap-3 hover:bg-[#242a3d] transition-colors"
          >
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-medium text-white">Tutoria</span>
            <ChevronRight className="h-5 w-5 text-gray-500 ml-auto" />
          </Link>

          <Link
            to="/usuarios"
            className="bg-[#1a1f2e] p-4 rounded-2xl flex items-center gap-3 hover:bg-[#242a3d] transition-colors"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="font-medium text-white">Usuarios</span>
            <ChevronRight className="h-5 w-5 text-gray-500 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-[#1a1f2e] rounded-2xl p-4">
        <h3 className="font-semibold text-white mb-3">Resumo do Sistema</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>Cadastro e gerenciamento de usuarios/tutores</p>
          <p>Cadastro e acompanhamento de alunos</p>
          <p>Registro de avaliacoes e notas</p>
          <p>Controle de participacao em atividades</p>
        </div>
      </div>
    </div>
  );
}
