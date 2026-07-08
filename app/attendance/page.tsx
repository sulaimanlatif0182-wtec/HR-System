'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  role: 'admin' | 'manager' | 'employee';
}

interface AttendanceRecord {
  id: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  status: 'present' | 'late' | 'absent';
}

export default function Attendance() {
  const [user, setUser] = useState<User>({ name: "Loading...", role: "employee" });
  const router = useRouter();

  const [records] = useState<AttendanceRecord[]>([
    { id: 1, employeeName: "Michael Torres", date: "2025-07-01", checkIn: "08:52", checkOut: "17:45", status: "present" },
    { id: 2, employeeName: "Aisha Patel", date: "2025-07-01", checkIn: "09:35", checkOut: "18:10", status: "late" },
    { id: 3, employeeName: "David Kim", date: "2025-07-01", checkIn: "08:48", checkOut: "17:30", status: "present" },
    { id: 4, employeeName: "Emma Rodriguez", date: "2025-07-01", checkIn: "—", checkOut: "—", status: "absent" },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (user.name === "Loading...") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
            <p className="text-sm text-zinc-500">Daily attendance overview</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="px-4 py-1.5 bg-white border border-zinc-200 rounded-2xl">Today: July 1, 2025</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="card bg-white border border-zinc-200 rounded-3xl overflow-hidden">
            <div className="px-8 py-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-zinc-400" />
                <span className="font-semibold">Attendance Records</span>
              </div>
              <button className="text-sm px-4 py-1.5 rounded-2xl border border-zinc-200 hover:bg-zinc-50">Export CSV</button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 text-xs font-medium text-zinc-500">
                  <th className="px-8 py-4 text-left">Employee</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Check In</th>
                  <th className="px-6 py-4 text-left">Check Out</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {records.map((record) => (
                  <tr key={record.id} className="table-row">
                    <td className="px-8 py-5 font-medium">{record.employeeName}</td>
                    <td className="px-6 py-5 text-sm text-zinc-600">{record.date}</td>
                    <td className="px-6 py-5 font-mono text-sm">{record.checkIn}</td>
                    <td className="px-6 py-5 font-mono text-sm">{record.checkOut || '—'}</td>
                    <td className="px-6 py-5">
                      <span className={`status-badge ${
                        record.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 
                        record.status === 'late' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
