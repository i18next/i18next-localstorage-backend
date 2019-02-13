(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.i18nextLocalStorageBackend = factory());
}(this, (function () { 'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = function () {
  function Storage(options) {
    _classCallCheck(this, Storage);

    this.store = options.store;
  }

  _createClass(Storage, [{
    key: 'setItem',
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
    key: 'getItem',
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
    versions: {},
    store: window.localStorage
  };
}

var Cache = function () {
  function Cache(services) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Cache);

    this.init(services, options);

    this.type = 'backend';
  }

  _createClass(Cache, [{
    key: 'init',
    value: function init(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.services = services;
      this.options = _extends({}, getDefaults(), this.options, options);
      this.storage = new Storage(this.options);
    }
  }, {
    key: 'read',
    value: function read(language, namespace, callback) {
      var nowMS = new Date().getTime();

      if (!this.storage.store) {
        return callback(null, null);
      }

      var local = this.storage.getItem('' + this.options.prefix + language + '-' + namespace);

      if (local) {
        local = JSON.parse(local);
        if (
        // expiration field is mandatory, and should not be expired
        local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS

        // there should be no language version set, or if it is, it should match the one in translation
        && this.options.versions[language] === local.i18nVersion) {
          delete local.i18nVersion;
          delete local.i18nStamp;
          return callback(null, local);
        }
      }

      return callback(null, null);
    }
  }, {
    key: 'save',
    value: function save(language, namespace, data) {
      if (this.storage.store) {
        data.i18nStamp = new Date().getTime();

        // language version (if set)
        if (this.options.versions[language]) {
          data.i18nVersion = this.options.versions[language];
        }

        // save
        this.storage.setItem('' + this.options.prefix + language + '-' + namespace, JSON.stringify(data));
      }
    }
  }]);

  return Cache;
}();

Cache.type = 'backend';

return Cache;

})));
