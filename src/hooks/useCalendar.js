import { useCallback } from 'react';
import { useStore } from '../store/contentStore';

export function useCalendar() {
  const { state, dispatch } = useStore();

  const getItemsForMonth = useCallback(
    (year, month) => {
      return state.savedContent.filter((item) => {
        const d = new Date(item.createdAt);
        return d.getFullYear() === year && d.getMonth() === month;
      });
    },
    [state.savedContent]
  );

  const getItemsForDay = useCallback(
    (dateStr) => {
      return state.savedContent.filter((item) => item.createdAt.startsWith(dateStr));
    },
    [state.savedContent]
  );

  const updateStatus = useCallback(
    (id, status) => {
      dispatch({ type: 'UPDATE_CONTENT_STATUS', payload: { id, status } });
    },
    [dispatch]
  );

  const deleteItem = useCallback(
    (id) => {
      dispatch({ type: 'DELETE_CONTENT', payload: id });
    },
    [dispatch]
  );

  return { getItemsForMonth, getItemsForDay, updateStatus, deleteItem, savedContent: state.savedContent };
}