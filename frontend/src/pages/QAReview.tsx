import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Clock, Eye } from 'lucide-react'

const reviewQueue = [
  { id: '1', task: 'Competitive Report: SaaS Landscape', type: 'report', tier: 'T1', reviewType: 'spot_check', qaScore: 87, flags: 1, priority: 3, deadline: '2h' },
  { id: '2', task: 'Financial Model — Series A', type: 'analysis', tier: 'T2', reviewType: 'full', qaScore: 91, flags: 0, priority: 1, deadline: '1h' },
  { id: '3', task: 'Sales Pipeline Script', type: 'code', tier: 'T1', reviewType: 'spot_check', qaScore: 78, flags: 3, priority: 2, deadline: '3h' },
  { id: '4', task: 'Brand Guidelines', type: 'content', tier: 'T2', reviewType: 'full', qaScore: 94, flags: 0, priority: 2, deadline: '5h' },
]

const completedReviews = [
  { id: '5', task: 'API Documentation', type: 'content', result: 'approved', reviewer: 'QA Agent', score: 92, time: '12 min ago' },
  { id: '6', task: 'Market Research Brief', type: 'research', result: 'approved', reviewer: 'Sarah (Human)', score: 88, time: '1h ago' },
  { id: '7', task: 'Customer Analysis', type: 'analysis', result: 'revised', reviewer: 'QA Agent', score: 76, time: '2h ago' },
]

export default function QAReview() {

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">QA Review</h1>
        <p className="text-white/40 text-sm mt-1">{reviewQueue.length} pending · Automated + human review pipeline</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Review Queue */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold mb-4">Review Queue</h2>
          <div className="space-y-3">
            {reviewQueue.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium">{item.task}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-white/30">{item.type}</span>
                      <span className="text-[10px] font-mono text-white/30">{item.tier}</span>
                      <span className="text-[10px] text-white/30">{item.reviewType.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] flex items-center gap-1 text-white/30">
                      <Clock className="w-3 h-3" /> {item.deadline}
                    </span>
                  </div>
                </div>

                {/* QA Agent Score */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">QA Score:</span>
                    <span className={`text-sm font-bold ${item.qaScore >= 85 ? 'text-green-400' : item.qaScore >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {item.qaScore}
                    </span>
                  </div>
                  {item.flags > 0 && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span className="text-xs">{item.flags} flag{item.flags > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Score Bars */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: 'Accuracy', value: Math.round(item.qaScore * (0.95 + Math.random() * 0.1)) },
                    { label: 'Complete', value: Math.round(item.qaScore * (0.9 + Math.random() * 0.15)) },
                    { label: 'Format', value: Math.round(item.qaScore * (0.92 + Math.random() * 0.12)) },
                    { label: 'Relevant', value: Math.round(item.qaScore * (0.88 + Math.random() * 0.15)) },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-[9px] text-white/30 mb-0.5">
                        <span>{s.label}</span>
                        <span>{s.value}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${s.value}%`,
                            backgroundColor: s.value >= 85 ? '#4ADE80' : s.value >= 75 ? '#FBBF24' : '#EF4444',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-white/40 text-xs font-medium hover:bg-white/10 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar: Completed + Stats */}
        <div>
          {/* QA Stats */}
          <div className="bg-white/[0.02] rounded-xl border border-white/5 p-5 mb-6">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">QA Pipeline Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Automated Pass Rate</span>
                <span className="font-medium text-green-400">94.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Human Override Rate</span>
                <span className="font-medium text-yellow-400">8.3%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Avg Review Time</span>
                <span className="font-medium">2.4 min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Total Reviews Today</span>
                <span className="font-medium">47</span>
              </div>
            </div>
          </div>

          {/* Recently Completed */}
          <div className="bg-white/[0.02] rounded-xl border border-white/5 p-5">
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Recently Completed</h3>
            <div className="space-y-3">
              {completedReviews.map(r => (
                <div key={r.id} className="flex items-start gap-3">
                  {r.result === 'approved' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{r.task}</p>
                    <p className="text-[10px] text-white/30">{r.reviewer} · Score {r.score} · {r.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
