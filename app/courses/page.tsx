'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

const courses = [
  { id: 1, name: 'Introduction to Computer Science', code: 'CS101', section: 'A' },
  { id: 2, name: 'Calculus I', code: 'MATH101', section: 'B' },
  { id: 3, name: 'Introduction to Psychology', code: 'PSYCH101', section: 'C' },
  { id: 4, name: 'World History', code: 'HIST101', section: 'A' },
]

export default function CoursesPage() {
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const toggleCourse = (courseId: number) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Choose Your Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <div key={course.id} className="border p-4 rounded-lg">
            <h3 className="text-xl font-semibold">{course.name}</h3>
            <p>Code: {course.code}</p>
            <p>Section: {course.section}</p>
            <div className="mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => toggleCourse(course.id)}
                  className="form-checkbox"
                />
                <span>Select this course</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
        disabled={selectedCourses.length === 0}
        onClick={() => alert(`Selected courses: ${selectedCourses.join(', ')}`)}
      >
        Register for Selected Courses
      </button>
    </div>
  )
}
