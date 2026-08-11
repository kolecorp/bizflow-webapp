import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte(), viteSingleFile()],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
  base: "./",

  build: {
    outDir: "dist",
    cssCodeSplit: false,

    assetsInlineLimit: 100000000,
  },
});
