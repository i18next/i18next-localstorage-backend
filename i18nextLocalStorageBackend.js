(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.i18nextLocalStorageBackend = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  /* eslint-disable max-classes-per-file */
  var Storage = /*#__PURE__*/function () {
    function Storage(options) {
      _classCallCheck(this, Storage);
      this.store = options.store;
    }
    _createClass(Storage, [{
      key: "setItem",
      value: function setItem(key, value) {
        if (this.store) {
          try {
            this.store.setItem(key, value);
          } catch (e) {
            // f.log('failed to set value for key "' + key + '" to localStorage.');
          }
        }
      }
    }, {
      key: "getItem",
      value: function getItem(key, value) {
        if (this.store) {
          try {
            return this.store.getItem(key, value);
          } catch (e) {
            // f.log('failed to get value for key "' + key + '" from localStorage.');
          }
        }
        return undefined;
      }
    }]);
    return Storage;
  }();
  function getDefaults() {
    return {
      prefix: 'i18next_res_',
      expirationTime: 7 * 24 * 60 * 60 * 1000,
      defaultVersion: undefined,
      versions: {},
      store: typeof window !== 'undefined' ? window.localStorage : null
    };
  }
  var Cache = /*#__PURE__*/function () {
    function Cache(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, Cache);
      this.init(services, options);
      this.type = 'backend';
    }
    _createClass(Cache, [{
      key: "init",
      value: function init(services) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        this.services = services;
        this.options = _objectSpread(_objectSpread(_objectSpread({}, getDefaults()), this.options), options);
        this.storage = new Storage(this.options);
      }
    }, {
      key: "read",
      value: function read(language, namespace, callback) {
        var nowMS = new Date().getTime();
        if (!this.storage.store) {
          return callback(null, null);
        }
        var local = this.storage.getItem("".concat(this.options.prefix).concat(language, "-").concat(namespace));
        if (local) {
          local = JSON.parse(local);
          var version = this.getVersion(language);
          if (
          // expiration field is mandatory, and should not be expired
          local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS &&
          // there should be no language version set, or if it is, it should match the one in translation
          version === local.i18nVersion) {
            delete local.i18nVersion;
            delete local.i18nStamp;
            return callback(null, local);
          }
        }
        return callback(null, null);
      }
    }, {
      key: "save",
      value: function save(language, namespace, data) {
        if (this.storage.store) {
          data.i18nStamp = new Date().getTime();

          // language version (if set)
          var version = this.getVersion(language);
          if (version) {
            data.i18nVersion = version;
          }

          // save
          this.storage.setItem("".concat(this.options.prefix).concat(language, "-").concat(namespace), JSON.stringify(data));
        }
      }
    }, {
      key: "getVersion",
      value: function getVersion(language) {
        return this.options.versions[language] || this.options.defaultVersion;
      }
    }]);
    return Cache;
  }();
  Cache.type = 'backend';

  return Cache;

})));
