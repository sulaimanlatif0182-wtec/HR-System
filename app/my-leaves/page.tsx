'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface LeaveRequest {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface LeaveBalance {
  total: number;
  used: number;
  remaining: number;
}

export default function MyLeaves() {
  const [user] = useState({ name: "Aisha Patel", role: "employee" as const });
  const [showModal, setShowModal] = useState(false);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [newLeave, setNewLeave] = useState({
    leaveType: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Fetch leaves from database
  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/leaves');
      const data = await res.json();
      setLeaves(data);
    } catch (error) {
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // Calculate dynamic leave balance
const calculateLeaveBalance = () => {
  const totals = { annual: 14, sick: 7, casual: 5 };
  const used = { annual: 0, sick: 0, casual: 0 };

  leaves.forEach(leave => {
    if (leave.status === "approved") {
      // Calculate number of days
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

      if (leave.leaveType === "annual") used.annual += days;
      if (leave.leaveType === "sick") used.sick += days;
      if (leave.leaveType === "casual") used.casual += days;
    }
  });

  return {
    annual: {
      total: totals.annual,
      used: used.annual,
      remaining: totals.annual - used.annual,
    },
    sick: {
      total: totals.sick,
      used: used.sick,
      remaining: totals.sick - used.sick,
    },
    casual: {
      total: totals.casual,
      used: used.casual,
      remaining: totals.casual - used.casual,
    },
  };
};

  const balances = calculateLeaveBalance();

const submitLeave = async () => {
  if (!newLeave.startDate || !newLeave.endDate) {
    toast.error("Please select both start and end dates");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Check if employeeId exists and is valid
  if (!currentUser.employeeId) {
    toast.error("Please login again (employee ID missing)");
    return;
  }

  try {
    const res = await fetch('/api/leaves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: Number(currentUser.employeeId),
        employeeName: currentUser.name,
        leaveType: newLeave.leaveType,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        reason: newLeave.reason || "",
      }),
    });

    if (res.ok) {
      toast.success("Leave request submitted successfully!");
      setShowModal(false);
      setNewLeave({ leaveType: 'annual', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || "Failed to submit leave request");
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
};

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Leaves</h1>
            <p className="text-sm text-zinc-500">Request and track your leave</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Request Leave
          </button>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Leave Balance Cards */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Leave Balance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Annual Leave */}
                <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-zinc-500">Annual Leave</p>
                      <p className="text-4xl font-semibold tracking-tighter mt-1">
                        {balances.annual.remaining}
                      </p>
                      <p className="text-xs text-zinc-400">days remaining</p>
                    </div>
                    <div className="text-right text-xs text-zinc-500">
                      <div>Total: {balances.annual.total}</div>
                      <div>Used: {balances.annual.used}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 transition-all" 
                      style={{ width: `${(balances.annual.remaining / balances.annual.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Sick Leave */}
                <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-zinc-500">Sick Leave</p>
                      <p className="text-4xl font-semibold tracking-tighter mt-1">
                        {balances.sick.remaining}
                      </p>
                      <p className="text-xs text-zinc-400">days remaining</p>
                    </div>
                    <div className="text-right text-xs text-zinc-500">
                      <div>Total: {balances.sick.total}</div>
                      <div>Used: {balances.sick.used}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 transition-all" 
                      style={{ width: `${(balances.sick.remaining / balances.sick.total) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Casual Leave */}
                <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-zinc-500">Casual Leave</p>
                      <p className="text-4xl font-semibold tracking-tighter mt-1">
                        {balances.casual.remaining}
                      </p>
                      <p className="text-xs text-zinc-400">days remaining</p>
                    </div>
                    <div className="text-right text-xs text-zinc-500">
                      <div>Total: {balances.casual.total}</div>
                      <div>Used: {balances.casual.used}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 transition-all" 
                      style={{ width: `${(balances.casual.remaining / balances.casual.total) * 100}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Leave History */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Leave History</span>
              </div>
              
              <div className="card bg-white border border-zinc-200 rounded-3xl overflow-hidden">
                <div className="divide-y">
                  {leaves.length > 0 ? (
                    leaves.map((leave) => (
                      <div key={leave.id} className="px-6 py-5 flex items-center justify-between">
                        <div>
                          <div className="font-medium capitalize">{leave.leaveType} Leave</div>
                          <div className="text-sm text-zinc-500">
                            {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-zinc-400 mt-0.5">{leave.reason}</div>
                        </div>
                        <div>
                          <span className={`status-badge ${
                            leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                            leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {leave.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-zinc-400">No leave requests yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Request Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="modal bg-white rounded-3xl w-full max-w-md p-8">
            <h2 className="font-semibold text-2xl tracking-tight mb-6">Request Leave</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium">Leave Type</label>
                <select 
                  value={newLeave.leaveType}
                  onChange={(e) => setNewLeave({...newLeave, leaveType: e.target.value})}
                  className="input w-full px-4 py-3 border border-zinc-200 rounded-2xl mt-1.5 text-sm"
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium">Start Date</label>
                  <input 
                    type="date" 
                    value={newLeave.startDate} 
                    onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})} 
                    className="input w-full px-4 py-3 border border-zinc-200 rounded-2xl mt-1.5 text-sm" 
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">End Date</label>
                  <input 
                    type="date" 
                    value={newLeave.endDate} 
                    onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})} 
                    className="input w-full px-4 py-3 border border-zinc-200 rounded-2xl mt-1.5 text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium">Reason</label>
                <textarea 
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                  className="input w-full px-4 py-3 border border-zinc-200 rounded-2xl mt-1.5 text-sm h-20 resize-none" 
                  placeholder="Brief reason..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowModal(false)} 
                className="btn-secondary flex-1 py-3 rounded-2xl"
              >
                Cancel
              </button>
              <button 
                onClick={submitLeave} 
                className="btn-primary flex-1 py-3 rounded-2xl"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}