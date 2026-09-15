import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const here = dirname(fileURLToPath(import.meta.url));
import reactNativeWeb from 'vite-plugin-react-native-web';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: { name: '@storybook/react-vite', options: {} },
  managerEntries: [join(here, 'live-code/manager.tsx')],
  async viteFinal(cfg) {
    cfg.plugins = [...(cfg.plugins ?? []), reactNativeWeb()];
    cfg.define = { ...(cfg.define ?? {}), __DEV__: JSON.stringify(true), global: 'window' };
    // react-live's JSX transform (sucrase) does dynamic `require()` calls
    // internally that Rollup's CJS→ESM conversion can't statically resolve,
    // leaving bare `require()` in the production bundle ("require is not
    // defined" at runtime). Forcing esbuild to pre-bundle it (as Vite's dev
    // server already does) resolves those correctly before Rollup sees it.
    cfg.optimizeDeps = {
      ...(cfg.optimizeDeps ?? {}),
      include: [...(cfg.optimizeDeps?.include ?? []), 'react-live', 'sucrase'],
    };
    cfg.build = {
      ...(cfg.build ?? {}),
      commonjsOptions: { ...(cfg.build?.commonjsOptions ?? {}), transformMixedEsModules: true },
    };
    return cfg;
  },
};

export default config;
