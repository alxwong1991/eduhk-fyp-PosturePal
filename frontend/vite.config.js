import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // ✅ Load `.env` from `config/` directory
  const env = loadEnv(mode, process.cwd() + "/config");

  return {
    plugins: [react()],
    define: {
      // ✅ Expose environment variables to Vite
      "process.env": JSON.stringify(env),
    },
  };
});