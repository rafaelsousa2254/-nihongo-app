'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

const floatingKanji = ['日', '本', '語', '学', '習', '先', '生', '友', '達', '大', '小', '中', '上', '下', '左', '右', '新', '古', '高', '安'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function FloatingKanji() {
  const kanjiData = useMemo(() =>
    floatingKanji.map((kanji, i) => ({
      kanji,
      x: seededRandom(i * 7 + 1) * 100,
      duration: 15 + seededRandom(i * 13 + 3) * 20,
      delay: seededRandom(i * 17 + 5) * 10,
    })),
  []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {kanjiData.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-[#0ea5e9]/10 text-6xl font-bold select-none"
          initial={{ y: '110vh', x: `${item.x}vw`, rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: 360,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'linear',
          }}
        >
          {item.kanji}
        </motion.div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAppStore((s) => s.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao entrar');
        return;
      }

      login(data.user, data.token);
      window.location.href = '/dashboard';
    } catch {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.length < 3) {
      setError('Nome de usuário deve ter pelo menos 3 caracteres');
      return;
    }

    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao registrar');
        return;
      }

      setSuccess('Conta criada com sucesso! Agora faça login.');
      setUsername('');
      setPassword('');
      setTimeout(() => {
        setIsLogin(true);
        setSuccess('');
      }, 2000);
    } catch {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      <FloatingKanji />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <motion.h1
            className="text-5xl font-bold text-[#0ea5e9] mb-2"
            style={{ textShadow: '0 0 10px #0ea5e9, 0 0 20px #0ea5e9, 0 0 40px rgba(14,165,233,0.3)' }}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            日本語 Journey
          </motion.h1>
          <p className="text-[#94a3b8] text-lg">Aprenda Japonês do seu jeito</p>
        </div>

        <div className="glass rounded-2xl p-8">
          <div className="flex mb-6 bg-[#0f172a] rounded-lg p-1">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-md transition-all ${isLogin ? 'bg-[#0ea5e9] text-white' : 'text-[#94a3b8]'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-md transition-all ${!isLogin ? 'bg-[#0ea5e9] text-white' : 'text-[#94a3b8]'}`}
            >
              Registrar
            </button>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                onSubmit={handleLogin}
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label htmlFor="login-username" className="block text-sm text-[#94a3b8] mb-1">Usuário</label>
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-[#0ea5e9] focus:outline-none text-white"
                    placeholder="Seu nome de usuário"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm text-[#94a3b8] mb-1">Senha</label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-[#0ea5e9] focus:outline-none text-white"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0ea5e9] hover:bg-[#38bdf8] text-white font-bold rounded-lg transition-all neon-glow disabled:opacity-50"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                onSubmit={handleRegister}
                className="space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <label htmlFor="register-username" className="block text-sm text-[#94a3b8] mb-1">Usuário</label>
                  <input
                    id="register-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-[#0ea5e9] focus:outline-none text-white"
                    placeholder="Escolha um nome de usuário"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label htmlFor="register-password" className="block text-sm text-[#94a3b8] mb-1">Senha</label>
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-lg focus:border-[#0ea5e9] focus:outline-none text-white"
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
                {success && (
                  <p className="text-green-400 text-sm text-center">{success}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0ea5e9] hover:bg-[#38bdf8] text-white font-bold rounded-lg transition-all neon-glow disabled:opacity-50"
                >
                  {loading ? 'Criando conta...' : 'Criar conta'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
