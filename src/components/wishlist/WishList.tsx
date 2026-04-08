import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, PlusCircle } from 'lucide-react';
import { WishlistItem } from '../../types';
import { WishCard } from './WishCard';
import { ParentPinModal } from '../shared/ParentPinModal';

interface WishListProps {
  wishlist: WishlistItem[];
  onAdd: (item: Omit<WishlistItem, 'id'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const WishList: React.FC<WishListProps> = ({ wishlist, onAdd, onToggle, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Please enter a book title! 📚');
      return;
    }
    onAdd({ title, author });
    setTitle('');
    setAuthor('');
    setIsAdding(false);
    setError('');
  };

  const handleDeleteSuccess = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-indigo-600 flex items-center gap-2">
          <Bookmark className="w-6 h-6" /> Wishlist
        </h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <PlusCircle className="w-5 h-5" /> Add Book
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} 
            className="bg-white p-5 rounded-3xl shadow-sm border-2 border-indigo-200 overflow-hidden"
          >
            <h3 className="font-black text-lg text-indigo-700 mb-3">Add to Wishlist 🌟</h3>
            {error && <p className="text-red-500 font-bold text-sm mb-3">{error}</p>}
            <div className="space-y-3 mb-4">
              <input 
                type="text" 
                placeholder="Book Title" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none" 
              />
              <input 
                type="text" 
                placeholder="Author (Optional)" 
                value={author} 
                onChange={e => setAuthor(e.target.value)} 
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none" 
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-colors">Save to Wishlist</button>
              <button type="button" onClick={() => { setIsAdding(false); setError(''); }} className="px-4 font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {wishlist.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-300">
          <p className="text-slate-500 font-bold">Your wishlist is empty!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {wishlist.map((item) => (
            <WishCard 
              key={item.id} 
              item={item} 
              onToggle={onToggle} 
              onDeleteClick={setDeletingId} 
            />
          ))}
        </div>
      )}

      <ParentPinModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onSuccess={handleDeleteSuccess}
        message="Please enter the password to remove this book from the wishlist."
        colorTheme="red"
      />
    </motion.div>
  );
};
