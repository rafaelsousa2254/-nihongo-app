'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  Library,
  MessageSquare,
  Mic,
  Brain,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  Swords,
  Timer,
  Pill,
  Dna,
  Radar,
  NotebookPen,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navLinks: NavLink[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Hiragana', href: '/hiragana', icon: BookOpen },
  { name: 'Katakana', href: '/katakana', icon: Bookmark },
  { name: 'Kanji', href: '/kanji', icon: Library },
  { name: 'Vocabulário', href: '/vocabulary', icon: BookOpen },
  { name: 'Gramática', href: '/grammar', icon: BookOpen },
  { name: 'Flashcards', href: '/flashcards', icon: Brain },
  { name: 'Conversação', href: '/conversation', icon: MessageSquare },
  { name: 'Pronúncia', href: '/practice/pronunciation', icon: Mic },
  { name: 'JLPT', href: '/jlpt', icon: GraduationCap },
  { name: 'Radar', href: '/japanese-radar', icon: Radar },
  { name: 'Caderno Erros', href: '/error-notebook', icon: NotebookPen },
  { name: 'Kanji DNA', href: '/kanji-dna', icon: Dna },
  { name: 'Boss Battle', href: '/boss-battle', icon: Swords },
  { name: 'Survival', href: '/survival', icon: Timer },
  { name: 'Cápsula Diária', href: '/daily-capsule', icon: Pill },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { user, level } = useAppStore();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/25">
            日
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-xl font-bold text-white">日本語</h1>
              <p className="text-xs text-slate-400">Nihongo App</p>
            </motion.div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
              {!collapsed && <span>{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800">
        <div
          className={`flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Estudante'}</p>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-400 rounded">
                  N5
                </span>
                <span className="text-xs text-slate-400">Nível {level}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-slate-900/95 border-r border-slate-800 backdrop-blur-xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <aside
        className={`hidden lg:flex flex-col h-screen bg-slate-900/80 border-r border-slate-800/50 backdrop-blur-xl transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
        {sidebarContent}
      </aside>
    </>
  );
}
