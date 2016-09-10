/*jshint unused:false */

(function (exports) {

  'use strict';

  var STORAGE_KEY = 'todos-vuejs-';

  exports.todoStorage = {
    fetch: function (id, defval) {
      if (defval == undefined) defval = '[]';
      return JSON.parse(localStorage.getItem(STORAGE_KEY + id) || defval);
    },
    save: function (id, todos) {
      localStorage.setItem(STORAGE_KEY + id, JSON.stringify(todos));
    }
  };

})(window);
