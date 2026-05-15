import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Library, Clock, BookOpen } from 'lucide-react';
import { Book, ReadingSession } from '../../types';
import { BookCard } from './BookCard';
import { SessionCard } from '../time/SessionCard';
import { ParentPinModal } from '../shared/ParentPinModal';

interface BookListProps {
  books: Book[];
  sessions: ReadingSession[];
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onApproveSession: (id: string) => void;
  bookPoints: number;
  minutesPerPoint: number;
}

export const BookList: React.FC<BookListProps> = ({ 
  books, sessions, onDelete, onApprove, 
  onDeleteSession, onApproveSession, 
  bookPoints, minutesPerPoint 
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'time'>('books');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [approvingSessionId, setApprovingSessionId] = useState<string | null>(null);

  const handleDeleteSuccess = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    } else if (deletingSessionId) {
      onDeleteSession(deletingSessionId);
      setDeletingSessionId(null);
    }
  };

  const handleApproveSuccess = () => {
    if (approvingId) {
      onApprove(approvingId);
      setApprovingId(null);
    } else if (approvingSessionId) {
      onApproveSession(approvingSessionId);
      setApprovingSessionId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-purple-600 flex items-center gap-2">
          <Library className="w-6 h-6" /> Activity Log
        </h2>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('books')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm sm:text-base transition-colors ${activeTab === 'books' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BookOpen className="w-4 h-4" /> Books ({books.length})
        </button>
        <button 
          onClick={() => setActiveTab('time')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm sm:text-base transition-colors ${activeTab === 'time' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Clock className="w-4 h-4" /> Time ({sessions.length})
        </button>
      </div>

      {activeTab === 'books' ? (
        books.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 font-bold">Your reading log is empty!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {books.map(book => (
              <BookCard 
                key={book.id} 
                book={book} 
                onDeleteClick={setDeletingId}
                onApproveClick={setApprovingId}
                bookPoints={bookPoints}
              />
            ))}
          </div>
        )
      ) : (
        sessions.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-300">
            <p className="text-slate-500 font-bold">No reading time logged yet!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.map(session => (
              <SessionCard 
                key={session.id} 
                session={session} 
                onDeleteClick={setDeletingSessionId}
                onApproveClick={setApprovingSessionId}
                minutesPerPoint={minutesPerPoint}
              />
            ))}
          </div>
        )
      )}

      <ParentPinModal
        isOpen={!!deletingId || !!deletingSessionId}
        onClose={() => {
          setDeletingId(null);
          setDeletingSessionId(null);
        }}
        onSuccess={handleDeleteSuccess}
        message="Please enter the password to delete this item."
        colorTheme="red"
      />
      <ParentPinModal
        isOpen={!!approvingId || !!approvingSessionId}
        onClose={() => {
          setApprovingId(null);
          setApprovingSessionId(null);
        }}
        onSuccess={handleApproveSuccess}
        message="Please enter the password to approve this item and add points."
        colorTheme="emerald"
      />
    </motion.div>
  );
};
