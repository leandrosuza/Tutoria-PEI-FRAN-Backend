import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '@/services/api';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nome: '', cpf: '' });
  const [showCpf, setShowCpf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cpfLimpo = formData.cpf.replace(/\D/g, '');
      const usuario = await usuarioService.login(formData.nome, cpfLimpo);
      console.log('Usuário logado:', usuario);
      if (usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        // Verifica se é admin (case insensitive)
        const isAdminUser = usuario.perfil?.toUpperCase() === 'ADMIN';
        console.log('É admin?', isAdminUser, 'Perfil:', usuario.perfil);
        if (isAdminUser) {
          navigate('/professores');
        } else {
          navigate('/alunos');
        }
      } else {
        setError('Nome ou CPF inválidos');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6">
        <div className="border-l-4 border-orange-500 pl-4">
          <p className="text-sm text-gray-500 mb-1">Bem-vindo ao sistema</p>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Tutoria PEI</h1>
        </div>
        <p className="text-sm text-gray-500 mt-3 ml-5">Faça login para continuar</p>
      </div>

      {/* Form Card */}
      <div className="flex-1 px-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Nome</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  placeholder="Digite seu nome"
                  required
                />
              </div>
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Senha (CPF)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showCpf ? 'text' : 'password'}
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCpf(!showCpf)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCpf ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Botão Acessar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Acessando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          
          {/* Link Cadastrar */}
          <div className="mt-6 text-center">
            <span className="text-gray-500">Ainda não tem uma conta? </span>
            <button
              onClick={() => navigate('/cadastro')}
              className="text-red-500 font-semibold hover:underline"
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-xs text-gray-400">Tutoria PEI FRAN 2024</p>
      </div>
    </div>
  );
}
