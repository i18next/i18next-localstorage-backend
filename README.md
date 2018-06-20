# Introduction

This is a i18next cache layer to be used in the browser. It will load and cache resources from localStorage and can be used in combination with the [chained backend](https://github.com/WASD-Team/i18next-localstorage-backend).

This is a fork, which supports loading translation versions from a promises. Linting is applied and is in compliance with AirBNB coding guidlines.

# Getting started

`yarn add git+https://github.com/WASD-Team/i18next-localstorage-backend`

- If you don't use a module loader it will be added to window.i18nextLocalStorageBackend

Wiring up with the chained backend:

```js
import i18next from 'i18next';
import Backend from 'i18next-chained-backend';
import XHR from 'i18next-xhr-backend'; // fallback xhr load
import LocalStorageBackend from 'i18next-localstorage-backend'; // primary use cache

i18next
  .use(Backend)
  .init({
    backend: {
      backends: [
        LocalStorageBackend,  // primary
        XHR                   // fallback
      ],
      backendOptions: [{
        /* below options */
      }, {
        loadPath: '/locales/{{lng}}/{{ns}}.json' // xhr load path for my own fallback
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

  // language versions
  versions: { en: 'v1.2', ru: Promise.resolve('v1.2') }
};
```

- Contrary to cookies behavior, the cache will respect updates to `expirationTime`. If you set 7 days and later update to 10 days, the cache will persist for 10 days

- Passing in a `versions` object (ex.: `versions: { en: 'v1.2', fr: 'v1.1' }`) will give you control over the cache based on translations version. This setting works along `expirationTime`, so a cached translation will still expire even though the version did not change. You can still set `expirationTime` far into the future to avoid this
