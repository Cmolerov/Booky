import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Book } from '../../types';

interface AddBookFormProps {
  onAdd: (book: Book) => void;
  onCancel: () => void;
  existingWords: string[];
}

export const AddBookForm: React.FC<AddBookFormProps> = ({ onAdd, onCancel, existingWords }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [word1, setWord1] = useState('');
  const [def1, setDef1] = useState('');
  const [word2, setWord2] = useState('');
  const [def2, setDef2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title || !author || !summary || !word1 || !def1 || !word2 || !def2) {
      setError('Please fill out all the required fields! 🖍️');
      return;
    }

    // Check for at least 2 sentences
    const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 2) {
      setError('Please write at least 2 sentences about the book! ✍️');
      return;
    }

    const w1Exists = existingWords.some(w => w.toLowerCase() === word1.toLowerCase().trim());
    const w2Exists = existingWords.some(w => w.toLowerCase() === word2.toLowerCase().trim());

    if (w1Exists) {
      setError(`Whoa there! You already learned "${word1}"! You're so smart! 🧠✨`);
      return;
    }
    if (w2Exists) {
      setError(`Whoa there! You already learned "${word2}"! You're so smart! 🧠✨`);
      return;
    }

    const newBook: Book = {
      id: Date.now().toString(),
      title,
      author,
      summary,
      words: [
        { word: word1, definition: def1 },
        { word: word2, definition: def2 }
      ],
      dateLogged: new Date().toISOString()
    };

    onAdd(newBook);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-sky-600">Log a Book 📖</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full">Cancel</button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-bold border-2 border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Book Title</label>
            <input 
              type="text" 
              value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              placeholder="e.g. The Magic Treehouse"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Author</label>
            <input 
              type="text" 
              value={author} onChange={e => setAuthor(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              placeholder="Who wrote it?"
            />
          </div>
        </div>

        <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-100">
          <label className="block font-bold text-sky-800 mb-2">What was the book about? 🤔</label>
          <p className="text-xs text-sky-600 font-bold mb-2 uppercase tracking-wider">Write at least 2 sentences!</p>
          <textarea 
            value={summary} onChange={e => setSummary(e.target.value)}
            className="w-full border-2 border-sky-200 rounded-xl p-3 font-medium focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all min-h-[100px]"
            placeholder="This book is about..."
          />
        </div>

        <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-100">
          <label className="block font-bold text-rose-800 mb-4">2 New Words You Learned 🧠</label>
          
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl border-2 border-rose-200">
              <div className="flex gap-2 mb-2">
                <span className="bg-rose-200 text-rose-800 font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</span>
                <input 
                  type="text" value={word1} onChange={e => setWord1(e.target.value)}
                  className="w-full font-bold outline-none placeholder-slate-300" placeholder="Word"
                />
              </div>
              <input 
                type="text" value={def1} onChange={e => setDef1(e.target.value)}
                className="w-full text-sm font-medium outline-none text-slate-600 placeholder-slate-300 pl-8" placeholder="What does it mean?"
              />
            </div>

            <div className="bg-white p-3 rounded-xl border-2 border-rose-200">
              <div className="flex gap-2 mb-2">
                <span className="bg-rose-200 text-rose-800 font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</span>
                <input 
                  type="text" value={word2} onChange={e => setWord2(e.target.value)}
                  className="w-full font-bold outline-none placeholder-slate-300" placeholder="Word"
                />
              </div>
              <input 
                type="text" value={def2} onChange={e => setDef2(e.target.value)}
                className="w-full text-sm font-medium outline-none text-slate-600 placeholder-slate-300 pl-8" placeholder="What does it mean?"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xl py-4 rounded-2xl shadow-[0_4px_0_rgb(16,185,129)] hover:shadow-[0_2px_0_rgb(16,185,129)] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px]"
        >
          Save Adventure! 🚀
        </button>
      </form>
    </motion.div>
  );
};
