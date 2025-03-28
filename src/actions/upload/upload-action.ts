'use server'

import { extractPdfAndChunks } from '@/lib/langchain'
import { generateSummaryFromOpenAi } from '@/lib/openai'
import { getOrCreateUser } from '@/lib/user'
import { embedChunksToVectorStore } from '@/lib/vectorstore'
import { prisma } from '@/utils/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function generatePdfSummary(uploadResponse: {
  userId: string
  url: string
  name: string
}) {
  const { userId, url: pdfUrl, name: fileName } = uploadResponse

  if (!pdfUrl) {
    return {
      success: false,
      message: 'File upload failed',
      data: null,
    }
  }

  try {
    const { fullText, chunks } = await extractPdfAndChunks(pdfUrl)

    const user = await currentUser()
    console.log('I SERVER ACTION', user)
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      throw new Error('No user email found')
    }

    await getOrCreateUser(userId!, 'markus.wiland@outlook.com')

    const pdf = await prisma.pdfFile.create({
      data: {
        userId: userId,
        name: fileName,
        url: pdfUrl,
      },
    })

    // Spara chunks
    await prisma.pdfChunk.createMany({
      data: chunks.map((chunk) => ({
        pdfId: pdf.id,
        content: chunk,
      })),
    })
    await embedChunksToVectorStore(pdf.id)
    // (Valfritt) Sammanfattning
    let summary
    try {
      summary = await generateSummaryFromOpenAi(fullText)
      if (summary) {
        await prisma.pdfSummary.create({
          data: {
            pdfId: pdf.id,
            summary,
          },
        })
      }
    } catch (error) {
      console.warn('Kunde inte generera sammanfattning:', error)
    }

    return {
      success: true,
      message: 'PDF klar',
      data: {
        pdfId: pdf.id,
        summary,
      },
    }
  } catch (err) {
    console.error('Fel i PDF-hantering:', err)
    return {
      success: false,
      message: 'Något gick fel vid processering',
      data: null,
    }
  }
}
