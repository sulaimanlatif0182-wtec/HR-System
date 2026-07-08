'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { toast } from 'sonner';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfilePhoto(parsedUser.profilePhoto || null);
    }
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;

      const updatedUser = { ...user, profilePhoto: base64String };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setProfilePhoto(base64String);

      toast.success("Profile photo updated!");
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Get full name safely
  const fullName = user.name || 
                   (user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : 'Not available');

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar role={user.role} userName={user.name || 'User'} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-8 py-4">
          <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
        </header>

        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="card bg-white border border-zinc-200 rounded-3xl p-8">
              
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-zinc-900 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                      {fullName.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                  )}
                  
                  <label className="absolute bottom-0 right-0 bg-white border border-zinc-200 rounded-full p-1.5 cursor-pointer hover:bg-zinc-50">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                    <span className="text-xs text-zinc-600">📷</span>
                  </label>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Click the camera icon to change photo</p>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Full Name */}
                <div>
                  <label className="text-xs text-zinc-500">Full Name</label>
                  <div className="font-medium mt-1">{fullName}</div>
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Email</label>
                  <div className="font-medium mt-1">{user.email || 'Not available'}</div>
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Role</label>
                  <div className="font-medium mt-1 capitalize">{user.role}</div>
                </div>

                <div>
                  <label className="text-xs text-zinc-500">Employee ID</label>
                  <div className="font-medium mt-1">{user.employeeId || 'Not assigned'}</div>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}