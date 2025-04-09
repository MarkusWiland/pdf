// app/api/proxy/route.ts

import axios from 'axios'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const fileUrl = url.searchParams.get('url')

  if (!fileUrl) {
    return new Response('No URL provided', { status: 400 })
  }

  try {
    console.log(`Hämtar PDF från: ${fileUrl}`) // Logga URL för felsökning

    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' })

    // Skicka tillbaka PDF-data till klienten
    return new Response(response.data, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="file.pdf"',
      },
    })
  } catch (error) {
    console.error('Error while fetching PDF:', error)
    return new Response('Failed to fetch PDF', { status: 500 })
  }
}
