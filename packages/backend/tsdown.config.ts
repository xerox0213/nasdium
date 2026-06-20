import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/client.ts"],
  dts: true,
});
