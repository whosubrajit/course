'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

type Review = {
  id: number
  facultyName: string
  reviewerName: string
  rating: number
  comment: string
  date: string
}

const initialReviews: Review[] = [
  { id: 1, facultyName: "Dr. John Smith", reviewerName: "Alice", rating: 4, comment: "Great teacher, very knowledgeable.", date: "2023-06-01" },
  { id: 2, facultyName: "Prof. Jane Doe", reviewerName: "Bob", rating: 5, comment: "Excellent lectures and very helpful during office hours.", date: "2023-06-02" },
  { id: 3, facultyName: "Dr. John Smith", reviewerName: "Charlie", rating: 3, comment: "Good content, but sometimes hard to follow.", date: "2023-06-03" },
]

export default function FacultyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [newReview, setNewReview] = useState({ facultyName: "", rating: 5, comment: "" })
  const { user } = useAuth()

  const filteredReviews = reviews.filter(review => 
    review.facultyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      const review: Review = {
        id: reviews.length + 1,
        facultyName: newReview.facultyName,
        reviewerName: user.email,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      }
      setReviews([...reviews, review])
      setNewReview({ facultyName: "", rating: 5, comment: "" })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Faculty Reviews</h1>
      
      <div>
        <input
          type="text"
          placeholder="Search faculty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-4">
        {filteredReviews.map(review => (
          <div key={review.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{review.facultyName}</h2>
            <p>Rating: {review.rating}/5</p>
            <p>{review.comment}</p>
            <p className="text-sm text-gray-500">By {review.reviewerName} on {review.date}</p>
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleSubmitReview} className="space-y-4 border p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Write a Review</h2>
          <div>
            <label htmlFor="facultyName" className="block">Faculty Name</label>
            <input
              type="text"
              id="facultyName"
              value={newReview.facultyName}
              onChange={(e) => setNewReview({...newReview, facultyName: e.target.value})}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="rating" className="block">Rating</label>
            <select
              id="rating"
              value={newReview.rating}
              onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
              className="w-full p-2 border rounded"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="comment" className="block">Comment</label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              required
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Submit Review
          </button>
        </form>
      )}

      {!user && (
        <p className="text-center">Please <a href="/login" className="text-blue-500 hover:underline">log in</a> to write a review.</p>
      )}
    </div>
  )
}
