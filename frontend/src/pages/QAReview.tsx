import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'

const fallbackReviews = [
  { id: '1', task_title: 'Q1 Market Analysis', tier: 'T1', status: 'pending', score: 85, issues: 2, submitted_by: 'Analyst', time: '2h ago' },
  { id: '2', task_title: 'Competitive Report: SaaS', tier: 'T1', status: 'approved', score: 92, issues: 0, submitted_by: 'Builder', time: '3h ago' },
  { id: '3', task_title: 'API Documentation', tier: 'T0', status: 'rejected', score: 65, issues: 4, submitted_by: 'Builder', time: '5h ago' },
]

export default function QAReview() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Try fetching from API first
    fetch('/api/qa/').then(r => r.json()).then(data => {
      if (data.reviews?.length) setReviews(data.reviews)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  // Use fallback if no data
  useEffect(() => {
    if (!loading && reviews.length === 0) {
      setReviews(fallbackReviews)
    }
  }, [loading])

  const filtered = reviews.filter(r => filter === 'all' || r.status === filter)

  const pendingCount = reviews.filter(r => r.status === 'pending').length
  const approvedCount = reviews.filter(r => r.status === 'approved').length
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">QA Review</h1>
        <p className="text-white/30 text-sm mt-1">Review AI agent outputs before delivery</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
            <Clock className="w-4 h-4" /> Pending
          </div>
          <div className="text-2xl font-bold">{pendingCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
            <ThumbsUp className="w-4 h-4" /> Approved
          </div>
          <div className="text-2xl font-bold">{approvedCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
            <ThumbsDown className="w-4 h-4" /> Rejected
          </div>
          <div className="text-2xl font-bold">{rejectedCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === f ? 'bg-white/10 text-white' : 'text-white/30'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{review.task_title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                    <span className="font-mono">{review.tier}</span>
                    <span>by {review.submitted_by}</span>
                    <span>{review.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{review.score}%</div>
                  {review.issues > 0 && <div className="text-xs text-red-400">{review.issues} issues</div>}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30">Approve</button>
                <button className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30">Reject</button>
                <button className="px-3 py-1.5 bg-white/10 text-white/60 rounded-lg text-xs hover:bg-white/20">Review</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}