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

function setItem(key, value) {
  try {
    global.window.localStorage.setItem(key, value);
  } catch (e) {
    // f.log('failed to set value for key "' + key + '" to localStorage.');
  }
}

function getItem(key, value) {
  try {
    return global.window.localStorage.getItem(key, value);
  } catch (e) {
    return undefined;
    // f.log('failed to get value for key "' + key + '" from localStorage.');
  }
}

class Cache {
  constructor(services, options = {}) {
    this.init(services, {
      prefix: 'i18next_res_',
      expirationTime: 7 * 24 * 60 * 60 * 1000,
      versions: {},
      ...options,
    });

    this.type = 'backend';
  }

  init(services, options = {}) {
    this.options = options;
    this.services = services;

    for (let key in options) {
      if (this.options[key] === undefined) this.options[key] = options[key];
    }
  }

  /**
   * Get translations from the localstorage.
   *
   * @param {string} language - Current language namespace.
   * @param {string} namespace - Current namespace (translation set).
   * @returns {object|boolean} The result of the local storage fetch or false.
   */
  get(language, namespace) {
    try {
      return JSON.parse(getItem(keyBuilder(language, namespace, this.options)));
    } catch (err) {
      return undefined;
    }
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
    if (!local.i18nStamp) return callback(null, null);
    if (local.i18nStamp + this.options.expirationTime < nowMS) return callback(null, null);

    const resolver = this.options.versions[language];

    // We may have a promise version
    if (resolver instanceof Promise) {
      return resolver.then(version => {
        data.i18nVersion = version;
        this.set(language, namespace, data);
      });
    }

    // there should be no language version set, or if it is, it should match the one in translation
    if (resolver !== local.i18nVersion) return callback(null, null);

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
    setItem(keyBuilder(language, namespace, this.options), JSON.stringify(data));
  }

  /**
   * Preprocessing for save.
   *
   * @param {string} language - Current language namespace.
   * @param {string} namespace - Current namespace (translation set).
   * @param {object} data - Translations to be saved or loaded.
   */
  save(language, namespace, data) {
    try {
      data.i18nStamp = new Date().getTime();

      const resolver = this.options.versions[language];

      // We may have a promise version
      if (resolver instanceof Promise) {
        return resolver.then(version => {
          data.i18nVersion = version;
          this.set(language, namespace, data);
        });
      }

      // language version (if set)
      if (!resolver) return this.set(language, namespace, data);

      // Simple string version
      data.i18nVersion = resolver;
      this.set(language, namespace, data);
    } catch (err) {
      // f.log('failed to get value for key "' + key + '" from localStorage.');
    }
  }
}

Cache.type = 'backend';

export default Cache;
