'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Quick Demo Login
  const quickLogin = (role: 'admin' | 'manager' | 'employee') => {
    setLoading(true);

    const users = {
      admin: { name: "Sarah Chen", role: "admin", employeeId: 1 },
      manager: { name: "James Wilson", role: "manager", employeeId: 2 },
      employee: { name: "Aisha Patel", role: "employee", employeeId: 3 },
    };

    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(users[role]));
      router.push('/dashboard');
      setLoading(false);
    }, 600);
  };

  // Real Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success("Login successful!");
        router.push('/dashboard');
      } else {
        toast.error(data.error || "Invalid email or password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-2xl mb-6">
            <span className="text-white text-3xl font-bold">HR</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 mt-2">Sign in to your HR account</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
          
          {/* Quick Demo Buttons */}
          <div className="mb-8">
            <p className="text-xs font-medium text-zinc-500 mb-3 text-center">QUICK DEMO ACCESS</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => quickLogin('admin')}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">Admin</div>
                  <div className="text-[10px] text-zinc-400">Full access</div>
                </div>
              </button>

              <button
                onClick={() => quickLogin('manager')}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-amber-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-bold">M</span>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">Manager</div>
                  <div className="text-[10px] text-zinc-400">Team access</div>
                </div>
              </button>

              <button
                onClick={() => quickLogin('employee')}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all disabled:opacity-50"
              >
                <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-bold">E</span>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">Employee</div>
                  <div className="text-[10px] text-zinc-400">Self service</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-zinc-400">or login manually</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="input w-full px-4 py-3 border border-zinc-300 rounded-2xl text-sm" 
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="input w-full px-4 py-3 border border-zinc-300 rounded-2xl text-sm" 
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-2xl font-medium disabled:opacity-75"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Need help? Contact <a href="#" className="font-medium">support@hrsystem.com</a>
        </p>
      </div>
    </div>
  );
}