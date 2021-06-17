/* eslint-disable max-classes-per-file */
class Storage {

  constructor(options) {
    this.store = options.store;
  }

  setItem(key, value) {
    if (this.store) {
      try {
        this.store.setItem(key, value);
      } catch (e) {
        // f.log('failed to set value for key "' + key + '" to localStorage.');
      }
    }
  }

  getItem(key, value) {
    if (this.store) {
      try {
        return this.store.getItem(key, value);
      } catch (e) {
        // f.log('failed to get value for key "' + key + '" from localStorage.');
      }
    }
    return undefined;
  }
}

function getDefaults() {
  return {
    prefix: 'i18next_res_',
    expirationTime: 7 * 24 * 60 * 60 * 1000,
    defaultVersion: undefined,
    versions: {},
    store: typeof window !== 'undefined' ? window.localStorage : null
  };
}

class Cache {
  constructor(services, options = {}) {
    this.init(services, options);

    this.type = 'backend';
  }

  init(services, options = {}) {
    this.services = services;
    this.options = { ...getDefaults(), ...this.options, ...options };
    this.storage = new Storage(this.options);
  }

  read(language, namespace, callback) {
    const nowMS = new Date().getTime();

    if (!this.storage.store) {
      return callback(null, null);
    }

    let local = this.storage.getItem(`${this.options.prefix}${language}-${namespace}`);

    if (local) {
      local = JSON.parse(local);
      const version = this.getVersion(language);
      if (
        // expiration field is mandatory, and should not be expired
        local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS

        // there should be no language version set, or if it is, it should match the one in translation
        && version === local.i18nVersion
      ) {
        delete local.i18nVersion;
        delete local.i18nStamp;
        return callback(null, local);
      }
    }

    return callback(null, null);
  }

  save(language, namespace, data) {
    if (this.storage.store) {
      data.i18nStamp = new Date().getTime();

      // language version (if set)
      const version = this.getVersion(language);
      if (version) {
        data.i18nVersion = version;
      }

      // save
      this.storage.setItem(`${this.options.prefix}${language}-${namespace}`, JSON.stringify(data));
    }
  }

  getVersion(language) {
    return this.options.versions[language] || this.options.defaultVersion;
  }
}

Cache.type = 'backend';

export default Cache;
