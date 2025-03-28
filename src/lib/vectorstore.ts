import { prisma } from '@/utils/prisma'
import { NeonPostgres } from '@langchain/community/vectorstores/neon'
import { OpenAIEmbeddings } from '@langchain/openai'

const embeddings = new OpenAIEmbeddings({
  dimensions: 512,
  model: 'text-embedding-3-small',
})

export default async function loadVectorStore() {
  return await NeonPostgres.initialize(embeddings, {
    connectionString: process.env.DATABASE_URL as string,
  })
}

export async function embedChunksToVectorStore(pdfId: string) {
  const chunks = await prisma.pdfChunk.findMany({
    where: { pdfId },
  })

  const documents = chunks.map((chunk, i) => ({
    pageContent: chunk.content,
    metadata: { pdfId, chunkIndex: i },
  }))

  const vectorStore = await NeonPostgres.initialize(embeddings, {
    connectionString: process.env.DATABASE_URL as string,
  })

  await vectorStore.addDocuments(documents)

  // 🧪 Lägg till en kort paus för att ge Neon tid att indexera
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 🧠 Testa att vectorStore faktiskt innehåller chunksen
  const result = await vectorStore.similaritySearch('Autogiro', 3, {
    pdfId,
  })

  console.log('🔍 VECTORSTORE TESTRESULTAT:', result)
}
