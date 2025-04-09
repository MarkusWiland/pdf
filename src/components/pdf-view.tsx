'use client'
import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js'

export default function PdfView({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)

  // Callback när PDF är inläst
  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
  }

  // Proxy-URL för att hämta PDF via API-rutten
  console.log('PDFURL', url)
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`
  console.log('proxyUrl', proxyUrl)
  // Navigera till nästa sida
  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1)
    }
  }

  // Navigera till föregående sida
  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1)
    }
  }

  return (
    <div className="pdf-viewer-container">
      {/* Visa PDF från Proxy-URL */}
      <Document file={proxyUrl} onLoadSuccess={onLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>

      {/* Navigering mellan sidor */}
      <div className="page-controls mt-4 flex justify-center gap-4">
        <button
          onClick={goToPreviousPage}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Föregående
        </button>
        <span className="text-sm">
          Sida {pageNumber} av {numPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Nästa
        </button>
      </div>
    </div>
  )
}
