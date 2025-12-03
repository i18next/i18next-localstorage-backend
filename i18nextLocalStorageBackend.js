(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.i18nextLocalStorageBackend = factory());
})(this, (function () { 'use strict';

  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }

  function toPrimitive(t, r) {
    if ("object" != _typeof(t) || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != _typeof(i)) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }

  function toPropertyKey(t) {
    var i = toPrimitive(t, "string");
    return "symbol" == _typeof(i) ? i : i + "";
  }

  function _defineProperty(e, r, t) {
    return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }

  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }

  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }

  function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
  function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
  /* eslint-disable max-classes-per-file */
  var Storage = /*#__PURE__*/function () {
    function Storage(options) {
      _classCallCheck(this, Storage);
      this.store = options.store;
    }
    return _createClass(Storage, [{
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
  }();
  function getDefaults() {
    var store = null;
    try {
      store = window.localStorage;
    } catch (e) {
      if (typeof window !== 'undefined') {
        console.log('Failed to load local storage.', e);
      }
    }
    return {
      prefix: 'i18next_res_',
      expirationTime: 7 * 24 * 60 * 60 * 1000,
      defaultVersion: undefined,
      getVersion: undefined,
      versions: {},
      store: store
    };
  }
  var Cache = /*#__PURE__*/function () {
    function Cache(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      _classCallCheck(this, Cache);
      this.init(services, options);
      this.type = 'backend';
    }
    return _createClass(Cache, [{
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
        var nowMS = Date.now();
        if (!this.storage.store) {
          return callback(null, null);
        }
        var local = this.storage.getItem("".concat(this.options.prefix).concat(language, "-").concat(namespace));
        if (local) {
          local = JSON.parse(local);
          var version = this.getVersion(language, namespace);
          if (
          // expiration field is mandatory, and should not be expired
          local.i18nStamp && local.i18nStamp + this.options.expirationTime > nowMS &&
          // there should be no language version set, or if it is, it should match the one in translation
          version === local.i18nVersion) {
            var i18nStamp = local.i18nStamp;
            delete local.i18nVersion;
            delete local.i18nStamp;
            return callback(null, local, i18nStamp);
          }
        }
        return callback(null, null);
      }
    }, {
      key: "save",
      value: function save(language, namespace, data) {
        if (this.storage.store) {
          data.i18nStamp = Date.now();

          // language version (if set)
          var version = this.getVersion(language, namespace);
          if (version) {
            data.i18nVersion = version;
          }

          // save
          this.storage.setItem("".concat(this.options.prefix).concat(language, "-").concat(namespace), JSON.stringify(data));
        }
      }
    }, {
      key: "getVersion",
      value: function getVersion(language, namespace) {
        var _this$options$getVers, _this$options;
        return ((_this$options$getVers = (_this$options = this.options).getVersion) === null || _this$options$getVers === void 0 ? void 0 : _this$options$getVers.call(_this$options, language, namespace)) || this.options.versions[language] || this.options.defaultVersion;
      }
    }]);
  }();
  Cache.type = 'backend';

  return Cache;

}));
