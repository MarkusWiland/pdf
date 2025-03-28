// actions/get-pdf-info.ts
'use server'

import { prisma } from '@/utils/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function getPdfInfo(pdfId: string) {
  const user = await currentUser()
  if (!user?.id) throw new Error('Unauthorized')

  const pdf = await prisma.pdfFile.findUnique({
    where: { id: pdfId, userId: user.id },
    include: {
      summary: true,
    },
  })

  if (!pdf) {
    throw new Error('PDF inte hittad')
  }

  return {
    pdfUrl: pdf.url,
    summary: pdf.summary?.summary || null,
    fileName: pdf.name,
    createdAt: pdf.createdAt,
  }
}
