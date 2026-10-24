import { NextResponse } from 'next/server'

const kanji: Record<string, Array<{ character: string; meaning: string; readings: string[]; level: string; examples: string[] }>> = {
  N5: [
    { character: '日', meaning: 'day, sun', readings: ['にち', 'ひ'], level: 'N5', examples: ['日本 (にほん) - Japan', '今日 (きょう) - today'] },
    { character: '本', meaning: 'book, origin', readings: ['ほん', 'もと'], level: 'N5', examples: ['本屋 (ほんや) - bookstore', '日本語 (にほんご) - Japanese language'] },
    { character: '人', meaning: 'person', readings: ['じん', 'ひと'], level: 'N5', examples: ['日本人 (にほんじん) - Japanese person', '友達 (ともだち) - friend'] },
    { character: '学', meaning: 'learn, study', readings: ['がく', 'まなぶ'], level: 'N5', examples: ['学生 (がくせい) - student', '大学 (だいがく) - university'] },
    { character: '山', meaning: 'mountain', readings: ['やま', 'さん'], level: 'N5', examples: ['富士山 (ふじさん) - Mt. Fuji', '山登り (やまのぼり) - mountain climbing'] },
    { character: '川', meaning: 'river', readings: ['かわ', 'せん'], level: 'N5', examples: ['川沿い (かわぞい) - riverside', '大川 (おおかわ) - large river'] },
    { character: '田', meaning: 'rice field', readings: ['た', 'でん'], level: 'N5', examples: ['田中 (たなか) - Tanaka', '水田 (すいでん) - paddy field'] },
    { character: '目', meaning: 'eye', readings: ['め', 'もく'], level: 'N5', examples: ['目 (め) - eye', '注目 (ちゅうもく) - attention'] },
    { character: '耳', meaning: 'ear', readings: ['みみ', 'じ'], level: 'N5', examples: ['耳 (みみ) - ear', '聴力 (ちょうりょく) - hearing'] },
    { character: '口', meaning: 'mouth', readings: ['くち', 'こう'], level: 'N5', examples: ['口 (くち) - mouth', '入口 (いりぐち) - entrance'] },
    { character: '手', meaning: 'hand', readings: ['て', 'しゅ'], level: 'N5', examples: ['手 (て) - hand', '上手 (じょうず) - skillful'] },
    { character: '足', meaning: 'foot, leg', readings: ['あし', 'そく'], level: 'N5', examples: ['足 (あし) - foot', '足球 (そうきゅう) - soccer'] },
    { character: '力', meaning: 'power, strength', readings: ['ちから', 'りょく'], level: 'N5', examples: ['力 (ちから) - power', '努力 (どりょく) - effort'] },
    { character: '気', meaning: 'spirit, mind', readings: ['き', 'け'], level: 'N5', examples: ['元気 (げんき) - healthy', '天気 (てんき) - weather'] },
    { character: '雨', meaning: 'rain', readings: ['あめ', 'う'], level: 'N5', examples: ['雨 (あめ) - rain', '梅雨 (つゆ) - rainy season'] },
  ],
  N4: [
    { character: '会', meaning: 'meet, society', readings: ['かい', 'あう'], level: 'N4', examples: ['会社 (かいしゃ) - company', '会う (あう) - to meet'] },
    { character: '同', meaning: 'same, together', readings: ['どう', 'おなじ'], level: 'N4', examples: ['同僚 (どうりょう) - colleague', '同じ (おなじ) - same'] },
    { character: '事', meaning: 'thing, matter', readings: ['こと', 'じ'], level: 'N4', examples: ['事件 (じけん) - incident', '事 (こと) - thing'] },
    { character: '自', meaning: 'self', readings: ['じ', 'みずから'], level: 'N4', examples: ['自分 (じぶん) - myself', '自己 (じこ) - self'] },
    { character: '社', meaning: 'company, shrine', readings: ['しゃ', 'やしろ'], level: 'N4', examples: ['会社 (かいしゃ) - company', '神社 (じんじゃ) - shrine'] },
  ],
  N3: [
    { character: '経', meaning: 'manage, pass through', readings: ['けい', 'へる'], level: 'N3', examples: ['経験 (けいけん) - experience', '経つ (たつ) - to pass'] },
    { character: '験', meaning: 'verify, test', readings: ['けん', 'あかし'], level: 'N3', examples: ['経験 (けいけん) - experience', '試験 (しけん) - exam'] },
    { character: '画', meaning: 'picture, stroke', readings: ['か', 'が'], level: 'N3', examples: ['画家 (がか) - painter', '図画 (ずが) - picture'] },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const level = searchParams.get('level')

  if (level) {
    const filtered = kanji[level] || []
    return NextResponse.json({ kanji: filtered, level })
  }

  return NextResponse.json({ kanji })
}
