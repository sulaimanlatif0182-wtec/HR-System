'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, LineChart, Line 
} from 'recharts';

interface User {
  name: string;
  role: 'admin' | 'manager' | 'employee';
  employeeId?: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';
  const isManager = user.role === 'manager';

  const stats = [
    { title: "Total Employees", value: 124, change: "+8 this month", icon: <Users className="w-5 h-5 text-white" />, color: "bg-zinc-900" },
    { title: "Present Today", value: "98", change: "79% attendance", icon: <Clock className="w-5 h-5 text-white" />, color: "bg-emerald-600" },
    { title: "Pending Leaves", value: 17, change: "5 new today", icon: <Calendar className="w-5 h-5 text-white" />, color: "bg-amber-600" },
    { title: "On Leave", value: 6, change: "2 returning tomorrow", icon: <Users className="w-5 h-5 text-white" />, color: "bg-sky-600" },
  ];

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-zinc-500">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'}!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 bg-white border border-zinc-200 rounded-2xl text-sm">
              Today: <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="card bg-white border border-zinc-200 rounded-3xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">{stat.title}</p>
                    <p className="text-3xl font-semibold mt-2 tracking-tighter">{stat.value}</p>
                    {stat.change && (
                      <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {stat.change}
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Attendance Trend */}
            <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
              <h3 className="font-semibold text-lg mb-4">Attendance Trend (Last 7 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { day: 'Mon', present: 112, late: 8 },
                    { day: 'Tue', present: 105, late: 12 },
                    { day: 'Wed', present: 118, late: 5 },
                    { day: 'Thu', present: 98, late: 15 },
                    { day: 'Fri', present: 120, late: 4 },
                    { day: 'Sat', present: 45, late: 2 },
                    { day: 'Sun', present: 38, late: 1 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#0f172a" name="Present" />
                    <Bar dataKey="late" fill="#f59e0b" name="Late" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leave Type Distribution */}
            <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
              <h3 className="font-semibold text-lg mb-4">Leave Type Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Annual Leave', value: 68, fill: '#0f172a' },
                        { name: 'Sick Leave', value: 25, fill: '#10b981' },
                        { name: 'Casual Leave', value: 18, fill: '#f59e0b' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 text-sm mt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-900 rounded"></div> Annual</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-600 rounded"></div> Sick</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded"></div> Casual</div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Employee Growth Trend */}
            <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
              <h3 className="font-semibold text-lg mb-4">Employee Growth Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Jan', employees: 98 },
                    { month: 'Feb', employees: 105 },
                    { month: 'Mar', employees: 112 },
                    { month: 'Apr', employees: 118 },
                    { month: 'May', employees: 124 },
                    { month: 'Jun', employees: 131 },
                    { month: 'Jul', employees: 138 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="natural" dataKey="employees" stroke="#0f172a" strokeWidth={3} dot={{ fill: '#0f172a', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Attendance by Department */}
            <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
              <h3 className="font-semibold text-lg mb-4">Attendance by Department</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { dept: 'Engineering', present: 42, late: 3 },
                    { dept: 'Marketing', present: 17, late: 1 },
                    { dept: 'Finance', present: 11, late: 2 },
                    { dept: 'HR', present: 8, late: 0 },
                    { dept: 'Sales', present: 19, late: 4 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dept" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#10b981" name="Present" />
                    <Bar dataKey="late" fill="#f59e0b" name="Late" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg">Recent Activity</h3>
                <button className="text-sm text-zinc-500 hover:text-zinc-800">View all</button>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Michael Torres", action: "submitted a leave request", time: "2h ago" },
                  { name: "Aisha Patel", action: "checked in", time: "4h ago" },
                  { name: "David Kim", action: "leave approved", time: "Yesterday" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{activity.name}</span>{" "}
                      <span className="text-zinc-500">{activity.action}</span>
                    </div>
                    <span className="text-xs text-zinc-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
              <h3 className="font-semibold text-lg mb-5">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {(isAdmin || isManager) && (
                  <button onClick={() => window.location.href = '/employees'} className="btn-primary flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium">
                    <Users className="w-4 h-4" /> Add Employee
                  </button>
                )}
                <button onClick={() => window.location.href = '/leaves'} className="btn-secondary flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium">
                  <Calendar className="w-4 h-4" /> {isAdmin || isManager ? "Review Leaves" : "My Leaves"}
                </button>
                <button onClick={() => window.location.href = isAdmin || isManager ? '/attendance' : '/my-attendance'} className="btn-secondary flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium">
                  <Clock className="w-4 h-4" /> Attendance
                </button>
                {(isAdmin || isManager) && (
                  <button onClick={() => window.location.href = '/reports'} className="btn-secondary flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-medium">
                    <TrendingUp className="w-4 h-4" /> Reports
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}