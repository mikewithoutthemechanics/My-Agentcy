import { Bell, CreditCard } from 'lucide-react'

export default function ClientSettings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold mb-4">Profile</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Company Name</label>
              <input className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-200" defaultValue="Acme Corp" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1.5">Email</label>
              <input className="w-full border border-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-200" defaultValue="hello@acmecorp.com" />
            </div>
          </div>
          <button className="mt-4 px-4 py-2.5 rounded-lg bg-[#1A1A2E] text-white text-sm font-medium hover:bg-[#2D2D44] transition-colors">Save Changes</button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Task completed', desc: 'When your task is ready for review', enabled: true },
              { label: 'Revision update', desc: 'When a revision has been completed', enabled: true },
              { label: 'Weekly summary', desc: 'Weekly digest of your tasks and usage', enabled: false },
              { label: 'Marketing updates', desc: 'New features and product updates', enabled: false },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-gray-400">{n.desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${n.enabled ? 'bg-[#1A1A2E]' : 'bg-gray-200'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${n.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-sm font-semibold mb-4">Integrations</h2>
          <div className="space-y-3">
            {[
              { name: 'Slack', status: 'Connected', color: 'text-green-500' },
              { name: 'WhatsApp', status: 'Not connected', color: 'text-gray-400' },
              { name: 'Google Drive', status: 'Connected', color: 'text-green-500' },
              { name: 'Email', status: 'Connected', color: 'text-green-500' },
            ].map(i => (
              <div key={i.name} className="flex items-center justify-between py-2">
                <span className="text-sm">{i.name}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${i.color}`}>{i.status}</span>
                  <button className="text-xs text-[#1A1A2E] font-medium hover:underline">
                    {i.status === 'Connected' ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold">Plan & Billing</h2>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
            <div>
              <p className="font-semibold">Pro Plan</p>
              <p className="text-sm text-gray-400">R7,999/month · 80 tasks/month</p>
            </div>
            <button className="text-xs text-[#1A1A2E] font-medium hover:underline">Upgrade</button>
          </div>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex justify-between"><span>Tasks used this month</span><span>15 / 80</span></div>
            <div className="flex justify-between"><span>Next billing date</span><span>April 1, 2026</span></div>
            <div className="flex justify-between"><span>Payment method</span><span>•••• 4242</span></div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-100 p-6">
          <h2 className="text-sm font-semibold text-red-500 mb-4">Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-gray-400">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}
