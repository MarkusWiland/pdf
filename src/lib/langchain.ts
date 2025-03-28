import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

export async function extractPdfAndChunks(fileUrl: string) {
  // 1. Hämta filen
  const response = await fetch(fileUrl)
  const blob = await response.blob()
  const arrayBuffer = await blob.arrayBuffer()

  // 2. Ladda innehåll
  const loader = new PDFLoader(new Blob([arrayBuffer]))
  const docs = await loader.load()

  // 3. Skapa hela texten
  const fullText = docs.map((doc) => doc.pageContent).join('\n')

  // 4. Splitta till chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  const chunkDocs = await textSplitter.createDocuments([fullText])
  const chunks = chunkDocs.map((doc) => doc.pageContent)

  return {
    fullText,
    chunks,
  }
}
