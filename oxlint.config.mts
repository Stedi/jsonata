import { node } from "@stedi/oxc-config/oxlint";
import { defineConfig } from "oxlint";

// The tests run on mocha, so no test-runner slice applies (the shared package
// ships jest and vitest slices only). The old `test/.eslintrc` held one rule,
// `strict: ["error", "global"]`, and oxlint has no `strict` rule, so a `test/**`
// override would carry nothing: `oxlint src test` is clean without one.
export default defineConfig({
  extends: [node],
  // Leading slashes anchor these at the repo root: the bundles `browserify`
  // writes there share their names with files in `src/`, and an unanchored
  // pattern would hide `src/jsonata.js` from the linter.
  ignorePatterns: [
    ...node.ignorePatterns,
    "coverage",
    "docs",
    "website",
    "/polyfill.js",
    "/jsonata.js",
    "/jsonata.min.js",
    "/jsonata-es5.js",
    "/jsonata-es5.min.js",
  ],
  env: { browser: true, es2022: true, mocha: true, node: true },
  rules: {
    // `_jsonata_lambda`, `_jsonata_function` and `_formatInteger` are runtime
    // markers that the evaluator reads across modules. Renaming them changes
    // behaviour, so allow them by name.
    "no-underscore-dangle": ["error", { allow: ["_formatInteger", "_jsonata_function", "_jsonata_lambda"] }],
    // `then` is the JSONata AST property for the `? :` ternary, and the async
    // test suite builds thenables on purpose. Neither is an accidental promise.
    "unicorn/no-thenable": "off",
    // 33 benign shadows in the hand-written parser and function library. The
    // old ESLint config never enforced this, and this repo tracks an upstream
    // fork, so cosmetic renames across src/ would cost merge conflicts.
    // Promote to "error" in a dedicated change.
    "typescript/no-shadow": "off",
    "anti-slop/no-runtime-typeof": "warn", // 204
  },
});
