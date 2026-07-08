'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
  managerId?: number | null;
  manager?: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
  user?: {
    id: number;
    role: string;
  } | null;
}

export default function Employees() {
  const [user] = useState({ name: "Sarah Chen", role: "admin" as const });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [newEmployee, setNewEmployee] = useState({
    firstName: '', lastName: '', email: '', phone: '', department: '', designation: ''
  });

  const [editEmployee, setEditEmployee] = useState({
    firstName: '', lastName: '', email: '', phone: '', department: '', designation: '', managerId: null as number | null
  });

  // Fetch employees from database
  const fetchEmployees = async () => {
    try {
      const res = await fetch('/api/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new employee
  const handleAddEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.email) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmployee),
      });

      if (res.ok) {
        toast.success("Employee added successfully!");
        setShowAddModal(false);
        setNewEmployee({ firstName: '', lastName: '', email: '', phone: '', department: '', designation: '' });
        fetchEmployees();
      } else {
        toast.error("Failed to add employee");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Open Edit Modal
  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditEmployee({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || '',
      department: employee.department,
      designation: employee.designation,
      managerId: employee.managerId || null,
    });
    setShowEditModal(true);
  };

  // Update Employee
  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const res = await fetch(`/api/employees/${selectedEmployee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editEmployee),
      });

      if (res.ok) {
        toast.success("Employee updated successfully!");
        setShowEditModal(false);
        setSelectedEmployee(null);
        fetchEmployees();
      } else {
        toast.error("Failed to update employee");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Delete Employee
  const deleteEmployee = async (id: number) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success("Employee deleted");
        fetchEmployees();
      } else {
        toast.error("Failed to delete employee");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-zinc-400">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
            <p className="text-sm text-zinc-500">{employees.length} total employees</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {/* Search */}
          <div className="mb-6 flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full pl-11 py-3 border border-zinc-200 rounded-2xl text-sm"
              />
            </div>
          </div>

          {/* Employees Table */}
          <div className="card bg-white border border-zinc-200 rounded-3xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-xs font-medium text-zinc-500">
                  <th className="px-8 py-4">Employee</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Designation</th>
                  <th className="px-6 py-4">Manager</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="table-row">
                      <td className="px-8 py-5">
                        <div>
                          <div className="font-medium">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-zinc-500">{emp.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm">{emp.department}</td>
                      <td className="px-6 py-5 text-sm">{emp.designation}</td>
                      <td className="px-6 py-5 text-sm">
                        {emp.manager ? `${emp.manager.firstName} ${emp.manager.lastName}` : '—'}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`status-badge ${emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-600'}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(emp)}
                            className="p-2 text-zinc-400 hover:text-zinc-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteEmployee(emp.id)}
                            className="p-2 text-zinc-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center text-zinc-400">No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="modal bg-white rounded-3xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-1">Add New Employee</h2>
            <p className="text-sm text-zinc-500 mb-6">Fill in the employee details below</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">First Name</label>
                  <input 
                    type="text" 
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                    className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Last Name</label>
                  <input 
                    type="text" 
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                    className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Phone</label>
                  <input 
                    type="tel" 
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Department</label>
                  <select 
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm"
                  >
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">Designation</label>
                <input 
                  type="text" 
                  value={newEmployee.designation}
                  onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                  className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1 py-3 rounded-2xl font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddEmployee}
                className="btn-primary flex-1 py-3 rounded-2xl font-medium"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="modal bg-white rounded-3xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-1">Edit Employee</h2>
            <p className="text-sm text-zinc-500 mb-6">Update the employee details below</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">First Name</label>
                  <input 
                    type="text" 
                    value={editEmployee.firstName}
                    onChange={(e) => setEditEmployee({...editEmployee, firstName: e.target.value})}
                    className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Last Name</label>
                  <input 
                    type="text" 
                    value={editEmployee.lastName}
                    onChange={(e) => setEditEmployee({...editEmployee, lastName: e.target.value})}
                    className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({...editEmployee, email: e.target.value})}
                  className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5">Phone</label>
                  <input 
                    type="tel" 
                    value={editEmployee.phone}
                    onChange={(e) => setEditEmployee({...editEmployee, phone: e.target.value})}
                    className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">Department</label>
                  <select 
                    value={editEmployee.department}
                    onChange={(e) => setEditEmployee({...editEmployee, department: e.target.value})}
                    className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm"
                  >
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">Designation</label>
                <input 
                  type="text" 
                  value={editEmployee.designation}
                  onChange={(e) => setEditEmployee({...editEmployee, designation: e.target.value})}
                  className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm" 
                />
              </div>

              {/* Manager Assignment */}
              <div>
                <label className="block text-xs font-medium mb-1.5">Manager</label>
                <select 
                  value={editEmployee.managerId || ''}
                  onChange={(e) => setEditEmployee({...editEmployee, managerId: e.target.value ? Number(e.target.value) : null})}
                  className="input w-full px-4 py-2.5 border border-zinc-200 rounded-2xl text-sm"
                >
                  <option value="">No Manager</option>
                  {employees
                    .filter(emp => emp.id !== selectedEmployee.id)
                    .map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} ({emp.designation})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowEditModal(false)}
                className="btn-secondary flex-1 py-3 rounded-2xl font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditEmployee}
                className="btn-primary flex-1 py-3 rounded-2xl font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}