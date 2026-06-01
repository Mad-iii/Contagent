import { useState, useCallback } from 'react';
import { generateContent } from '../services/modelOrchestrator';
import { buildPrompt } from '../utils/promptTemplates';
import { rateLimiter } from '../utils/rateLimiter';
import { useStore } from '../store/contentStore';
import { useModelStatus } from './useModelStatus';

export function useContentGeneration() {
  const { state, dispatch } = useStore();
  const { markExhausted, incrementCount } = useModelStatus();
  const [output, setOutput] = useState('');
  const [modelUsed, setModelUsed] = useState(null);
  const [isFailover, setIsFailover] = useState(false);
  const [failoverFrom, setFailoverFrom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(
    async ({ contentType, topic, tone, additionalContext }) => {
      setLoading(true);
      setError(null);
      setOutput('');
      setModelUsed(null);
      setIsFailover(false);

      try {
        const prompt = buildPrompt({
          contentType,
          topic,
          tone,
          brandVoice: state.brandVoice,
          additionalContext,
        });

        // Throttle via rate limiter
        const route = (await import('../config/taskRoutes')).CONTENT_TYPES[contentType];
        await rateLimiter.throttle(route.primary);

        const result = await generateContent({
          contentType,
          prompt,
          apiKeys: state.apiKeys,
          modelStatus: state.modelStatus,
          onModelExhausted: markExhausted,
        });

        setOutput(result.output);
        setModelUsed(result.modelUsed);
        setIsFailover(result.wasFailover);
        setFailoverFrom(result.failoverFrom);
        incrementCount(result.modelUsed);

        return result;
      } catch (err) {
        setError(err.message || 'Generation failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [state.apiKeys, state.brandVoice, state.modelStatus, markExhausted, incrementCount]
  );

  const saveContent = useCallback(
    ({ contentType, topic, tone }) => {
      if (!output) return;
      const item = {
        id: Date.now().toString(),
        contentType,
        topic,
        tone,
        output,
        modelUsed,
        wasFailover: isFailover,
        createdAt: new Date().toISOString(),
        status: 'draft',
      };
      dispatch({ type: 'SAVE_CONTENT', payload: item });
      return item;
    },
    [output, modelUsed, isFailover, dispatch]
  );

  return { generate, saveContent, output, modelUsed, isFailover, failoverFrom, loading, error };
}