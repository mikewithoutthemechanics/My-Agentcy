import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, MessageSquare } from 'lucide-react'

const completedTasks = [
  { id: '4', title: 'Customer Segmentation Analysis', type: 'Analysis', completed: '2 days ago', rating: null, feedback: '' },
  { id: '5', title: 'Sales Email Templates', type: 'Content', completed: '5 days ago', rating: 5, feedback: 'Excellent work, exactly what we needed!' },
  { id: '6', title: 'Competitive Landscape Report', type: 'Report', completed: '1 week ago', rating: 4, feedback: 'Good analysis, could have included more pricing data.' },
  { id: '7', title: 'API Integration Guide', type: 'Content', completed: '2 weeks ago', rating: 5, feedback: 'Clear and well-structured documentation.' },
]

export default function ClientFeedback() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
        <p className="text-gray-400 text-sm mt-1">Rate your completed tasks and help us improve</p>
      </div>

      {/* Feedback Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Average Rating</p>
          <p className="text-2xl font-bold flex items-center gap-1">4.7 <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Reviews Given</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Revision Rate</p>
          <p className="text-2xl font-bold text-green-500">8%</p>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-sm font-semibold mb-4">Completed Tasks</h2>
        <div className="space-y-4">
          {completedTasks.map(task => (
            <div key={task.id} className="p-4 rounded-lg border border-gray-50 hover:border-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-gray-400">{task.type} · {task.completed}</p>
                </div>
                {task.rating ? (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= task.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedTask(task.id)}
                    className="text-xs text-[#FF6B6B] hover:text-[#FF5252] font-medium"
                  >
                    Rate this task
                  </button>
                )}
              </div>
              {task.feedback && (
                <div className="flex items-start gap-2 mt-2 p-3 bg-gray-50 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-500">{task.feedback}</p>
                </div>
              )}

              {/* Inline Rating */}
              {selectedTask === task.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setRating(s)}>
                        <Star className={`w-6 h-6 cursor-pointer transition-colors ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 hover:text-yellow-200'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    placeholder="Tell us what you thought..."
                    className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm h-20 resize-none focus:outline-none focus:border-gray-200 mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedTask(null)} className="px-4 py-2 rounded-lg border border-gray-100 text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                    <button className="px-4 py-2 rounded-lg bg-[#1A1A2E] text-white text-xs font-medium hover:bg-[#2D2D44]">Submit Feedback</button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
