'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { NavigationControls } from './navigation-controls'

const parseSection = (section: string) => {
  const [title, ...content] = section.split('\n')

  const cleanTitle = title.startsWith('#')
    ? title.substring(1).trim()
    : title.trim()
  const points = content
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-')) // filtrera bara punkter
    .map((line) => line.replace(/^-\s*/, '').trim()) // ta bort "- " i börja

  return { title: cleanTitle, points }
}

export function SummaryViewer({ summary }: { summary: string }) {
  const [currentSection, setCurrentSection] = useState(0)
  const handleNext = () => {
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1))
  }
  const handlePrevious = () => {
    setCurrentSection((prev) => Math.min(prev - 1, sections.length - 1))
  }
  const sections = summary
    .split('\n# ')
    .map((section) => section.trim())
    .filter(Boolean)
    .map(parseSection)

  return (
    <Card className="relative px-2 h-[500px] sm:h-[600px] lg:h-[700px] w-full xl:w-[800px] overflow-hidden bg-gradient-to-br from-background via-background/95 to-rose-500/5 backdrop-blur-lg shadow-2xl rounded-3xl border border-rose-500/10">
      <div className="h-full overflow-y-auto scrollbar-hide pt-12 sm:pt-16 pb-20 sm:pb-24">
        <div className="px-4 sm:px-6">
          <h2>{sections[currentSection]?.title || ''}</h2>
          <ul>
            {sections[currentSection]?.points.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
      <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSectionSelect={setCurrentSection}
      />
    </Card>
  )
}
