import { useMemo } from 'react';
import { useStore } from '../store/contentStore';
import { CONTENT_TYPES } from '../config/taskRoutes';

export function useAnalytics() {
  const { state } = useStore();
  const { savedContent, monthlyTargets } = state;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthContent = useMemo(
    () =>
      savedContent.filter((item) => {
        const d = new Date(item.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }),
    [savedContent, currentMonth, currentYear]
  );

  const byChannel = useMemo(() => {
    const result = {};
    Object.keys(CONTENT_TYPES).forEach((type) => {
      result[type] = thisMonthContent.filter((i) => i.contentType === type).length;
    });
    return result;
  }, [thisMonthContent]);

  const byModel = useMemo(() => {
    const result = { gemini: 0, grok: 0, mistral: 0, llama: 0 };
    thisMonthContent.forEach((item) => {
      if (result[item.modelUsed] !== undefined) result[item.modelUsed]++;
    });
    return result;
  }, [thisMonthContent]);

  const targetProgress = useMemo(() => {
    const result = {};
    Object.entries(monthlyTargets).forEach(([type, target]) => {
      const actual = byChannel[type] || 0;
      result[type] = { actual, target, percent: Math.min(100, Math.round((actual / target) * 100)) };
    });
    return result;
  }, [byChannel, monthlyTargets]);

  const totalGenerated = thisMonthContent.length;
  const failoverCount = thisMonthContent.filter((i) => i.wasFailover).length;

  return { byChannel, byModel, targetProgress, totalGenerated, failoverCount, thisMonthContent };
}