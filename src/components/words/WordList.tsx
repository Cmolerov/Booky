import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Type, PlusCircle } from 'lucide-react';
import { Word, Book } from '../../types';
import { WordCard } from './WordCard';
import { AddWordForm } from './AddWordForm';
import { ParentPinModal } from '../shared/ParentPinModal';

interface WordListProps {
  books: Book[];
  standaloneWords: Word[];
  onAddWord: (word: Word) => void;
  onDeleteWord: (word: string) => void;
}

export const WordList: React.FC<WordListProps> = ({ books, standaloneWords, onAddWord, onDeleteWord }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [deletingWord, setDeletingWord] = useState<string | null>(null);

  const allWords = [...standaloneWords, ...books.flatMap(b => b.words)];

  const handleAddWord = (word: Word) => {
    onAddWord(word);
    setIsAdding(false);
  };

  const handleDeleteSuccess = () => {
    if (deletingWord) {
      onDeleteWord(deletingWord);
      setDeletingWord(null);
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
        <h2 className="text-2xl font-black text-rose-600 flex items-center gap-2">
          <Type className="w-6 h-6" /> Word Bank
        </h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-rose-500 hover:bg-rose-400 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <PlusCircle className="w-5 h-5" /> Add Word
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <AddWordForm 
            onAdd={handleAddWord} 
            onCancel={() => setIsAdding(false)} 
            allWords={allWords} 
          />
        )}
      </AnimatePresence>

      {allWords.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-300">
          <p className="text-slate-500 font-bold">No words learned yet!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {allWords.map((w, i) => (
            <WordCard 
              key={i} 
              word={w} 
              onDeleteClick={setDeletingWord} 
            />
          ))}
        </div>
      )}

      <ParentPinModal
        isOpen={!!deletingWord}
        onClose={() => setDeletingWord(null)}
        onSuccess={handleDeleteSuccess}
        message="Please enter the password to delete this word."
        colorTheme="red"
      />
    </motion.div>
  );
};
