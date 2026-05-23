import React from 'react';
import './PageLoading.css';

interface PageLoadingProps {
  message?: string;
  compact?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  message = 'Loading…',
  compact = false,
}) => {
  return (
    <div
      className={`page-loading ${compact ? 'page-loading--compact' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="page-loading__spinner" aria-hidden />
      <span className="page-loading__text">{message}</span>
    </div>
  );
};
