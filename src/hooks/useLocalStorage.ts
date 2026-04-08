import { useState, useEffect } from 'react';
import { AllReaderData } from '../types';
import { loadData, saveData } from '../utils/storage';

export const useLocalStorage = () => {
  const [allData, setAllData] = useState<AllReaderData>(loadData);

  useEffect(() => {
    saveData(allData);
  }, [allData]);

  return [allData, setAllData] as const;
};
