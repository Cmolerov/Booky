import React from 'react';
import { Trash2, CheckCircle, Clock } from 'lucide-react';
import { ReadingSession } from '../../types';

interface SessionCardProps {
  session: ReadingSession;
  onDeleteClick: (id: string) => void;
  onApproveClick: (id: string) => void;
  minutesPerPoint: number;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onDeleteClick, onApproveClick, minutesPerPoint }) => {
  const formattedDate = new Date(session.dateLogged).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const potentialPoints = Math.floor(session.minutes / minutesPerPoint);

  return (
    <div className={`bg-white p-4 sm:p-5 rounded-3xl shadow-sm border-2 relative transition-all ${session.isApproved === false ? 'border-amber-300' : 'border-indigo-100'}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-12">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
            <h3 className="font-black text-lg sm:text-xl text-indigo-900 leading-tight">
              {session.minutes} Minutes {session.title ? `of ${session.title}` : ''}
            </h3>
          </div>
          <p className="text-slate-400 font-medium text-xs sm:text-sm">{formattedDate}</p>
          
          {session.isApproved === false && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Needs Approval
            </div>
          )}
        </div>

        <button 
          onClick={() => onDeleteClick(session.id)}
          className="absolute top-3 sm:top-4 right-2 sm:right-3 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          title="Delete Session"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-between items-center sm:items-end flex-col sm:flex-row gap-4 mt-4 pt-4 border-t-2 border-slate-50">
        <div className="w-full">
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-indigo-200 inline-block">
              {potentialPoints} pt{potentialPoints !== 1 ? 's' : ''} value
            </span>
        </div>
        
        {session.isApproved === false && (
          <button 
            onClick={() => onApproveClick(session.id)}
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1 transition-colors shrink-0 shadow-sm"
          >
            <CheckCircle className="w-5 h-5" /> Approve (+{potentialPoints})
          </button>
        )}
      </div>
    </div>
  );
};
