import { createContext, useContext, useReducer, useEffect } from 'react';

const STORAGE_KEY = 'content-agent-state';

const initialState = {
  savedContent: [],
  brandVoice: {
    name: '',
    tagline: '',
    keywords: [],
    forbiddenWords: [],
    defaultTone: 'professional',
  },
  apiKeys: {
    gemini: '',
    grok: '',
    openrouter: '',
  },
  monthlyTargets: {
    blog: 8,
    email: 12,
    social: 30,
    ad: 20,
    landing: 4,
    casestudy: 2,
  },
  modelStatus: {
    gemini: { isExhausted: false, resetAt: null, callCount: 0, dailyCount: 0 },
    grok: { isExhausted: false, resetAt: null, callCount: 0, dailyCount: 0 },
    mistral: { isExhausted: false, resetAt: null, callCount: 0, dailyCount: 0 },
    llama: { isExhausted: false, resetAt: null, callCount: 0, dailyCount: 0 },
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'SAVE_CONTENT':
      return { ...state, savedContent: [action.payload, ...state.savedContent] };

    case 'DELETE_CONTENT':
      return { ...state, savedContent: state.savedContent.filter((c) => c.id !== action.payload) };

    case 'UPDATE_BRAND_VOICE':
      return { ...state, brandVoice: { ...state.brandVoice, ...action.payload } };

    case 'SET_API_KEYS':
      return { ...state, apiKeys: { ...state.apiKeys, ...action.payload } };

    case 'SET_MONTHLY_TARGETS':
      return { ...state, monthlyTargets: { ...state.monthlyTargets, ...action.payload } };

    case 'SET_MODEL_EXHAUSTED': {
      const { modelId, resetAt } = action.payload;
      return {
        ...state,
        modelStatus: {
          ...state.modelStatus,
          [modelId]: { ...state.modelStatus[modelId], isExhausted: true, resetAt },
        },
      };
    }

    case 'RESET_MODEL': {
      const { modelId } = action.payload;
      return {
        ...state,
        modelStatus: {
          ...state.modelStatus,
          [modelId]: { ...state.modelStatus[modelId], isExhausted: false, resetAt: null },
        },
      };
    }

    case 'INCREMENT_MODEL_COUNT': {
      const { modelId } = action.payload;
      const current = state.modelStatus[modelId];
      return {
        ...state,
        modelStatus: {
          ...state.modelStatus,
          [modelId]: {
            ...current,
            callCount: (current.callCount || 0) + 1,
            dailyCount: (current.dailyCount || 0) + 1,
          },
        },
      };
    }

    case 'HYDRATE':
      return { ...initialState, ...action.payload };

    default:
      return state;
  }
}

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch (e) {
      console.warn('Failed to load saved state:', e);
    }
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, [state]);

  return <ContentContext.Provider value={{ state, dispatch }}>{children}</ContentContext.Provider>;
}

export function useStore() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useStore must be used within ContentProvider');
  return ctx;
}