import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Library } from 'lucide-react';
import { Book } from '../../types';
import { BookCard } from './BookCard';
import { ParentPinModal } from '../shared/ParentPinModal';

interface BookListProps {
  books: Book[];
  onDelete: (id: string) => void;
}

export const BookList: React.FC<BookListProps> = ({ books, onDelete }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteSuccess = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-black text-purple-600 flex items-center gap-2">
        <Library className="w-6 h-6" /> My Library
      </h2>

      {books.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-300">
          <p className="text-slate-500 font-bold">Your library is empty!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {books.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              onDeleteClick={setDeletingId} 
            />
          ))}
        </div>
      )}

      <ParentPinModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onSuccess={handleDeleteSuccess}
        message="Please enter the password to delete this book."
        colorTheme="red"
      />
    </motion.div>
  );
};
