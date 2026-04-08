import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X } from 'lucide-react';

interface ParentPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  message?: string;
  colorTheme?: 'sky' | 'amber' | 'emerald' | 'purple' | 'rose' | 'indigo' | 'red';
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  title = "Parent Check", 
  message = "Please enter the password.",
  colorTheme = 'sky'
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const colorClasses = {
    sky: 'text-sky-600 border-sky-100 focus:border-sky-400 focus:ring-sky-100 bg-sky-500 hover:bg-sky-600',
    amber: 'text-amber-600 border-amber-100 focus:border-amber-400 focus:ring-amber-100 bg-amber-500 hover:bg-amber-600',
    emerald: 'text-emerald-600 border-emerald-100 focus:border-emerald-400 focus:ring-emerald-100 bg-emerald-500 hover:bg-emerald-600',
    purple: 'text-purple-600 border-purple-100 focus:border-purple-400 focus:ring-purple-100 bg-purple-500 hover:bg-purple-600',
    rose: 'text-rose-600 border-rose-100 focus:border-rose-400 focus:ring-rose-100 bg-rose-500 hover:bg-rose-600',
    indigo: 'text-indigo-600 border-indigo-100 focus:border-indigo-400 focus:ring-indigo-100 bg-indigo-500 hover:bg-indigo-600',
    red: 'text-red-600 border-red-100 focus:border-red-400 focus:ring-red-100 bg-red-500 hover:bg-red-600',
  };

  const themeClass = colorClasses[colorTheme];
  const textColor = themeClass.split(' ')[0];
  const borderColor = themeClass.split(' ')[1];
  const focusBorder = themeClass.split(' ')[2];
  const focusRing = themeClass.split(' ')[3];
  const bgClass = themeClass.split(' ')[4];
  const hoverBgClass = themeClass.split(' ')[5];

  const handleSubmit = () => {
    if (password.toLowerCase() === 'piggy') {
      setPassword('');
      setError('');
      onSuccess();
    } else {
      setError('Incorrect password! 🐷');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-xl border-4 ${borderColor} max-h-[90vh] overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-black ${textColor} flex items-center gap-2`}>
                <Lock className="w-6 h-6" /> {title}
              </h3>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-slate-600 font-medium mb-4">
              {message}
            </p>
            
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full border-2 border-slate-200 rounded-xl p-3 font-medium ${focusBorder} focus:ring-4 ${focusRing} outline-none transition-all mb-2`}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            
            {error && <p className="text-red-500 font-bold text-sm mb-4">{error}</p>}
            {!error && <div className="mb-4"></div>}
            
            <button 
              onClick={handleSubmit}
              className={`w-full ${bgClass} ${hoverBgClass} text-white font-black py-3 rounded-xl transition-colors`}
            >
              Confirm
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
