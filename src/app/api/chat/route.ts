export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { ChatOpenAI } from '@langchain/openai'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { pull } from 'langchain/hub'
import { NextRequest } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import loadVectorStore from '@/lib/vectorstore'

const llm = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0.3,
  streaming: false,
})

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user?.id) return new Response('Unauthorized', { status: 401 })

  const { messages, pdfId } = await req.json()

  const input = messages?.at(-1)?.content || ''
  if (!pdfId || !input) return new Response('Bad Request', { status: 400 })

  console.log('[CHAT API] Incoming:', { pdfId, lastMessage: input })

  const vectorStore = await loadVectorStore()
  const retriever = vectorStore.asRetriever({
    k: 10,
    searchType: 'similarity',
    filter: { pdfId },
  })

  const prompt = await pull<ChatPromptTemplate>(
    'langchain-ai/retrieval-qa-chat',
  )
  const combineDocsChain = await createStuffDocumentsChain({ llm, prompt })
  const chain = await createRetrievalChain({ retriever, combineDocsChain })

  const response = await chain.invoke({
    input,
    chat_history: messages.map((m: any) =>
      m.role === 'user'
        ? new HumanMessage(m.content)
        : new AIMessage(m.content),
    ),
  })

  return Response.json({
    id: crypto.randomUUID(),
    role: 'assistant',
    content: response.answer ?? 'Jag kunde inte hitta ett svar.',
  })
}
