'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

const courses = [
  { id: 1, name: 'Introduction to Computer Science', code: 'CS101', currentSection: 'A', availableSections: ['B', 'C'] },
  { id: 2, name: 'Calculus I', code: 'MATH101', currentSection: 'B', availableSections: ['A', 'C'] },
  { id: 3, name: 'Introduction to Psychology', code: 'PSYCH101', currentSection: 'C', availableSections: ['A', 'B'] },
]

export default function SwapPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleSwapRequest = () => {
    if (selectedCourse && selectedSection) {
      console.log(`Swap request submitted for course ${selectedCourse} to section ${selectedSection}`)
      alert('Swap request submitted successfully!')
    }
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Swap Course Sections</h2>
      <div className="border p-4 rounded-lg space-y-4">
        <div>
          <label htmlFor="course-select" className="block mb-2">Select Course</label>
          <select 
            id="course-select"
            className="w-full p-2 border rounded"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id.toString()}>
                {course.name} ({course.code}) - Current Section: {course.currentSection}
              </option>
            ))}
          </select>
        </div>
        {selectedCourse && (
          <div>
            <label htmlFor="section-select" className="block mb-2">Select New Section</label>
            <select 
              id="section-select"
              className="w-full p-2 border rounded"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Select a section</option>
              {courses.find(c => c.id.toString() === selectedCourse)?.availableSections.map(section => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>
          </div>
        )}
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
          onClick={handleSwapRequest}
          disabled={!selectedCourse || !selectedSection}
        >
          Submit Swap Request
        </button>
      </div>
    </div>
  )
}
