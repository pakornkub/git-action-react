import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd()); // Load ENV values based on specified mode

  return {
    base: env.VITE_BASE_PATH || '/', // If not set in .env, use '/' as default value
  };
});