import { useState, useEffect } from 'react';
import { AllReaderData } from '../types';
import { loadData, saveData } from '../utils/storage';

export const useLocalStorage = () => {
  const [allData, setAllData] = useState<AllReaderData>({
    Manny: { books: [], standaloneWords: [], wishlist: [], goals: [], points: 0 },
    Penny: { books: [], standaloneWords: [], wishlist: [], goals: [], points: 0 }
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initData = async () => {
      const data = await loadData();
      setAllData(data);
      setIsLoaded(true);
    };
    initData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveData(allData);
    }
  }, [allData, isLoaded]);

  return [allData, setAllData] as const;
};
