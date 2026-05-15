import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Trash2, Users, Star } from 'lucide-react';
import { AllReaderData, AppSettings } from '../../types';

interface ParentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allData: AllReaderData;
  setAllData: React.Dispatch<React.SetStateAction<AllReaderData>>;
  currentReader: string;
  setCurrentReader: (reader: string) => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({
  isOpen, onClose, allData, setAllData, currentReader, setCurrentReader, settings, setSettings
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'points'>('users');
  const [newUserName, setNewUserName] = useState('');
  const [addUserError, setAddUserError] = useState('');

  const [bookPointsStr, setBookPointsStr] = useState(settings.bookPoints.toString());
  const [wordPointsStr, setWordPointsStr] = useState(settings.wordPoints.toString());
  const [minutesPerPointStr, setMinutesPerPointStr] = useState(settings.minutesPerPoint?.toString() || '10');

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

  const handleSavePoints = () => {
    const bp = parseInt(bookPointsStr);
    const wp = parseInt(wordPointsStr);
    const mpp = parseInt(minutesPerPointStr);
    if (!isNaN(bp) && bp >= 0 && !isNaN(wp) && wp >= 0 && !isNaN(mpp) && mpp > 0) {
      setSettings(prev => ({
        ...prev,
        bookPoints: bp,
        wordPoints: wp,
        minutesPerPoint: mpp,
      }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-xl border-4 border-sky-100 max-h-[85vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-sky-600 flex items-center gap-2">
                <Settings className="w-6 h-6 sm:w-7 sm:h-7" /> Parent Settings
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="flex gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm sm:text-base transition-colors ${activeTab === 'users' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Users className="w-4 h-4" /> Users
              </button>
              <button 
                onClick={() => setActiveTab('points')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm sm:text-base transition-colors ${activeTab === 'points' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Star className="w-4 h-4" /> Points
              </button>
            </div>
            
            {activeTab === 'users' && (
              <>
                <div className="overflow-y-auto flex-1 pr-2 space-y-3 mb-6 min-h-[200px]">
                  {Object.keys(allData).map(reader => (
                    <div key={reader} className="flex justify-between items-center bg-sky-50 p-3 sm:p-4 rounded-2xl border-2 border-sky-100">
                      <span className="font-bold text-sky-900 text-base sm:text-lg">{reader}</span>
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
                      className="flex-1 border-2 border-slate-200 rounded-xl p-3 font-medium focus:border-sky-400 focus:ring-4 focus:ring-sky-100 outline-none transition-all w-full"
                    />
                    <button 
                      type="submit"
                      disabled={!newUserName.trim()}
                      className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-bold px-4 sm:px-6 rounded-xl transition-colors shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === 'points' && (
              <div className="flex-1 flex flex-col pt-2 min-h-[200px]">
                <p className="text-sm font-medium text-slate-500 mb-4">Set how many points users earn for completing tasks.</p>
                <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-100 space-y-4 mb-4">
                  <div>
                    <label className="block text-amber-900 font-bold mb-1">Book Approval Points</label>
                    <input 
                      type="number"
                      min="0"
                      value={bookPointsStr}
                      onChange={(e) => setBookPointsStr(e.target.value)}
                      onBlur={handleSavePoints}
                      className="w-full border-2 border-amber-200 rounded-xl p-3 font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-900 font-bold mb-1">New Word Points</label>
                    <input 
                      type="number"
                      min="0"
                      value={wordPointsStr}
                      onChange={(e) => setWordPointsStr(e.target.value)}
                      onBlur={handleSavePoints}
                      className="w-full border-2 border-amber-200 rounded-xl p-3 font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-900 font-bold mb-1">Mins Reading per Point</label>
                    <input 
                      type="number"
                      min="1"
                      value={minutesPerPointStr}
                      onChange={(e) => setMinutesPerPointStr(e.target.value)}
                      onBlur={handleSavePoints}
                      className="w-full border-2 border-amber-200 rounded-xl p-3 font-medium focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none"
                    />
                  </div>
                </div>
                <div className="mt-auto">
                    <button 
                      onClick={handleSavePoints}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                      Save Point Rules
                    </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
