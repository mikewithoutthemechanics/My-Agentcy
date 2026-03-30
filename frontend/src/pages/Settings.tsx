import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Key,
  Bell,
  Users,
  Shield,
  Globe,
  Palette,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import { Card, Button, Input, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  permissions: string[];
}

const mockApiKeys: ApiKey[] = [
  { id: '1', name: 'Production API Key', key: 'sk-prod-****************************abcd', created: '2024-01-15', lastUsed: '2 hours ago', permissions: ['read', 'write'] },
  { id: '2', name: 'Development Key', key: 'sk-dev-****************************efgh', created: '2024-02-01', lastUsed: '5 minutes ago', permissions: ['read', 'write', 'admin'] },
  { id: '3', name: 'CI/CD Pipeline', key: 'sk-ci--****************************ijkl', created: '2024-02-20', lastUsed: '1 day ago', permissions: ['read'] },
];

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  slack: boolean;
}

const notificationSettings: NotificationSetting[] = [
  { id: 'task_completed', label: 'Task Completed', description: 'When an agent completes a task', email: true, push: true, slack: true },
  { id: 'qa_required', label: 'QA Review Required', description: 'When a task needs human review', email: true, push: true, slack: false },
  { id: 'agent_error', label: 'Agent Errors', description: 'When an agent encounters an error', email: true, push: true, slack: true },
  { id: 'billing_alert', label: 'Billing Alerts', description: 'Budget thresholds and invoices', email: true, push: false, slack: false },
  { id: 'weekly_report', label: 'Weekly Summary', description: 'Weekly performance digest', email: true, push: false, slack: true },
];

