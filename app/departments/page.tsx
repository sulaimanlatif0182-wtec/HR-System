'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  name: string;
  role: 'admin' | 'manager' | 'employee';
}

interface Department {
  id: number;
  name: string;
  description: string;
  employeeCount: number;
  manager: string;
}

export default function Departments() {
  const [user, setUser] = useState<User>({ name: "Loading...", role: "employee" });
  const [showModal, setShowModal] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "Engineering", description: "Software development & IT", employeeCount: 45, manager: "Michael Torres" },
    { id: 2, name: "Marketing", description: "Brand & Digital Marketing", employeeCount: 18, manager: "Aisha Patel" },
    { id: 3, name: "Finance", description: "Accounting & Financial Planning", employeeCount: 12, manager: "David Kim" },
    { id: 4, name: "Human Resources", description: "People Operations & Talent", employeeCount: 8, manager: "Sarah Chen" },
  ]);

  const [newDept, setNewDept] = useState({ name: '', description: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    }
  }, []);

  const addDepartment = () => {
    if (!newDept.name) {
      toast.error("Department name is required");
      return;
    }

    const dept: Department = {
      id: Date.now(),
      name: newDept.name,
      description: newDept.description,
      employeeCount: 0,
      manager: "Not assigned"
    };

    setDepartments([...departments, dept]);
    setShowModal(false);
    setNewDept({ name: '', description: '' });
    toast.success("Department created successfully!");
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Departments</h1>
            <p className="text-sm text-zinc-500">{departments.length} departments</p>
          </div>
          {user.role === 'admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          )}
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="card bg-white border border-zinc-200 rounded-3xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-xl tracking-tight">{dept.name}</div>
                    <div className="text-sm text-zinc-500 mt-1">{dept.description}</div>
                  </div>
                  <div className="p-3 bg-zinc-100 rounded-2xl">
                    <Users className="w-5 h-5 text-zinc-600" />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <div>
                    <div className="text-2xl font-semibold tracking-tighter">{dept.employeeCount}</div>
                    <div className="text-xs text-zinc-400">employees</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Manager</div>
                    <div className="font-medium text-sm">{dept.manager}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="modal bg-white rounded-3xl w-full max-w-md p-8">
            <h2 className="font-semibold text-2xl tracking-tight mb-6">Create New Department</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium">Department Name</label>
                <input 
                  type="text" 
                  value={newDept.name}
                  onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                  className="input w-full px-4 py-3 border border-zinc-200 rounded-2xl mt-1.5 text-sm" 
                  placeholder="e.g. Sales"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Description</label>
                <textarea 
                  value={newDept.description}
                  onChange={(e) => setNewDept({...newDept, description: e.target.value})}
                  className="input w-full px-4 py-3 border border-zinc-200 rounded-2xl mt-1.5 text-sm h-20 resize-none" 
                  placeholder="Short description..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-3 rounded-2xl">Cancel</button>
              <button onClick={addDepartment} className="btn-primary flex-1 py-3 rounded-2xl">Create Department</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
