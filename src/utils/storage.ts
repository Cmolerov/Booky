import { AllReaderData } from '../types';

const STORAGE_KEY = 'reading-app-data-v2';

export const loadData = (): AllReaderData => {
  const saved = localStorage.getItem(STORAGE_KEY);
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
};

export const saveData = (data: AllReaderData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
