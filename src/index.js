/* eslint-disable max-classes-per-file */
class Storage {
  constructor (options) {
    this.store = options.store
  }

  setItem (key, value) {
    if (this.store) {
      try {
        this.store.setItem(key, value)
      } catch (e) {
        // f.log('failed to set value for key "' + key + '" to localStorage.');
      }
    }
  }

  getItem (key, value) {
    if (this.store) {
      try {
        return this.store.getItem(key, value)
      } catch (e) {
        // f.log('failed to get value for key "' + key + '" from localStorage.');
      }
    }
    return undefined
  }
}

function getDefaults () {
  let store = null
  try {
    store = window.localStorage
  } catch (e) {
    if (typeof window !== 'undefined') {
      console.log('Failed to load local storage.', e)
    }
  }
  return {
    prefix: 'i18next_res_',
    expirationTime: 7 * 24 * 60 * 60 * 1000,
    defaultVersion: undefined,
    getVersion: undefined,
    versions: {},
    store
  }
}

class Cache {
  constructor (services, options = {}) {
    this.init(services, options)

    this.type = 'backend'
  }

  init (services, options = {}) {
    this.services = services
    this.options = { ...getDefaults(), ...this.options, ...options }
    this.storage = new Storage(this.options)
  }

  read (language, namespace, callback) {
    const nowMS = Date.now()

    if (!this.storage.store) {
      return callback(null, null)
    }

    let local = this.storage.getItem(`${this.options.prefix}${language}-${namespace}`)

    if (local) {
      try {
        local = JSON.parse(local)
      } catch (e) {
        // A corrupted or foreign value under our key must not take the whole
        // translation load down with it. Treat it as a cache miss; the next
        // successful load overwrites the entry via save().
        local = null
      }
    }

    // JSON.parse can legitimately yield null or a primitive ('null', '5', '"x"')
    if (local && typeof local === 'object') {
      const version = this.getVersion(language, namespace)
      if (
        // expiration field is mandatory, and should not be expired
        local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS &&

        // there should be no language version set, or if it is, it should match the one in translation
        version === local.i18nVersion
      ) {
        const i18nStamp = local.i18nStamp
        delete local.i18nVersion
        delete local.i18nStamp
        return callback(null, local, i18nStamp)
      }
    }

    return callback(null, null)
  }

  save (language, namespace, data) {
    if (this.storage.store) {
      // Copy rather than mutate: with i18next-chained-backend the very same
      // object is already live in i18next's resourceStore by the time save()
      // runs, so i18nStamp / i18nVersion would show up as translation keys.
      const payload = { ...data, i18nStamp: Date.now() }

      // language version (if set)
      const version = this.getVersion(language, namespace)
      if (version) {
        payload.i18nVersion = version
      }

      // save
      this.storage.setItem(`${this.options.prefix}${language}-${namespace}`, JSON.stringify(payload))
    }
  }

  getVersion (language, namespace) {
    const { getVersion, versions, defaultVersion } = this.options
    // own-property lookup only: a language such as `__proto__` or `toString`
    // would otherwise inherit a truthy value from Object.prototype and
    // silently defeat the version check on every read
    const version = Object.prototype.hasOwnProperty.call(versions, language) ? versions[language] : undefined
    return getVersion?.(language, namespace) || version || defaultVersion
  }
}

Cache.type = 'backend'
// i18next >= 26.7 calls read and create with a callback (and create with the options too) instead of
// guessing that from the number of parameters
Cache.callbackApi = true

export default Cache
