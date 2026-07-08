'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  role: 'admin' | 'manager' | 'employee';
}

interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'casual';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export default function Leaves() {
  const [user, setUser] = useState<User>({ name: "Loading...", role: "employee" });
  const router = useRouter();

  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: 1, employeeId: 2, employeeName: "Aisha Patel", leaveType: "annual", startDate: "2025-07-10", endDate: "2025-07-14", reason: "Family vacation", status: "pending", appliedDate: "2025-06-28" },
    { id: 2, employeeId: 3, employeeName: "David Kim", leaveType: "sick", startDate: "2025-07-05", endDate: "2025-07-06", reason: "Medical appointment", status: "pending", appliedDate: "2025-07-01" },
    { id: 3, employeeId: 4, employeeName: "Emma Rodriguez", leaveType: "casual", startDate: "2025-07-03", endDate: "2025-07-03", reason: "Personal matters", status: "approved", appliedDate: "2025-06-25" },
    { id: 4, employeeId: 1, employeeName: "Michael Torres", leaveType: "annual", startDate: "2025-08-01", endDate: "2025-08-10", reason: "Annual leave", status: "pending", appliedDate: "2025-06-20" },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Redirect employees to my-leaves
      if (parsedUser.role === 'employee') {
        router.push('/my-leaves');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  if (user.name === "Loading...") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const updateLeaveStatus = (id: number, newStatus: 'approved' | 'rejected') => {
    setLeaves(leaves.map(leave => 
      leave.id === id ? { ...leave, status: newStatus } : leave
    ));
  };

  const getStatusColor = (status: string) => {
    if (status === 'approved') return 'bg-emerald-100 text-emerald-700';
    if (status === 'rejected') return 'bg-red-100 text-red-700';
    return 'bg-amber-100 text-amber-700';
  };

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const processedLeaves = leaves.filter(l => l.status !== 'pending');

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Leave Requests</h1>
            <p className="text-sm text-zinc-500">{pendingLeaves.length} pending approvals</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8 space-y-8">
          {/* Pending Requests */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">PENDING</div>
              <h3 className="font-semibold text-lg">Pending Approvals</h3>
            </div>
            
            <div className="card bg-white border border-zinc-200 rounded-3xl overflow-hidden">
              {pendingLeaves.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs font-medium text-zinc-500">
                      <th className="px-8 py-4 text-left">Employee</th>
                      <th className="px-6 py-4 text-left">Leave Type</th>
                      <th className="px-6 py-4 text-left">Dates</th>
                      <th className="px-6 py-4 text-left">Reason</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {pendingLeaves.map((leave) => (
                      <tr key={leave.id} className="table-row">
                        <td className="px-8 py-5 font-medium">{leave.employeeName}</td>
                        <td className="px-6 py-5">
                          <span className="capitalize px-3 py-1 bg-zinc-100 text-xs rounded-full">{leave.leaveType}</span>
                        </td>
                        <td className="px-6 py-5 text-sm">
                          {new Date(leave.startDate).toLocaleDateString()} → {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 text-sm text-zinc-600 max-w-[220px] truncate">{leave.reason}</td>
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => updateLeaveStatus(leave.id, 'approved')}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-2xl"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button 
                              onClick={() => updateLeaveStatus(leave.id, 'rejected')}
                              className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-2xl"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-8 py-12 text-center text-zinc-400">No pending leave requests</div>
              )}
            </div>
          </div>

          {/* Processed Requests */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-zinc-200 text-zinc-700 text-xs font-medium rounded-full">PROCESSED</div>
              <h3 className="font-semibold text-lg">Recently Processed</h3>
            </div>

            <div className="card bg-white border border-zinc-200 rounded-3xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs font-medium text-zinc-500">
                    <th className="px-8 py-4 text-left">Employee</th>
                    <th className="px-6 py-4 text-left">Leave Type</th>
                    <th className="px-6 py-4 text-left">Dates</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {processedLeaves.map((leave) => (
                    <tr key={leave.id} className="table-row">
                      <td className="px-8 py-5 font-medium">{leave.employeeName}</td>
                      <td className="px-6 py-5 capitalize text-sm">{leave.leaveType}</td>
                      <td className="px-6 py-5 text-sm">
                        {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`status-badge ${getStatusColor(leave.status)}`}>
                          {leave.status}
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
