'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpeakJapanese, RecognizeSpeech, CheckVoiceSupport } from '@/lib/speech';
import { japaneseToRomaji } from '@/lib/romaji';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  romaji?: string;
  timestamp: Date;
};

export default function ConversationPage() {
  const [activeMode, setActiveMode] = useState('voice');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'こんにちは！わたしはにほんごのアシスタントです。',
      romaji: 'Konnichiwa! Watashi wa nihongo no ashisutanto desu.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [currentRomaji, setCurrentRomaji] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(2);

  useEffect(() => {
    setVoiceSupported(CheckVoiceSupport());
    setTtsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getJapaneseText = (text: string): string => {
    const jpMatch = text.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g);
    return jpMatch ? jpMatch.join(' ') : text;
  };

  const speakMessage = useCallback((text: string) => {
    if (!ttsSupported) return;
    setIsSpeaking(true);
    const jpText = getJapaneseText(text);
    const romaji = japaneseToRomaji(jpText);
    setCurrentRomaji(romaji);
    SpeakJapanese(jpText);
    setTimeout(() => setIsSpeaking(false), 4000);
  }, [ttsSupported]);

  const handleRecord = useCallback(async () => {
    if (!voiceSupported || isRecording) return;
    setIsRecording(true);
    try {
      const text = await RecognizeSpeech();
      setInput(text);
      await sendMessage(text);
    } catch {
      // ignore error
    } finally {
      setIsRecording(false);
    }
  }, [voiceSupported, isRecording]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend) return;

    const userMessage: Message = {
      id: String(msgIdRef.current++),
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const token = localStorage.getItem('token');
    const apiMessages = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: `Responda SOMENTE em japonês. ${m.content}`,
    }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: apiMessages,
          mode: activeMode === 'voice' ? 'conversation' : activeMode,
        }),
      });

      if (!response.ok) throw new Error('API error');

      const contentType = response.headers.get('content-type');
      const aiId = String(msgIdRef.current++);

      if (contentType?.includes('text/plain')) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let streamContent = '';

        setMessages((prev) => [
          ...prev,
          { id: aiId, role: 'assistant', content: '', timestamp: new Date() },
        ]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            streamContent += decoder.decode(value, { stream: true });
            const romaji = japaneseToRomaji(getJapaneseText(streamContent));
            setMessages((prev) =>
              prev.map((m) => (m.id === aiId ? { ...m, content: streamContent, romaji } : m))
            );
          }
          speakMessage(streamContent);
        }
      } else {
        const data = await response.json();
        const responseText = data.message || data.error || 'ごめんなさい。もう一度おねがいします。';
        const romaji = japaneseToRomaji(getJapaneseText(responseText));
        setMessages((prev) => [
          ...prev,
          { id: aiId, role: 'assistant', content: responseText, romaji, timestamp: new Date() },
        ]);
        speakMessage(responseText);
      }
    } catch {
      const fallback = 'ごめんなさい。サーバーに接続できません。もう一度おねがいします。';
      const romaji = japaneseToRomaji(getJapaneseText(fallback));
      setMessages((prev) => [
        ...prev,
        { id: String(msgIdRef.current++), role: 'assistant', content: fallback, romaji, timestamp: new Date() },
      ]);
      speakMessage(fallback);
    } finally {
      setIsTyping(false);
    }
  };

  const modes = [
    { id: 'voice', label: 'Voz', icon: '🎙️', desc: 'Conversa por voz com IA' },
    { id: 'text', label: 'Texto', icon: '💬', desc: 'Chat por escrito' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeMode === mode.id
                ? 'bg-[#0ea5e9] text-white'
                : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155]'
            }`}
          >
            <span>{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass rounded-xl overflow-hidden flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#0ea5e9] text-white'
                      : 'bg-[#0f172a] text-white'
                  }`}
                >
                  <div className="text-lg">{msg.content}</div>
                  {msg.romaji && (
                    <div className={`text-xs mt-1 italic ${
                      msg.role === 'user' ? 'text-white/50' : 'text-[#0ea5e9]/70'
                    }`}>
                      {msg.romaji}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs ${msg.role === 'user' ? 'text-white/60' : 'text-[#64748b]'}`}>
                      {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.role === 'assistant' && ttsSupported && (
                      <button
                        onClick={() => speakMessage(msg.content)}
                        className="text-xs text-[#0ea5e9] hover:text-[#38bdf8] transition-colors"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="bg-[#0f172a] rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#0ea5e9] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Romaji Display */}
        {currentRomaji && isSpeaking && (
          <div className="px-4 py-3 border-t border-[#334155] bg-[#0ea5e9]/5">
            <div className="text-center">
              <span className="text-xs text-[#94a3b8]">Romaji: </span>
              <span className="text-sm text-[#0ea5e9] font-medium">{currentRomaji}</span>
            </div>
          </div>
        )}

        {/* Voice Chat - Big Mic Button */}
        {activeMode === 'voice' ? (
          <div className="p-6 border-t border-[#334155] flex flex-col items-center gap-4">
            <p className="text-sm text-[#94a3b8]">
              {isRecording ? '🎤 Ouvindo...' : isSpeaking ? '🔊 Falando...' : 'Pressione o microfone para falar'}
            </p>
            <button
              onClick={handleRecord}
              disabled={isRecording || isTyping || isSpeaking || !voiceSupported}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all ${
                isRecording
                  ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/30 scale-110'
                  : 'bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] hover:shadow-lg hover:shadow-[#0ea5e9]/25 hover:scale-105'
              } disabled:opacity-50`}
            >
              {isRecording ? '⏹' : '🎤'}
            </button>
            {!voiceSupported && (
              <p className="text-xs text-[#94a3b8]">Modo texto: digite sua mensagem. A IA vai responder com voz.</p>
            )}
          </div>
        ) : (
          /* Text Input */
          <div className="p-4 border-t border-[#334155] flex gap-3">
            {voiceSupported && (
              <button
                onClick={handleRecord}
                disabled={isRecording || isTyping}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#1e293b] text-[#94a3b8] hover:bg-[#334155] hover:text-white'
                }`}
              >
                {isRecording ? '⏹' : '🎤'}
              </button>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Digite em japonês..."
              className="flex-1 px-4 py-3 bg-[#0f172a] border border-[#334155] rounded-xl focus:border-[#0ea5e9] focus:outline-none text-white placeholder-[#64748b]"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="px-6 py-3 bg-[#0ea5e9] text-white rounded-xl font-medium hover:bg-[#38bdf8] transition-all disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
