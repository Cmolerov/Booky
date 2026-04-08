import React from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';
import { Goal } from '../../types';

interface GoalCardProps {
  goal: Goal;
  points: number;
  onCashOutClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, points, onCashOutClick, onDeleteClick }) => {
  return (
    <div className={`bg-white p-4 rounded-2xl shadow-sm border-2 ${goal.isCompleted ? 'border-emerald-200 bg-emerald-50' : 'border-amber-100'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0`}>
      <div className="w-full sm:w-auto flex justify-between items-start sm:block">
        <div>
          <h3 className={`font-black text-lg ${goal.isCompleted ? 'text-emerald-700 line-through' : 'text-amber-900'}`}>{goal.title}</h3>
          <p className={`font-bold text-sm ${goal.isCompleted ? 'text-emerald-600' : 'text-amber-600'}`}>Cost: {goal.cost} pts</p>
        </div>
        {/* Mobile delete button */}
        <button 
          onClick={() => onDeleteClick(goal.id)}
          className="sm:hidden text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          title="Delete Goal"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
        {!goal.isCompleted && (
          points >= goal.cost ? (
            <button 
              onClick={() => onCashOutClick(goal.id)}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors"
            >
              <CheckCircle className="w-5 h-5" /> Cash Out
            </button>
          ) : (
            <span className="w-full sm:w-auto text-center text-slate-400 font-bold text-sm bg-slate-100 px-3 py-2 rounded-xl">
              Need {goal.cost - points} more
            </span>
          )
        )}
        {goal.isCompleted && (
          <span className="w-full sm:w-auto justify-center text-emerald-600 font-black flex items-center gap-1 bg-emerald-100 px-3 py-2 rounded-xl">
            <CheckCircle className="w-5 h-5" /> Done!
          </span>
        )}
        {/* Desktop delete button */}
        <button 
          onClick={() => onDeleteClick(goal.id)}
          className="hidden sm:block text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors ml-1"
          title="Delete Goal"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
