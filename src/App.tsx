import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Star, Trophy, Library, Type, PlusCircle, Trash2, X, Lock, Bookmark, Target, CheckCircle, Circle, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';

const triggerPointsConfetti = () => {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#facc15', '#fb923c', '#38bdf8']
  });
};

const triggerLevelUpConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#facc15', '#fb923c', '#38bdf8', '#c084fc', '#fb7185']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#facc15', '#fb923c', '#38bdf8', '#c084fc', '#fb7185']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

interface Word {
  word: string;
  definition: string;
}

interface WishlistItem {
  id: string;
  title: string;
  author: string;
  isCompleted?: boolean;
}

interface Goal {
  id: string;
  title: string;
  cost: number;
  isCompleted: boolean;
}

interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  words: Word[];
  dateLogged: string;
}

export default function App() {
  interface ReaderData {
    books: Book[];
    standaloneWords: Word[];
    wishlist: WishlistItem[];
    goals?: Goal[];
    points: number;
  }

  const [allData, setAllData] = useState<Record<string, ReaderData>>(() => {
    const saved = localStorage.getItem('reading-app-data-v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.keys(parsed).forEach(key => {
        if (!parsed[key].standaloneWords) parsed[key].standaloneWords = [];
        if (!parsed[key].wishlist) parsed[key].wishlist = [];
        if (!parsed[key].goals) parsed[key].goals = [];
      });
      return parsed;
    }
    
    // Migrate old data if exists
    const oldBooks = localStorage.getItem('reading-app-books');
    const oldPoints = localStorage.getItem('reading-app-points');
    return {
      Manny: { books: oldBooks ? JSON.parse(oldBooks) : [], standaloneWords: [], wishlist: [], goals: [], points: oldPoints ? parseInt(oldPoints, 10) : 0 },
      Penny: { books: [], standaloneWords: [], wishlist: [], goals: [], points: 0 }
    };
  });
  
  const [currentReader, setCurrentReader] = useState<string>('Manny');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add' | 'library' | 'vocab' | 'wishlist' | 'goals'>('dashboard');

  const [manageUsersPasswordModal, setManageUsersPasswordModal] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [globalPassword, setGlobalPassword] = useState('');
  const [globalPasswordError, setGlobalPasswordError] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [addUserError, setAddUserError] = useState('');

  const currentData = allData[currentReader] || { books: [], standaloneWords: [], wishlist: [], goals: [], points: 0 };
  const books = currentData.books;
  const standaloneWords = currentData.standaloneWords || [];
  const wishlist = currentData.wishlist || [];
  const goals = currentData.goals || [];
  const points = currentData.points;
  
  const allWords = [...standaloneWords, ...books.flatMap(b => b.words)];

  useEffect(() => {
    localStorage.setItem('reading-app-data-v2', JSON.stringify(allData));
  }, [allData]);

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

  const handleGlobalPasswordSubmit = () => {
    if (globalPassword.toLowerCase() === 'piggy') {
      setManageUsersPasswordModal(false);
      setShowManageUsers(true);
      setGlobalPassword('');
      setGlobalPasswordError('');
    } else {
      setGlobalPasswordError('Incorrect password! 🐷');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newUserName.trim();
    if (!name) return;
    if (allData[name]) {
      setAddUserError("User already exists!");
      return;
    }
    setAllData(prev => ({
      ...prev,
      [name]: { books: [], standaloneWords: [], wishlist: [], goals: [], points: 0 }
    }));
    setNewUserName('');
    setAddUserError('');
  };

  const handleDeleteUser = (name: string) => {
    if (Object.keys(allData).length <= 1) return;
    setAllData(prev => {
      const newData = { ...prev };
      delete newData[name];
      return newData;
    });
    if (currentReader === name) {
      const available = Object.keys(allData).filter(n => n !== name);
      setCurrentReader(available[0]);
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans text-slate-800 selection:bg-yellow-300">
      {/* Subtle Settings Button */}
      <button onClick={() => setManageUsersPasswordModal(true)} className="fixed top-2 right-2 text-sky-200 hover:text-sky-400 z-50 transition-colors" title="Manage Users">
        <Settings className="w-5 h-5" />
      </button>

      {/* Header */}
      <header className="bg-white border-b-4 border-sky-300 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-2xl rotate-3 shadow-sm">
              <BookOpen className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-black text-sky-600 tracking-tight leading-none">
                B<span className="text-yellow-500">oo</span>ky
              </h1>
              <select 
                value={currentReader} 
                onChange={(e) => setCurrentReader(e.target.value)}
                className="mt-1 bg-sky-50 border-2 border-sky-200 text-sky-700 font-bold rounded-lg px-2 py-1 text-sm outline-none focus:border-sky-400 cursor-pointer"
              >
                {Object.keys(allData).map(reader => (
                  <option key={reader} value={reader}>{reader}'s Profile</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-300 shadow-sm">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-xl font-bold text-yellow-700">{points} pts</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <Dashboard key={`dashboard-${currentReader}`} books={books} standaloneWords={standaloneWords} points={points} onNavigate={setActiveTab} />
          )}
          {activeTab === 'add' && (
            <AddBook key={`add-${currentReader}`} onAdd={handleAddBook} onCancel={() => setActiveTab('dashboard')} existingWords={allWords.map(w => w.word)} />
          )}
          {activeTab === 'library' && (
            <LibraryView key={`library-${currentReader}`} books={books} onDelete={handleDeleteBook} />
          )}
          {activeTab === 'vocab' && (
            <VocabView key={`vocab-${currentReader}`} books={books} standaloneWords={standaloneWords} onAddWord={handleAddWord} onDeleteWord={handleDeleteWord} />
          )}
          {activeTab === 'wishlist' && (
            <WishlistView key={`wishlist-${currentReader}`} wishlist={wishlist} onAdd={handleAddWishlist} onToggle={handleToggleWishlist} onDelete={handleDeleteWishlist} />
          )}
          {activeTab === 'goals' && (
            <GoalsView key={`goals-${currentReader}`} goals={goals} points={points} onAdd={handleAddGoal} onCashOut={handleCashOutGoal} onDelete={handleDeleteGoal} />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-sky-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex justify-around p-2 items-end">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<Trophy />} 
            label="Home" 
            color="text-emerald-500"
          />
          <NavButton 
            active={activeTab === 'library'} 
            onClick={() => setActiveTab('library')} 
            icon={<Library />} 
            label="Books" 
            color="text-purple-500"
          />
          <NavButton 
            active={activeTab === 'goals'} 
            onClick={() => setActiveTab('goals')} 
            icon={<Target />} 
            label="Goals" 
            color="text-amber-500"
          />
          <div className="relative -top-6 shrink-0">
            <button 
              onClick={() => setActiveTab('add')}
              className="bg-sky-500 hover:bg-sky-400 text-white p-4 rounded-full shadow-lg border-4 border-white transition-transform hover:scale-110 active:scale-95"
            >
              <PlusCircle className="w-8 h-8" />
            </button>
          </div>
          <NavButton 
            active={activeTab === 'vocab'} 
            onClick={() => setActiveTab('vocab')} 
            icon={<Type />} 
            label="Words" 
            color="text-rose-500"
          />
          <NavButton 
            active={activeTab === 'wishlist'} 
            onClick={() => setActiveTab('wishlist')} 
            icon={<Bookmark />} 
            label="Wishlist" 
            color="text-indigo-500"
          />
        </div>
      </nav>

      {/* Global Password Modal */}
      <AnimatePresence>
        {manageUsersPasswordModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border-4 border-sky-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-sky-600 flex items-center gap-2">
                  <Lock className="w-6 h-6" /> Parent Check
                </h3>
                <button onClick={() => { setManageUsersPasswordModal(false); setGlobalPassword(''); setGlobalPasswordError(''); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-slate-600 font-medium mb-4">
                Please enter the password to manage users.
              </p>
              
              <input 
                type="password" 
                value={globalPassword}
                onChange={(e) => setGlobalPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all mb-2"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleGlobalPasswordSubmit()}
              />
              
              {globalPasswordError && <p className="text-red-500 font-bold text-sm mb-4">{globalPasswordError}</p>}
              {!globalPasswordError && <div className="mb-4"></div>}
              
              <button 
                onClick={handleGlobalPasswordSubmit}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-3 rounded-xl transition-colors"
              >
                Confirm
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Users Modal */}
      <AnimatePresence>
        {showManageUsers && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl border-4 border-sky-100 max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-sky-600 flex items-center gap-2">
                  <Settings className="w-7 h-7" /> Manage Users
                </h3>
                <button onClick={() => setShowManageUsers(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 pr-2 space-y-3 mb-6">
                {Object.keys(allData).map(reader => (
                  <div key={reader} className="flex justify-between items-center bg-sky-50 p-4 rounded-2xl border-2 border-sky-100">
                    <span className="font-bold text-sky-900 text-lg">{reader}</span>
                    <button 
                      onClick={() => handleDeleteUser(reader)}
                      disabled={Object.keys(allData).length <= 1}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      title={Object.keys(allData).length <= 1 ? "Cannot delete last user" : "Delete User"}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddUser} className="mt-auto border-t-2 border-slate-100 pt-4">
                <h4 className="font-bold text-slate-700 mb-3">Add New User</h4>
                {addUserError && <p className="text-red-500 font-bold text-sm mb-2">{addUserError}</p>}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="User's Name"
                    className="flex-1 border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={!newUserName.trim()}
                    className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-bold px-6 rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center p-2 rounded-xl transition-all ${active ? 'bg-slate-100 scale-110' : 'hover:bg-slate-50 text-slate-400'}`}
    >
      <div className={`${active ? color : ''} mb-1`}>
        {icon}
      </div>
      <span className={`text-xs font-bold ${active ? 'text-slate-800' : ''}`}>{label}</span>
    </button>
  );
}

// --- Dashboard Component ---
const Dashboard: React.FC<{ books: Book[], standaloneWords: Word[], points: number, onNavigate: (tab: any) => void }> = ({ books, standaloneWords, points, onNavigate }) => {
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
      <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
        <h2 className="text-2xl font-black mb-2 relative z-10">Level {level} Reader! 🚀</h2>
        <p className="text-slate-500 font-medium mb-4 relative z-10">You need {nextLevelPoints - points} more points to reach Level {level + 1}.</p>
        
        <div className="h-6 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('library')}
          className="bg-purple-100 hover:bg-purple-200 p-6 rounded-3xl text-left transition-colors border-2 border-purple-200"
        >
          <Library className="w-10 h-10 text-purple-500 mb-3" />
          <h3 className="font-black text-xl text-purple-900">{books.length}</h3>
          <p className="font-bold text-purple-600">Books Read</p>
        </button>
        
        <button 
          onClick={() => onNavigate('vocab')}
          className="bg-rose-100 hover:bg-rose-200 p-6 rounded-3xl text-left transition-colors border-2 border-rose-200"
        >
          <Type className="w-10 h-10 text-rose-500 mb-3" />
          <h3 className="font-black text-xl text-rose-900">{totalWords}</h3>
          <p className="font-bold text-rose-600">New Words</p>
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
}

// --- Add Book Component ---
const AddBook: React.FC<{ onAdd: (book: Book) => void, onCancel: () => void, existingWords: string[] }> = ({ onAdd, onCancel, existingWords }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [word1, setWord1] = useState('');
  const [def1, setDef1] = useState('');
  const [word2, setWord2] = useState('');
  const [def2, setDef2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title || !author || !summary || !word1 || !def1 || !word2 || !def2) {
      setError('Please fill out all the required fields! 🖍️');
      return;
    }

    // Check for at least 2 sentences
    const sentences = summary.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 2) {
      setError('Please write at least 2 sentences about the book! ✍️');
      return;
    }

    const w1Exists = existingWords.some(w => w.toLowerCase() === word1.toLowerCase().trim());
    const w2Exists = existingWords.some(w => w.toLowerCase() === word2.toLowerCase().trim());

    if (w1Exists) {
      setError(`Whoa there! You already learned "${word1}"! You're so smart! 🧠✨`);
      return;
    }
    if (w2Exists) {
      setError(`Whoa there! You already learned "${word2}"! You're so smart! 🧠✨`);
      return;
    }

    const newBook: Book = {
      id: Date.now().toString(),
      title,
      author,
      summary,
      words: [
        { word: word1, definition: def1 },
        { word: word2, definition: def2 }
      ],
      dateLogged: new Date().toISOString()
    };

    onAdd(newBook);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl p-6 shadow-sm border-2 border-slate-100 mb-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-sky-600">Log a Book 📖</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-full">Cancel</button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 font-bold border-2 border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Book Title</label>
            <input 
              type="text" 
              value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              placeholder="e.g. The Magic Treehouse"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Author</label>
            <input 
              type="text" 
              value={author} onChange={e => setAuthor(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              placeholder="Who wrote it?"
            />
          </div>
        </div>

        <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-100">
          <label className="block font-bold text-sky-800 mb-2">What was the book about? 🤔</label>
          <p className="text-xs text-sky-600 font-bold mb-2 uppercase tracking-wider">Write at least 2 sentences!</p>
          <textarea 
            value={summary} onChange={e => setSummary(e.target.value)}
            className="w-full border-2 border-sky-200 rounded-xl p-3 font-medium focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all min-h-[100px]"
            placeholder="This book is about..."
          />
        </div>

        <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-100">
          <label className="block font-bold text-rose-800 mb-4">2 New Words You Learned 🧠</label>
          
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-xl border-2 border-rose-200">
              <div className="flex gap-2 mb-2">
                <span className="bg-rose-200 text-rose-800 font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0">1</span>
                <input 
                  type="text" value={word1} onChange={e => setWord1(e.target.value)}
                  className="w-full font-bold outline-none placeholder-slate-300" placeholder="Word"
                />
              </div>
              <input 
                type="text" value={def1} onChange={e => setDef1(e.target.value)}
                className="w-full text-sm font-medium outline-none text-slate-600 placeholder-slate-300 pl-8" placeholder="What does it mean?"
              />
            </div>

            <div className="bg-white p-3 rounded-xl border-2 border-rose-200">
              <div className="flex gap-2 mb-2">
                <span className="bg-rose-200 text-rose-800 font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0">2</span>
                <input 
                  type="text" value={word2} onChange={e => setWord2(e.target.value)}
                  className="w-full font-bold outline-none placeholder-slate-300" placeholder="Word"
                />
              </div>
              <input 
                type="text" value={def2} onChange={e => setDef2(e.target.value)}
                className="w-full text-sm font-medium outline-none text-slate-600 placeholder-slate-300 pl-8" placeholder="What does it mean?"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xl py-4 rounded-2xl shadow-[0_4px_0_rgb(16,185,129)] hover:shadow-[0_2px_0_rgb(16,185,129)] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px]"
        >
          Save Adventure! 🚀
        </button>
      </form>
    </motion.div>
  );
}

// --- Library View Component ---
const LibraryView: React.FC<{ books: Book[], onDelete: (id: string) => void }> = ({ books, onDelete }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleDeleteAttempt = () => {
    if (password.toLowerCase() === 'piggy') {
      onDelete(deletingId!);
      setDeletingId(null);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password! 🐷');
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
            <div key={book.id} className="bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-100 relative">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-xl pr-10">{book.title}</h3>
                <button 
                  onClick={() => setDeletingId(book.id)}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  title="Delete Book"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-500 font-bold text-sm mb-4">by {book.author}</p>
              
              <div className="bg-slate-50 p-3 rounded-xl mb-4">
                <p className="font-medium text-slate-700 italic">"{book.summary}"</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {book.words.map((w, i) => (
                  <span key={i} className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-bold border border-rose-200">
                    {w.word}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Password Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border-4 border-red-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-red-600 flex items-center gap-2">
                  <Lock className="w-6 h-6" /> Parent Check
                </h3>
                <button onClick={() => { setDeletingId(null); setPassword(''); setError(''); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-slate-600 font-medium mb-4">Please enter the password to delete this book.</p>
              
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-red-400 focus:ring-4 focus:ring-red-100 outline-none transition-all mb-2"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleDeleteAttempt()}
              />
              
              {error && <p className="text-red-500 font-bold text-sm mb-4">{error}</p>}
              {!error && <div className="mb-4"></div>}
              
              <button 
                onClick={handleDeleteAttempt}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-3 rounded-xl transition-colors"
              >
                Delete Book
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Vocabulary View Component ---
const VocabView: React.FC<{ books: Book[], standaloneWords: Word[], onAddWord: (word: Word) => void, onDeleteWord: (word: string) => void }> = ({ books, standaloneWords, onAddWord, onDeleteWord }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newDef, setNewDef] = useState('');
  const [error, setError] = useState('');
  const [deletingWord, setDeletingWord] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const allWords = [...standaloneWords, ...books.flatMap(b => b.words)];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newDef) {
      setError('Please fill out both fields! 🖍️');
      return;
    }

    const wordExists = allWords.some(w => w.word.toLowerCase() === newWord.toLowerCase().trim());
    if (wordExists) {
      setError(`Whoa there! You already learned "${newWord}"! You're so smart! 🧠✨`);
      return;
    }

    onAddWord({ word: newWord.trim(), definition: newDef });
    setNewWord('');
    setNewDef('');
    setIsAdding(false);
    setError('');
  };

  const handleDeleteAttempt = () => {
    if (password.toLowerCase() === 'piggy') {
      onDeleteWord(deletingWord!);
      setDeletingWord(null);
      setPassword('');
      setDeleteError('');
    } else {
      setDeleteError('Incorrect password! 🐷');
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
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit} 
            className="bg-white p-5 rounded-3xl shadow-sm border-2 border-rose-200 overflow-hidden"
          >
            <h3 className="font-black text-lg text-rose-700 mb-3">Add a New Word (+2 pts) 🌟</h3>
            {error && <p className="text-red-500 font-bold text-sm mb-3">{error}</p>}
            <div className="space-y-3 mb-4">
              <input 
                type="text" 
                placeholder="Word" 
                value={newWord} 
                onChange={e => setNewWord(e.target.value)} 
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none" 
              />
              <input 
                type="text" 
                placeholder="Definition" 
                value={newDef} 
                onChange={e => setNewDef(e.target.value)} 
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none" 
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-colors">Save Word</button>
              <button type="button" onClick={() => { setIsAdding(false); setError(''); }} className="px-4 font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {allWords.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-300">
          <p className="text-slate-500 font-bold">No words learned yet!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {allWords.map((w, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border-2 border-rose-100 flex flex-col relative pr-12">
              <span className="font-black text-lg text-rose-600">{w.word}</span>
              <span className="text-slate-600 font-medium">{w.definition}</span>
              <button 
                onClick={() => setDeletingWord(w.word)}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                title="Remove Word"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete Password Modal */}
      <AnimatePresence>
        {deletingWord && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border-4 border-red-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-red-600 flex items-center gap-2">
                  <Lock className="w-6 h-6" /> Parent Check
                </h3>
                <button onClick={() => { setDeletingWord(null); setPassword(''); setDeleteError(''); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-slate-600 font-medium mb-4">Please enter the password to remove this word.</p>
              
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-red-400 focus:ring-4 focus:ring-red-100 outline-none transition-all mb-2"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleDeleteAttempt()}
              />
              
              {deleteError && <p className="text-red-500 font-bold text-sm mb-4">{deleteError}</p>}
              {!deleteError && <div className="mb-4"></div>}
              
              <button 
                onClick={handleDeleteAttempt}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-3 rounded-xl transition-colors"
              >
                Remove Word
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- Goals View Component ---
const GoalsView: React.FC<{ goals: Goal[], points: number, onAdd: (goal: Omit<Goal, 'id' | 'isCompleted'>) => void, onCashOut: (id: string) => void, onDelete: (id: string) => void }> = ({ goals, points, onAdd, onCashOut, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [error, setError] = useState('');

  const [passwordModal, setPasswordModal] = useState<{ type: 'add' | 'cashout' | 'delete', goalId?: string } | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordSubmit = () => {
    if (password.toLowerCase() === 'piggy') {
      if (passwordModal?.type === 'add') {
        onAdd({ title, cost: parseInt(cost) });
        setTitle('');
        setCost('');
        setIsAdding(false);
        setError('');
      } else if (passwordModal?.type === 'cashout' && passwordModal.goalId) {
        onCashOut(passwordModal.goalId);
      } else if (passwordModal?.type === 'delete' && passwordModal.goalId) {
        onDelete(passwordModal.goalId);
      }
      setPasswordModal(null);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password! 🐷');
    }
  };

  const handleAddClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !cost || isNaN(parseInt(cost)) || parseInt(cost) <= 0) {
      setError('Please enter a valid title and cost! 🎯');
      return;
    }
    setPasswordModal({ type: 'add' });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-amber-600 flex items-center gap-2">
          <Target className="w-6 h-6" /> Goals
        </h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-amber-500 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <PlusCircle className="w-5 h-5" /> Add Goal
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddClick} 
            className="bg-white p-5 rounded-3xl shadow-sm border-2 border-amber-200 overflow-hidden"
          >
            <h3 className="font-black text-lg text-amber-700 mb-3">Set a New Goal 🎯</h3>
            {error && <p className="text-red-500 font-bold text-sm mb-3">{error}</p>}
            <div className="space-y-3 mb-4">
              <input 
                type="text" 
                placeholder="Goal (e.g. Ice Cream Trip)" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-bold focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none" 
              />
              <input 
                type="number" 
                placeholder="Cost (Points)" 
                value={cost} 
                onChange={e => setCost(e.target.value)} 
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none" 
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">Save Goal</button>
              <button type="button" onClick={() => { setIsAdding(false); setError(''); }} className="px-4 font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {goals.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-300">
          <p className="text-slate-500 font-bold">No goals set yet!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {goals.map((goal) => (
            <div key={goal.id} className={`bg-white p-4 rounded-2xl shadow-sm border-2 ${goal.isCompleted ? 'border-emerald-200 bg-emerald-50' : 'border-amber-100'} flex justify-between items-center`}>
              <div>
                <h3 className={`font-black text-lg ${goal.isCompleted ? 'text-emerald-700 line-through' : 'text-amber-900'}`}>{goal.title}</h3>
                <p className={`font-bold text-sm ${goal.isCompleted ? 'text-emerald-600' : 'text-amber-600'}`}>Cost: {goal.cost} pts</p>
              </div>
              
              <div className="flex items-center gap-2">
                {!goal.isCompleted && (
                  points >= goal.cost ? (
                    <button 
                      onClick={() => setPasswordModal({ type: 'cashout', goalId: goal.id })}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" /> Cash Out
                    </button>
                  ) : (
                    <span className="text-slate-400 font-bold text-sm bg-slate-100 px-3 py-2 rounded-xl">
                      Need {goal.cost - points} more
                    </span>
                  )
                )}
                {goal.isCompleted && (
                  <span className="text-emerald-600 font-black flex items-center gap-1 bg-emerald-100 px-3 py-2 rounded-xl">
                    <CheckCircle className="w-5 h-5" /> Done!
                  </span>
                )}
                <button 
                  onClick={() => setPasswordModal({ type: 'delete', goalId: goal.id })}
                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors ml-1"
                  title="Delete Goal"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Password Modal */}
      <AnimatePresence>
        {passwordModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl border-4 border-amber-100"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-amber-600 flex items-center gap-2">
                  <Lock className="w-6 h-6" /> Parent Check
                </h3>
                <button onClick={() => { setPasswordModal(null); setPassword(''); setPasswordError(''); }} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <p className="text-slate-600 font-medium mb-4">
                {passwordModal.type === 'add' ? 'Please enter the password to add a new goal.' : 
                 passwordModal.type === 'cashout' ? 'Please enter the password to cash out this goal!' :
                 'Please enter the password to delete this goal.'}
              </p>
              
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all mb-2"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              />
              
              {passwordError && <p className="text-red-500 font-bold text-sm mb-4">{passwordError}</p>}
              {!passwordError && <div className="mb-4"></div>}
              
              <button 
                onClick={handlePasswordSubmit}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3 rounded-xl transition-colors"
              >
                Confirm
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
const WishlistView: React.FC<{ wishlist: WishlistItem[], onAdd: (item: Omit<WishlistItem, 'id'>) => void, onToggle: (id: string) => void, onDelete: (id: string) => void }> = ({ wishlist, onAdd, onToggle, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

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
            <h3 className="font-black text-lg text-indigo-700 mb-3">Want to read a new book? 🌟</h3>
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
                placeholder="Author (optional)" 
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
            <div key={item.id} className={`bg-white p-4 rounded-2xl shadow-sm border-2 ${item.isCompleted ? 'border-emerald-200 bg-emerald-50' : 'border-indigo-100'} flex justify-between items-center gap-3`}>
              <button 
                onClick={() => onToggle(item.id)} 
                className={`shrink-0 ${item.isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'} transition-colors`}
                title={item.isCompleted ? "Mark as not gotten" : "Mark as gotten!"}
              >
                {item.isCompleted ? <CheckCircle className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
              </button>
              <div className="flex-1">
                <h3 className={`font-black text-lg ${item.isCompleted ? 'text-emerald-700 line-through' : 'text-indigo-900'}`}>{item.title}</h3>
                {item.author && <p className={`font-bold text-sm ${item.isCompleted ? 'text-emerald-600' : 'text-indigo-600'}`}>by {item.author}</p>}
              </div>
              <button 
                onClick={() => onDelete(item.id)}
                className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors shrink-0"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
