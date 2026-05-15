import React, { useState } from 'react';
import { Trash2, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onDeleteClick: (id: string) => void;
  onApproveClick: (id: string) => void;
  bookPoints: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onDeleteClick, onApproveClick, bookPoints }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = new Date(book.dateLogged).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={`bg-white p-4 sm:p-5 rounded-3xl shadow-sm border-2 relative transition-all ${book.isApproved === false ? 'border-amber-300' : 'border-slate-100'}`}>
      <div 
        className="flex justify-between items-start cursor-pointer select-none" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 pr-20">
          <h3 className="font-black text-lg sm:text-xl break-words">{book.title}</h3>
          <div className="flex flex-wrap flex-row items-center gap-x-2 gap-y-1 mt-1">
            <p className="text-slate-500 font-bold text-xs sm:text-sm">by {book.author}</p>
            <span className="text-slate-300 hidden sm:inline">&bull;</span>
            <p className="text-slate-400 font-medium text-xs sm:text-sm">{formattedDate}</p>
          </div>
          {book.isApproved === false && !isExpanded && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Needs Approval
            </div>
          )}
        </div>

        <div className="flex items-center absolute top-3 sm:top-4 right-2 sm:right-3">
          <button 
            className="text-slate-400 hover:text-sky-500 p-2 rounded-full transition-colors"
            title={isExpanded ? "Show Less" : "Show More"}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDeleteClick(book.id); }}
            className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
            title="Delete Book"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 pt-4 border-t-2 border-slate-50 animate-in fade-in duration-200">
          <div className="bg-slate-50 p-3 rounded-xl mb-4">
            <p className="font-medium text-sm sm:text-base text-slate-700 italic">"{book.summary}"</p>
          </div>

          {book.favoritePart && (
            <div className="bg-amber-50 p-3 rounded-xl mb-4 border border-amber-100">
              <p className="text-xs sm:text-sm font-bold text-amber-800 mb-1">Favorite Part ⭐</p>
              <p className="font-medium text-sm sm:text-base text-amber-900">{book.favoritePart}</p>
            </div>
          )}

          {((book.characters && book.characters.length > 0) || (book.settings && book.settings.length > 0)) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {book.characters && book.characters.length > 0 && (
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                  <p className="text-xs sm:text-sm font-bold text-purple-800 mb-2">Characters 🦸‍♂️</p>
                  <div className="flex flex-wrap gap-1.5">
                    {book.characters.map((c, i) => (
                      <span key={i} className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded-md text-xs font-bold">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {book.settings && book.settings.length > 0 && (
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                  <p className="text-xs sm:text-sm font-bold text-purple-800 mb-2">Settings 🗺️</p>
                  <div className="flex flex-wrap gap-1.5">
                    {book.settings.map((s, i) => (
                      <span key={i} className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded-md text-xs font-bold">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center sm:items-end flex-col sm:flex-row gap-4">
            <div className="flex gap-2 flex-wrap w-full">
              {book.words.map((w, i) => (
                <span key={i} className="bg-rose-100 text-rose-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold border border-rose-200">
                  {w.word}
                </span>
              ))}
            </div>
            
            {book.isApproved === false && (
              <button 
                onClick={(e) => { e.stopPropagation(); onApproveClick(book.id); }}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors shrink-0 shadow-sm"
              >
                <CheckCircle className="w-5 h-5" /> Approve (+{bookPoints} pt{bookPoints !== 1 ? 's' : ''})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
