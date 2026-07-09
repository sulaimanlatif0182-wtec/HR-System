'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Pre-fill form based on role (does NOT auto login)
  const selectRole = (role: 'admin' | 'manager' | 'employee') => {
    if (role === 'admin') {
      setEmail('admin@hr.com');
      setPassword('admin123');
    } else if (role === 'manager') {
      setEmail('manager@hr.com');
      setPassword('manager123');
    } else {
      setEmail('employee@hr.com');
      setPassword('employee123');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      let role = 'employee';
      let name = 'Aisha Patel';

      if (email.includes('admin')) {
        role = 'admin';
        name = 'Sarah Chen';
      } else if (email.includes('manager')) {
        role = 'manager';
        name = 'James Wilson';
      }

      localStorage.setItem('user', JSON.stringify({ name, role }));
      router.push('/dashboard');
      setLoading(false);
    }, 800);
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
          
          {/* Quick Role Buttons (Pre-fill only) */}
          <div className="mb-8">
            <p className="text-xs font-medium text-zinc-500 mb-3 text-center">QUICK DEMO ACCESS</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => selectRole('admin')}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all"
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
                onClick={() => selectRole('manager')}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all"
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
                onClick={() => selectRole('employee')}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all"
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

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-zinc-300" />
                <span className="text-zinc-600">Remember me</span>
              </div>
              <a href="#" className="text-zinc-600 hover:text-zinc-900">Forgot password?</a>
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
