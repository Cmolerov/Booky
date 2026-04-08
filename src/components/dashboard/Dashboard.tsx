import React from 'react';
import { motion } from 'motion/react';
import { Library, Type, Star, BookOpen } from 'lucide-react';
import { Book, Word, TabType } from '../../types';

interface DashboardProps {
  books: Book[];
  standaloneWords: Word[];
  points: number;
  onNavigate: (tab: TabType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ books, standaloneWords, points, onNavigate }) => {
  const level = Math.floor(points / 50) + 1;
  const nextLevelPoints = level * 50;
  const progress = (points % 50) / 50 * 100;
  
  const totalWords = standaloneWords.length + books.reduce((acc, b) => acc + b.words.length, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-100 rounded-full -mr-8 -mt-8 sm:-mr-10 sm:-mt-10 opacity-50"></div>
        <h2 className="text-xl sm:text-2xl font-black mb-2 relative z-10">Level {level} Reader! 🚀</h2>
        <p className="text-slate-500 text-sm sm:text-base font-medium mb-4 relative z-10">You need {nextLevelPoints - points} more points to reach Level {level + 1}.</p>
        
        <div className="h-5 sm:h-6 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button 
          onClick={() => onNavigate('library')}
          className="bg-purple-100 hover:bg-purple-200 p-4 sm:p-6 rounded-3xl text-left transition-colors border-2 border-purple-200"
        >
          <Library className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500 mb-2 sm:mb-3" />
          <h3 className="font-black text-lg sm:text-xl text-purple-900">{books.length}</h3>
          <p className="font-bold text-sm sm:text-base text-purple-600">Books Read</p>
        </button>
        
        <button 
          onClick={() => onNavigate('vocab')}
          className="bg-rose-100 hover:bg-rose-200 p-4 sm:p-6 rounded-3xl text-left transition-colors border-2 border-rose-200"
        >
          <Type className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 mb-2 sm:mb-3" />
          <h3 className="font-black text-lg sm:text-xl text-rose-900">{totalWords}</h3>
          <p className="font-bold text-sm sm:text-base text-rose-600">New Words</p>
        </button>
      </div>

      {books.length > 0 && (
        <div>
          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> 
            Recent Adventures
          </h3>
          <div className="space-y-4">
            {books.slice(0, 3).map(book => (
              <div key={book.id} className="bg-white p-4 rounded-2xl shadow-sm border-2 border-slate-100 flex items-start gap-4">
                <div className="bg-sky-100 p-3 rounded-xl">
                  <BookOpen className="w-6 h-6 text-sky-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">{book.title}</h4>
                  <p className="text-slate-500 text-sm font-medium">by {book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {books.length === 0 && (
        <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-300">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="font-bold text-xl mb-2">No books yet!</h3>
          <p className="text-slate-500">Tap the + button to log your first adventure.</p>
        </div>
      )}
    </motion.div>
  );
};
