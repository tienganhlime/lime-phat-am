'use client';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Teacher() {
  const [words, setWords] = useState('');
  const [setName, setSetName] = useState('');

  const saveSet = async () => {
    if (!words.trim() || !setName.trim()) return;
    const wordList = words.split('\n').map(w => w.trim()).filter(Boolean);
    await addDoc(collection(db, 'wordSets'), {
      name: setName,
      words: wordList,
      createdAt: new Date()
    });
    alert('Đã lưu bộ từ thành công!');
    setWords(''); setSetName('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => window.location.href = '/out/'} className="text-blue-600 mb-4">← Quay lại trang chủ</button>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-green-600">Giáo viên – Tạo bộ từ</h1>
        <input placeholder="Tên bộ từ (vd: Week 1)" value={setName} onChange={e=>setSetName(e.target.value)} className="w-full p-4 border rounded-xl mb-4 text-lg" />
        <textarea placeholder="Mỗi từ 1 dòng...&#10;apple&#10;banana&#10;cat" value={words} onChange={e=>setWords(e.target.value)} rows={15} className="w-full p-4 border rounded-xl font-mono text-lg" />
        <button onClick={saveSet} className="mt-6 w-full bg-green-600 text-white py-5 rounded-xl text-2xl font-bold hover:bg-green-700">Lưu bộ từ</button>
      </div>
    </div>
  );
}