export interface ElectronAPI {
  readData(key: string): Promise<any>;
  writeData(key: string, value: unknown): Promise<void>;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}
