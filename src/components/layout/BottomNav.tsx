import React from 'react';
import { Trophy, Library, Target, PlusCircle, Type, Bookmark } from 'lucide-react';
import { TabType } from '../../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

function NavButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-1 sm:p-2 min-w-[44px] min-h-[44px] rounded-xl transition-all ${active ? 'bg-slate-100 scale-110' : 'hover:bg-slate-50 text-slate-400'}`}
    >
      <div className={`${active ? color : ''} mb-0.5 sm:mb-1 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6`}>
        {icon}
      </div>
      <span className={`text-[10px] sm:text-xs font-bold ${active ? 'text-slate-800' : ''}`}>{label}</span>
    </button>
  );
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-sky-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
      <div className="max-w-lg mx-auto flex justify-between sm:justify-around px-1 sm:px-2 py-2 items-end">
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
        <div className="relative -top-5 sm:-top-6 shrink-0 mx-1 sm:mx-0">
          <button 
            onClick={() => setActiveTab('add')}
            className="bg-sky-500 hover:bg-sky-400 text-white p-3 sm:p-4 rounded-full shadow-lg border-4 border-white transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
          >
            <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8" />
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
  );
};
