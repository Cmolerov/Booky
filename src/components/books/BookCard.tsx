import React from 'react';
import { Trash2 } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onDeleteClick: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onDeleteClick }) => {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border-2 border-slate-100 relative">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-black text-lg sm:text-xl pr-10 break-words">{book.title}</h3>
        <button 
          onClick={() => onDeleteClick(book.id)}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          title="Delete Book"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <p className="text-slate-500 font-bold text-xs sm:text-sm mb-3 sm:mb-4">by {book.author}</p>
      
      <div className="bg-slate-50 p-3 rounded-xl mb-4">
        <p className="font-medium text-sm sm:text-base text-slate-700 italic">"{book.summary}"</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {book.words.map((w, i) => (
          <span key={i} className="bg-rose-100 text-rose-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border border-rose-200">
            {w.word}
          </span>
        ))}
      </div>
    </div>
  );
};
