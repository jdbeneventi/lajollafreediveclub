import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// Next 16 removed the `next lint` command and ships eslint-config-next as
// native ESLint flat config, so this file replaces .eslintrc.json. The old
// config extended "next/core-web-vitals" and "next/typescript"; these are the
// same two rule sets, imported directly.
//
// `next build` no longer runs linting either, so `npm run verify` calls eslint
// explicitly — otherwise the build would stop catching lint errors that used to
// fail it.
export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      // Google Apps Script backups: a different runtime with its own globals,
      // and not source we author here. See scripts/apps-script/README.md.
      "scripts/apps-script/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Promoted to errors by the newer eslint-plugin-react-hooks that arrives
      // with Next 16. They flag pre-existing patterns — 15 and 2 occurrences
      // respectively, across 8 admin files — not anything the upgrade changed.
      //
      // Kept as warnings on purpose. Clearing them means restructuring effects
      // across the admin cockpit, which is real work with real risk and does
      // not belong bundled inside a framework upgrade. Tracked in CLAUDE.md;
      // fix them deliberately, then promote these back to "error".
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },
];
