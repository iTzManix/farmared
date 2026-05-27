'use client';

import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  pageSize: number;
}

export function usePagination(initial: PaginationState = { page: 1, pageSize: 20 }) {
  const [state, setState] = useState(initial);

  const next = useCallback(() => setState(s => ({ ...s, page: s.page + 1 })), []);
  const prev = useCallback(() => setState(s => ({ ...s, page: Math.max(1, s.page - 1) })), []);
  const go = useCallback((page: number) => setState(s => ({ ...s, page })), []);

  return { ...state, next, prev, go };
}