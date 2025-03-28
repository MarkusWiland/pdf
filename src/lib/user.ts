// lib/user.ts

import { prisma } from '@/utils/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function getOrCreateUser(clerkId: string, email: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email,
      },
    })
  }

  return user
}

export async function getCurrentUser() {
  const user = await currentUser()

  return user
}
