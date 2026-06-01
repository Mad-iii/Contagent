export const MODELS = {
  gemini: {
    id: 'gemini',
    name: 'Gemini Flash',
    provider: 'Google',
    apiKeyVar: 'VITE_GEMINI_API_KEY',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    rateLimits: { rpm: 15, dailyTokens: 1_000_000 },
    color: '#4285F4',
  },
  grok: {
    id: 'grok',
    name: 'Grok',
    provider: 'xAI',
    apiKeyVar: 'VITE_GROK_API_KEY',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    rateLimits: { rpm: 60, dailyTokens: 500_000 },
    color: '#FF6B35',
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral-7B',
    provider: 'OpenRouter',
    apiKeyVar: 'VITE_OPENROUTER_API_KEY',
    modelId: 'mistralai/mistral-7b-instruct:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    rateLimits: { rpm: 20, dailyTokens: 200_000 },
    color: '#7C3AED',
  },
  llama: {
    id: 'llama',
    name: 'Llama-3-8B',
    provider: 'OpenRouter',
    apiKeyVar: 'VITE_OPENROUTER_API_KEY',
    modelId: 'meta-llama/llama-3-8b-instruct:free',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    rateLimits: { rpm: 20, dailyTokens: 200_000 },
    color: '#059669',
  },
};

export const MODEL_IDS = Object.keys(MODELS);