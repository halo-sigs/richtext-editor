import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Icons from "unplugin-icons/vite";
import Dts from "vite-plugin-dts";
import path from "path";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default defineConfig({
  plugins: [
    Vue(),
    Icons({
      compiler: "vue3",
    }),
    Dts({
      entryRoot: "./src",
      outputDir: "./dist",
      insertTypesEntry: true,
    }),
    VueI18nPlugin({
      include: [path.resolve(__dirname, "./src/locales/*.yaml")],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "RichTextEditor",
      formats: ["es", "iife"],
      fileName: (format) => `rich-text-editor.${format}.js`,
    },
    minify: false,
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
        exports: "named",
      },
    },
    sourcemap: true,
  },
});
