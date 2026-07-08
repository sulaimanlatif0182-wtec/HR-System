'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users } from 'lucide-react';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  department: string;
  designation: string;
  joinDate: string;
  status: string;
}

export default function ManagerDashboard() {
  const [user] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });

  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.employeeId) {
      setLoading(false);
      return;
    }

    const fetchTeamMembers = async () => {
      try {
        const res = await fetch('/api/employees');
        const data = await res.json();

        // Filter employees who have this manager
        const myTeam = data.filter((emp: any) => emp.managerId === user.employeeId);
        setTeamMembers(myTeam);
      } catch (error) {
        console.error("Failed to fetch team members");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-zinc-400">Please login first</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-zinc-200 px-8 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">My Team</h1>
          <p className="text-sm text-zinc-500">{teamMembers.length} team members</p>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="card bg-white border border-zinc-200 rounded-3xl overflow-hidden">
              <div className="px-8 py-5 border-b flex items-center gap-3">
                <Users className="w-5 h-5 text-zinc-400" />
                <span className="font-semibold">Team Members</span>
              </div>

              {teamMembers.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs font-medium text-zinc-500">
                      <th className="px-8 py-4 text-left">Employee</th>
                      <th className="px-6 py-4 text-left">Department</th>
                      <th className="px-6 py-4 text-left">Designation</th>
                      <th className="px-6 py-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {teamMembers.map((emp) => (
                      <tr key={emp.id} className="table-row">
                        <td className="px-8 py-5">
                          <div>
                            <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                            <div className="text-xs text-zinc-500">{emp.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm">{emp.department}</td>
                        <td className="px-6 py-5 text-sm">{emp.designation}</td>
                        <td className="px-6 py-5">
                          <span className={`status-badge ${emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-600'}`}>
                            {emp.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-8 py-12 text-center text-zinc-400">
                  You currently have no team members assigned.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}