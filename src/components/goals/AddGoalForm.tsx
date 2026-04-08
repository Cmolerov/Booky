import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Goal } from '../../types';

interface AddGoalFormProps {
  onAddRequest: (title: string, cost: number) => void;
  onCancel: () => void;
}

export const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddRequest, onCancel }) => {
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !cost || isNaN(parseInt(cost)) || parseInt(cost) <= 0) {
      setError('Please enter a valid title and cost! 🎯');
      return;
    }
    onAddRequest(title, parseInt(cost));
  };

  return (
    <motion.form 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit} 
      className="bg-white p-5 rounded-3xl shadow-sm border-2 border-amber-200 overflow-hidden"
    >
      <h3 className="font-black text-lg text-amber-700 mb-3">Set a New Goal 🎯</h3>
      {error && <p className="text-red-500 font-bold text-sm mb-3">{error}</p>}
      <div className="space-y-3 mb-4">
        <input 
          type="text" 
          placeholder="Goal (e.g. Ice Cream Trip)" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none" 
        />
        <input 
          type="number" 
          placeholder="Cost (Points)" 
          value={cost} 
          onChange={e => setCost(e.target.value)} 
          className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none" 
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">Save Goal</button>
        <button type="button" onClick={() => { onCancel(); setError(''); }} className="px-4 font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
      </div>
    </motion.form>
  );
};
