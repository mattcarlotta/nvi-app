import { defineConfig } from 'astro/config';
import solidJs from "@astrojs/solid-js";
import node from "@astrojs/node";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind()],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});