const settingsTabs = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(notificationSettings);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleNotification = (id: string, channel: 'email' | 'push' | 'slack') => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, [channel]: !n[channel] } : n)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-accent-dim mt-1">Manage your organization and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-surface rounded-xl border border-surface-lighter overflow-x-auto">
        {settingsTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-surface-light text-white'
                  : 'text-accent-dim hover:text-accent hover:bg-surface-light/50',
              )}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h3 className="section-title mb-4">Organization</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-accent-dim mb-1.5 block">Organization Name</label>
                  <Input defaultValue="My-Agentcy" />
                </div>
                <div>
                  <label className="text-sm text-accent-dim mb-1.5 block">Slug</label>
                  <Input defaultValue="my-agentcy" />
                </div>
              </div>
              <div>
                <label className="text-sm text-accent-dim mb-1.5 block">Description</label>
                <textarea
                  className="input min-h-[80px] resize-none"
                  defaultValue="AI Workforce as a Service platform"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Palette size={18} />
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-accent-dim">Use dark theme across the application</p>
                </div>
                <div className="w-11 h-6 bg-accent rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-background rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Compact Mode</p>
                  <p className="text-xs text-accent-dim">Reduce spacing in tables and lists</p>
                </div>
                <div className="w-11 h-6 bg-surface-lighter rounded-full relative cursor-pointer">
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-accent-dim rounded-full" />
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Globe size={18} />
              Regional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-accent-dim mb-1.5 block">Timezone</label>
                <select className="input">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-accent-dim mb-1.5 block">Date Format</label>
                <select className="input">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-accent-dim mb-1.5 block">Currency</label>
                <select className="input">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button variant="primary">
              <Save size={16} />
              Save Changes
            </Button>
          </div>
        </motion.div>
      )}

      {/* API Keys */}
      {activeTab === 'api-keys' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="section-title">API Keys</h3>
                <p className="text-sm text-accent-dim mt-1">Manage your API keys for programmatic access</p>
              </div>
              <Button variant="primary">
                <Plus size={16} />
                New Key
              </Button>
            </div>

            <div className="space-y-3">
              {mockApiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="flex items-center justify-between p-4 bg-surface-light rounded-lg border border-surface-lighter"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{apiKey.name}</p>
                      <div className="flex gap-1">
                        {apiKey.permissions.map((perm) => (
                          <Badge key={perm} variant="neutral" className="text-[10px]">{perm}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <code className="text-xs text-accent-dim font-mono">
                        {showKeys[apiKey.id] ? apiKey.key : apiKey.key.replace(/[^-]/g, '*')}
                      </code>
                    </div>
                    <p className="text-xs text-accent-dim mt-1">
                      Created {apiKey.created} · Last used {apiKey.lastUsed}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => toggleKeyVisibility(apiKey.id)}>
                      {showKeys[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => copyKey(apiKey.id, apiKey.key)}>
                      {copiedKey === apiKey.id ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-error hover:text-error">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="section-title mb-2">Rate Limits</h3>
            <p className="text-sm text-accent-dim mb-4">Current API usage and limits</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-surface-light rounded-lg">
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-xs text-accent-dim">Requests today</p>
                <div className="mt-2 h-1.5 bg-surface-lighter rounded-full">
                  <div className="h-full bg-accent rounded-full" style={{ width: '28%' }} />
                </div>
                <p className="text-xs text-accent-dim mt-1">of 10,000 limit</p>
              </div>
              <div className="p-4 bg-surface-light rounded-lg">
                <p className="text-2xl font-bold">150</p>
                <p className="text-xs text-accent-dim">Requests / minute</p>
                <div className="mt-2 h-1.5 bg-surface-lighter rounded-full">
                  <div className="h-full bg-warning rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-xs text-accent-dim mt-1">of 200 limit</p>
              </div>
              <div className="p-4 bg-surface-light rounded-lg">
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-accent-dim">Active connections</p>
                <div className="mt-2 h-1.5 bg-surface-lighter rounded-full">
                  <div className="h-full bg-success rounded-full" style={{ width: '12%' }} />
                </div>
                <p className="text-xs text-accent-dim mt-1">of 100 limit</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h3 className="section-title mb-1">Notification Preferences</h3>
            <p className="text-sm text-accent-dim mb-6">Choose how you want to be notified</p>

            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-[1fr_80px_80px_80px] gap-4 px-4 py-2 text-xs text-accent-dim font-medium">
                <span>Event</span>
                <span className="text-center">Email</span>
                <span className="text-center">Push</span>
                <span className="text-center">Slack</span>
              </div>

              {notifications.map((setting) => (
                <div
                  key={setting.id}
                  className="grid grid-cols-[1fr_80px_80px_80px] gap-4 items-center px-4 py-3 rounded-lg hover:bg-surface-light transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{setting.label}</p>
                    <p className="text-xs text-accent-dim">{setting.description}</p>
                  </div>
                  <div className="flex justify-center">
                    <ToggleSwitch checked={setting.email} onChange={() => toggleNotification(setting.id, 'email')} />
                  </div>
                  <div className="flex justify-center">
                    <ToggleSwitch checked={setting.push} onChange={() => toggleNotification(setting.id, 'push')} />
                  </div>
                  <div className="flex justify-center">
                    <ToggleSwitch checked={setting.slack} onChange={() => toggleNotification(setting.id, 'slack')} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-surface-lighter flex justify-end">
              <Button variant="primary">
                <Save size={16} />
                Save Preferences
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Team */}
      {activeTab === 'team' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="section-title">Team Members</h3>
                <p className="text-sm text-accent-dim mt-1">Manage who has access to your organization</p>
              </div>
              <Button variant="primary">
                <Plus size={16} />
                Invite Member
              </Button>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Alex Chen', email: 'alex@my-agentcy.com', role: 'Admin', avatar: '👨‍💻', status: 'online' },
                { name: 'Sarah Miller', email: 'sarah@my-agentcy.com', role: 'Manager', avatar: '👩‍💼', status: 'online' },
                { name: 'James Wilson', email: 'james@my-agentcy.com', role: 'Developer', avatar: '🧑‍💻', status: 'offline' },
                { name: 'Emily Davis', email: 'emily@my-agentcy.com', role: 'QA Reviewer', avatar: '👩‍🔬', status: 'busy' },
              ].map((member) => (
                <div
                  key={member.email}
                  className="flex items-center justify-between p-4 bg-surface-light rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-lighter flex items-center justify-center text-lg">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-accent-dim">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={member.role === 'Admin' ? 'info' : 'neutral'}>{member.role}</Badge>
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      member.status === 'online' ? 'bg-success' : member.status === 'busy' ? 'bg-warning' : 'bg-accent-dim',
                    )} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Shield size={18} />
              Security Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                <div>
                  <p className="font-medium text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-accent-dim">Add an extra layer of security to your account</p>
                </div>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                <div>
                  <p className="font-medium text-sm">Session Timeout</p>
                  <p className="text-xs text-accent-dim">Automatically log out after inactivity</p>
                </div>
                <select className="input w-auto text-sm">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                  <option>Never</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                <div>
                  <p className="font-medium text-sm">IP Allowlist</p>
                  <p className="text-xs text-accent-dim">Restrict access to specific IP addresses</p>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                <div>
                  <p className="font-medium text-sm">Audit Log</p>
                  <p className="text-xs text-accent-dim">View all account activity and changes</p>
                </div>
                <Button variant="secondary" size="sm">View Log</Button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="section-title mb-4 text-error">Danger Zone</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-error/5 rounded-lg border border-error/20">
                <div>
                  <p className="font-medium text-sm">Delete Organization</p>
                  <p className="text-xs text-accent-dim">Permanently delete your organization and all data</p>
                </div>
                <Button variant="danger" size="sm">Delete</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'w-9 h-5 rounded-full relative transition-colors',
        checked ? 'bg-accent' : 'bg-surface-lighter',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}
