import React from 'react'

export default function SourceInfo({ fileName }: { fileName: string }) {
  return (
    <div>
      <h1>{fileName}</h1>
    </div>
  )
}
