import React from 'react';

let counter = 0;

/** Stable unique id, using `React.useId` when available (React 18+). */
export function useId(prefix = 'rendr'): string {
  const reactUseId = (React as { useId?: () => string }).useId;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const id = reactUseId ? reactUseId() : React.useState(() => `${++counter}`)[0];
  return `${prefix}-${id.replace(/:/g, '')}`;
}
