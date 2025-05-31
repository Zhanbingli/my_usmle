import { create } from 'zustand';
import { QuerySession, Message, SessionStatus } from '../types';

interface QueryState {
  sessions: QuerySession[];
  currentSession: QuerySession | null;
  isLoading: boolean;
  error: string | null;
}

interface QueryActions {
  setSessions: (sessions: QuerySession[]) => void;
  setCurrentSession: (session: QuerySession | null) => void;
  addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  createSession: (title: string, userId: string) => string;
  updateSessionStatus: (sessionId: string, status: SessionStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type QueryStore = QueryState & QueryActions;

export const useQueryStore = create<QueryStore>((set, get) => ({
  // State
  sessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  // Actions
  setSessions: (sessions: QuerySession[]) =>
    set({ sessions }),

  setCurrentSession: (currentSession: QuerySession | null) =>
    set({ currentSession }),

  addMessage: (sessionId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, messages: [...session.messages, newMessage] }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { ...state.currentSession, messages: [...state.currentSession.messages, newMessage] }
          : state.currentSession,
    }));
  },

  createSession: (title: string, userId: string) => {
    const newSession: QuerySession = {
      id: Date.now().toString(),
      userId,
      title,
      messages: [],
      status: SessionStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      sessions: [newSession, ...state.sessions],
      currentSession: newSession,
    }));

    return newSession.id;
  },

  updateSessionStatus: (sessionId: string, status: SessionStatus) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, status, updatedAt: new Date().toISOString() }
          : session
      ),
      currentSession:
        state.currentSession?.id === sessionId
          ? { ...state.currentSession, status, updatedAt: new Date().toISOString() }
          : state.currentSession,
    })),

  setLoading: (isLoading: boolean) =>
    set({ isLoading }),

  setError: (error: string | null) =>
    set({ error, isLoading: false }),

  clearError: () =>
    set({ error: null }),
})); 