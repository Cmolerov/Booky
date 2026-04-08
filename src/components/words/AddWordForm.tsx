import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Word } from '../../types';

interface AddWordFormProps {
  onAdd: (word: Word) => void;
  onCancel: () => void;
  allWords: Word[];
}

export const AddWordForm: React.FC<AddWordFormProps> = ({ onAdd, onCancel, allWords }) => {
  const [newWord, setNewWord] = useState('');
  const [newDef, setNewDef] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newDef) {
      setError('Please fill out both fields! 🖍️');
      return;
    }

    const wordExists = allWords.some(w => w.word.toLowerCase() === newWord.toLowerCase().trim());
    if (wordExists) {
      setError(`Whoa there! You already learned "${newWord}"! You're so smart! 🧠✨`);
      return;
    }

    onAdd({ word: newWord.trim(), definition: newDef });
    setNewWord('');
    setNewDef('');
    setError('');
  };

  return (
    <motion.form 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit} 
      className="bg-white p-5 rounded-3xl shadow-sm border-2 border-rose-200 overflow-hidden"
    >
      <h3 className="font-black text-lg text-rose-700 mb-3">Add a New Word (+2 pts) 🌟</h3>
      {error && <p className="text-red-500 font-bold text-sm mb-3">{error}</p>}
      <div className="space-y-3 mb-4">
        <input 
          type="text" 
          placeholder="Word" 
          value={newWord} 
          onChange={e => setNewWord(e.target.value)} 
          className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none" 
        />
        <input 
          type="text" 
          placeholder="Definition" 
          value={newDef} 
          onChange={e => setNewDef(e.target.value)} 
          className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none" 
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors">Save Word</button>
        <button type="button" onClick={() => { onCancel(); setError(''); }} className="px-4 font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
      </div>
    </motion.form>
  );
};
