import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, PlusCircle } from 'lucide-react';
import { Goal } from '../../types';
import { GoalCard } from './GoalCard';
import { AddGoalForm } from './AddGoalForm';
import { ParentPinModal } from '../shared/ParentPinModal';

interface GoalListProps {
  goals: Goal[];
  points: number;
  onAdd: (goal: Omit<Goal, 'id' | 'isCompleted'>) => void;
  onCashOut: (id: string) => void;
  onDelete: (id: string) => void;
}

export const GoalList: React.FC<GoalListProps> = ({ goals, points, onAdd, onCashOut, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{ type: 'add' | 'cashout' | 'delete', goalId?: string, pendingGoal?: { title: string, cost: number } } | null>(null);

  const handleAddRequest = (title: string, cost: number) => {
    setPasswordModal({ type: 'add', pendingGoal: { title, cost } });
  };

  const handlePasswordSuccess = () => {
    if (passwordModal?.type === 'add' && passwordModal.pendingGoal) {
      onAdd(passwordModal.pendingGoal);
      setIsAdding(false);
    } else if (passwordModal?.type === 'cashout' && passwordModal.goalId) {
      onCashOut(passwordModal.goalId);
    } else if (passwordModal?.type === 'delete' && passwordModal.goalId) {
      onDelete(passwordModal.goalId);
    }
    setPasswordModal(null);
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
          <AddGoalForm 
            onAddRequest={handleAddRequest} 
            onCancel={() => setIsAdding(false)} 
          />
        )}
      </AnimatePresence>

      {goals.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-3xl border-2 border-dashed border-slate-300">
          <p className="text-slate-500 font-bold">No goals set yet!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {goals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              points={points} 
              onCashOutClick={(id) => setPasswordModal({ type: 'cashout', goalId: id })} 
              onDeleteClick={(id) => setPasswordModal({ type: 'delete', goalId: id })} 
            />
          ))}
        </div>
      )}

      <ParentPinModal
        isOpen={!!passwordModal}
        onClose={() => setPasswordModal(null)}
        onSuccess={handlePasswordSuccess}
        message={
          passwordModal?.type === 'add' ? 'Please enter the password to add a new goal.' : 
          passwordModal?.type === 'cashout' ? 'Please enter the password to cash out this goal!' :
          'Please enter the password to delete this goal.'
        }
        colorTheme="amber"
      />
    </motion.div>
  );
};
