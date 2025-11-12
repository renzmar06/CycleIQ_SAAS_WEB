import { Layout } from '../components';
import { Package, Scale, DollarSign, Users, Box, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    { label: "Today's Tickets", value: 0, icon: Package, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: "Today's Weight", value: '0 lbs', icon: Scale, color: 'text-green-600', bg: 'bg-green-50' },
    { label: "Today's Payout", value: '$0', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Customers', value: 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];
  return (
    <Layout>
      <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.bg}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
    </Layout>
  );
}