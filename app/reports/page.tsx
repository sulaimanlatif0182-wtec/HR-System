'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Download, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';
import { monthlyAttendanceData, leaveTrendData } from '@/lib/chartData';

interface User {
  name: string;
  role: 'admin' | 'manager' | 'employee';
}

export default function Reports() {
  const [user, setUser] = useState<User>({ name: "Loading...", role: "employee" });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const exportToCSV = (type: string) => {
    let csvContent = "";
    let filename = "";

    if (type === "employees") {
      csvContent = "Name,Email,Department,Designation,Join Date\n" +
        "Michael Torres,michael.t@company.com,Engineering,Senior Developer,2023-04-12\n" +
        "Aisha Patel,aisha.p@company.com,Marketing,Marketing Manager,2022-11-05\n";
      filename = "employees_report.csv";
    } else if (type === "attendance") {
      csvContent = "Employee,Date,Check In,Check Out,Status\n" +
        "Michael Torres,2025-07-01,08:52,17:45,present\n" +
        "Aisha Patel,2025-07-01,09:35,18:10,late\n";
      filename = "attendance_report.csv";
    } else {
      csvContent = "Employee,Leave Type,Start Date,End Date,Status\n" +
        "Aisha Patel,Annual,2025-07-10,2025-07-14,approved\n";
      filename = "leave_report.csv";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.click();

    toast.success(`${filename} downloaded successfully!`);
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
        </header>

        <main className="flex-1 overflow-auto p-8 space-y-8">
          
          {/* Export Section */}
          <div className="card bg-white border border-zinc-200 rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-semibold">Export Reports</h3>
              <p className="text-zinc-500 mt-1">Download data in CSV format</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => exportToCSV("employees")}
                className="flex flex-col items-center justify-center gap-3 border border-zinc-200 hover:bg-zinc-50 p-6 rounded-3xl transition-all"
              >
                <Download className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Employees Report</div>
                  <div className="text-xs text-zinc-400 mt-0.5">CSV Export</div>
                </div>
              </button>

              <button 
                onClick={() => exportToCSV("attendance")}
                className="flex flex-col items-center justify-center gap-3 border border-zinc-200 hover:bg-zinc-50 p-6 rounded-3xl transition-all"
              >
                <Download className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Attendance Report</div>
                  <div className="text-xs text-zinc-400 mt-0.5">CSV Export</div>
                </div>
              </button>

              <button 
                onClick={() => exportToCSV("leaves")}
                className="flex flex-col items-center justify-center gap-3 border border-zinc-200 hover:bg-zinc-50 p-6 rounded-3xl transition-all"
              >
                <Download className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Leave Summary</div>
                  <div className="text-xs text-zinc-400 mt-0.5">CSV Export</div>
                </div>
              </button>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Monthly Attendance Summary */}
            <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
              <h3 className="font-semibold text-lg mb-4">Monthly Attendance Summary</h3>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <BarChart data={monthlyAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#10b981" name="Present %" />
                    <Bar dataKey="late" fill="#f59e0b" name="Late %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Leave Requests Trend */}
            <div className="card bg-white border border-zinc-200 rounded-3xl p-6">
              <h3 className="font-semibold text-lg mb-4">Leave Requests Trend</h3>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={leaveTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="natural" 
                      dataKey="requests" 
                      stroke="#0f172a" 
                      strokeWidth={3} 
                      dot={{ fill: '#0f172a', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
