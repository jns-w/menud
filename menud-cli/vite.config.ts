import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    define: {
      "process.env.VITE_API_ENDPOINT": env.VITE_API_ENDPOINT,
    },
    base: "/",
    plugins: [react()],
    preview: {
      port: 80,
      strictPort: true,
    },
    server: {
      port: 80,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:8080",
    },
  }
});
