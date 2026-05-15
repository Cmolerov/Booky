import React from 'react';
import { BookOpen, Star } from 'lucide-react';
import { AllReaderData } from '../../types';

interface HeaderProps {
  currentReader: string;
  setCurrentReader: (reader: string) => void;
  allData: AllReaderData;
  points: number;
}

export const Header: React.FC<HeaderProps> = ({ currentReader, setCurrentReader, allData, points }) => {
  return (
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
  );
};
