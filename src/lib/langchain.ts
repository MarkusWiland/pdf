import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

export async function extractPdfAndChunks(fileUrl: string) {
  const response = await fetch(fileUrl)
  const blob = await response.blob()
  const arrayBuffer = await blob.arrayBuffer()

  const loader = new PDFLoader(new Blob([arrayBuffer]))
  const docs = await loader.load()

  const fullText = docs.map((doc) => doc.pageContent).join('\n')

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const chunksWithMetadata = await textSplitter.splitDocuments(docs)

  return {
    fullText, // Använd för summering
    chunks: chunksWithMetadata, // Använd i chatt (innehåller metadata)
  }
}
