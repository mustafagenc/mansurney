import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Destructure-to-omit-then-spread-rest is an intentional idiom (e.g.
      // Button.tsx strips custom props before spreading the remainder onto a
      // native element); underscore-prefixed bindings mark that intent.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Claude Code ajan worktree'leri ve SDD çalışma alanı
    ".claude/**",
    ".superpowers/**",
  ]),
]);

export default eslintConfig;
