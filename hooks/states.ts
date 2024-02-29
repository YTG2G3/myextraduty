import { create } from 'zustand';

export interface SubmittingState {
  submitting: boolean;
  setSubmitting: (loading: boolean) => void;
}

export const useSubmitting = create<SubmittingState>((set) => ({
  submitting: false,
  setSubmitting: (submitting) => set({ submitting })
}));

export interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  clearQuery: () => void;
}

export const useSearch = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  clearQuery: () => set({ query: '' })
}));
