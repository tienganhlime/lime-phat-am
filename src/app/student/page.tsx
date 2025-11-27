'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Student() {
  const [sets, setSets] = useState<any[]>([]);
  const [selectedSet, setSelectedSet] = useState<any>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    getDocs(collection(db, 'wordSets')).then(snap => {
      setSets(snap.docs.map(doc => ({id: doc.id, ...doc.data()})));
    });
  }, []);

  const speak = (text: string, rate = 1) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate; utter.lang = 'en-US';
    speechSynthesis.speak(utter);
  };

  const startRecording = async (word: string) => {
    setCurrentWord(word); setScore(null); setRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, {type: 'audio/webm'});
        const form = new FormData(); form.append('file', blob, 'audio.webm');
        const res = await fetch('https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}` },
          body: form
        });
        const data = await res.json();
        const recognized = (data?.text || '').trim().toLowerCase();
        const correct = word.toLowerCase();
        let points = recognized.includes(correct) ? 85 + Math.random()*15 : 30 + Math.random()*40;
        setScore(Math.round(points)); setRecording(false);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setTimeout(() => recorder.stop(), 5000);
    } catch { alert('Vui lòng cho phép micro!'); setRecording(false); }
  };

  if (!selectedSet) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-500 p-6">
      <button onClick={() => window.location.href = '/out/'} className="text-white mb-4">← Quay lại trang chủ</button>
      <h1 className="text-5xl font-bold text-white text-center mb-10">Chọn bộ từ</h1>
      <div className="max-w-2xl mx-auto space-y-6">
        {sets.length === 0 ? <p className="text-white text-2xl text-center">Chưa có bộ từ nào</p> :
          sets.map(s => (
            <button key={s.id} onClick={() => setSelectedSet(s)} className="block w-full bg-white p-8 rounded-3xl shadow-2xl text-2xl font-bold hover:scale-105 transition">
              {s.name} ({s.words.length} từ)
            </button>
          ))
        }
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-pink-500 p-6">
      <button onClick={() => setSelectedSet(null)} className="text-white mb-6">← Quay lại danh sách</button>
      <h1 className="text-5xl font-bold text-white text-center mb-8">{selectedSet.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {selectedSet.words.map((word: string, i: number) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-2xl text-center">
            <h3 className="text-3xl font-bold mb-4">{word}</h3>
            <div className="flex justify-center gap-3 mb-4">
              <button onClick={() => speak(word, 0.6)} className="bg-gray-500 text-white px-4 py-2 rounded">Chậm</button>
              <button onClick={() => speak(word, 1)} className="bg-blue-500 text-white px-4 py-2 rounded">Nhanh</button>
            </div>
            <button onClick={() => startRecording(word)} disabled={recording} className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-xl font-bold">
              {recording && currentWord===word ? 'Đang chấm...' : 'Thu âm'}
            </button>
            {score !== null && currentWord===word && <p className={`mt-4 text-4xl font-bold ${score>=80?'text-green-600':score>=60?'text-yellow-600':'text-red-600'}`}>{score}/100</p>}
          </div>
        ))}
      </div>
    </div>
  );
}