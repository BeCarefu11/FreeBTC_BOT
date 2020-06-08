"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function addScript(url, id) {
  var async = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (document.getElementById(id)) {
    return;
  }

  var s = document.createElement('script');
  var parent = document.body || document.head || document.documentElement;
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('charset', 'utf-8');
  s.id = id;
  s.src = url;
  s.async = async;
  parent.appendChild(s);
}

var scriptUrl = chrome.extension.getURL('scripts/webrtc-patch.js');
addScript(scriptUrl, 'zm-extension');
chrome.runtime.onMessage.addListener(function (data) {
  if (data.to !== 'content') {
    return;
  }

  window.postMessage(data, window.location.origin);
});
window.addEventListener('message', function (_ref) {
  var origin = _ref.origin,
      data = _ref.data;

  if (origin !== window.location.origin) {
    return;
  }

  if (!data.to) {
    return;
  }

  chrome.runtime.sendMessage(_objectSpread({
    origin: origin
  }, data));
});