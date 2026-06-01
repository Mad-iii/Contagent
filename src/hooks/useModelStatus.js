import { useEffect, useCallback } from 'react';
import { useStore } from '../store/contentStore';
import { MODELS } from '../config/models';

export function useModelStatus() {
  const { state, dispatch } = useStore();
  const { modelStatus } = state;

  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(modelStatus).forEach(([modelId, status]) => {
        if (status.isExhausted && status.resetAt && Date.now() >= status.resetAt) {
          dispatch({ type: 'RESET_MODEL', payload: { modelId } });
        }
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, [modelStatus, dispatch]);

  const markExhausted = useCallback(
    (modelId, resetAt) => {
      dispatch({ type: 'SET_MODEL_EXHAUSTED', payload: { modelId, resetAt } });
    },
    [dispatch]
  );

  const incrementCount = useCallback(
    (modelId) => {
      dispatch({ type: 'INCREMENT_MODEL_COUNT', payload: { modelId } });
    },
    [dispatch]
  );

  const warnings = Object.entries(modelStatus)
    .filter(([modelId, status]) => {
      const model = MODELS[modelId];
      if (!model) return false;
      const threshold = model.rateLimits.rpm * 0.8;
      return status.callCount > threshold && !status.isExhausted;
    })
    .map(([modelId]) => modelId);

  return { modelStatus, markExhausted, incrementCount, warnings };
}