import { CONTENT_TYPES } from '../config/taskRoutes';
import { QuotaError } from './QuotaError';
import { generateWithGemini } from './geminiService';
import { generateWithGrok } from './grokService';
import { generateWithMistral, generateWithLlama } from './openRouterService';

const SERVICE_MAP = {
  gemini: generateWithGemini,
  grok: generateWithGrok,
  mistral: generateWithMistral,
  llama: generateWithLlama,
};

export async function generateContent({ contentType, prompt, apiKeys, modelStatus, onModelExhausted }) {
  const route = CONTENT_TYPES[contentType];
  if (!route) throw new Error(`Unknown content type: ${contentType}`);

  const chain = [route.primary, ...route.fallbacks];
  let lastError = null;

  for (let i = 0; i < chain.length; i++) {
    const modelId = chain[i];
    const status = modelStatus?.[modelId];

    // Skip if currently exhausted
    if (status?.isExhausted && status.resetAt > Date.now()) {
      continue;
    }

    const serviceFn = SERVICE_MAP[modelId];
    if (!serviceFn) continue;

    const apiKey = getApiKey(modelId, apiKeys);

    try {
      const output = await serviceFn(prompt, apiKey);
      return {
        output,
        modelUsed: modelId,
        wasFailover: i > 0,
        failoverFrom: i > 0 ? chain.slice(0, i) : [],
      };
    } catch (err) {
      lastError = err;
      if (err instanceof QuotaError) {
        const resetMs = err.resetType === 'daily' ? 24 * 60 * 60 * 1000 : 60 * 1000;
        onModelExhausted?.(modelId, Date.now() + resetMs);
        continue; // try next in chain
      }
      throw err; // non-quota errors bubble up
    }
  }

  throw lastError || new Error('All models in the failover chain are exhausted');
}

function getApiKey(modelId, apiKeys) {
  if (modelId === 'gemini') return apiKeys.gemini;
  if (modelId === 'grok') return apiKeys.grok;
  if (modelId === 'mistral' || modelId === 'llama') return apiKeys.openrouter;
  return null;
}