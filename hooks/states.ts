import { create } from 'zustand';

export interface SubmittingState {
  submitting: boolean;
  setSubmitting: (loading: boolean) => void;
}

export const useSubmitting = create<SubmittingState>((set) => ({
  submitting: false,
  setSubmitting: (submitting) => set({ submitting })
}));
