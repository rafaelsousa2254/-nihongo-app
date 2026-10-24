let cachedVoice: SpeechSynthesisVoice | null = null;
let voiceChecked = false;

function getJaVoice(): SpeechSynthesisVoice | null {
  if (voiceChecked) return cachedVoice;
  voiceChecked = true;
  if (typeof window === 'undefined') return null;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice =
    voices.find((v) => v.lang === 'ja-JP') ||
    voices.find((v) => v.lang.startsWith('ja-JP')) ||
    voices.find((v) => v.lang.startsWith('ja')) ||
    null;
  return cachedVoice;
}

export function SpeakJapanese(text: string): void {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voice = getJaVoice();
  if (voice) u.voice = voice;
  u.lang = 'ja-JP';
  u.rate = 1;
  u.pitch = 1;
  u.volume = 1;
  window.speechSynthesis.speak(u);
}

export function stopAudio(): void {
  if (typeof window !== 'undefined') {
    window.speechSynthesis.cancel();
  }
}

export function playHiraganaAudio(char: string): void {
  SpeakJapanese(char);
}

export function playKatakanaAudio(char: string): void {
  SpeakJapanese(char);
}

export function playKanjiAudio(kanji: string, reading: string): void {
  SpeakJapanese(reading);
}

export function playWordAudio(word: string, reading: string): void {
  SpeakJapanese(reading || word);
}

export function playSentenceAudio(sentence: string): void {
  SpeakJapanese(sentence);
}

let recognition: SpeechRecognition | null = null;

export function CheckVoiceSupport(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) &&
    'speechSynthesis' in window
  );
}

export function GetJapaneseVoice(): SpeechSynthesisVoice | null {
  return getJaVoice();
}

export function RecognizeSpeech(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Speech recognition not available'));
      return;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      reject(new Error('Speech recognition not supported'));
      return;
    }

    if (recognition) {
      recognition.abort();
    }

    recognition = new SpeechRecognitionAPI();
    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech') {
        reject(new Error('Nenhuma fala detectada. Tente novamente.'));
      } else if (event.error === 'not-allowed') {
        reject(new Error('Permissão de microfone negada.'));
      } else {
        reject(new Error(`Erro de reconhecimento: ${event.error}`));
      }
    };

    recognition.onend = () => {
      recognition = null;
    };

    recognition.start();
  });
}

export function calculateSimilarity(original: string, spoken: string): number {
  const clean = (s: string) =>
    s.replace(/\s+/g, '').replace(/[。、！？.!?,]/g, '');
  const a = clean(original);
  const b = clean(spoken);

  if (a === b) return 100;
  if (!a || !b) return 0;

  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const maxLen = Math.max(a.length, b.length);
  const distance = matrix[a.length][b.length];
  return Math.round(((maxLen - distance) / maxLen) * 100);
}
