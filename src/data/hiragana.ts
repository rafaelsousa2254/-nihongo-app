export interface HiraganaCharacter {
  id: string;
  character: string;
  romanization: string;
  audio: string;
  group: 'basic' | 'dakuten' | 'handakuten' | 'combo';
  strokes: number;
}

export const hiragana: HiraganaCharacter[] = [
  // Basic Hiragana (46 characters)
  // A row
  { id: 'a', character: 'あ', romanization: 'a', audio: '/audio/hiragana/a.mp3', group: 'basic', strokes: 3 },
  { id: 'i', character: 'い', romanization: 'i', audio: '/audio/hiragana/i.mp3', group: 'basic', strokes: 2 },
  { id: 'u', character: 'う', romanization: 'u', audio: '/audio/hiragana/u.mp3', group: 'basic', strokes: 2 },
  { id: 'e', character: 'え', romanization: 'e', audio: '/audio/hiragana/e.mp3', group: 'basic', strokes: 2 },
  { id: 'o', character: 'お', romanization: 'o', audio: '/audio/hiragana/o.mp3', group: 'basic', strokes: 3 },
  
  // Ka row
  { id: 'ka', character: 'か', romanization: 'ka', audio: '/audio/hiragana/ka.mp3', group: 'basic', strokes: 3 },
  { id: 'ki', character: 'き', romanization: 'ki', audio: '/audio/hiragana/ki.mp3', group: 'basic', strokes: 4 },
  { id: 'ku', character: 'く', romanization: 'ku', audio: '/audio/hiragana/ku.mp3', group: 'basic', strokes: 1 },
  { id: 'ke', character: 'け', romanization: 'ke', audio: '/audio/hiragana/ke.mp3', group: 'basic', strokes: 3 },
  { id: 'ko', character: 'こ', romanization: 'ko', audio: '/audio/hiragana/ko.mp3', group: 'basic', strokes: 2 },
  
  // Sa row
  { id: 'sa', character: 'さ', romanization: 'sa', audio: '/audio/hiragana/sa.mp3', group: 'basic', strokes: 3 },
  { id: 'shi', character: 'し', romanization: 'shi', audio: '/audio/hiragana/shi.mp3', group: 'basic', strokes: 1 },
  { id: 'su', character: 'す', romanization: 'su', audio: '/audio/hiragana/su.mp3', group: 'basic', strokes: 2 },
  { id: 'se', character: 'せ', romanization: 'se', audio: '/audio/hiragana/se.mp3', group: 'basic', strokes: 3 },
  { id: 'so', character: 'そ', romanization: 'so', audio: '/audio/hiragana/so.mp3', group: 'basic', strokes: 2 },
  
  // Ta row
  { id: 'ta', character: 'た', romanization: 'ta', audio: '/audio/hiragana/ta.mp3', group: 'basic', strokes: 4 },
  { id: 'chi', character: 'ち', romanization: 'chi', audio: '/audio/hiragana/chi.mp3', group: 'basic', strokes: 2 },
  { id: 'tsu', character: 'つ', romanization: 'tsu', audio: '/audio/hiragana/tsu.mp3', group: 'basic', strokes: 1 },
  { id: 'te', character: 'て', romanization: 'te', audio: '/audio/hiragana/te.mp3', group: 'basic', strokes: 1 },
  { id: 'to', character: 'と', romanization: 'to', audio: '/audio/hiragana/to.mp3', group: 'basic', strokes: 2 },
  
  // Na row
  { id: 'na', character: 'な', romanization: 'na', audio: '/audio/hiragana/na.mp3', group: 'basic', strokes: 4 },
  { id: 'ni', character: 'に', romanization: 'ni', audio: '/audio/hiragana/ni.mp3', group: 'basic', strokes: 3 },
  { id: 'nu', character: 'ぬ', romanization: 'nu', audio: '/audio/hiragana/nu.mp3', group: 'basic', strokes: 2 },
  { id: 'ne', character: 'ね', romanization: 'ne', audio: '/audio/hiragana/ne.mp3', group: 'basic', strokes: 2 },
  { id: 'no', character: 'の', romanization: 'no', audio: '/audio/hiragana/no.mp3', group: 'basic', strokes: 1 },
  
  // Ha row
  { id: 'ha', character: 'は', romanization: 'ha', audio: '/audio/hiragana/ha.mp3', group: 'basic', strokes: 3 },
  { id: 'hi', character: 'ひ', romanization: 'hi', audio: '/audio/hiragana/hi.mp3', group: 'basic', strokes: 1 },
  { id: 'fu', character: 'ふ', romanization: 'fu', audio: '/audio/hiragana/fu.mp3', group: 'basic', strokes: 4 },
  { id: 'he', character: 'へ', romanization: 'he', audio: '/audio/hiragana/he.mp3', group: 'basic', strokes: 1 },
  { id: 'ho', character: 'ほ', romanization: 'ho', audio: '/audio/hiragana/ho.mp3', group: 'basic', strokes: 4 },
  
  // Ma row
  { id: 'ma', character: 'ま', romanization: 'ma', audio: '/audio/hiragana/ma.mp3', group: 'basic', strokes: 3 },
  { id: 'mi', character: 'み', romanization: 'mi', audio: '/audio/hiragana/mi.mp3', group: 'basic', strokes: 2 },
  { id: 'mu', character: 'む', romanization: 'mu', audio: '/audio/hiragana/mu.mp3', group: 'basic', strokes: 3 },
  { id: 'me', character: 'め', romanization: 'me', audio: '/audio/hiragana/me.mp3', group: 'basic', strokes: 2 },
  { id: 'mo', character: 'も', romanization: 'mo', audio: '/audio/hiragana/mo.mp3', group: 'basic', strokes: 3 },
  
  // Ya row
  { id: 'ya', character: 'や', romanization: 'ya', audio: '/audio/hiragana/ya.mp3', group: 'basic', strokes: 2 },
  { id: 'yu', character: 'ゆ', romanization: 'yu', audio: '/audio/hiragana/yu.mp3', group: 'basic', strokes: 2 },
  { id: 'yo', character: 'よ', romanization: 'yo', audio: '/audio/hiragana/yo.mp3', group: 'basic', strokes: 2 },
  
  // Ra row
  { id: 'ra', character: 'ら', romanization: 'ra', audio: '/audio/hiragana/ra.mp3', group: 'basic', strokes: 2 },
  { id: 'ri', character: 'り', romanization: 'ri', audio: '/audio/hiragana/ri.mp3', group: 'basic', strokes: 2 },
  { id: 'ru', character: 'る', romanization: 'ru', audio: '/audio/hiragana/ru.mp3', group: 'basic', strokes: 1 },
  { id: 're', character: 'れ', romanization: 're', audio: '/audio/hiragana/re.mp3', group: 'basic', strokes: 2 },
  { id: 'ro', character: 'ろ', romanization: 'ro', audio: '/audio/hiragana/ro.mp3', group: 'basic', strokes: 1 },
  
  // Wa row
  { id: 'wa', character: 'わ', romanization: 'wa', audio: '/audio/hiragana/wa.mp3', group: 'basic', strokes: 2 },
  { id: 'wo', character: 'を', romanization: 'wo', audio: '/audio/hiragana/wo.mp3', group: 'basic', strokes: 1 },
  
  // N
  { id: 'n', character: 'ん', romanization: 'n', audio: '/audio/hiragana/n.mp3', group: 'basic', strokes: 1 },
  
  // Dakuten (voiced consonants) - 25 characters
  { id: 'ga', character: 'が', romanization: 'ga', audio: '/audio/hiragana/ga.mp3', group: 'dakuten', strokes: 3 },
  { id: 'gi', character: 'ぎ', romanization: 'gi', audio: '/audio/hiragana/gi.mp3', group: 'dakuten', strokes: 4 },
  { id: 'gu', character: 'ぐ', romanization: 'gu', audio: '/audio/hiragana/gu.mp3', group: 'dakuten', strokes: 1 },
  { id: 'ge', character: 'げ', romanization: 'ge', audio: '/audio/hiragana/ge.mp3', group: 'dakuten', strokes: 3 },
  { id: 'go', character: 'ご', romanization: 'go', audio: '/audio/hiragana/go.mp3', group: 'dakuten', strokes: 2 },
  
  { id: 'za', character: 'ざ', romanization: 'za', audio: '/audio/hiragana/za.mp3', group: 'dakuten', strokes: 3 },
  { id: 'ji', character: 'じ', romanization: 'ji', audio: '/audio/hiragana/ji.mp3', group: 'dakuten', strokes: 1 },
  { id: 'zu', character: 'ず', romanization: 'zu', audio: '/audio/hiragana/zu.mp3', group: 'dakuten', strokes: 2 },
  { id: 'ze', character: 'ぜ', romanization: 'ze', audio: '/audio/hiragana/ze.mp3', group: 'dakuten', strokes: 3 },
  { id: 'zo', character: 'ぞ', romanization: 'zo', audio: '/audio/hiragana/zo.mp3', group: 'dakuten', strokes: 2 },
  
  { id: 'da', character: 'だ', romanization: 'da', audio: '/audio/hiragana/da.mp3', group: 'dakuten', strokes: 4 },
  { id: 'di', character: 'ぢ', romanization: 'ji', audio: '/audio/hiragana/di.mp3', group: 'dakuten', strokes: 2 },
  { id: 'du', character: 'づ', romanization: 'zu', audio: '/audio/hiragana/du.mp3', group: 'dakuten', strokes: 1 },
  { id: 'de', character: 'で', romanization: 'de', audio: '/audio/hiragana/de.mp3', group: 'dakuten', strokes: 1 },
  { id: 'do', character: 'ど', romanization: 'do', audio: '/audio/hiragana/do.mp3', group: 'dakuten', strokes: 2 },
  
  { id: 'ba', character: 'ば', romanization: 'ba', audio: '/audio/hiragana/ba.mp3', group: 'dakuten', strokes: 3 },
  { id: 'bi', character: 'び', romanization: 'bi', audio: '/audio/hiragana/bi.mp3', group: 'dakuten', strokes: 1 },
  { id: 'bu', character: 'ぶ', romanization: 'bu', audio: '/audio/hiragana/bu.mp3', group: 'dakuten', strokes: 3 },
  { id: 'be', character: 'べ', romanization: 'be', audio: '/audio/hiragana/be.mp3', group: 'dakuten', strokes: 2 },
  { id: 'bo', character: 'ぼ', romanization: 'bo', audio: '/audio/hiragana/bo.mp3', group: 'dakuten', strokes: 4 },
  
  // Handakuten (semi-voiced consonants) - 5 characters
  { id: 'pa', character: 'ぱ', romanization: 'pa', audio: '/audio/hiragana/pa.mp3', group: 'handakuten', strokes: 3 },
  { id: 'pi', character: 'ぴ', romanization: 'pi', audio: '/audio/hiragana/pi.mp3', group: 'handakuten', strokes: 1 },
  { id: 'pu', character: 'ぷ', romanization: 'pu', audio: '/audio/hiragana/pu.mp3', group: 'handakuten', strokes: 3 },
  { id: 'pe', character: 'ぺ', romanization: 'pe', audio: '/audio/hiragana/pe.mp3', group: 'handakuten', strokes: 2 },
  { id: 'po', character: 'ぽ', romanization: 'po', audio: '/audio/hiragana/po.mp3', group: 'handakuten', strokes: 4 },
  
  // Combo Hiragana (36 characters)
  { id: 'kya', character: 'きゃ', romanization: 'kya', audio: '/audio/hiragana/kya.mp3', group: 'combo', strokes: 4 },
  { id: 'kyu', character: 'きゅ', romanization: 'kyu', audio: '/audio/hiragana/kyu.mp3', group: 'combo', strokes: 4 },
  { id: 'kyo', character: 'きょ', romanization: 'kyo', audio: '/audio/hiragana/kyo.mp3', group: 'combo', strokes: 4 },
  
  { id: 'sha', character: 'しゃ', romanization: 'sha', audio: '/audio/hiragana/sha.mp3', group: 'combo', strokes: 3 },
  { id: 'shu', character: 'しゅ', romanization: 'shu', audio: '/audio/hiragana/shu.mp3', group: 'combo', strokes: 3 },
  { id: 'sho', character: 'しょ', romanization: 'sho', audio: '/audio/hiragana/sho.mp3', group: 'combo', strokes: 3 },
  
  { id: 'cha', character: 'ちゃ', romanization: 'cha', audio: '/audio/hiragana/cha.mp3', group: 'combo', strokes: 2 },
  { id: 'chu', character: 'ちゅ', romanization: 'chu', audio: '/audio/hiragana/chu.mp3', group: 'combo', strokes: 2 },
  { id: 'cho', character: 'ちょ', romanization: 'cho', audio: '/audio/hiragana/cho.mp3', group: 'combo', strokes: 2 },
  
  { id: 'nya', character: 'にゃ', romanization: 'nya', audio: '/audio/hiragana/nya.mp3', group: 'combo', strokes: 3 },
  { id: 'nyu', character: 'にゅ', romanization: 'nyu', audio: '/audio/hiragana/nyu.mp3', group: 'combo', strokes: 3 },
  { id: 'nyo', character: 'にょ', romanization: 'nyo', audio: '/audio/hiragana/nyo.mp3', group: 'combo', strokes: 3 },
  
  { id: 'hya', character: 'ひゃ', romanization: 'hya', audio: '/audio/hiragana/hya.mp3', group: 'combo', strokes: 1 },
  { id: 'hyu', character: 'ひゅ', romanization: 'hyu', audio: '/audio/hiragana/hyu.mp3', group: 'combo', strokes: 1 },
  { id: 'hyo', character: 'ひょ', romanization: 'hyo', audio: '/audio/hiragana/hyo.mp3', group: 'combo', strokes: 1 },
  
  { id: 'mya', character: 'みゃ', romanization: 'mya', audio: '/audio/hiragana/mya.mp3', group: 'combo', strokes: 2 },
  { id: 'myu', character: 'みゅ', romanization: 'myu', audio: '/audio/hiragana/myu.mp3', group: 'combo', strokes: 2 },
  { id: 'myo', character: 'みょ', romanization: 'myo', audio: '/audio/hiragana/myo.mp3', group: 'combo', strokes: 2 },
  
  { id: 'rya', character: 'りゃ', romanization: 'rya', audio: '/audio/hiragana/rya.mp3', group: 'combo', strokes: 2 },
  { id: 'ryu', character: 'りゅ', romanization: 'ryu', audio: '/audio/hiragana/ryu.mp3', group: 'combo', strokes: 2 },
  { id: 'ryo', character: 'りょ', romanization: 'ryo', audio: '/audio/hiragana/ryo.mp3', group: 'combo', strokes: 2 },
  
  { id: 'gya', character: 'ぎゃ', romanization: 'gya', audio: '/audio/hiragana/gya.mp3', group: 'combo', strokes: 4 },
  { id: 'gyu', character: 'ぎゅ', romanization: 'gyu', audio: '/audio/hiragana/gyu.mp3', group: 'combo', strokes: 4 },
  { id: 'gyo', character: 'ぎょ', romanization: 'gyo', audio: '/audio/hiragana/gyo.mp3', group: 'combo', strokes: 4 },
  
  { id: 'ja', character: 'じゃ', romanization: 'ja', audio: '/audio/hiragana/ja.mp3', group: 'combo', strokes: 1 },
  { id: 'ju', character: 'じゅ', romanization: 'ju', audio: '/audio/hiragana/ju.mp3', group: 'combo', strokes: 1 },
  { id: 'jo', character: 'じょ', romanization: 'jo', audio: '/audio/hiragana/jo.mp3', group: 'combo', strokes: 1 },
  
  { id: 'bya', character: 'びゃ', romanization: 'bya', audio: '/audio/hiragana/bya.mp3', group: 'combo', strokes: 1 },
  { id: 'byu', character: 'びゅ', romanization: 'byu', audio: '/audio/hiragana/byu.mp3', group: 'combo', strokes: 1 },
  { id: 'byo', character: 'びょ', romanization: 'byo', audio: '/audio/hiragana/byo.mp3', group: 'combo', strokes: 1 },
  
  { id: 'pya', character: 'ぴゃ', romanization: 'pya', audio: '/audio/hiragana/pya.mp3', group: 'combo', strokes: 1 },
  { id: 'pyu', character: 'ぴゅ', romanization: 'pyu', audio: '/audio/hiragana/pyu.mp3', group: 'combo', strokes: 1 },
  { id: 'pyo', character: 'ぴょ', romanization: 'pyo', audio: '/audio/hiragana/pyo.mp3', group: 'combo', strokes: 1 },
];

export default hiragana;