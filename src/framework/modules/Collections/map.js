Jx().package("T.Collections", function(J){
    this.StackedMap = new J.Class({
        // 构造函数
        init: function(){
            this._innerStack= [];
        },
        add: function(key, value) {
            this._innerStack.push({
                key: key,
                value: value
            });
        },
        get: function(key) {
            for (var i = 0; i < this._innerStack.length; i++) {
                if (key === this._innerStack[i].key) {
                    return this._innerStack[i];
                }
            }
        },
        keys: function() {
            var keys = [];
            for (var i = 0; i < this._innerStack.length; i++) {
                keys.push(this._innerStack[i].key);
            }
            return keys;
        },
        top: function() {
            return this._innerStack[this._innerStack.length - 1];
        },
        remove: function(key) {
            var idx = -1;
            for (var i = 0; i < this._innerStack.length; i++) {
                if (key === this._innerStack[i].key) {
                    idx = i;
                    break;
                }
            }
            return this._innerStack.splice(idx, 1)[0];
        },
        removeTop: function() {
            return this._innerStack.splice(this._innerStack.length - 1, 1)[0];
        },
        length: function() {
            return this._innerStack.length;
        }
    });

    this.MultiMap = new J.Class({
        // 构造函数
        init: function(){
            this._innerMap= {};
        },

        entries: function() {
            // TODO: Object.keys在ie8下的浏览器兼容性问题
            return Object.keys(this._innerMap).map(function(key) {
                return {
                    key: key,
                    value: this._innerMap[key]
                };
            });
        },
        get: function(key) {
            return this._innerMap[key];
        },
        hasKey: function(key) {
            return !!this._innerMap[key];
        },
        keys: function() {
            return Object.keys(this._innerMap);
        },
        put: function(key, value) {
            if (!this._innerMap[key]) {
                this._innerMap[key] = [];
            }

            this._innerMap[key].push(value);
        },
        remove: function(key, value) {
            var values = this._innerMap[key];

            if (!values) {
                return;
            }

            var idx = values.indexOf(value);

            if (idx !== -1) {
                values.splice(idx, 1);
            }

            if (!values.length) {
                delete this._innerMap[key];
            }
        }
    });
});


// var stack = [];
// return {
//     add: function(key, value) {
//         stack.push({
//             key: key,
//             value: value
//         });
//     },
//     get: function(key) {
//         for (var i = 0; i < stack.length; i++) {
//             if (key === stack[i].key) {
//                 return stack[i];
//             }
//         }
//     },
//     keys: function() {
//         var keys = [];
//         for (var i = 0; i < stack.length; i++) {
//             keys.push(stack[i].key);
//         }
//         return keys;
//     },
//     top: function() {
//         return stack[stack.length - 1];
//     },
//     remove: function(key) {
//         var idx = -1;
//         for (var i = 0; i < stack.length; i++) {
//             if (key === stack[i].key) {
//                 idx = i;
//                 break;
//             }
//         }
//         return stack.splice(idx, 1)[0];
//     },
//     removeTop: function() {
//         return stack.splice(stack.length - 1, 1)[0];
//     },
//     length: function() {
//         return stack.length;
//     }
// };

// var map = {};
// return {
//     entries: function() {
//         return Object.keys(map).map(function(key) {
//             return {
//                 key: key,
//                 value: map[key]
//             };
//         });
//     },
//     get: function(key) {
//         return map[key];
//     },
//     hasKey: function(key) {
//         return !!map[key];
//     },
//     keys: function() {
//         return Object.keys(map);
//     },
//     put: function(key, value) {
//         if (!map[key]) {
//             map[key] = [];
//         }
//         map[key].push(value);
//     },
//     remove: function(key, value) {
//         var values = map[key];
//         if (!values) {
//             return;
//         }
//         var idx = values.indexOf(value);
//         if (idx !== -1) {
//             values.splice(idx, 1);
//         }
//         if (!values.length) {
//             delete map[key];
//         }
//     }
// };