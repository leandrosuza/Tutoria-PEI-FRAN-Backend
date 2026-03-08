import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '@/services/api';
import { User, Lock, ArrowLeft } from 'lucide-react';

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nome: '', cpf: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

    const cpfLimpo = formData.cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      setError('CPF deve ter 11 dígitos');
      setLoading(false);
      return;
    }

    try {
      await usuarioService.create({ nome: formData.nome, cpf: cpfLimpo, perfil: 'PROFESSOR' });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Erro ao cadastrar. CPF já pode estar em uso.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cadastro realizado!</h2>
          <p className="text-gray-500">Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-8 px-6">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">Voltar</span>
        </button>
        <div className="border-l-4 border-red-500 pl-4">
          <p className="text-sm text-gray-500 mb-1">Crie sua conta no</p>
          <h1 className="text-2xl font-bold text-gray-900">Sistema de Tutoria PEI</h1>
        </div>
        <p className="text-sm text-gray-500 mt-3 ml-5">Preencha seus dados para se cadastrar</p>
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
              <label className="block text-sm text-gray-600 mb-2">Nome completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  placeholder="Digite seu nome completo"
                  required
                />
              </div>
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">CPF</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-4 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">O CPF será usado como senha de acesso</p>
            </div>

            {/* Botão Cadastrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Cadastrando...
                </span>
              ) : (
                'Cadastrar'
              )}
            </button>
          </form>

          {/* Link Login */}
          <div className="mt-6 text-center">
            <span className="text-gray-500">Já tem uma conta? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-red-500 font-semibold hover:underline"
            >
              Entrar
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
