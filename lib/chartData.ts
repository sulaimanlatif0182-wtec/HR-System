// ============================================
// SHARED CHART DATA - Used by Dashboard & Reports
// ============================================

// Dashboard - Attendance Trend (Last 7 Days)
export const attendanceTrendData = [
  { day: 'Mon', present: 112, late: 8 },
  { day: 'Tue', present: 105, late: 12 },
  { day: 'Wed', present: 118, late: 5 },
  { day: 'Thu', present: 98, late: 15 },
  { day: 'Fri', present: 120, late: 4 },
  { day: 'Sat', present: 45, late: 2 },
  { day: 'Sun', present: 38, late: 1 },
];

// Dashboard - Leave Type Distribution
export const leaveTypeData = [
  { name: 'Annual Leave', value: 68, fill: '#0f172a' },
  { name: 'Sick Leave', value: 25, fill: '#10b981' },
  { name: 'Casual Leave', value: 18, fill: '#f59e0b' },
];

// Dashboard - Employee Growth Trend
export const employeeGrowthData = [
  { month: 'Jan', employees: 98 },
  { month: 'Feb', employees: 105 },
  { month: 'Mar', employees: 112 },
  { month: 'Apr', employees: 118 },
  { month: 'May', employees: 124 },
  { month: 'Jun', employees: 131 },
  { month: 'Jul', employees: 138 },
];

// Dashboard - Attendance by Department
export const attendanceByDeptData = [
  { dept: 'Engineering', present: 42, late: 3 },
  { dept: 'Marketing', present: 17, late: 1 },
  { dept: 'Finance', present: 11, late: 2 },
  { dept: 'HR', present: 8, late: 0 },
  { dept: 'Sales', present: 19, late: 4 },
];

// Reports - Monthly Attendance Summary
export const monthlyAttendanceData = [
  { month: 'Jan', present: 94, late: 6 },
  { month: 'Feb', present: 91, late: 9 },
  { month: 'Mar', present: 96, late: 4 },
  { month: 'Apr', present: 89, late: 11 },
  { month: 'May', present: 93, late: 7 },
  { month: 'Jun', present: 97, late: 3 },
];

// Reports - Leave Requests Trend
export const leaveTrendData = [
  { month: 'Jan', requests: 12 },
  { month: 'Feb', requests: 18 },
  { month: 'Mar', requests: 14 },
  { month: 'Apr', requests: 22 },
  { month: 'May', requests: 19 },
  { month: 'Jun', requests: 27 },
];
