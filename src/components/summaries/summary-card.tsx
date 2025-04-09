import React from 'react'
import { Card } from '../ui/card'
import DeleteButton from './delete-button'
import Link from 'next/link'
import { FileText } from 'lucide-react'
const SummaryHeader = ({
  fileUrl,
  title,
  createdAt,
}: {
  fileUrl: string
  title: string
  createdAt: string
}) => {
  return (
    <div>
      <FileText className="h-6 w-6 sm:w-8 sm:h-8 text-rose-400 mt-1" />
    </div>
  )
}
export default function SummaryCard({ summary }: { summary: any }) {
  console.log('summary', summary)
  return (
    <div>
      <Card className="relative h-full">
        <div className="absolute top-2 right-2">
          <DeleteButton />
        </div>
        <Link href={`dashboard/${summary.id}`} className="block p-4 sm:p-6">
          <SummaryHeader
            fileUrl={summary.file}
            title={summary.name}
            createdAt="test"
          />
          <p className="text-muted-foreground line-clamp-2 text-sm sm:text-base pl-2">
            {summary.name}
          </p>
          <p className="text-sm text-muted-foreground">2024</p>
          <div>
            <span></span>
          </div>
        </Link>
      </Card>
    </div>
  )
}
