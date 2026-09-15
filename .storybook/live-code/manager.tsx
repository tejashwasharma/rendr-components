import React, { useCallback, useEffect, useRef, useState } from 'react';
import { addons, types, useChannel, useStorybookApi, useStorybookState } from 'storybook/manager-api';
import Editor from '@monaco-editor/react';
import { ADDON_ID, EVENTS, PANEL_ID, type CodePayload } from './constants';

function Panel({ active }: { active: boolean }) {
  const { storyId } = useStorybookState();
  const api = useStorybookApi();
  const [code, setCode] = useState('');
  const [edited, setEdited] = useState(false);
  const editedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const emit = useChannel({
    [EVENTS.INIT]: (p: CodePayload) => {
      if (p.storyId !== storyId) return;
      if (!editedRef.current) setCode(p.code);
    },
  }, [storyId]);

  useEffect(() => {
    editedRef.current = false;
    setEdited(false);
  }, [storyId]);

  const onChange = useCallback(
    (value?: string) => {
      const next = value ?? '';
      setCode(next);
      editedRef.current = true;
      setEdited(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => emit(EVENTS.UPDATE, { storyId, code: next } satisfies CodePayload), 150);
    },
    [emit, storyId],
  );

  const reset = useCallback(() => {
    editedRef.current = false;
    setEdited(false);
    emit(EVENTS.RESET, { storyId });
  }, [emit, storyId]);

  const dark = api.getCurrentStoryData()?.parameters?.backgrounds?.default === 'dark';

  if (!active) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          fontSize: 12,
          opacity: 0.8,
        }}
      >
        <span>
          Edit the component code — the canvas above re-renders as you type.{' '}
          {edited ? <strong style={{ color: '#d97706' }}>edited</strong> : <span>synced with Controls</span>}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => navigator.clipboard?.writeText(code)} style={btn}>
            Copy
          </button>
          {edited ? (
            <button type="button" onClick={reset} style={btn}>
              Reset
            </button>
          ) : null}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language="javascript"
          theme={dark ? 'vs-dark' : 'light'}
          value={code}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 8 },
          }}
        />
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  border: '1px solid rgba(128,128,128,0.4)',
  background: 'transparent',
  color: 'inherit',
  borderRadius: 4,
  padding: '3px 10px',
  fontSize: 12,
  cursor: 'pointer',
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Live Code',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => <Panel active={!!active} />,
  });
});
