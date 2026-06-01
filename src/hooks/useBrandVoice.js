import { useCallback } from 'react';
import { useStore } from '../store/contentStore';

export function useBrandVoice() {
  const { state, dispatch } = useStore();

  const update = useCallback(
    (updates) => {
      dispatch({ type: 'UPDATE_BRAND_VOICE', payload: updates });
    },
    [dispatch]
  );

  return { brandVoice: state.brandVoice, update };
}