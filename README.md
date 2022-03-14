# Introduction

This is a i18next cache layer to be used in the browser. It will load and cache resources from localStorage and can be used in combination with the [chained backend](https://github.com/i18next/i18next-chained-backend).

# Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/i18next-localstorage-backend) or [downloaded](https://github.com/i18next/i18next-localstorage-backend/blob/master/i18nextLocalStorageBackend.min.js) from this repo.

- If you don't use a module loader it will be added to window.i18nextLocalStorageBackend

```
# npm package
$ npm install i18next-localstorage-backend
```

Wiring up with the chained backend:

```js
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import LocalStorageBackend from 'i18next-localstorage-backend'; // primary use cache
import HttpApi from 'i18next-http-backend'; // fallback http load

i18next
  .use(Backend)
  .init({
    backend: {
      backends: [
        LocalStorageBackend,  // primary backend
        HttpApi               // fallback backend
      ],
      backendOptions: [{
        /* options for primary backend */
      }, {
        /* options for secondary backend */
        loadPath: '/locales/{{lng}}/{{ns}}.json' // http load path for my own fallback
      }]
    }
  });
```

## Cache Backend Options


```js
{
  // prefix for stored languages
  prefix: 'i18next_res_',

  // expiration
  expirationTime: 7*24*60*60*1000,

  // Version applied to all languages, can be overriden using the option `versions`
  defaultVersion: '',

  // language versions
  versions: {},

  // can be either window.localStorage or window.sessionStorage. Default: window.localStorage
  store: typeof window !== 'undefined' ? window.localStorage : null
};
```

- Contrary to cookies behavior, the cache will respect updates to `expirationTime`. If you set 7 days and later update to 10 days, the cache will persist for 10 days

- Passing in a `versions` object (ex.: `versions: { en: 'v1.2', fr: 'v1.1' }`) will give you control over the cache based on translations version. This setting works along `expirationTime`, so a cached translation will still expire even though the version did not change. You can still set `expirationTime` far into the future to avoid this

- Passing in a `defaultVersion` string (ex.: `version: 'v1.2'`) will act as if you applied a version to all languages using `versions` option.

- The test on window makes this package available for SSR environments like NextJS

## IMPORTANT ADVICE for the usage in combination with saveMissing/updateMissing

We suggest not to use a caching layer in combination with saveMissing or updateMissing, because it may happen, that the trigger for this is based on stale data.


--------------

<h3 align="center">Gold Sponsors</h3>

<p align="center">
  <a href="https://locize.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/i18next/i18next/master/assets/locize_sponsor_240.gif" width="240px">
  </a>
</p>

---

**localization as a service - locize.com**

Needing a translation management? Want to edit your translations with an InContext Editor? Use the orginal provided to you by the maintainers of i18next!

![locize](https://locize.com/img/ads/github_locize.png)

With using [locize](http://locize.com/?utm_source=react_i18next_readme&utm_medium=github) you directly support the future of i18next and react-i18next.

---
