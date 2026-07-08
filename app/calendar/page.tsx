'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Calendar } from 'lucide-react';

interface User {
  name: string;
  role: 'admin' | 'manager' | 'employee';
}

interface LeaveEvent {
  id: number;
  employee: string;
  start: string;
  end: string;
  type: string;
}

export default function LeaveCalendar() {
  const [user, setUser] = useState<User>({ name: "Loading...", role: "employee" });

  const [events] = useState<LeaveEvent[]>([
    { id: 1, employee: "Aisha Patel", start: "2025-07-10", end: "2025-07-14", type: "Annual" },
    { id: 2, employee: "Michael Torres", start: "2025-07-15", end: "2025-07-18", type: "Sick" },
    { id: 3, employee: "David Kim", start: "2025-08-01", end: "2025-08-05", type: "Annual" },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4">
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            <Calendar className="w-6 h-6" /> Leave Calendar
          </h1>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
            <div className="card bg-white border border-zinc-200 rounded-3xl p-8">
              <div className="mb-6">
                <h3 className="font-semibold">Upcoming Leaves - July & August 2025</h3>
              </div>

              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between border border-zinc-100 p-5 rounded-2xl">
                    <div>
                      <div className="font-medium">{event.employee}</div>
                      <div className="text-sm text-zinc-500">{event.type} Leave</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {new Date(event.start).toLocaleDateString()} — {new Date(event.end).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-emerald-600">
                        {Math.ceil((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 3600 * 24)) + 1} days
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center text-xs text-zinc-400">
                Full interactive calendar view will be available in future updates
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
