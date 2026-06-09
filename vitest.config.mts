import { defineConfig } from "vitest/config";
import { resolve } from "path";

const envMocks: { [key: string]: string } = {
  ENV: "dev", // example
};

export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, ".") },
  },
  test: {
    include: ["**/?(*.)+(spec|test).?(ts|tsx)"],
    exclude: ["node_modules", "dist"],
    clearMocks: true,
    globals: true,
    env: { ...envMocks },
  },
});
