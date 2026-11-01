### 4.3.3

- fix: i18next 26.7.0 deprecates guessing the calling convention of a backend from the number of parameters of its methods; the backend now declares it with `callbackApi`, so i18next calls `read` and `create` with a callback (and passes `create` its options), and debug mode no longer logs the deprecation notice. Older i18next versions ignore it.

### 4.3.2

- fix: a corrupted cache entry no longer breaks translation loading. `JSON.parse` on the stored value was unguarded, so any malformed value under an `i18next_res_*` key (a truncated write when the storage quota is hit, a hand-edited entry, anything else writing to that key) threw straight out of `read()`. Malformed and non-object values (`null`, numbers, strings) are now treated as a cache miss, and the entry is overwritten by the next successful load.
- fix: `save()` no longer mutates the object it is given. With `i18next-chained-backend` the same object reference is already live in i18next's `resourceStore` when `save()` runs, so the `i18nStamp` / `i18nVersion` bookkeeping fields leaked in as translation keys.
- fix: `getVersion()` looks up `options.versions` with an own-property check. A language named `__proto__`, `constructor` or `toString` previously inherited a truthy value from `Object.prototype`, which silently defeated the version check and made every read a cache miss.
- chore: added unit tests, run via Node's built-in test runner (`node --test`), no new dependencies.

### 4.3.1

- add getVersion type [57](https://github.com/i18next/i18next-localstorage-backend/pull/57)

### 4.3.0

- add getVersion prop [55](https://github.com/i18next/i18next-localstorage-backend/pull/55)

### 4.2.0

- return timestamp when reading, can be useful for chained-backend

### 4.1.1

- fix: localStorage SecutiryError [46](https://github.com/i18next/i18next-localstorage-backend/pull/46)

### 4.1.0

- typescript: export the backend options type

### 4.0.1

- typescript: static type prop

### 4.0.0

- typescript fix for i18next v22

### 3.1.3

- SSR fix [31](https://github.com/i18next/i18next-localstorage-backend/pull/31)

### 3.1.2

- typescript: Add defaultVersion to typings of BackendOptions [25](https://github.com/i18next/i18next-localstorage-backend/pull/25)

### 3.1.1

- fix(options): make defaultVersion undefined [19](https://github.com/i18next/i18next-localstorage-backend/pull/19)

### 3.1.0

- feat(version): add a defautversion option to apply a version for all languages in once [15](https://github.com/i18next/i18next-localstorage-backend/pull/15)

### 3.0.0

- removes deprecated jsnext:main from package.json
- Bundle all entry points with rollup [11](https://github.com/i18next/i18next-localstorage-backend/pull/11)
- **note:** dist/es -> dist/esm, dist/commonjs -> dist/cjs (individual files -> one bundled file)

### 2.1.2

- typescript: fix types [9](https://github.com/i18next/i18next-localstorage-backend/pull/9)

### 2.1.1

- typescript: Fixing a TypeScript error complaining of missing default export [8](https://github.com/i18next/i18next-localstorage-backend/pull/8)

### 2.1.0

- optionally set store to use [7](https://github.com/i18next/i18next-localstorage-backend/pull/7)

### 2.0.0

- typescript: add types [5](https://github.com/i18next/i18next-localstorage-backend/pull/5)

### 1.1.4

- fixes cache save call

### 1.1.1

- initial version
