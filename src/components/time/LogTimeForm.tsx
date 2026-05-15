import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { ReadingSession } from '../../types';

interface LogTimeFormProps {
  onAdd: (session: ReadingSession) => void;
  minutesPerPoint: number;
}

export const LogTimeForm: React.FC<LogTimeFormProps> = ({ onAdd, minutesPerPoint }) => {
  const [minutesStr, setMinutesStr] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const mins = parseInt(minutesStr);
    
    if (!title.trim()) {
      setError('Please enter the book title! 📚');
      return;
    }

    if (isNaN(mins) || mins <= 0) {
      setError('Please enter a valid number of minutes! ⏱️');
      return;
    }

    onAdd({
      id: Date.now().toString(),
      minutes: mins,
      title: title.trim(),
      dateLogged: new Date().toISOString(),
      isApproved: false
    });
    setMinutesStr('');
    setTitle('');
  };

  const potentialPoints = !isNaN(parseInt(minutesStr)) && parseInt(minutesStr) > 0 ? Math.floor(parseInt(minutesStr) / minutesPerPoint) : 0;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-3xl shadow-sm border-2 border-indigo-100 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <h3 className="font-black text-xl text-indigo-600 flex items-center gap-2">
          <Clock className="w-6 h-6" /> Log Reading Time
        </h3>
        <span className="text-sm font-bold text-indigo-400 bg-indigo-50 px-3 py-1 rounded-full w-fit">
          {minutesPerPoint} min = 1 pt
        </span>
      </div>
      
      {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
      
      <div className="flex flex-col gap-3">
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="What book did you read?" 
          className="w-full border-2 border-indigo-200 rounded-xl p-3 font-medium focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-lg" 
        />
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input 
              type="number" 
              value={minutesStr} 
              onChange={e => setMinutesStr(e.target.value)} 
              placeholder="How many minutes?" 
              className="w-full border-2 border-indigo-200 rounded-xl p-3 pr-12 font-medium focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-lg" 
            />
            <span className="absolute right-4 top-3.5 text-indigo-300 font-bold">min</span>
          </div>
          <button 
            type="submit" 
            disabled={!minutesStr || !title.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white font-bold px-6 py-3 rounded-xl transition-colors shrink-0"
          >
            Submit Time
          </button>
        </div>
      </div>
      
      {potentialPoints > 0 && (
        <p className="text-sm font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg text-center border border-emerald-100">
          You could earn +{potentialPoints} pt{potentialPoints !== 1 ? 's' : ''} when approved! 🎉
        </p>
      )}
    </form>
  );
};
