// app/api/chat/history/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/utils/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function GET(req: NextRequest) {
  const user = await currentUser()
  if (!user?.id) return new Response('Unauthorized', { status: 401 })

  const { searchParams } = new URL(req.url)
  const pdfId = searchParams.get('pdfId')

  if (!pdfId) return new Response('Missing pdfId', { status: 400 })

  const messages = await prisma.pdfChatMessage.findMany({
    where: { userId: user.id, pdfId },
    orderBy: { createdAt: 'asc' },
  })

  return Response.json(messages.map(({ role, content }) => ({ role, content })))
}
