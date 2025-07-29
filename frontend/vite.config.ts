import { loadEnv, defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    base: "/static/",
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
      conditions: mode === "test" ? ["browser"] : [],
    },
    build: {
      manifest: "manifest.json",
      outDir: resolve("./assets"),
      target: ["es2022"],
      rollupOptions: {
        input: resolve("./src/main.tsx"),
        output: {
          assetFileNames: "assets/[name][extname]",
          chunkFileNames: "assets/[name].[hash].js",
          entryFileNames: "assets/[name].js",
        },
      },
      commonjsOptions: {
        exclude: [],
        // include: []
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  };
});
