'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';

export default function Home() {
  const [role, setRole] = useState<'teacher' | 'student' | null>(null);

  const loginAs = async (r: 'teacher' | 'student') => {
    await signInAnonymously(auth);
    setRole(r);
    // Fix đường dẫn: dùng window.location để navigate thủ công, không phụ thuộc Next.js Link
    if (r === 'teacher') window.location.href = '/out/teacher';
    else if (r === 'student') window.location.href = '/out/student';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Luyện Phát Âm
        </h1>
        <p className="text-gray-600 mb-10 text-lg">Giống ELSA – hoàn toàn miễn phí</p>
        <div className="space-y-5">
          <button onClick={() => loginAs('teacher')} className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-2xl text-2xl font-bold transition">
            Tôi là Giáo viên
          </button>
          <button onClick={() => loginAs('student')} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-5 rounded-2xl text-2xl font-bold transition">
            Tôi là Học sinh
          </button>
        </div>
        {role === 'teacher' && <p className="block mt-8 text-green-600 text-xl underline">→ Đã đăng nhập, bấm nút trên để vào!</p>}
        {role === 'student' && <p className="block mt-8 text-blue-600 text-xl underline">→ Đã đăng nhập, bấm nút trên để vào!</p>}
      </div>
    </div>
  );
}