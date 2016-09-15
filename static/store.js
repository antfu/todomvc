/*jshint unused:false */

(function (exports) {

  'use strict';

  var STORAGE_KEY = 'todos-vuejs-';
  var FIREBASE_CONFIG = exports.firebase_config;

  exports.todoStorage = {
    fetch: function (id, callback, defval) {
      callback = callback || function () {};
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY + id) || '0') || defval;
      callback(data);
      return data;
    },
    save: function (id, todos) {
      localStorage.setItem(STORAGE_KEY + id, JSON.stringify(todos));
    }
  };

  var firedb;
  var fire_account;
  var fire_inited = false;
  exports.fireStorage = {
    init: function (account) {
      if (fire_inited) return;
      // Initialize Firebase
      firedb = exports.firebase.initializeApp(FIREBASE_CONFIG).database();
      fire_account = account;
      fire_inited = true;
      return firedb;
    },
    fetch: function (id, callback, defval) {
      if (!fire_inited) return;
      callback = callback || function () {};
      firedb.ref('todos/' + fire_account + '/' + id).once('value', function (data) {
        callback(data.val() || defval);
      });
    },
    save: function (id, todos) {
      if (!fire_inited) return;
      firedb.ref('todos/' + fire_account + '/' + id).set(todos);
    }
  };

})(window);
