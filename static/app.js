/*global Vue, todoStorage */

(function (exports) {

  'use strict';

  var storage = todoStorage;

  var last_tab_id = todoStorage.fetch('id', undefined, 0);
  var filters = {
    all: function (todos) {
      return todos;
    },
    active: function (todos) {
      return todos.filter(function (todo) {
        return !todo.completed;
      });
    },
    completed: function (todos) {
      return todos.filter(function (todo) {
        return todo.completed;
      });
    }
  };

  exports.use_firebase = function (account) {
    fireStorage.init(account);
    storage = fireStorage;
    exports.app.update();
  };

  exports.app = new Vue({

    // the root element that will be compiled
    el: '.todoapp',

    // app initial state
    data: {
      todos: [],
      newTodo: '',
      editedTodo: null,
      visibility: 'all',
      tab_id: last_tab_id
    },

    // watch todos change for localStorage persistence
    watch: {
      todos: {
        handler: function (todos) {
          storage.save(this.$root.tab_id, todos);
        },
        deep: true
      },
      tab_id: function (val) {
        todoStorage.save('id', val);
        last_tab_id = val;
        this.$root.update();
      }
    },

    // computed properties
    // http://vuejs.org/guide/computed.html
    computed: {
      filteredTodos: function () {
        return filters[this.visibility](this.todos);
      },
      remaining: function () {
        return filters.active(this.todos).length;
      },
      allDone: {
        get: function () {
          return this.remaining === 0;
        },
        set: function (value) {
          this.todos.forEach(function (todo) {
            todo.completed = value;
          });
        }
      }
    },

    // methods that implement data logic.
    // note there's no DOM manipulation here at all.
    methods: {
      update: function () {
        var app = this;
        storage.fetch(app.tab_id, function (data) {
          Vue.set(app, 'todos', data || []);
        });
      },
      addTodo: function () {
        var value = this.newTodo && this.newTodo.trim();
        if (!value) {
          return;
        }
        this.todos.push({
          title: value,
          completed: false
        });
        this.newTodo = '';
      },

      removeTodo: function (todo) {
        this.todos.$remove(todo);
      },

      editTodo: function (todo) {
        this.beforeEditCache = todo.title;
        this.editedTodo = todo;
      },

      doneEdit: function (todo) {
        if (!this.editedTodo) {
          return;
        }
        this.editedTodo = null;
        todo.title = todo.title.trim();
        if (!todo.title) {
          this.removeTodo(todo);
        }
      },

      cancelEdit: function (todo) {
        this.editedTodo = null;
        todo.title = this.beforeEditCache;
      },

      removeCompleted: function () {
        this.todos = filters.active(this.todos);
      },

      switchTab: function (id) {
        this.tab_id = id;
      }
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
      'todo-focus': function (value) {
        if (!value) {
          return;
        }
        var el = this.el;
        Vue.nextTick(function () {
          el.focus();
        });
      }
    }
  });

  exports.app.update();

})(window);
