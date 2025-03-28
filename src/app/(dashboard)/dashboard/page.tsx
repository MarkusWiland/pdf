import BgGradient from '@/components/common/bg-gradient'
import SummaryCard from '@/components/summaries/summary-card'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/user'
import { prisma } from '@/utils/prisma'
import { ArrowRight, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

// Hämta alla pdf-filer kopplade till user.id
async function getAllPdfs(userId: string) {
  const pdfs = await prisma.pdfFile.findMany({
    where: {
      userId: userId, // Viktigt att din tabell har detta fält
    },
  })
  return pdfs
}

export default async function Dashboard() {
  const user = await getCurrentUser()

  if (!user) {
    return <div>Du måste vara inloggad för att se denna sida.</div>
  }

  const pdfs = await getAllPdfs(user.id)
  const summaries = [
    {
      id: 1,
      title: 'Souls sol',
      description: 'Description',
      summary_text: 'descriptionm',
      created_at: '025-01-30 22:52:10.642315+00',
      status: 'Completed',
    },
  ]
  const uploadLimit = 5
  return (
    <main className="min-h-screen">
      <BgGradient className="from-emerald-200 via-teal-200 to-cyan-200" />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2 py-12 sm:py-24">
          <div className="flex gap-4 mb-8 justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Dina PDF filer
              </h1>
              <p className="text-muted-foreground">
                Transform your opsft into concise acotjant insights
              </p>
            </div>

            <Button variant="link">
              <Link href="/upload" className="flex items-center text-white">
                <Plus className="h-5 w-5 mr-2" /> Ladda upp PDF
              </Link>
            </Button>
          </div>
          <div className="mb-6">
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800">
              <p className="text-sm">
                Du har nått limit av {uploadLimit} uppladdningar on basic plan
                <Link
                  href="/#pricing"
                  className="text-rose-800 underline font-medium underline-offset-4 inline-flex items-center"
                >
                  Klicka här för uppgradera till PRO{' '}
                  <ArrowRight className="w-4 h-4 inline-block" />
                </Link>
                För unlimited uploads
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 sm:px-0">
            {summaries.map((summary, index) => (
              <SummaryCard key={index} summary={summary} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
