import BgGradient from '@/components/common/bg-gradient'
import { Badge } from '@/components/ui/badge'
import UploadForm from '@/components/upload/upload-form'
import { UploadButton, UploadDropzone } from '@/utils/uploadthing'
import { Sparkles } from 'lucide-react'
import React from 'react'

export default function Upload() {
  return (
    <section className="min-h-screen">
      <BgGradient />
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="relative p-[1px] overflow-hidden rounded-full bg-linear-to-r from-rose-200 via-rose-500 to-rose-800 animate-gradient-x group">
            <Badge
              variant="secondary"
              className="relative px-6 py-2 text-base font-medium bg-white rounded-full group-hover:bg-gray-50 transition-colors"
            >
              <Sparkles className="h-6 w-6 mr-2 text-rose-600 animate-pulse" />
              <span className="text-base">AI-Powered ciobtebt creatuib</span>
            </Badge>
          </div>
          <div className="capitalize text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <h1>Börja med ladda upp din PDF fil.</h1>
            <p>Ladda upp din PDF och låt AI göra magin</p>
          </div>
          <div>
            <UploadForm />
          </div>
        </div>
      </div>
    </section>
  )
}
