import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TabType, Book, Word, WishlistItem, Goal } from './types';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Dashboard } from './components/dashboard/Dashboard';
import { AddBookForm } from './components/books/AddBookForm';
import { BookList } from './components/books/BookList';
import { WordList } from './components/words/WordList';
import { WishList } from './components/wishlist/WishList';
import { GoalList } from './components/goals/GoalList';
import { triggerPointsConfetti, triggerLevelUpConfetti } from './components/shared/ConfettiCelebration';

export default function App() {
  const [allData, setAllData] = useLocalStorage();
  const [currentReader, setCurrentReader] = useState<string>('Manny');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const currentData = allData[currentReader] || { books: [], standaloneWords: [], wishlist: [], goals: [], points: 0 };
  const books = currentData.books;
  const standaloneWords = currentData.standaloneWords || [];
  const wishlist = currentData.wishlist || [];
  const goals = currentData.goals || [];
  const points = currentData.points;
  
  const allWords = [...standaloneWords, ...books.flatMap(b => b.words)];

  const handleAddBook = (book: Book) => {
    let earned = 1; // Base points for a book
    
    const oldLevel = Math.floor(points / 50) + 1;
    const newLevel = Math.floor((points + earned) / 50) + 1;
    
    if (newLevel > oldLevel) {
      triggerLevelUpConfetti();
    } else {
      triggerPointsConfetti();
    }
    
    setAllData(prev => ({
      ...prev,
      [currentReader]: {
        ...prev[currentReader],
        books: [book, ...prev[currentReader].books],
        points: prev[currentReader].points + earned
      }
    }));
    setActiveTab('dashboard');
  };

  const handleAddWord = (word: Word) => {
    const earned = 2;
    const oldLevel = Math.floor(points / 50) + 1;
    const newLevel = Math.floor((points + earned) / 50) + 1;
    
    if (newLevel > oldLevel) {
      triggerLevelUpConfetti();
    } else {
      triggerPointsConfetti();
    }

    setAllData(prev => ({
      ...prev,
      [currentReader]: {
        ...prev[currentReader],
        standaloneWords: [word, ...(prev[currentReader].standaloneWords || [])],
        points: prev[currentReader].points + earned
      }
    }));
  };

  const handleDeleteWord = (wordToRemove: string) => {
    setAllData(prev => {
      const current = prev[currentReader];
      const newStandaloneWords = (current.standaloneWords || []).filter(w => w.word !== wordToRemove);
      const newBooks = current.books.map(b => ({
        ...b,
        words: b.words.filter(w => w.word !== wordToRemove)
      }));

      return {
        ...prev,
        [currentReader]: {
          ...current,
          standaloneWords: newStandaloneWords,
          books: newBooks,
          points: Math.max(0, current.points - 2)
        }
      };
    });
  };

  const handleDeleteBook = (id: string) => {
    const bookToDelete = books.find(b => b.id === id);
    if (!bookToDelete) return;
    
    let lost = 1;

    setAllData(prev => ({
      ...prev,
      [currentReader]: {
        ...prev[currentReader],
        books: prev[currentReader].books.filter(b => b.id !== id),
        points: Math.max(0, prev[currentReader].points - lost)
      }
    }));
  };

  const handleAddWishlist = (item: Omit<WishlistItem, 'id'>) => {
    setAllData(prev => ({
      ...prev,
      [currentReader]: {
        ...prev[currentReader],
        wishlist: [{ id: Date.now().toString(), ...item, isCompleted: false }, ...(prev[currentReader].wishlist || [])]
      }
    }));
  };

  const handleToggleWishlist = (id: string) => {
    setAllData(prev => ({
      ...prev,
      [currentReader]: {
        ...prev[currentReader],
        wishlist: (prev[currentReader].wishlist || []).map(w => w.id === id ? { ...w, isCompleted: !w.isCompleted } : w)
      }
    }));
  };

  const handleDeleteWishlist = (id: string) => {
    setAllData(prev => ({
      ...prev,
      [currentReader]: {
        ...prev[currentReader],
        wishlist: (prev[currentReader].wishlist || []).filter(w => w.id !== id)
      }
    }));
  };

  const handleAddGoal = (goal: Omit<Goal, 'id' | 'isCompleted'>) => {
    setAllData(prev => ({
      ...prev,
      [currentReader]: {
        ...prev[currentReader],
        goals: [{ id: Date.now().toString(), ...goal, isCompleted: false }, ...(prev[currentReader].goals || [])]
      }
    }));
  };

  const handleCashOutGoal = (id: string) => {
    setAllData(prev => {
      const current = prev[currentReader];
      const goal = (current.goals || []).find(g => g.id === id);
      if (!goal || goal.isCompleted || current.points < goal.cost) return prev;

      return {
        ...prev,
        [currentReader]: {
          ...current,
          points: current.points - goal.cost,
          goals: current.goals!.map(g => g.id === id ? { ...g, isCompleted: true } : g)
        }
      };
    });
    triggerLevelUpConfetti(); // Celebrate cashing out!
  };

  const handleDeleteGoal = (id: string) => {
    setAllData(prev => ({
      ...prev,
      [currentReader]: {
        ...prev[currentReader],
        goals: (prev[currentReader].goals || []).filter(g => g.id !== id)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans text-slate-800 selection:bg-yellow-300">
      <Header 
        currentReader={currentReader} 
        setCurrentReader={setCurrentReader} 
        allData={allData} 
        setAllData={setAllData} 
        points={points} 
      />

      <main className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 pb-28 sm:pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <Dashboard key={`dashboard-${currentReader}`} books={books} standaloneWords={standaloneWords} points={points} onNavigate={setActiveTab} />
          )}
          {activeTab === 'add' && (
            <AddBookForm key={`add-${currentReader}`} onAdd={handleAddBook} onCancel={() => setActiveTab('dashboard')} existingWords={allWords.map(w => w.word)} />
          )}
          {activeTab === 'library' && (
            <BookList key={`library-${currentReader}`} books={books} onDelete={handleDeleteBook} />
          )}
          {activeTab === 'vocab' && (
            <WordList key={`vocab-${currentReader}`} books={books} standaloneWords={standaloneWords} onAddWord={handleAddWord} onDeleteWord={handleDeleteWord} />
          )}
          {activeTab === 'wishlist' && (
            <WishList key={`wishlist-${currentReader}`} wishlist={wishlist} onAdd={handleAddWishlist} onToggle={handleToggleWishlist} onDelete={handleDeleteWishlist} />
          )}
          {activeTab === 'goals' && (
            <GoalList key={`goals-${currentReader}`} goals={goals} points={points} onAdd={handleAddGoal} onCashOut={handleCashOutGoal} onDelete={handleDeleteGoal} />
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
