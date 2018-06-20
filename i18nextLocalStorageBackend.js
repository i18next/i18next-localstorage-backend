(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.i18nextLocalStorageBackend = factory());
}(this, (function () { 'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    /**
     * Builds the prefix key for local storage.
     *
     * @param {string} language - Current language namespace.
     * @param {string} namespace - Current namespace (translation set).
     * @param {object} options - Options, with prefix key.
     * @returns {string} Localstorage prefix key.
     */
    function keyBuilder(language, namespace) {
        var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
            _ref$prefix = _ref.prefix,
            prefix = _ref$prefix === undefined ? '' : _ref$prefix;

        return '' + prefix + language + '-' + namespace;
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

    var Cache = function () {
        function Cache(services) {
            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            _classCallCheck(this, Cache);

            this.init(services, _extends({
                prefix: 'i18next_res_',
                expirationTime: 7 * 24 * 60 * 60 * 1000,
                versions: {}
            }, options));

            this.type = 'backend';
        }

        _createClass(Cache, [{
            key: 'init',
            value: function init(services) {
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                this.options = options;
                this.services = services;

                for (var key in options) {
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

        }, {
            key: 'get',
            value: function get(language, namespace) {
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

        }, {
            key: 'read',
            value: function read(language, namespace, callback) {
                // Try to fetch from the localStorage
                var local = this.get(language, namespace);
                if (!local) return callback(null, null);

                // expiration field is mandatory, and should not be expired
                var nowMS = new Date().getTime();
                if (!local.i18nStamp) return callback(null, null);
                if (local.i18nStamp + this.options.expirationTime < nowMS) return callback(null, null);

                var resolver = this.options.versions[language];

                // Sometimes we may want to specify the version from a server check, so as not to always manually bump the version
                // We'll wait for the promise to resolve, then check the version string from the result
                if (resolver instanceof Promise) {
                    return resolver.then(function (versionString) {
                        if (versionString !== local.i18nVersion) return callback(null, null);
                        return callback(null, local);
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

        }, {
            key: 'set',
            value: function set(language, namespace, data) {
                setItem(keyBuilder(language, namespace, this.options), JSON.stringify(data));
            }

            /**
             * Preprocessing for save.
             *
             * @param {string} language - Current language namespace.
             * @param {string} namespace - Current namespace (translation set).
             * @param {object} data - Translations to be saved or loaded.
             */

        }, {
            key: 'save',
            value: function save(language, namespace, data) {
                var _this = this;

                try {
                    data.i18nStamp = new Date().getTime();

                    var resolver = this.options.versions[language];

                    // We may have a promise version
                    if (resolver instanceof Promise) {
                        return resolver.then(function (version) {
                            data.i18nVersion = version;
                            _this.set(language, namespace, data);
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
        }]);

        return Cache;
    }();

    Cache.type = 'backend';

    return Cache;

})));
