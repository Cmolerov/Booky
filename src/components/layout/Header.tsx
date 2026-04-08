import React, { useState } from 'react';
import { BookOpen, Star, Settings, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ParentPinModal } from '../shared/ParentPinModal';
import { AllReaderData } from '../../types';

interface HeaderProps {
  currentReader: string;
  setCurrentReader: (reader: string) => void;
  allData: AllReaderData;
  setAllData: React.Dispatch<React.SetStateAction<AllReaderData>>;
  points: number;
}

export const Header: React.FC<HeaderProps> = ({ currentReader, setCurrentReader, allData, setAllData, points }) => {
  const [manageUsersPasswordModal, setManageUsersPasswordModal] = useState(false);
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [addUserError, setAddUserError] = useState('');

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
    <>
      {/* Subtle Settings Button */}
      <button onClick={() => setManageUsersPasswordModal(true)} className="fixed top-2 right-2 text-sky-200 hover:text-sky-400 z-50 transition-colors" title="Manage Users">
        <Settings className="w-5 h-5" />
      </button>

      {/* Header */}
      <header className="bg-white border-b-4 border-sky-300 p-3 sm:p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-yellow-400 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl rotate-3 shadow-sm shrink-0">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-sky-600 tracking-tight leading-none truncate">
                B<span className="text-yellow-500">oo</span>ky
              </h1>
              <select 
                value={currentReader} 
                onChange={(e) => setCurrentReader(e.target.value)}
                className="mt-1 bg-sky-50 border-2 border-sky-200 text-sky-700 font-bold rounded-lg px-1 sm:px-2 py-0.5 sm:py-1 text-xs sm:text-sm outline-none focus:border-sky-400 cursor-pointer truncate max-w-[120px] sm:max-w-[200px]"
              >
                {Object.keys(allData).map(reader => (
                  <option key={reader} value={reader}>{reader}'s Profile</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 bg-yellow-100 px-2 sm:px-4 py-1 sm:py-2 rounded-full border-2 border-yellow-300 shadow-sm shrink-0">
            <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-sm sm:text-xl font-bold text-yellow-700 whitespace-nowrap">{points} pts</span>
          </div>
        </div>
      </header>

      <ParentPinModal
        isOpen={manageUsersPasswordModal}
        onClose={() => setManageUsersPasswordModal(false)}
        onSuccess={() => {
          setManageUsersPasswordModal(false);
          setShowManageUsers(true);
        }}
        message="Please enter the password to manage users."
        colorTheme="sky"
      />

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
    </>
  );
};
