'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function MyAttendance() {
  const [user] = useState({ name: "Aisha Patel", role: "employee" as const });
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const handleCheckIn = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCheckInTime(time);
    setCheckedIn(true);
  };

  const handleCheckOut = () => {
    setCheckedIn(false);
    setCheckInTime(null);
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">My Attendance</h1>
        </header>

        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            {/* Today's Status */}
            <div className="card bg-white border border-zinc-200 rounded-3xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-zinc-500">Today&apos;s Status</div>
                  <div className="text-4xl font-semibold tracking-tighter mt-1">
                    {checkedIn ? "Present" : "Not Checked In"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-500">Date</div>
                  <div className="font-medium">{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {checkedIn ? (
                <div>
                  <div className="text-emerald-600 text-sm font-medium">Checked in at {checkInTime}</div>
                  <button 
                    onClick={handleCheckOut}
                    className="mt-4 w-full py-4 bg-red-600 text-white rounded-2xl font-medium"
                  >
                    Check Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleCheckIn}
                  className="btn-primary w-full py-4 rounded-2xl font-medium text-lg mt-2"
                >
                  Check In Now
                </button>
              )}
            </div>

            {/* Attendance History */}
            <div className="card bg-white border border-zinc-200 rounded-3xl overflow-hidden">
              <div className="px-6 py-4 border-b font-medium text-sm">Attendance History</div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-zinc-500 text-xs">
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Check In</th>
                    <th className="px-6 py-3 text-left">Check Out</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {[
                    { date: "2025-06-30", in: "08:55", out: "17:40", status: "present" },
                    { date: "2025-06-29", in: "09:05", out: "17:55", status: "late" },
                    { date: "2025-06-27", in: "08:50", out: "17:35", status: "present" },
                  ].map((rec, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">{rec.date}</td>
                      <td className="px-6 py-4 font-mono">{rec.in}</td>
                      <td className="px-6 py-4 font-mono">{rec.out}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`status-badge text-xs ${rec.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
