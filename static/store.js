/*jshint unused:false */

(function (exports) {

  'use strict';

  var STORAGE_KEY = 'todos-vuejs-';
  var FIREBASE_CONFIG = exports.firebase_config;

  exports.todoStorage = {
    fetch: function (id, callback, defval) {
      if (defval == undefined) defval = '[]';
      callback = callback || function () {};
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY + id) || (defval + ''));
      callback(data);
      return data;
    },
    save: function (id, todos) {
      localStorage.setItem(STORAGE_KEY + id, JSON.stringify(todos));
    }
  };

  var firedb;
  var fire_account;
  exports.fireStorage = {
    init: function (account) {
      // Initialize Firebase
      firedb = exports.firebase.initializeApp(FIREBASE_CONFIG).database();
      fire_account = account;
      return firedb;
    },
    fetch: function (id, callback, defval) {
      if (defval == undefined) defval = [];
      callback = callback || function () {};
      firedb.ref('todos/' + fire_account + '/' + id).once('value', function (data) {
        callback(data.val() || defval);
      });
    },
    save: function (id, todos) {
      firedb.ref('todos/' + fire_account + '/' + id).set(todos);
    }
  };

})(window);
