import { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { storage } from '../utils/storage';

const defaultSettings: AppSettings = {
  bookPoints: 1,
  wordPoints: 2,
  minutesPerPoint: 10,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await storage.get('reading-app-settings');
      if (data) {
        setSettings({ ...defaultSettings, ...data });
      }
      setIsLoaded(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      storage.set('reading-app-settings', settings);
    }
  }, [settings, isLoaded]);

  return [settings, setSettings] as const;
};
