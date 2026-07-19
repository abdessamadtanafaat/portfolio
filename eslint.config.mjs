import nextConfig from "eslint-config-next";
import tseslint from "@typescript-eslint/eslint-plugin";

export default [
  ...nextConfig,
  {
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
];
