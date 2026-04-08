export interface Word {
  word: string;
  definition: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  author: string;
  isCompleted?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  cost: number;
  isCompleted: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  words: Word[];
  dateLogged: string;
}

export interface ReaderData {
  books: Book[];
  standaloneWords: Word[];
  wishlist: WishlistItem[];
  goals?: Goal[];
  points: number;
}

export type AllReaderData = Record<string, ReaderData>;

export type TabType = 'dashboard' | 'add' | 'library' | 'vocab' | 'wishlist' | 'goals';
