import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { streamAIResponse, type AIMessage } from '@/lib/ai-clients'

const SYSTEM_PROMPTS: Record<string, string> = {
  teacher: `You are a Japanese language teacher. Explain grammar points clearly in simple English.
Always provide:
1. The grammar pattern with Japanese characters
2. A clear explanation in English
3. 2-3 example sentences in Japanese with romaji and English translation
4. Common mistakes to avoid
Be encouraging and patient. If the student asks in Japanese, respond in Japanese with English explanations.`,
  conversation: `You are a friendly Japanese conversation partner. Practice daily conversation scenarios.
Always provide:
1. Your response in Japanese (with furigana/romaji if helpful)
2. English translation
3. Useful vocabulary or phrases from the conversation
Keep conversations natural and age-appropriate. Gently correct mistakes and explain why.`,
  jlpt: `You are a JLPT (Japanese Language Proficiency Test) exam tutor.
Always provide:
1. The question or practice problem
2. Detailed explanation of the correct answer
3. Why other options are incorrect
4. Tips for similar questions on the actual exam
Cover grammar, vocabulary, reading, and listening comprehension strategies.`,
  anime: `You are an anime and manga culture expert who teaches Japanese through anime.
Always provide:
1. The Japanese phrase or expression
2. Romaji and English translation
3. Context from anime/manga where this phrase is commonly used
4. Cultural notes about the expression
5. Whether it's formal, casual, slang, or dramatic
Make learning fun by connecting it to popular anime series!`,
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1]
        await verifyToken(token)
      } catch {
        // continue without auth
      }
    }

    const { messages, mode = 'teacher' } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      )
    }

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.teacher

    const aiMessages: AIMessage[] = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })
    )

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamAIResponse(aiMessages, systemPrompt, {
            onChunk(text) {
              controller.enqueue(encoder.encode(text))
            },
            onDone() {
              controller.close()
            },
            onError(err) {
              console.error('[AI] Stream error:', err)
              controller.error(err)
            },
          })
        } catch (err) {
          console.error('[AI] Controller error:', err)
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
