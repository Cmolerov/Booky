import React from 'react';
import { Circle, CheckCircle, Trash2 } from 'lucide-react';
import { WishlistItem } from '../../types';

interface WishCardProps {
  item: WishlistItem;
  onToggle: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const WishCard: React.FC<WishCardProps> = ({ item, onToggle, onDeleteClick }) => {
  return (
    <div className={`bg-white p-4 rounded-2xl shadow-sm border-2 flex justify-between items-center ${item.isCompleted ? 'border-emerald-200 bg-emerald-50' : 'border-indigo-100'}`}>
      <div className="flex items-center gap-3 flex-1">
        <button 
          onClick={() => onToggle(item.id)}
          className={`shrink-0 transition-colors ${item.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
        >
          {item.isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
        <div>
          <h3 className={`font-black text-lg ${item.isCompleted ? 'text-slate-400 line-through' : 'text-indigo-900'}`}>{item.title}</h3>
          <p className={`font-bold text-sm ${item.isCompleted ? 'text-slate-400' : 'text-indigo-600'}`}>by {item.author}</p>
        </div>
      </div>
      
      <button 
        onClick={() => onDeleteClick(item.id)}
        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors ml-2"
        title="Remove from Wishlist"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};
