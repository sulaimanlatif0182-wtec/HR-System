'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface LeaveRequest {
  id: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
}

export default function AdminLeaveApproval() {
  const [user, setUser] = useState<any>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check user role
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    
    if (parsedUser.role !== 'admin' && parsedUser.role !== 'manager') {
      toast.error("Access denied. Admin only.");
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    fetchLeaves();
  }, [router]);

  // Fetch all leave requests
  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leaves');
      const data = await res.json();
      setLeaves(data);
    } catch (error) {
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  // Update leave status
  const updateLeaveStatus = async (id: number, newStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/leaves/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Leave request ${newStatus} successfully`);
        fetchLeaves();
      } else {
        toast.error("Failed to update leave request");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const processedLeaves = leaves.filter(l => l.status !== 'pending');

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-zinc-200 px-8 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">Leave Requests</h1>
          <p className="text-sm text-zinc-500">{pendingLeaves.length} pending approvals</p>
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
                        <td className="px-6 py-5 capitalize">{leave.leaveType}</td>
                        <td className="px-6 py-5 text-sm">
                          {new Date(leave.startDate).toLocaleDateString()} → {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 text-sm text-zinc-600">{leave.reason}</td>
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
                      <td className="px-6 py-5 capitalize">{leave.leaveType}</td>
                      <td className="px-6 py-5 text-sm">
                        {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`status-badge ${
                          leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
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