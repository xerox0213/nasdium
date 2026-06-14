import ui from "@nuxt/ui/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import VueRouter from "vue-router/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueRouter(),
    vue(),
    ui({
      ui: {
        colors: {
          neutral: "zinc",
        },
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
