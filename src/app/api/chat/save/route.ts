import { prisma } from '@/utils/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const user = await currentUser()
  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { pdfId, message } = await req.json()

  if (!pdfId || !message || !message.role || !message.content) {
    return NextResponse.json({ error: 'Ogiltig request' }, { status: 400 })
  }

  // ✅ Kontrollera att PDF:en existerar
  const pdf = await prisma.pdfFile.findUnique({
    where: { id: pdfId },
  })

  if (!pdf) {
    return NextResponse.json({ error: 'PDF hittades inte' }, { status: 400 })
  }

  // 💾 Spara meddelandet
  await prisma.pdfChatMessage.create({
    data: {
      pdfId,
      userId: user.id,
      role: message.role,
      content: message.content,
    },
  })

  return NextResponse.json({ success: true })
}
