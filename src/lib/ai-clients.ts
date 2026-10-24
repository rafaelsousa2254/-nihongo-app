export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface StreamCallbacks {
  onChunk: (text: string) => void
  onDone: () => void
  onError: (error: Error) => void
}

// --- Pollinations.ai (sem key, anônimo) ---

async function streamPollinations(
  messages: AIMessage[],
  systemPrompt: string,
  callbacks: StreamCallbacks
): Promise<void> {
  const allMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'system' ? ('user' as const) : (m.role as 'user' | 'assistant'),
      content: m.content,
    })),
  ]

  const response = await fetch('https://text.pollinations.ai/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai-fast',
      messages: allMessages,
      stream: true,
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) throw new Error(`Pollinations returned ${response.status}`)

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') continue
      try {
        const json = JSON.parse(data)
        const text = json.choices?.[0]?.delta?.content
        if (text) callbacks.onChunk(text)
      } catch {
        // skip malformed
      }
    }
  }

  callbacks.onDone()
}

// --- KeylessAI (agrega 4 providers, sem key) ---

async function streamKeylessAI(
  messages: AIMessage[],
  systemPrompt: string,
  callbacks: StreamCallbacks
): Promise<void> {
  const allMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'system' ? ('user' as const) : (m.role as 'user' | 'assistant'),
      content: m.content,
    })),
  ]

  const response = await fetch('https://keylessai.thryx.workers.dev/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai-fast',
      messages: allMessages,
      stream: true,
    }),
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) throw new Error(`KeylessAI returned ${response.status}`)

  const reader = response.body?.getReader()
  if (!reader) throw new Error('No response body')

  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') continue
      try {
        const json = JSON.parse(data)
        const text = json.choices?.[0]?.delta?.content
        if (text) callbacks.onChunk(text)
      } catch {
        // skip malformed
      }
    }
  }

  callbacks.onDone()
}

// --- Gemini (opcional, com key) ---

async function streamGemini(
  messages: AIMessage[],
  systemPrompt: string,
  callbacks: StreamCallbacks
): Promise<void> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured')

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  })

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role === 'system' ? 'user' : m.role,
      parts: [{ text: m.content }],
    })),
  })

  const lastUserMessage = messages[messages.length - 1]
  const result = await chat.sendMessageStream(lastUserMessage.content)

  for await (const chunk of result.stream) {
    const text = chunk.text()
    if (text) callbacks.onChunk(text)
  }

  callbacks.onDone()
}

// --- Fallback hardcoded ---

const FALLBACK_RESPONSES: Record<string, { jp: string; romaji: string; pt: string }[]> = {
  greeting: [
    { jp: 'おはようございます！今日はいい天気ですね。', romaji: 'Ohayou gozaimasu! Kyou wa ii tenki desu ne.', pt: 'Bom dia! Hoje está um bom dia, não é?' },
    { jp: 'はじめまして！どうぞよろしくおねがいします。', romaji: 'Hajimemashite! Douzo yoroshiku onegai shimasu.', pt: 'Prazer em conhecê-lo!' },
    { jp: 'こんばんは！今日は何をしましたか？', romaji: 'Konbanwa! Kyou wa nani wo shimashita ka?', pt: 'Boa noite! O que você fez hoje?' },
  ],
  howAreYou: [
    { jp: 'げんきですか？わたしはげんきです！', romaji: 'Genki desu ka? Watashi wa genki desu!', pt: 'Como vai? Eu estou bem!' },
    { jp: 'おげんきですか？にほんごをべんきょうしていますか？', romaji: 'Ogenki desu ka? Nihongo wo benkyou shite imasu ka?', pt: 'Você está bem? Está estudando japonês?' },
  ],
  thanks: [
    { jp: 'ありがとうございます！がんばってくださいね。', romaji: 'Arigatou gozaimasu! Ganbatte kudasai ne.', pt: 'Obrigado! Se esforce!' },
    { jp: 'どういたしまして！またいつでもきてください。', romaji: 'Dou itashimashite! Mata itsudemo kite kudasai.', pt: 'De nada! Venha sempre.' },
  ],
  goodbye: [
    { jp: 'さようなら！またあした！', romaji: 'Sayounara! Mata ashita!', pt: 'Adeus! Até amanhã!' },
    { jp: 'じゃあね！またべんきょうしましょう！', romaji: 'Jaa ne! Mata benkyou shimashou!', pt: 'Tchau! Vamos estudar de novo!' },
  ],
  study: [
    { jp: 'にほんごをべんきょうしましょう！', romaji: 'Nihongo wo benkyou shimashou!', pt: 'Vamos estudar japonês!' },
    { jp: 'れんしゅうをしましょう！毎日のべんきょうがたいせつです。', romaji: 'Renshuu wo shimashou! Mainichi no benkyou ga taisetsu desu.', pt: 'Vamos praticar! Estudar todo dia é importante.' },
  ],
  default: [
    { jp: 'すごいですね！もうちょっとおねがいします。', romaji: 'Sugoi desu ne! Mou chotto onegai shimasu.', pt: 'Incrível! Me diga mais.' },
    { jp: 'それはおもしろいですね！', romaji: 'Sore wa omoshiroi desu ne!', pt: 'Isso é interessante!' },
    { jp: 'がんばって！にほんごはたのしいですよ。', romaji: 'Ganbatte! Nihongo wa tanoshii desu yo.', pt: 'Se esforce! Japonês é divertido.' },
  ],
}

function getFallbackResponse(lastMessage: string): string {
  const lower = lastMessage.toLowerCase()
  let category: keyof typeof FALLBACK_RESPONSES = 'default'

  if (lower.includes('おはよう') || lower.includes('はじめまして') || lower.includes('こんにちは')) {
    category = 'greeting'
  } else if (lower.includes('げんき') || lower.includes('como') || lower.includes('お元気')) {
    category = 'howAreYou'
  } else if (lower.includes('ありがとう') || lower.includes('obrigado')) {
    category = 'thanks'
  } else if (lower.includes('さようなら') || lower.includes('tchau') || lower.includes('adeus')) {
    category = 'goodbye'
  } else if (lower.includes('べんきょう') || lower.includes('study') || lower.includes('estud')) {
    category = 'study'
  }

  const responses = FALLBACK_RESPONSES[category]
  const response = responses[Math.floor(Math.random() * responses.length)]
  return `${response.jp}\n\nRomaji: ${response.romaji}\n\nPortuguês: ${response.pt}`
}

// --- Main: Pollinations -> KeylessAI -> Gemini (se tiver key) -> Fallback ---

export async function streamAIResponse(
  messages: AIMessage[],
  systemPrompt: string,
  callbacks: StreamCallbacks
): Promise<void> {
  // 1. Pollinations (sem key)
  try {
    await streamPollinations(messages, systemPrompt, callbacks)
    return
  } catch (err) {
    console.warn('[AI] Pollinations failed, trying KeylessAI:', err)
  }

  // 2. KeylessAI (sem key)
  try {
    await streamKeylessAI(messages, systemPrompt, callbacks)
    return
  } catch (err) {
    console.warn('[AI] KeylessAI failed:', err)
  }

  // 3. Gemini (se tiver key configurada)
  if (process.env.GEMINI_API_KEY) {
    try {
      await streamGemini(messages, systemPrompt, callbacks)
      return
    } catch (err) {
      console.warn('[AI] Gemini failed:', err)
    }
  }

  // 4. Fallback hardcoded
  const lastMessage = messages[messages.length - 1]?.content || ''
  const fallbackText = getFallbackResponse(lastMessage)
  callbacks.onChunk(fallbackText)
  callbacks.onDone()
}
