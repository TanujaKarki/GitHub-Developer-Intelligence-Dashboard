import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/tests/setup.js',
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: ['node_modules/', 'src/tests/'],
        thresholds: {
          lines: 70,
        },
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 5174,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5001',
          changeOrigin: true,
        },
      },
    },
  });
};
