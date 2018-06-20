import { defaults } from './utils';

/**
 * Checks for localStorage on our window (don't fail on SSR).
 * @returns {boolean} True if we have a local storage.
 */
function hasLocalStorage() {
  if (typeof global.window === 'undefined') return false;
  if (!global.window.localStorage) return false;

  return true;
}

/**
 * Builds the prefix key for local storage.
 *
 * @param {string} language - Current language namespace.
 * @param {string} namespace - Current namespace (translation set).
 * @param {object} options - Options, with prefix key.
 * @returns {string} Localstorage prefix key.
 */
function keyBuilder(language, namespace, { prefix = '' } = {}) {
  return `${prefix}${language}-${namespace}`;
}

const storage = {
  setItem(key, value) {
    if (!hasLocalStorage()) return;

    try {
      global.window.localStorage.setItem(key, value);
    } catch (e) {
      // f.log('failed to set value for key "' + key + '" to localStorage.');
    }
  },
  getItem(key, value) {
    if (!hasLocalStorage()) return undefined;

    try {
      return global.window.localStorage.getItem(key, value);
    } catch (e) {
      return undefined;
      // f.log('failed to get value for key "' + key + '" from localStorage.');
    }
  }
};

function getDefaults() {
  return {
    prefix: 'i18next_res_',
    expirationTime: 7 * 24 * 60 * 60 * 1000,
    versions: {}
  };
}

class Cache {
  constructor(services, options = {}) {
    this.init(services, options);
    this.type = 'backend';
  }

  init(services, options = {}) {
    this.services = services;
    this.options = defaults(options, this.options || {}, getDefaults());
  }

  /**
   * Get translations from the localstorage.
   *
   * @param {string} language - Current language namespace.
   * @param {string} namespace - Current namespace (translation set).
   * @returns {object|boolean} The result of the local storage fetch or false.
   */
  get(language, namespace) {
    if (!hasLocalStorage()) return false;

    const storageItem = storage.getItem(keyBuilder(language, namespace, this.options));

    // We shoud load the translations anew
    if (!storageItem) return false;

    return JSON.parse(storageItem);
  }

  /**
   * Called by i18next-chained-backend when looking for translations.
   *
   * @param {string} language - The current language.
   * @param {string} namespace - Namespace to use for lookup.
   * @param {function} callback - (err, result) should be called with the results of the local-storage fetch (if any).
   * @returns {undefined|promise} Errors should be handled through the callback from xhr-chained-backend.
   */
  read(language, namespace, callback) {
    // Try to fetch from the localStorage
    const local = this.get(language, namespace);
    if (!local) return callback(null, null);

    // expiration field is mandatory, and should not be expired
    const nowMS = new Date().getTime();
    if (local.i18nStamp) return callback(null, null);
    if (local.i18nStamp + this.options.expirationTime < nowMS) return callback(null, null);

    const versionResolver = this.options.versions[language];

    // Sometimes we may want to specify the version from a server check, so as not to always manually bump the version
    // We'll wait for the promise to resolve, then check the version string from the result
    if (versionResolver instanceof Promise) {
      return versionResolver.then((versionString) => {
        if (versionString !== local.i18nVersion) return callback(null, null);
        return callback(null, local);
      });
    }

    // there should be no language version set, or if it is, it should match the one in translation
    if (versionResolver !== local.i18nVersion) return callback(null, null);

    // Looks like we've loaded everything successfully
    delete local.i18nVersion;
    delete local.i18nStamp;
    return callback(null, local);
  }

  /**
   * Set data to the localStorage.
   *
   * @param {string} language - Used to build the localStorage key.
   * @param {string} namespace - Used to build the localStorage key.
   * @param {object} data - Will be stringified and saved.
   */
  set(language, namespace, data) {
    storage.setItem(keyBuilder(language, namespace, this.options), JSON.stringify(data));
  }

  /**
   * Preprocessing for save.
   *
   * @param {string} language - Current language namespace.
   * @param {string} namespace - Current namespace (translation set).
   * @param {object} data - Translations to be saved or loaded.
   */
  save(language, namespace, data) {
    if (!hasLocalStorage()) return;

    data.i18nStamp = new Date().getTime();

    // language version (if set)
    if (this.options.versions[language]) {
      data.i18nVersion = this.options.versions[language];
    }

    this.set(language, namespace, data);
  }
}

Cache.type = 'backend';

export default Cache;
