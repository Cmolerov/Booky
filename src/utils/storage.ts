import { AllReaderData } from '../types';

const STORAGE_KEY = 'reading-app-data-v2';

export const storage = {
  async get(key: string): Promise<any> {
    if (typeof window !== 'undefined' && window.electron) {
      return await window.electron.readData(key);
    } else {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    }
  },
  async set(key: string, value: unknown): Promise<void> {
    if (typeof window !== 'undefined' && window.electron) {
      await window.electron.writeData(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

export const loadData = async (): Promise<AllReaderData> => {
  const parsed = await storage.get(STORAGE_KEY);
  if (parsed) {
    Object.keys(parsed).forEach(key => {
      if (!parsed[key].standaloneWords) parsed[key].standaloneWords = [];
      if (!parsed[key].wishlist) parsed[key].wishlist = [];
      if (!parsed[key].goals) parsed[key].goals = [];
    });
    return parsed;
  }
  
  // Migrate old data if exists
  const oldBooks = await storage.get('reading-app-books');
  const oldPoints = await storage.get('reading-app-points');
  return {
    Manny: { books: oldBooks || [], standaloneWords: [], wishlist: [], goals: [], points: oldPoints ? parseInt(oldPoints, 10) : 0 },
    Penny: { books: [], standaloneWords: [], wishlist: [], goals: [], points: 0 }
  };
};

export const saveData = async (data: AllReaderData): Promise<void> => {
  await storage.set(STORAGE_KEY, data);
};
