import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd() + "/config");

  return {
    plugins: [react()],
    define: {
      "process.env": JSON.stringify(env),
    },
  };
});