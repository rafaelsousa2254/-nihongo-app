'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsPage() {
  const router = useRouter();
  const {
    logout, theme, toggleTheme, language, setLanguage,
    notifications, setNotifications, reminder, setReminder,
    reminderTime, setReminderTime, audioEnabled, setAudioEnabled,
    autoPlay, setAutoPlay, difficulty, setDifficulty,
  } = useAppStore();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    router.push('/');
  };

  const handleEditProfile = async () => {
    if (!profileName || profileName.length < 3) {
      setMessage('Nome deve ter pelo menos 3 caracteres');
      return;
    }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Perfil atualizado com sucesso!');
        setShowEditProfile(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      setMessage('Erro ao atualizar perfil');
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setMessage('Preencha todos os campos');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setMessage('Senha alterada com sucesso!');
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await res.json();
        setMessage(data.error || 'Erro ao alterar senha');
      }
    } catch {
      setMessage('Erro ao alterar senha');
    }
  };

  const handleExportData = () => {
    const storeData = typeof window !== 'undefined' ? localStorage.getItem('nihongo-journey-storage') : null;
    if (storeData) {
      const blob = new Blob([storeData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nihongo-journey-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Dados exportados com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">⚙️ Configurações</h1>
        <p className="text-[var(--text-secondary)]">Personalize sua experiência de aprendizado</p>
      </motion.div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.includes('sucesso') ? 'bg-[var(--success)]/20 text-[var(--success)]' : 'bg-[var(--danger)]/20 text-[var(--danger)]'}`}>
          {message}
        </div>
      )}

      {/* Appearance */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">🎨 Aparência</h3>
        <div className="flex items-center justify-between py-3 border-b border-[var(--bg-tertiary)]">
          <div>
            <div className="text-sm text-[var(--text-primary)]">Tema</div>
            <div className="text-xs text-[var(--text-secondary)]">Escolha entre escuro e claro</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                theme === 'dark' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
              }`}
            >
              🌙 Escuro
            </button>
            <button
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                theme === 'light' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
              }`}
            >
              ☀️ Claro
            </button>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">🔔 Notificações</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--bg-tertiary)]">
            <div>
              <div className="text-sm text-[var(--text-primary)]">Notificações Push</div>
              <div className="text-xs text-[var(--text-secondary)]">Receba alertas no seu dispositivo</div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-all ${notifications ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--bg-tertiary)]">
            <div>
              <div className="text-sm text-[var(--text-primary)]">Lembrete de Estudo</div>
              <div className="text-xs text-[var(--text-secondary)]">Receba um lembrete diário para estudar</div>
            </div>
            <button
              onClick={() => setReminder(!reminder)}
              className={`w-12 h-6 rounded-full transition-all ${reminder ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${reminder ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          {reminder && (
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="text-sm text-[var(--text-primary)]">Horário do Lembrete</div>
                <div className="text-xs text-[var(--text-secondary)]">Escolha o horário ideal</div>
              </div>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Audio */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">🔊 Áudio</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--bg-tertiary)]">
            <div>
              <div className="text-sm text-[var(--text-primary)]">Áudio Habilitado</div>
              <div className="text-xs text-[var(--text-secondary)]">Reproduzir sons ao interagir</div>
            </div>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`w-12 h-6 rounded-full transition-all ${audioEnabled ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${audioEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm text-[var(--text-primary)]">Reprodução Automática</div>
              <div className="text-xs text-[var(--text-secondary)]">Tocar áudio automaticamente nos flashcards</div>
            </div>
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`w-12 h-6 rounded-full transition-all ${autoPlay ? 'bg-[var(--accent)]' : 'bg-[var(--bg-tertiary)]'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${autoPlay ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">🌐 Idioma e Dificuldade</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[var(--bg-tertiary)]">
            <div>
              <div className="text-sm text-[var(--text-primary)]">Idioma do App</div>
              <div className="text-xs text-[var(--text-secondary)]">Idioma da interface</div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm text-[var(--text-primary)]">Nível de Dificuldade</div>
              <div className="text-xs text-[var(--text-secondary)]">Velocidade de Progressão</div>
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--bg-tertiary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
            >
              <option value="iniciante">Iniciante</option>
              <option value="intermediario">Intermediário</option>
              <option value="avancado">Avançado</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Account */}
      <motion.div
        className="glass rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="font-semibold text-[var(--text-primary)] mb-4">👤 Conta</h3>
        <div className="space-y-3">
          {showEditProfile ? (
            <div className="p-4 bg-[var(--bg-primary)] rounded-lg space-y-3">
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Novo nome de usuário"
                className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />
              <div className="flex gap-2">
                <button onClick={handleEditProfile} className="flex-1 py-2 bg-[var(--accent)] text-white rounded-lg text-sm">Salvar</button>
                <button onClick={() => setShowEditProfile(false)} className="flex-1 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-sm">Cancelar</button>
              </div>
            </div>
          ) : (
            <button onClick={() => { setShowEditProfile(true); setProfileName(''); }} className="w-full py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg transition-all text-sm">
              Editar Perfil
            </button>
          )}

          {showChangePassword ? (
            <div className="p-4 bg-[var(--bg-primary)] rounded-lg space-y-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Senha atual"
                className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nova senha (mínimo 6 caracteres)"
                className="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
              />
              <div className="flex gap-2">
                <button onClick={handleChangePassword} className="flex-1 py-2 bg-[var(--accent)] text-white rounded-lg text-sm">Alterar</button>
                <button onClick={() => setShowChangePassword(false)} className="flex-1 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg text-sm">Cancelar</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowChangePassword(true)} className="w-full py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg transition-all text-sm">
              Alterar Senha
            </button>
          )}

          <div className="flex gap-3">
            <button onClick={handleExportData} className="flex-1 py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg transition-all text-sm">
              📤 Exportar Dados
            </button>
            <label className="flex-1 py-3 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg transition-all text-sm text-center cursor-pointer">
              📥 Importar Dados
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = (ev) => {
                    try {
                      const data = JSON.parse(ev.target?.result as string)
                      localStorage.setItem('nihongo-journey-storage', JSON.stringify(data))
                      setMessage('Dados importados com sucesso! Recarregue a página.')
                      setTimeout(() => setMessage(''), 3000)
                    } catch {
                      setMessage('Erro ao importar: arquivo inválido')
                    }
                  }
                  reader.readAsText(file)
                }}
              />
            </label>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-[var(--danger)]/20 hover:bg-[var(--danger)]/30 text-[var(--danger)] rounded-lg transition-all text-sm"
          >
            Sair da Conta
          </button>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        className="glass rounded-xl p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="text-2xl font-bold text-[var(--accent)] mb-2">日本語 Journey</div>
        <div className="text-sm text-[var(--text-secondary)]">Versão 1.0.0</div>
        <div className="text-xs text-[var(--text-secondary)] mt-2">Feito com ❤️ para aprender japonês</div>
      </motion.div>
    </div>
  );
}
