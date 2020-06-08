"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root, initPageApi) {
  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    module.exports = initPageApi;
  } else {
    initPageApi();
  }
})(void 0, function () {
  function injectFn() {
    window.__zm = {
      toggle: function toggle(enabled) {
        document.dispatchEvent(new CustomEvent('toggle', {
          detail: enabled
        }));
      },
      setPageExcludes: function setPageExcludes(list) {
        document.dispatchEvent(new CustomEvent('setPageExcludes', {
          detail: list
        }));
      },
      update: function update() {
        document.dispatchEvent(new CustomEvent('updateZM'));
      },
      removeCredentials: function removeCredentials() {
        document.dispatchEvent(new CustomEvent('removeCredentials'));
      },
      updateWithCredentials: function updateWithCredentials(creds) {
        document.dispatchEvent(new CustomEvent('updateWithCredentials', {
          detail: creds
        }));
      },
      getData: function getData(cb) {
        var ts = Date.now();
        document.dispatchEvent(new CustomEvent('request:getData', {
          detail: ts
        }));

        var handler = function handler(e) {
          var resp = JSON.parse(e.detail);

          if (resp.timestamp === ts && cb) {
            cb({
              user: resp.user,
              device: resp.device,
              version: resp.version
            });
            document.removeEventListener('response:getData', handler);
          }
        };

        document.addEventListener('response:getData', handler);
      }
    };
  }

  var inject = "(".concat(injectFn, ")();");
  document.addEventListener('toggle', function (e) {
    chrome.runtime.sendMessage({
      subject: 'toggle',
      payload: e.detail
    });
  });
  document.addEventListener('setPageExcludes', function (e) {
    chrome.runtime.sendMessage({
      subject: 'setPageExcludes',
      payload: e.detail
    });
  });
  document.addEventListener('updateZM', function () {
    chrome.runtime.sendMessage({
      subject: 'update'
    });
  });
  document.addEventListener('removeCredentials', function () {
    chrome.runtime.sendMessage({
      subject: 'removeCredentials'
    });
  });
  document.addEventListener('updateWithCredentials', function (e) {
    chrome.runtime.sendMessage({
      subject: 'updateWithCredentials',
      payload: {
        credentials: e.detail
      }
    });
  });
  document.addEventListener('request:getData', function (e) {
    chrome.runtime.sendMessage({
      subject: 'request:getData',
      payload: {
        timestamp: e.detail
      }
    });
  });
  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg && msg.subject) {
      document.dispatchEvent(new CustomEvent(msg.subject, {
        detail: JSON.stringify(msg.payload)
      }));
    }
  });
  var script = document.createElement('script');
  script.innerHTML = inject;
  var parent = document.body || document.head || document.documentElement;
  parent.appendChild(script);
});