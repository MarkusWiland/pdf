import React from 'react'
import { Pizza } from 'lucide-react'
export default function DemoSection() {
  return (
    <section className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"></div>
      <div className="flex flex-col items-center text-center space-y-4">
        <Pizza className="h-6 w-6 text-rose-500" />
        <h3>Hello</h3>
      </div>
    </section>
  )
}
