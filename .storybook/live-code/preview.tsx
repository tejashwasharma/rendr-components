import React, { useEffect, useMemo, useState } from 'react';
import type { Decorator, StoryContext } from '@storybook/react-vite';
import { addons } from 'storybook/preview-api';
import { LiveError, LivePreview, LiveProvider } from 'react-live';
import { EVENTS, type CodePayload } from './constants';
import { codeFromArgs } from './codegen';
import { scope } from './scope';

function componentNameOf(ctx: StoryContext): string {
  const c = ctx.component as { displayName?: string; name?: string } | undefined;
  return c?.displayName ?? c?.name ?? ctx.title.split('/').pop() ?? 'Component';
}

/** The code that represents the story right now: explicit `parameters.code`, else generated from args. */
export function baseCodeFor(ctx: StoryContext): string | null {
  const p = ctx.parameters as { code?: string | ((args: Record<string, unknown>) => string); liveCode?: boolean };
  if (p.liveCode === false) return null;
  if (typeof p.code === 'function') return p.code(ctx.args);
  if (typeof p.code === 'string') return p.code.trim();
  return codeFromArgs(componentNameOf(ctx), ctx.args);
}

function LiveStory({ context, children }: { context: StoryContext; children: React.ReactNode }) {
  const base = useMemo(() => baseCodeFor(context), [context]);
  const [edited, setEdited] = useState<string | null>(null);
  const storyId = context.id;

  // Reset edits when switching stories.
  useEffect(() => setEdited(null), [storyId]);

  useEffect(() => {
    const ch = addons.getChannel();
    const onUpdate = (p: CodePayload) => {
      if (p.storyId === storyId) setEdited(p.code);
    };
    const onReset = (p: { storyId: string }) => {
      if (p.storyId === storyId) setEdited(null);
    };
    ch.on(EVENTS.UPDATE, onUpdate);
    ch.on(EVENTS.RESET, onReset);
    return () => {
      ch.off(EVENTS.UPDATE, onUpdate);
      ch.off(EVENTS.RESET, onReset);
    };
  }, [storyId]);

  // Tell the panel what code is rendering (keeps the editor in sync with Controls).
  useEffect(() => {
    if (edited === null && base !== null) addons.getChannel().emit(EVENTS.INIT, { storyId, code: base } satisfies CodePayload);
  }, [base, edited, storyId]);

  const code = edited ?? base;
  if (code === null) return <>{children}</>;

  return (
    <LiveProvider code={code} scope={scope}>
      <LivePreview />
      <LiveError
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 8,
          background: '#fee2e2',
          color: '#991b1b',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: 12,
          whiteSpace: 'pre-wrap',
        }}
      />
    </LiveProvider>
  );
}

/** Renders every story from its code snippet so the canvas always matches the editor. */
export const withLiveCode: Decorator = (Story, context) => (
  <LiveStory context={context}>
    <Story />
  </LiveStory>
);
