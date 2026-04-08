import React from 'react';
import { Trash2 } from 'lucide-react';
import { Word } from '../../types';

interface WordCardProps {
  word: Word;
  onDeleteClick: (word: string) => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onDeleteClick }) => {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border-2 border-rose-100 flex flex-col relative pr-10 sm:pr-12">
      <span className="font-black text-base sm:text-lg text-rose-600 break-words">{word.word}</span>
      <span className="text-slate-600 font-medium text-sm sm:text-base break-words">{word.definition}</span>
      <button 
        onClick={() => onDeleteClick(word.word)}
        className="absolute top-1/2 -translate-y-1/2 right-1 sm:right-2 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
        title="Delete Word"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
