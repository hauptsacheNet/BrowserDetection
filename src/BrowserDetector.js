/**
 * Created by philipp on 27.10.14.
 */
(function (window, $) {
    "use strict";

    /**
     * TODO: MAKE CONFIGURABLE
     * @type {*|HTMLElement}
     */

    var minVersion = window.hnBrowserMinVersion || {Explorer: 9, chrome: 20, firefox: 3};

    var $document = $(document);

    var BrowserDetect = {
        browser: null,
        version: null,
        isQuirkMode: null,
        dataBrowser: [
            {string: navigator.userAgent, subString: "Chrome", identity: "Chrome"},
            {string: navigator.userAgent, subString: "MSIE", identity: "Explorer"},
            {string: navigator.userAgent, subString: "Trident", identity: "Explorer"},
            {string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
            {string: navigator.userAgent, subString: "Safari", identity: "Safari"},
            {string: navigator.userAgent, subString: "Opera", identity: "Opera"}
        ],
        searchString: function (data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                this.versionSearchString = data[i].subString;

                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                }
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index === -1) {
                return;
            }

            var rv = dataString.indexOf("rv:");
            if (this.versionSearchString === "Trident" && rv !== -1) {
                return parseFloat(dataString.substring(rv + 3));
            } else {
                return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
            }
        },
        detectQuirkMode: function () {
            var isQuirkMode = false;
            var compatMode = document.compatMode;

            if (compatMode) {
                if (compatMode === 'CSS1Compat') {
                    isQuirkMode = false;
                }

                if (compatMode === 'BackCompat') {
                    isQuirkMode = true;
                }
            }

            return isQuirkMode;
        },
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "Other";
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "Unknown";
            this.isQuirkMode = this.detectQuirkMode();
        }
    };

    var EventEmitter = {
        browserDetect: null,
        checkVersion: function () {
            var currentBrowser = this.browserDetect.browser;
            var currentVersion = this.browserDetect.version;

            for (var k in minVersion) {
                if (minVersion.hasOwnProperty(k)) {
                    var checkForBrowser = k;
                    var checkForVersion = minVersion[k];

                    console.log('Checking if currentBrowser', currentBrowser, currentVersion, 'fits', checkForBrowser, checkForVersion);

                    if (currentBrowser === checkForBrowser && currentVersion < checkForVersion) {
                        console.log('Your browser is way too old!', checkForBrowser, checkForVersion);
                        $document.trigger('hn_browser_unspported_browser', [currentBrowser, currentVersion]);
                        return;
                    }
                }
            }

            console.log('I have no issue with ', currentBrowser, currentVersion, 'have a really nice day!');
        },
        checkCompatMode: function () {
            if (this.browserDetect.isQuirkMode) {
                console.log('You are in quirks mode, stupid!');
                $(document).trigger('hn_browser_detection_is_in_quirks_mode');
            } else {
                console.log('All is fine! No compat mode detected!');
            }
        },
        init: function (BrowserDetect) {
            this.browserDetect = BrowserDetect;
            this.browserDetect.init();

            this.checkVersion();
            this.checkCompatMode();
        }
    };

    window.HnBrowserEventHandler = {
        callback: undefined,
        bind: function () {
            var self = this;

            $document.on('hn_browser_detection_is_in_quirks_mode', function () {
                if (self.callback) {
                    self.callback();
                } else {
                    window.alert("Your browser is in quirks mode and may not work as expected. Please configure for it to use standard mode.");
                }
            });

            $document.on('hn_browser_unspported_browser', function (event, browser, version) {
                window.alert("You are using the unsupported browser" +
                " " + browser + " " + version + "" +
                ". If you are sure that you are on the latest release, please check the browser mode.");
            });
        },
        init: function (callback) {
            if (callback) {
                this.callback = callback;
            }
            this.bind();
        }
    };

    window.HnBrowserEventHandler.init();
    EventEmitter.init(BrowserDetect);
})(window, jQuery);
