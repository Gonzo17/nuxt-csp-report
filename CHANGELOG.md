
## v1.0.0

[compare changes](https://github.com/Gonzo17/nuxt-csp-report/compare/v1.0.0-alpha.3...v1.0.0)

### 🚀 Enhancements

- Improve CSP report normalization and error handling ([#11](https://github.com/Gonzo17/nuxt-csp-report/pull/11))

### 🏡 Chore

- Update release script to remove alpha tag from publish command ([737a8e0](https://github.com/Gonzo17/nuxt-csp-report/commit/737a8e0))

### ❤️ Contributors

- David Gonzalez Casin <david.gonzalezcasin@gmail.com>

## v1.0.0-alpha.3

[compare changes](https://github.com/Gonzo17/nuxt-csp-report/compare/v1.0.0-alpha.2...v1.0.0-alpha.3)

### 🚀 Enhancements

- **examples:** Add minimal example for Stackblitz ([#1](https://github.com/Gonzo17/nuxt-csp-report/pull/1))

### 🏡 Chore

- Replace npm with pnpm ([#10](https://github.com/Gonzo17/nuxt-csp-report/pull/10))

### ✅ Tests

- **module:** Add matrix with Nuxt versions to run all tests against ([#7](https://github.com/Gonzo17/nuxt-csp-report/pull/7))

### ❤️ Contributors

- David Gonzalez Casin <david.gonzalezcasin@gmail.com>

## v1.0.0-alpha.2

[compare changes](https://github.com/Gonzo17/nuxt-csp-report/compare/v1.0.0-alpha.1...v1.0.0-alpha.2)

### 🚀 Enhancements

- **module:** Simplify log summary, so it only contains the most important information ([9393c5b](https://github.com/Gonzo17/nuxt-csp-report/commit/9393c5b))

### 🩹 Fixes

- **security:** Potential fix for code scanning alert no. 2: Workflow does not contain permissions ([8b91e6b](https://github.com/Gonzo17/nuxt-csp-report/commit/8b91e6b))
- **security:** Fix permissions in github workflow ([a93e3cb](https://github.com/Gonzo17/nuxt-csp-report/commit/a93e3cb))

### 🏡 Chore

- Change ESLint config from mjs to ts file ([8e2c65e](https://github.com/Gonzo17/nuxt-csp-report/commit/8e2c65e))
- Update dependencies ([d83bd52](https://github.com/Gonzo17/nuxt-csp-report/commit/d83bd52))
- Update dependencies ([e29d58a](https://github.com/Gonzo17/nuxt-csp-report/commit/e29d58a))

### ❤️ Contributors

- David Gonzalez Casin <david.gonzalezcasin@gmail.com>

## v1.0.0-alpha.1


### 🚀 Enhancements

- **module:** Implement complete CSP reporting module with normalization and tests ([200aa46](https://github.com/Gonzo17/nuxt-csp-report/commit/200aa46))
- **module:** Export types for usage outside of the module, restructure type files, add example usage to readme and playground ([e6682a6](https://github.com/Gonzo17/nuxt-csp-report/commit/e6682a6))
- **storage:** Remove storage name from module config, export types for module users ([4624f4e](https://github.com/Gonzo17/nuxt-csp-report/commit/4624f4e))
- **storage:** Add keyPrefix in module options, change suffix from UUID to randomized string to avoid hidden dependencies ([1aa8807](https://github.com/Gonzo17/nuxt-csp-report/commit/1aa8807))
- **module:** Add Reporting-Endpoints header ([88f2102](https://github.com/Gonzo17/nuxt-csp-report/commit/88f2102))

### 🩹 Fixes

- **import:** Update import path for NormalizedCspReport type ([edfbea9](https://github.com/Gonzo17/nuxt-csp-report/commit/edfbea9))
- **import:** Update import path for NormalizedCspReport type ([1a402b0](https://github.com/Gonzo17/nuxt-csp-report/commit/1a402b0))
- **playground:** Update useStorage and fs path ([cf6eb89](https://github.com/Gonzo17/nuxt-csp-report/commit/cf6eb89))
- **package:** Update repository field to use object format ([b25bbcc](https://github.com/Gonzo17/nuxt-csp-report/commit/b25bbcc))

### 💅 Refactors

- Update README and normalize CSP report handling; improve type definitions and tests ([8497c0c](https://github.com/Gonzo17/nuxt-csp-report/commit/8497c0c))

### 📖 Documentation

- **readme:** Update configuration section ([081fc2e](https://github.com/Gonzo17/nuxt-csp-report/commit/081fc2e))
- **readme:** Update configuration section to options and clarify descriptions ([aab828b](https://github.com/Gonzo17/nuxt-csp-report/commit/aab828b))
- **readme:** Add information about current status to README ([a1b4964](https://github.com/Gonzo17/nuxt-csp-report/commit/a1b4964))

### 🏡 Chore

- **module:** Initial nuxt module setup ([0c5a980](https://github.com/Gonzo17/nuxt-csp-report/commit/0c5a980))
- **playground:** Move nuxt-security from playground dependencies to module devDependencies ([cab7588](https://github.com/Gonzo17/nuxt-csp-report/commit/cab7588))
- **package:** Update repository to GitHub url ([b1d0d13](https://github.com/Gonzo17/nuxt-csp-report/commit/b1d0d13))
- **license:** Add MIT License file to the repository ([61a7366](https://github.com/Gonzo17/nuxt-csp-report/commit/61a7366))
- **changelog:** Add initial CHANGELOG.md file ([c965c3e](https://github.com/Gonzo17/nuxt-csp-report/commit/c965c3e))
- **playground:** Remove pnpm-lock.yaml ([685f81d](https://github.com/Gonzo17/nuxt-csp-report/commit/685f81d))
- **package:** Add homepage and keywords to package.json ([5efec0d](https://github.com/Gonzo17/nuxt-csp-report/commit/5efec0d))
- Set package version to 1.0.0-alpha.0 ([c3a5ab2](https://github.com/Gonzo17/nuxt-csp-report/commit/c3a5ab2))
- Update release script for alpha version ([587c153](https://github.com/Gonzo17/nuxt-csp-report/commit/587c153))
- Update release script for alpha version ([c729dc6](https://github.com/Gonzo17/nuxt-csp-report/commit/c729dc6))

### ✅ Tests

- **module:** Add fixture test for Reporting-Endpoints header, update storage fixture ([b1019d8](https://github.com/Gonzo17/nuxt-csp-report/commit/b1019d8))

### ❤️ Contributors

- David Gonzalez Casin <david.gonzalezcasin+github@gmail.com>

