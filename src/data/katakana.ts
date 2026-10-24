export interface KatakanaCharacter {
  id: string;
  character: string;
  romanization: string;
  audio: string;
  group: 'basic' | 'dakuten' | 'handakuten' | 'combo';
  strokes: number;
}

export const katakana: KatakanaCharacter[] = [
  // Basic Katakana (46 characters)
  // A row
  { id: 'a', character: 'ア', romanization: 'a', audio: '/audio/katakana/a.mp3', group: 'basic', strokes: 2 },
  { id: 'i', character: 'イ', romanization: 'i', audio: '/audio/katakana/i.mp3', group: 'basic', strokes: 2 },
  { id: 'u', character: 'ウ', romanization: 'u', audio: '/audio/katakana/u.mp3', group: 'basic', strokes: 3 },
  { id: 'e', character: 'エ', romanization: 'e', audio: '/audio/katakana/e.mp3', group: 'basic', strokes: 3 },
  { id: 'o', character: 'オ', romanization: 'o', audio: '/audio/katakana/o.mp3', group: 'basic', strokes: 4 },
  
  // Ka row
  { id: 'ka', character: 'カ', romanization: 'ka', audio: '/audio/katakana/ka.mp3', group: 'basic', strokes: 2 },
  { id: 'ki', character: 'キ', romanization: 'ki', audio: '/audio/katakana/ki.mp3', group: 'basic', strokes: 3 },
  { id: 'ku', character: 'ク', romanization: 'ku', audio: '/audio/katakana/ku.mp3', group: 'basic', strokes: 2 },
  { id: 'ke', character: 'ケ', romanization: 'ke', audio: '/audio/katakana/ke.mp3', group: 'basic', strokes: 2 },
  { id: 'ko', character: 'コ', romanization: 'ko', audio: '/audio/katakana/ko.mp3', group: 'basic', strokes: 2 },
  
  // Sa row
  { id: 'sa', character: 'サ', romanization: 'sa', audio: '/audio/katakana/sa.mp3', group: 'basic', strokes: 3 },
  { id: 'shi', character: 'シ', romanization: 'shi', audio: '/audio/katakana/shi.mp3', group: 'basic', strokes: 3 },
  { id: 'su', character: 'ス', romanization: 'su', audio: '/audio/katakana/su.mp3', group: 'basic', strokes: 2 },
  { id: 'se', character: 'セ', romanization: 'se', audio: '/audio/katakana/se.mp3', group: 'basic', strokes: 2 },
  { id: 'so', character: 'ソ', romanization: 'so', audio: '/audio/katakana/so.mp3', group: 'basic', strokes: 2 },
  
  // Ta row
  { id: 'ta', character: 'タ', romanization: 'ta', audio: '/audio/katakana/ta.mp3', group: 'basic', strokes: 3 },
  { id: 'chi', character: 'チ', romanization: 'chi', audio: '/audio/katakana/chi.mp3', group: 'basic', strokes: 3 },
  { id: 'tsu', character: 'ツ', romanization: 'tsu', audio: '/audio/katakana/tsu.mp3', group: 'basic', strokes: 3 },
  { id: 'te', character: 'テ', romanization: 'te', audio: '/audio/katakana/te.mp3', group: 'basic', strokes: 3 },
  { id: 'to', character: 'ト', romanization: 'to', audio: '/audio/katakana/to.mp3', group: 'basic', strokes: 2 },
  
  // Na row
  { id: 'na', character: 'ナ', romanization: 'na', audio: '/audio/katakana/na.mp3', group: 'basic', strokes: 2 },
  { id: 'ni', character: 'ニ', romanization: 'ni', audio: '/audio/katakana/ni.mp3', group: 'basic', strokes: 2 },
  { id: 'nu', character: 'ヌ', romanization: 'nu', audio: '/audio/katakana/nu.mp3', group: 'basic', strokes: 2 },
  { id: 'ne', character: 'ネ', romanization: 'ne', audio: '/audio/katakana/ne.mp3', group: 'basic', strokes: 4 },
  { id: 'no', character: 'ノ', romanization: 'no', audio: '/audio/katakana/no.mp3', group: 'basic', strokes: 1 },
  
  // Ha row
  { id: 'ha', character: 'ハ', romanization: 'ha', audio: '/audio/katakana/ha.mp3', group: 'basic', strokes: 2 },
  { id: 'hi', character: 'ヒ', romanization: 'hi', audio: '/audio/katakana/hi.mp3', group: 'basic', strokes: 2 },
  { id: 'fu', character: 'フ', romanization: 'fu', audio: '/audio/katakana/fu.mp3', group: 'basic', strokes: 1 },
  { id: 'he', character: 'ヘ', romanization: 'he', audio: '/audio/katakana/he.mp3', group: 'basic', strokes: 1 },
  { id: 'ho', character: 'ホ', romanization: 'ho', audio: '/audio/katakana/ho.mp3', group: 'basic', strokes: 4 },
  
  // Ma row
  { id: 'ma', character: 'マ', romanization: 'ma', audio: '/audio/katakana/ma.mp3', group: 'basic', strokes: 3 },
  { id: 'mi', character: 'ミ', romanization: 'mi', audio: '/audio/katakana/mi.mp3', group: 'basic', strokes: 3 },
  { id: 'mu', character: 'ム', romanization: 'mu', audio: '/audio/katakana/mu.mp3', group: 'basic', strokes: 2 },
  { id: 'me', character: 'メ', romanization: 'me', audio: '/audio/katakana/me.mp3', group: 'basic', strokes: 2 },
  { id: 'mo', character: 'モ', romanization: 'mo', audio: '/audio/katakana/mo.mp3', group: 'basic', strokes: 3 },
  
  // Ya row
  { id: 'ya', character: 'ヤ', romanization: 'ya', audio: '/audio/katakana/ya.mp3', group: 'basic', strokes: 2 },
  { id: 'yu', character: 'ユ', romanization: 'yu', audio: '/audio/katakana/yu.mp3', group: 'basic', strokes: 2 },
  { id: 'yo', character: 'ヨ', romanization: 'yo', audio: '/audio/katakana/yo.mp3', group: 'basic', strokes: 3 },
  
  // Ra row
  { id: 'ra', character: 'ラ', romanization: 'ra', audio: '/audio/katakana/ra.mp3', group: 'basic', strokes: 3 },
  { id: 'ri', character: 'リ', romanization: 'ri', audio: '/audio/katakana/ri.mp3', group: 'basic', strokes: 2 },
  { id: 'ru', character: 'ル', romanization: 'ru', audio: '/audio/katakana/ru.mp3', group: 'basic', strokes: 3 },
  { id: 're', character: 'レ', romanization: 're', audio: '/audio/katakana/re.mp3', group: 'basic', strokes: 2 },
  { id: 'ro', character: 'ロ', romanization: 'ro', audio: '/audio/katakana/ro.mp3', group: 'basic', strokes: 3 },
  
  // Wa row
  { id: 'wa', character: 'ワ', romanization: 'wa', audio: '/audio/katakana/wa.mp3', group: 'basic', strokes: 2 },
  { id: 'wo', character: 'ヲ', romanization: 'wo', audio: '/audio/katakana/wo.mp3', group: 'basic', strokes: 3 },
  
  // N
  { id: 'n', character: 'ン', romanization: 'n', audio: '/audio/katakana/n.mp3', group: 'basic', strokes: 1 },
  
  // Dakuten (voiced consonants) - 25 characters
  { id: 'ga', character: 'ガ', romanization: 'ga', audio: '/audio/katakana/ga.mp3', group: 'dakuten', strokes: 2 },
  { id: 'gi', character: 'ギ', romanization: 'gi', audio: '/audio/katakana/gi.mp3', group: 'dakuten', strokes: 3 },
  { id: 'gu', character: 'グ', romanization: 'gu', audio: '/audio/katakana/gu.mp3', group: 'dakuten', strokes: 2 },
  { id: 'ge', character: 'ゲ', romanization: 'ge', audio: '/audio/katakana/ge.mp3', group: 'dakuten', strokes: 2 },
  { id: 'go', character: 'ゴ', romanization: 'go', audio: '/audio/katakana/go.mp3', group: 'dakuten', strokes: 2 },
  
  { id: 'za', character: 'ザ', romanization: 'za', audio: '/audio/katakana/za.mp3', group: 'dakuten', strokes: 3 },
  { id: 'ji', character: 'ジ', romanization: 'ji', audio: '/audio/katakana/ji.mp3', group: 'dakuten', strokes: 3 },
  { id: 'zu', character: 'ズ', romanization: 'zu', audio: '/audio/katakana/zu.mp3', group: 'dakuten', strokes: 2 },
  { id: 'ze', character: 'ゼ', romanization: 'ze', audio: '/audio/katakana/ze.mp3', group: 'dakuten', strokes: 2 },
  { id: 'zo', character: 'ゾ', romanization: 'zo', audio: '/audio/katakana/zo.mp3', group: 'dakuten', strokes: 2 },
  
  { id: 'da', character: 'ダ', romanization: 'da', audio: '/audio/katakana/da.mp3', group: 'dakuten', strokes: 3 },
  { id: 'di', character: 'ヂ', romanization: 'ji', audio: '/audio/katakana/di.mp3', group: 'dakuten', strokes: 3 },
  { id: 'du', character: 'ヅ', romanization: 'zu', audio: '/audio/katakana/du.mp3', group: 'dakuten', strokes: 3 },
  { id: 'de', character: 'デ', romanization: 'de', audio: '/audio/katakana/de.mp3', group: 'dakuten', strokes: 3 },
  { id: 'do', character: 'ド', romanization: 'do', audio: '/audio/katakana/do.mp3', group: 'dakuten', strokes: 2 },
  
  { id: 'ba', character: 'バ', romanization: 'ba', audio: '/audio/katakana/ba.mp3', group: 'dakuten', strokes: 2 },
  { id: 'bi', character: 'ビ', romanization: 'bi', audio: '/audio/katakana/bi.mp3', group: 'dakuten', strokes: 2 },
  { id: 'bu', character: 'ブ', romanization: 'bu', audio: '/audio/katakana/bu.mp3', group: 'dakuten', strokes: 2 },
  { id: 'be', character: 'ベ', romanization: 'be', audio: '/audio/katakana/be.mp3', group: 'dakuten', strokes: 2 },
  { id: 'bo', character: 'ボ', romanization: 'bo', audio: '/audio/katakana/bo.mp3', group: 'dakuten', strokes: 4 },
  
  // Handakuten (semi-voiced consonants) - 5 characters
  { id: 'pa', character: 'パ', romanization: 'pa', audio: '/audio/katakana/pa.mp3', group: 'handakuten', strokes: 2 },
  { id: 'pi', character: 'ピ', romanization: 'pi', audio: '/audio/katakana/pi.mp3', group: 'handakuten', strokes: 2 },
  { id: 'pu', character: 'プ', romanization: 'pu', audio: '/audio/katakana/pu.mp3', group: 'handakuten', strokes: 2 },
  { id: 'pe', character: 'ペ', romanization: 'pe', audio: '/audio/katakana/pe.mp3', group: 'handakuten', strokes: 2 },
  { id: 'po', character: 'ポ', romanization: 'po', audio: '/audio/katakana/po.mp3', group: 'handakuten', strokes: 4 },
  
  // Combo Katakana (36 characters)
  { id: 'kya', character: 'キャ', romanization: 'kya', audio: '/audio/katakana/kya.mp3', group: 'combo', strokes: 3 },
  { id: 'kyu', character: 'キュ', romanization: 'kyu', audio: '/audio/katakana/kyu.mp3', group: 'combo', strokes: 3 },
  { id: 'kyo', character: 'キョ', romanization: 'kyo', audio: '/audio/katakana/kyo.mp3', group: 'combo', strokes: 3 },
  
  { id: 'sha', character: 'シャ', romanization: 'sha', audio: '/audio/katakana/sha.mp3', group: 'combo', strokes: 3 },
  { id: 'shu', character: 'シュ', romanization: 'shu', audio: '/audio/katakana/shu.mp3', group: 'combo', strokes: 3 },
  { id: 'sho', character: 'ショ', romanization: 'sho', audio: '/audio/katakana/sho.mp3', group: 'combo', strokes: 3 },
  
  { id: 'cha', character: 'チャ', romanization: 'cha', audio: '/audio/katakana/cha.mp3', group: 'combo', strokes: 3 },
  { id: 'chu', character: 'チュ', romanization: 'chu', audio: '/audio/katakana/chu.mp3', group: 'combo', strokes: 3 },
  { id: 'cho', character: 'チョ', romanization: 'cho', audio: '/audio/katakana/cho.mp3', group: 'combo', strokes: 3 },
  
  { id: 'nya', character: 'ニャ', romanization: 'nya', audio: '/audio/katakana/nya.mp3', group: 'combo', strokes: 2 },
  { id: 'nyu', character: 'ニュ', romanization: 'nyu', audio: '/audio/katakana/nyu.mp3', group: 'combo', strokes: 2 },
  { id: 'nyo', character: 'ニョ', romanization: 'nyo', audio: '/audio/katakana/nyo.mp3', group: 'combo', strokes: 2 },
  
  { id: 'hya', character: 'ヒャ', romanization: 'hya', audio: '/audio/katakana/hya.mp3', group: 'combo', strokes: 2 },
  { id: 'hyu', character: 'ヒュ', romanization: 'hyu', audio: '/audio/katakana/hyu.mp3', group: 'combo', strokes: 2 },
  { id: 'hyo', character: 'ヒョ', romanization: 'hyo', audio: '/audio/katakana/hyo.mp3', group: 'combo', strokes: 2 },
  
  { id: 'mya', character: 'ミャ', romanization: 'mya', audio: '/audio/katakana/mya.mp3', group: 'combo', strokes: 3 },
  { id: 'myu', character: 'ミュ', romanization: 'myu', audio: '/audio/katakana/myu.mp3', group: 'combo', strokes: 3 },
  { id: 'myo', character: 'ミョ', romanization: 'myo', audio: '/audio/katakana/myo.mp3', group: 'combo', strokes: 3 },
  
  { id: 'rya', character: 'リャ', romanization: 'rya', audio: '/audio/katakana/rya.mp3', group: 'combo', strokes: 2 },
  { id: 'ryu', character: 'リュ', romanization: 'ryu', audio: '/audio/katakana/ryu.mp3', group: 'combo', strokes: 2 },
  { id: 'ryo', character: 'リョ', romanization: 'ryo', audio: '/audio/katakana/ryo.mp3', group: 'combo', strokes: 2 },
  
  { id: 'gya', character: 'ギャ', romanization: 'gya', audio: '/audio/katakana/gya.mp3', group: 'combo', strokes: 3 },
  { id: 'gyu', character: 'ギュ', romanization: 'gyu', audio: '/audio/katakana/gyu.mp3', group: 'combo', strokes: 3 },
  { id: 'gyo', character: 'ギョ', romanization: 'gyo', audio: '/audio/katakana/gyo.mp3', group: 'combo', strokes: 3 },
  
  { id: 'ja', character: 'ジャ', romanization: 'ja', audio: '/audio/katakana/ja.mp3', group: 'combo', strokes: 3 },
  { id: 'ju', character: 'ジュ', romanization: 'ju', audio: '/audio/katakana/ju.mp3', group: 'combo', strokes: 3 },
  { id: 'jo', character: 'ジョ', romanization: 'jo', audio: '/audio/katakana/jo.mp3', group: 'combo', strokes: 3 },
  
  { id: 'bya', character: 'ビャ', romanization: 'bya', audio: '/audio/katakana/bya.mp3', group: 'combo', strokes: 2 },
  { id: 'byu', character: 'ビュ', romanization: 'byu', audio: '/audio/katakana/byu.mp3', group: 'combo', strokes: 2 },
  { id: 'byo', character: 'ビョ', romanization: 'byo', audio: '/audio/katakana/byo.mp3', group: 'combo', strokes: 2 },
  
  { id: 'pya', character: 'ピャ', romanization: 'pya', audio: '/audio/katakana/pya.mp3', group: 'combo', strokes: 2 },
  { id: 'pyu', character: 'ピュ', romanization: 'pyu', audio: '/audio/katakana/pyu.mp3', group: 'combo', strokes: 2 },
  { id: 'pyo', character: 'ピョ', romanization: 'pyo', audio: '/audio/katakana/pyo.mp3', group: 'combo', strokes: 2 },
];

export default katakana;