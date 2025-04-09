import { getPdfInfo } from '@/actions/get-pdf-info'
import ChatBox from '@/components/chatbox'
import PdfView from '@/components/pdf-view'
import SourceInfo from '@/components/summaries/source-info'
import SummaryHeader from '@/components/summaries/summary-header'

export default async function PdfPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: pdfId } = await params
  const { pdfUrl, summary, fileName, createdAt } = await getPdfInfo(pdfId)

  if (!pdfUrl || !summary) {
    return <p className="p-4">PDF kunde inte hittas.</p>
  }
  const readingTime = Math.ceil(122 / 200)
  return (
    <section className="container mx-auto">
      <SummaryHeader
        title="cool"
        createdAt={createdAt}
        readingTime={readingTime}
      />
      {fileName && <SourceInfo fileName={fileName} />}
      <div
        className="relative mt-4 sm:mt-8 lg:mt-16
    grid lg:grid-cols-5 h-full overflow-hidden"
      >
        <div className="col-span-5 lg:col-span-2 overflow-y-auto">
          <ChatBox pdfId={pdfId} pdfUrl={pdfUrl} summary={summary} />
        </div>
        <div className="col-span-5 lg:col-span-3 bg-gray-100 border-r-2 overflow-auto lg:-order-1">
          <PdfView url={pdfUrl} />
        </div>
        {/* <div className="relative p-4 sm:p-6 lg:p-8 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-rose-100/30 transition-all duration-300 hover:shadow-2xl hover:bg-white/90 max-w-4xl mx-auto">
         
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-orange-50/30 to-transparent opacity-50 rounded-2xl sm:rounded-3xl" />
      
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-white/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-xs">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400" />
            {'122'.toLocaleString()} words
          </div>

       
          <div className="relative mt-8 sm:mt-6 flex justify-center">
            <SummaryViewer summary={summary} />
          </div>
         
        </div> */}
      </div>
    </section>
  )
}
