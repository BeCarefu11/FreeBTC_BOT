"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var $toggleBtn = document.getElementById('toggle-btn');
var $message = document.getElementById('message');
var $headline = document.getElementById('headline');
var $description = document.getElementById('description');
var $iframe = document.getElementById('iframe-widget');
var $submitBtn = document.getElementById('submit-btn');
var $dismissBtn = document.getElementById('dismiss-btn');
/*
 * Helpers
 */
// request the content script to resize the iframe

function resize(params) {
  window.top.postMessage(_objectSpread({
    action: 'zm:resize'
  }, params), '*');
} // hide or show toggle button and content


function toggleVisibility(isShown) {
  $toggleBtn.classList.toggle('active', isShown);
  $message.classList.toggle('hidden', !isShown);
}

function showMessage() {
  resize({
    height: 400,
    width: 375
  }); // toggle the own controls

  setTimeout(function () {
    return toggleVisibility(true);
  }, 50);
}
/*
 * Logic
 */
// listen for message updates


chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.subject !== 'widgetMessage') {
    return;
  }

  var messages = msg.payload.messages;

  if (messages) {
    if (messages.iframe) {
      $message.classList.add('iframe');
      $message.classList.remove('plain');
      $iframe.src = messages.iframe;
    } else {
      $message.classList.remove('iframe');
      $message.classList.add('plain');
      $headline.textContent = messages.headline;
      $description.textContent = messages.description;
      $submitBtn.textContent = messages.action.label;
      $submitBtn.dataset.url = messages.action.url || '';
      $dismissBtn.textContent = messages.dismiss;
    }
  }

  if (msg.payload.show) {
    showMessage();
  } else {
    // hide message
    toggleVisibility(false);
  }
});
$submitBtn.addEventListener('click', function () {
  resize({
    height: 70,
    width: 70
  });
  chrome.runtime.sendMessage({
    subject: 'getPremium',
    payload: {
      url: this.dataset.url
    }
  });
});
$dismissBtn.addEventListener('click', function () {
  resize({
    height: 0,
    width: 0
  });
  chrome.runtime.sendMessage({
    subject: 'dismiss'
  });
});
$toggleBtn.addEventListener('click', function () {
  if ($message.classList.contains('hidden')) {
    showMessage();
  } else {
    toggleVisibility(false);
    resize({
      height: 70,
      width: 70,
      timeout: 500
    }); // signal the background to hide the message for all tabs

    chrome.runtime.sendMessage({
      subject: 'hideMessage'
    });
  }
});
/*
 * Initial call
 */
// send initial request to get message status

chrome.runtime.sendMessage({
  subject: 'getWidgetMessage'
});