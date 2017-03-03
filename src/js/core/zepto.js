/**
 * Created by chenxingyu on 2016/12/22.
 */
/* Zepto v1.2.0 - zepto event ajax form ie - zeptojs.com/license */
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return factory(global)
        });
    } else {
        factory(global);
    }
})(this, function () {

    // ? 匹配前面的子表达式零次或一次。例如，"do(es)?" 可以匹配 "do" 或 "does" 中的"do" 。? 等价于 {0,1}。

    // ! 非

    // (pattern) 匹配 pattern 并获取这一匹配。所获取的匹配可以从产生的 Matches 集合得到，在VBScript 中使用 SubMatches 集合，
    // 在JScript 中则使用 $0…$9 属性。要匹配圆括号字符，请使用 '\(' 或 '\)'。
    // /(asdasd)/.exec('a') -> null   /(asdasd)/.exec('asdasd') -> ["asdasd","asdasd"]

    // (?=pattern) 正向预查，在任何匹配 pattern 的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。
    // 例如，'Windows (?=95|98|NT|2000)' 能匹配 "Windows 2000" 中的 "Windows" ，但不能匹配 "Windows 3.1" 中的 "Windows"。
    // 预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。
    // /Windows(?=95|98|NT|2000)/.exec('Windows95') -> ["Windows"]  /Windows(?=95|98|NT|2000)/.exec('Windows') -> null

    // (?!pattern)  负向预查，在任何不匹配 pattern 的字符串开始处匹配查找字符串。这是一个非获取匹配，也就是说，该匹配不需要获取供以后使用。
    // 例如'Windows (?!95|98|NT|2000)' 能匹配 "Windows 3.1" 中的 "Windows"，但不能匹配 "Windows 2000" 中的 "Windows"。
    // 预查不消耗字符，也就是说，在一个匹配发生后，在最后一次匹配之后立即开始下一次匹配的搜索，而不是从包含预查的字符之后开始。
    // Windows(?!95|98|NT|2000)/.exec('Windows345') => ["Windows"]  /Windows(?!95|98|NT|2000)/.exec('Windows95') => null

    //(?:pattern) 匹配 pattern 但不获取匹配结果，也就是说这是一个非获取匹配，不进行存储供以后使用。这在使用 "或" 字符 (|) 来组合一个模式的各个部分是很有用。
    // 例如， 'industr(?:y|ies) 就是一个比 'industry|industries' 更简略的表达式。
    // industr(?:y|ies)/.exec('industries') -> ["industries"]  /industr(?:y|ies)/.exec('industrsssss') -> null


    var Zepto = function () {
        var undefined;
        var key;
        var $;
        var classList;
        var emptyArray = [];
        var concat = emptyArray.concat;
        var filter = emptyArray.filter;
        var slice = emptyArray.slice;
        var document = window.document;
        var elementDisplay = {};
        var classCache = {};
        var cssNumber = {
            'column-count': 1,
            'columns': 1,
            'font-weight': 1,
            'line-height': 1,
            'opacity': 1,
            'z-index': 1,
            'zoom': 1
        };

        //匹配开头以 空格(零次或多次) <(字符串) (\w+|!)(任意单词或者什么都没有) [^>]* (>字符串零次或多次) >(字符串)
        var fragmentRE = /^\s*<(\w+|!)[^>]*>/;   //匹配html标签

        //匹配开头以 <(字符串)  (\w+)(任意单词）\s*(空格零次或多次)  /?(/字符串零次或一次) (?:<\/\1>|)(匹配</1> 或者 什么都没有)
        var singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;

        //
        var tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;

        //匹配body 或者 html
        var rootNodeRE = /^(?:body|html)$/i;

        //获取奇数次 ？ capitalRE.exec('A') -> ["A","A"]  capitalRE.exec('A') -> null  capitalRE.exec('A') -> ["A","A"] capitalRE.exec('A') -> null
        var capitalRE = /([A-Z])/g;

        // [A-Z]/g.exec('SDF') -> ["S"]   [A-Z]/g.exec('SDF') -> ["S"]   [A-Z]/g.exec('SDF') -> ["S"]


        //应通过方法调用获取/设置的特殊属性
        var methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'];

        var adjacencyOperators = ['after', 'prepend', 'before', 'append'];

        var table = document.createElement('table');
        var tableRow = document.createElement('tr');
        var containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        };
        var readyRE = /complete|loaded|interactive/;
        var simpleSelectorRE = /^[\w-]*$/;  // w 匹配包括下划线的任何单词字符。等价于'[A-Za-z0-9_]'； - 连字符串 ；  * 等价于{0,} , 零次或多次；
        var class2type = {};
        var toString = class2type.toString;
        var zepto = {};
        var camelize;
        var uniq;
        var tempParent = document.createElement('div');
        var propMap = {
            'tabindex': 'tabIndex',
            'readonly': 'readOnly',
            'for': 'htmlFor',
            'class': 'className',
            'maxlength': 'maxLength',
            'cellspacing': 'cellSpacing',
            'cellpadding': 'cellPadding',
            'rowspan': 'rowSpan',
            'colspan': 'colSpan',
            'usemap': 'useMap',
            'frameborder': 'frameBorder',
            'contenteditable': 'contentEditable'
        };
        var isArray = Array.isArray || function (object) {
                return object instanceof Array
            };

        zepto.matches = function (element, selector) {
            
            if (!selector || !element || element.nodeType !== 1) {
                return false
            }

            //该Element.matches()方法,如果元素会由指定的选择器字符串来选择返回true; 否则，返回false。
            var matchesSelector = element.matches || element.webkitMatchesSelector ||
                element.mozMatchesSelector || element.oMatchesSelector ||
                element.matchesSelector;

            //如果存在
            if (matchesSelector) {
                return matchesSelector.call(element, selector)
            } else {
                var match, parent = element.parentNode, temp = !parent;
                if (temp) {
                    (parent = tempParent).appendChild(element);
                }
                match = ~zepto.qsa(parent, selector).indexOf(element);
                temp && tempParent.removeChild(element);
                return match;
            }
        };

        //判断类型
        function type(obj) {
            return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object";
        }

        //判断是否是函数
        function isFunction(value) {
            return type(value) == "function";
        }

        //判断是否是window
        function isWindow(obj) {
            return obj != null && obj == obj.window;
        }

        //判断是否是document
        function isDocument(obj) {
            return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
        }

        //判断是否是object
        function isObject(obj) {
            return type(obj) == "object";
        }

        //判断是否是普通object
        function isPlainObject(obj) {
            
            return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
        }

        //普通对象 ： {} ； 非普通对象 ： 如 new Function()

        //判断是否是数组 , 排除类数组
        function likeArray(obj) {
            var length = !!obj && 'length' in obj && obj.length;
            var type = $.type(obj);

            return 'function' != type && !isWindow(obj) && (
                    'array' == type || length === 0 ||
                    (typeof length == 'number' && length > 0 && (length - 1) in obj)
                );
        }

        //数组中去掉 null
        function compact(array) {
            return filter.call(array, function (item) {
                return item != null
            });
        }

        function flatten(array) {
            return array.length > 0 ? $.fn.concat.apply([], array) : array;
        }

        // - 转换 驼峰
        camelize = function (str) {
            return str.replace(/-+(.)?/g, function (match, chr) {
                return chr ? chr.toUpperCase() : ''
            });
        };


        function dasherize(str) {
            
            return str.replace(/::/g, '/')
                .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
                .replace(/([a-z\d])([A-Z])/g, '$1_$2')
                .replace(/_/g, '-')
                .toLowerCase();
        }

        uniq = function (array) {
            return filter.call(array, function (item, idx) {
                return array.indexOf(item) == idx;
            });
        };

        function classRE(name) {
            if (name in classCache) {
                return classCache[name];
            } else {
                return classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
            }
        }

        function maybeAddPx(name, value) {
            return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
        }

        //`$ .zepto.fragment`需要一个html字符串和一个可选的标签名
        //从给定的html字符串生成DOM节点。
        //生成的DOM节点作为数组返回。
        //此函数可以在插件中覆盖，例如make
        //它与不完全支持DOM的浏览器兼容。
        zepto.fragment = function (html, name, properties) {
            // 
            var dom, nodes, container;
            

            //单个标记的特殊情况优化s
            if (singleTagRE.test(html)) {
                dom = $(document.createElement(RegExp.$1));
            }

            if (!dom) {
                if (html.replace) {
                    html = html.replace(tagExpanderRE, "<$1></$2>");
                }
                if (name === undefined) {
                    name = fragmentRE.test(html) && RegExp.$1
                }
                if (!(name in containers)) {
                    name = '*'
                }

                container = containers[name];
                container.innerHTML = '' + html;

                dom = $.each(slice.call(container.childNodes), function () {
                    
                    container.removeChild(this)
                });
                // dom = $.each(slice.call(container.childNodes),function (){
                //     container.removeChild(this)
                // });
            }

            //如果是普通对象
            if (isPlainObject(properties)) {
                nodes = $(dom);
                $.each(properties, function (key, value) {
                    if (methodAttributes.indexOf(key) > -1) {
                        nodes[key](value);
                    } else {
                        nodes.attr(key, value);
                    }
                });
            }

            return dom;
        };


        function defaultDisplay(nodeName) {
            
            var element;
            var display;
            if (!elementDisplay[nodeName]) {
                element = document.createElement(nodeName);
                document.body.appendChild(element);
                display = getComputedStyle(element, '').getPropertyValue("display");
                element.parentNode.removeChild(element);
                display == "none" && (display = "block");
                elementDisplay[nodeName] = display;
            }
            return elementDisplay[nodeName]
        }

        function children(element) {
            
            return 'children' in element ?
                slice.call(element.children) :
                $.map(element.childNodes, function (node) {
                    if (node.nodeType == 1) {
                        return node;
                    }
                });
        }

        function Z(dom, selector) {
            // 
            var i, len = dom ? dom.length : 0;
            for (i = 0; i < len; i++) {
                this[i] = dom[i];
            }
            this.length = len;
            this.selector = selector || ''
        }

        // `$ .zepto.init`是Zepto的对应的jQuery的`$ .fn.init`和
        // 接受一个CSS选择器和一个可选的上下文（并处理各种特殊情况）。
        // 此方法可以在插件中覆盖。
        zepto.init = function (selector, context) {
            // 
            var dom;
            //如果没有给出，返回一个空的Zepto集合
            if (!selector) {
                return zepto.Z();
            } else if (typeof selector == 'string') {
                selector = selector.trim();
                //如果它是一个html片段，从它创建节点
                //注意：在Chrome 21和Firefox 15中，DOM错误12
                //如果片段不以<开头，则抛出
                if (selector[0] == '<' && fragmentRE.test(selector)) {
                    dom = zepto.fragment(selector, RegExp.$1, context);
                    selector = null;
                    //如果有上下文，首先在该上下文上创建一个集合，然后从那里选择节点
                } else if (context !== undefined) {
                    $(context).find(selector);

                    //如果它是一个CSS选择器，使用它来选择节点。
                } else {
                    dom = zepto.qsa(document, selector);
                }

                //如果给定一个函数，当DOM准备就绪时调用它
            } else if (isFunction(selector)) {
                // 
                return $(document).ready(selector);
                //如果给出了Zepto集合，只需返回它
            } else if (zepto.isZ(selector)) {
                return selector;
            } else {
                //如果给出了节点数组，则归一化数组
                if (isArray(selector)) {
                    dom = compact(selector);
                    //包裹dom节点
                } else if (isObject(selector)) {
                    dom = [selector];
                    selector = null;
                    //如果它是一个html片段，从它创建节点
                } else if (fragmentRE.test(selector)) {
                    dom = zepto.fragment(selector.trim(), RegExp.$1, context);
                    selector = null;
                    //如果有上下文，首先在该上下文上创建一个集合，然后从那里选择节点
                } else if (context !== undefined) {
                    return $(context).find(selector);
                    //最后但并非最不重要的，如果它是一个CSS选择器，使用它来选择节点。
                } else {
                    dom = zepto.qsa(document, selector);
                }
            }

            //从找到的节点创建一个新的Zepto集合
            return zepto.Z(dom, selector);
        };


        // `$ .zepto.Z'用`$ .fn'换出给定的`dom`数组的原型，
        // 从而为数组提供所有的Zepto函数。
        // 此方法可以在插件中覆盖。
        zepto.Z = function (dom, selector) {
            return new Z(dom, selector);
        };

        // `$ .zepto.isZ`应该返回`true`如果给定的对象是Zepto集合。
        // 此方法可以在插件中覆盖。
        zepto.isZ = function (object) {
            return object instanceof zepto.Z;
        };


        // `$`将是基本的Zepto对象。 当调用这个
        // 函数只是调用`$ .zepto.init，
        // 这使得实现选择节点和创建在插件中可修补的Zepto集合的细节。
        $ = function (selector, context) {
            return zepto.init(selector, context)
        };

        //实现多层对象拷贝
        function extend(target, source, deep) {
            for (key in source) {
                // 
                //如果满足条件 ， 则执行深复制
                if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                    if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                        target[key] = {};
                    }

                    if (isArray(source[key]) && !isArray(target[key])) {
                        target[key] = [];
                    }

                    extend(target[key], source[key], deep);
                } else if ((source[key] !== undefined)) {
                    target[key] = source[key];
                }
            }
        }

        //将所有未定义的属性从一个或多个对象复制到`target`对象。
        $.extend = function (target) {
            // 
            var deep;
            var args = slice.call(arguments, 1);
            if (typeof target == 'boolean') {
                deep = target;
                target = args.shift();
            }

            args.forEach(function (arg) {
                // 
                extend(target, arg, deep);
            });

            return target;
        };


        // `$ .zepto.qsa`是Zepto的CSS选择器实现
        // 使用`document.querySelectorAll`并对某些特殊情况（例如`＃id`）进行优化。
        // 此方法可以在插件中覆盖。
        zepto.qsa = function (element, selector) {
            var found;
            var result;
            var maybeID = selector[0] == '#';
            var maybeClass = !maybeID && selector[0] == '.';
            var nameOnly = maybeID || maybeClass ? selector.slice(1) : selector;  //确保仍然选中1个字符的标签名称
            var isSimple = simpleSelectorRE.test(nameOnly);

            //先判断是否是id
            if (element.getElementById && isSimple && maybeID) {
                found = element.getElementById(nameOnly);
                if (found) {
                    result = [found];
                } else {
                    result = [];
                }
            } else {
                if (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) {
                    result = [];
                } else {
                    var elementList;
                    if (isSimple && !maybeID && element.getElementsByClassName) {
                        //如果它很简单，它可能是一个类
                        if (maybeClass) {
                            elementList = element.getElementsByClassName(nameOnly);
                            //或标签名
                        } else {
                            elementList = element.getElementsByTagName(selector);
                        }
                        //或者它不简单，我们需要查询所有
                    } else {
                        elementList = element.querySelectorAll(selector);
                    }
                    result = slice.call(elementList);
                }
            }

            return result;

            // 三元运算符的做法 代码及其难以理解
            // return (element.getElementById && isSimple && maybeID) ?   // Safari DocumentFragment没有getElementById
            //     ((found = element.getElementById(nameOnly)) ? [found] : [] ) :
            //     (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
            //         slice.call(
            //             isSimple && !maybeID && element.getElementsByClassName ?
            //                 maybeClass ? element.getElementsByClassName(nameOnly) :    //如果它很简单，它可能是一个类
            //                     element.getElementsByTagName(selector) : //或标签名
            //                 element.querySelectorAll(selector)   //或者它不简单，我们需要查询所有
            //         );
        };

        function filtered(nodes, selector) {
            return selector == null ? $(nodes) : $(nodes).filter(selector);
        }

        //包含
        $.contains = document.documentElement.contains ?
            function contains(parent, node) {
                // 
                return parent !== node && parent.contains(node)
            } :
            function contains(parent, node) {
                while (node && (node = node.parentNode)) {
                    if (node === parent) {
                        return true
                    }
                }
                return false;
            };

        function funcArg(context, arg, idx, payload) {
            
            return isFunction(arg) ? arg.call(context, idx, payload) : arg;
        }

        //设置属性
        function setAttribute(node, name, value) {
            // 
            value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
        }

        //访问className属性，同时遵守SVGAnimatedString
        function className(node, value) {
            
            var klass = node.className || '';
            var svg = klass && klass.baseVal !== undefined;

            if (value === undefined) {
                if (svg) {
                    return klass.baseVal;
                } else {
                    return klass;
                }
            }

            if (svg) {
                klass.baseVal = value;
            } else {
                node.className = value;
            }
        }

        // "true"  => true
        // "false" => false
        // "null"  => null
        // "42"    => 42
        // "42.5"  => 42.5
        // "08"    => "08"
        // JSON    => parse if valid
        // String  => self
        function deserializeValue(value) {
            try {
                var result;
                if (value) {
                    if (value == "false") {
                        result = false;
                    } else if (value == "null") {
                        result = null;
                    } else if (+value + "" == value) {
                        result = +value;
                    } else if (/^[\[\{]/.test(value)) {
                        result = $.parseJSON(value);
                    } else {
                        result = value;
                    }

                    return value == "true" || result;

                } else {
                    return value;
                }
            } catch (e) {
                return value
            }
        }

        $.type = type;
        $.isFunction = isFunction;
        $.isWindow = isWindow;
        $.isArray = isArray;
        $.isPlainObject = isPlainObject;

        //判断是否是空对象
        $.isEmptyObject = function (obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        };

        //判断是否是数字
        $.isNumeric = function (value) {
            var num = Number(value);
            var type = typeof value;
            return num != null &&
                type != 'boolean' &&
                (type != 'string' || value.length) && !isNaN(num) &&
                isFinite(num) || false
        };

        //在数组里面
        $.inArray = function (elem, array, i) {
            return emptyArray.indexOf.apply(array, elem, i);
        };

        //空函数
        $.noop = function () {
        };


        //map 遍历
        $.map = function (elements, callback) {
            
            var value, values = [], i, len, key;
            if (likeArray(elements)) {
                for (i = 0, len = elements.length; i < len; i++) {
                    value = callback(elements[i], i);
                    if (value != null) {
                        values.push(value);
                    }
                }
            } else {
                for (key in elements) {
                    value = callback(elements[key], key);
                    if (value != null) {
                        values.push(value);
                    }
                }
            }

            return flatten(values);

        };

        //each遍历
        $.each = function (elements, callback) {
            
            var i, len, key;
            if (likeArray(elements)) {
                for (i = 0, len = elements.length; i < len; i++) {
                    if (callback.call(elements[i], i, elements[i]) === false) {
                        return elements
                    }
                }
            } else {
                for (key in elements) {
                    
                    if (callback.call(elements[key], key, elements[key]) === false) {
                        return elements
                    }
                }
            }
            return elements;
        };

        //获取一个只包含回调函数返回true的项目的新数组。
        $.grep = function (elements, callback) {
            return filter.call(elements, callback);
        };


        if (window.JSON) $.parseJSON = JSON.parse;

        //把类型放进数组
        $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase()
        });

        // 定义将在所有可用的方法
        // Zepto集合
        $.fn = {
            constructor: zepto.Z,
            length: 0,

            //因为一个集合的行为就像一个数组
            //复制这些有用的数组函数。
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            sort: emptyArray.sort,
            splice: emptyArray.splice,
            indexOf: emptyArray.indexOf,
            concat: function () {
                var i, value, args = [];
                for (i = 0; i < arguments.length; i++) {
                    value = arguments[i];
                    args[i] = zepto.isZ(value) ? value.toArray() : value;
                }
                return concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
            },

            //`map`和`slice`在jQuery API工作不同于它们的数组对应
            map: function (fn) {
                
                return $($.map(this, function (el, i) {
                    return fn.call(el, i, el);
                }));
            },
            slice: function (fn) {
                
                return $(slice.apply(this, arguments));
            },

            ready: function (callback) {
                // 
                //需要检查document.body是否存在IE浏览器报告
                //文档准备好，当它还没有创建body元素
                if (readyRE.test(document.readyState) && document.body) {
                    callback($);
                } else {
                    document.addEventListener('DOMContentLoaded', function () {
                        callback($);
                    }, false);
                }
                return this;
            },
            get: function (idx) {
                
                return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
            },
            toArray: function () {
                return this.get()
            },
            size: function () {
                return this.length;
            },
            remove: function remove() {
                // 
                return this.each(function remove() {
                    if (this.parentNode != null) {
                        this.parentNode.removeChild(this);
                    }
                });
            },
            each: function (callback) {
                
                emptyArray.every.call(this, function (el, idx) {
                    
                    return callback.call(el, idx, el) !== false
                });
                return this
            },
            filter: function (selector) {
                
                if (isFunction(selector)) {
                    return this.not(this.not(selector));
                } else {
                    return $(filter.call(this, function (element) {
                        
                        return zepto.matches(element, selector);
                    }));
                }
            },
            add: function (selector, context) {
                return $(uniq(this.concat($(selector, context))));
            },
            is: function (selector) {
                return this.length > 0 && zepto.matches(this[0], selector)
            },
            not: function (selector) {
                
                var nodes = [];
                if (isFunction(selector) && selector.call != undefined) {
                    this.each(function (idx) {
                        if (!selector.call(this, idx)) {
                            nodes.push(this);
                        }
                    });
                } else {
                    var excludes;
                    if (typeof selector == 'string') {
                        excludes = this.filter(selector);
                    } else {
                        if (likeArray(selector) && isFunction(selector.item)) {
                            excludes = slice.call(selector);
                        } else {
                            excludes = $(selector);
                        }
                    }
                    this.forEach(function (el) {
                        if (excludes.indexOf(el) < 0) {
                            nodes.push(el);
                        }
                    });
                }
                return $(nodes);
            },
            has: function (selector) {
                return this.filter(function () {
                    if (isObject(selector)) {
                        return $.contains(this, selector);
                    } else {
                        return $(this).find(selector).size();
                    }
                });
            },
            eq: function (idx) {
                return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
            },
            first: function () {
                var el = this[0];
                return el && !isObject(el) ? el : $(el);
            },
            last: function () {
                var el = this[this.length - 1];
                return el && !isObject(el) ? el : $(el);
            },
            find: function (selector) {
                
                var result;
                var $this = this;
                if (!selector) {
                    result = $();
                } else if (typeof selector == 'object') {
                    result = $(selector).filter(function () {
                        var node = this;
                        return emptyArray.some.call($this, function (parent) {
                            return $.contains(parent, node)
                        });
                    });
                } else if (this.length === 1) {
                    result = $(zepto.qsa(this[0], selector));
                } else {
                    result = this.map(function (index, item) {
                        // console.log(item, 'item');
                        // console.log(this, 'this');
                        return zepto.qsa(this, selector)
                    });
                }

                return result;
            },
            closest: function (selector, context) {
                
                var nodes = [];
                var collection = typeof selector == 'object' && $(selector);
                this.each(function (_, node) {
                    
                    while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) {
                        node = node !== context && !isDocument(node) && node.parentNode;
                    }
                    if (node && nodes.indexOf(node) < 0) {
                        nodes.push(node);
                    }
                });
                return $(nodes);
            },
            parents: function (selector) {
                
                var ancestors = [];
                var nodes = this;
                while (nodes.length > 0) {
                    nodes = $.map(nodes, function (node) {
                        
                        if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                            ancestors.push(node);
                            return node;
                        }
                    });
                }
                return filtered(ancestors, selector);
            },
            parent: function (selector) {
                
                return filtered(uniq(this.pluck('parentNode')), selector);
            },
            children: function (selector) {
                
                return filtered(this.map(function () {
                    
                    return children(this);
                }), selector);
            },
            contents: function () {
                
                return this.map(function () {
                    
                    return this.contentDocument || slice.call(this.childNodes);
                });
            },
            siblings: function (selector) {
                
                return filtered(this.map(function (i, el) {
                    
                    return filter.call(children(el.parentNode), function (child) {
                        
                        return child !== el;
                    });
                }), selector);
            },
            empty: function () {
                return this.each(function () {
                    this.innerHTML = ''
                })
            },
            show: function () {
                
                this.each(function () {

                    this.style.display == "none" && (this.style.display = '');
                    if (getComputedStyle(this, '').getPropertyValue("display") == "none") {
                        this.style.display = defaultDisplay(this.nodeName);
                    }
                });
            },
            pluck: function (property) {     //采取
                return $.map(this, function (el) {
                    return el[property];
                });
            },
            replaceWith: function (newContent) {
                
                return this.before(newContent).remove();
            },
            wrap: function (structure) {
                
                var node;
                var func = isFunction(structure);
                if (this[0] && !func) {
                    var dom = $(structure).get(0);
                    var clone = dom.parentNode || this.length > 1;
                }
                return this.each(function (index) {
                    
                    if (func) {
                        node = structure.call(this, index)
                    } else {
                        if (clone) {
                            node = dom.cloneNode(true)
                        } else {
                            node = dom;
                        }
                    }
                    $(this).wrapAll(node);
                });
            },
            wrapAll: function (structure) {
                if (this[0]) {
                    structure = $(structure);
                    $(this[0]).before(structure);
                    debugger
                    var children;
                    //向下钻取到大多数元素
                    while ((children = structure.children()).length) {
                        
                        structure = children.first();
                    }
                    $(structure).append(this);
                }
            },
            wrapInner: function (structure) {
                var func = isFunction(structure);
                return this.each(function (index) {
                    var self = $(this);
                    var contents = self.contents();
                    var dom;

                    if (func) {
                        dom = structure.call(this, index);
                    } else {
                        dom = structure;
                    }

                    if (contents.length) {
                        contents.wrapAll(dom)
                    } else {
                        self.append(dom);
                    }
                });
            },
            unwrap: function () {
                
                this.parent().each(function () {
                    
                    $(this).replaceWith($(this).children());
                });
                return this
            },
            clone: function () {
                return this.map(function () {
                    return this.cloneNode(true);
                });
            },
            hide: function () {
                return this.css("display", "none");
            },
            toggle: function (setting) {
                return this.each(function () {
                    var el = $(this);
                    if (setting === undefined) {
                        setting = el.css("display") == "none";
                    }

                    if (setting) {
                        el.show();
                    } else {
                        el.hide();
                    }
                });
            },
            prev: function (selector) {
                return $(this.pluck('previousElementSibling')).filter(selector || '*');
            },
            next: function (selector) {
                return $(this.pluck('nextElementSibling')).filter(selector || '*');
            },
            html: function (html) {
                if (0 in arguments) {
                    return this.each(function (idx) {
                        var originHtml = this.innerHTML;
                        $(this).empty().append(funcArg(this, html, idx, originHtml));
                    });
                } else {
                    if (0 in this) {
                        return this[0].innerHTML;
                    } else {
                        return null;
                    }
                }
            },
            text: function (text) {
                if (0 in arguments) {
                    return this.each(function (idx) {
                        var newText = funcArg(this, text, idx, this.textContent);
                        this.textContent = newText == null ? '' : '' + newText;
                    });
                } else {
                    if (0 in this) {
                        return this.pluck('textContent').join("");
                    } else {
                        return null;
                    }
                }
            },
            //设置属性
            attr: function (name, value) {
                var result;
                //判断 name 是否是字符串 && value存在
                if (typeof name == 'string' && !(1 in arguments)) {
                    var attrBute = this[0].getAttribute(name);
                    if (0 in this && this[0].nodeType == 1 && attrBute != null) {
                        result = attrBute;
                    }
                } else {
                    result = this.each(function attr(idx) {
                        if (this.nodeType !== 1) {
                            return;
                        }

                        //如果是对象
                        if (isObject(name)) {
                            for (var key in name) {
                                setAttribute(this, key, name[key]);
                            }
                        } else {
                            setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
                        }
                    });
                }

                return result;
            },
            removeAttr: function (name) {
                return this.each(function () {
                    
                    this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
                        
                        setAttribute(this, attribute);
                    }, this);
                });
            },
            prop: function (name, value) {
                
                name = propMap[name] || name;
                if (1 in arguments) {
                    return this.each(function (idx) {
                        
                        this[name] = funcArg(this, value, idx, this[name])
                    });
                } else {
                    return this[0] && this[0][name];
                }
            },
            removeProp: function (name) {
                name = propMap[name] || name;
                return this.each(function () {
                    delete this[name];
                });
            },
            data: function (name, value) {
                var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase();
                var data;

                if (1 in arguments) {
                    data = this.attr(attrName, value);
                } else {
                    data = this.attr(attrName);
                }

                if (data !== null) {
                    return deserializeValue(data)
                } else {
                    return undefined;
                }
            },
            val: function (value) {
                if (0 in arguments) {
                    if (value == null) {
                        value = "";
                    }
                    return this.each(function (idx) {
                        this.value = funcArg(this, value, idx, this.value);
                    });
                } else {
                    if (this[0] && this[0].multiple) {
                        return $(this[0]).find('option').filter(function () {
                            return this.selected
                        }).pluck('value');
                    } else {
                        return this[0].value;
                    }
                }
            },
            offset: function (coordinates) {
                if (coordinates) {
                    return this.each(function (index) {
                        var $this = $(this);
                        var coords = funcArg(this, coordinates, index, $this.offset());
                        var parentOffset = $this.offsetParent().offset();
                        var props = {
                            top: coords.top - parentOffset.top,
                            left: coords.left - parentOffset.left
                        };

                        if ($this.css('position') == 'static') {
                            props['position'] = 'relative';
                        }

                        $this.css(props);

                    });
                }

                if (!this.length) {
                    return null;
                }

                if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0])) {
                    return {top: 0, left: 0};
                }

                var obj = this[0].getBoundingClientRect();
                return {
                    left: obj.left + window.pageXOffset,
                    top: obj.top + window.pageYOffset,
                    width: Math.round(obj.width),
                    height: Math.round(obj.height)
                }
            },
            css: function (property, value) {
                //如果是一个参数
                if (arguments.length < 2) {
                    var element = this[0];
                    if (typeof property == 'string') {
                        if (!element) {
                            return;
                        }
                        return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property);
                        //对于数组
                    } else if (isArray(property)) {
                        if (!element) {
                            return;
                        }
                        var props = {};
                        var computedStyle = getComputedStyle(element, '');
                        $.each(property, function (_, prop) {
                            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop));
                        });
                        return props;
                    }
                }

                var css = '';

                if (type(property) == 'string') {
                    if (!value && value !== 0) {
                        this.each(function () {
                            this.style.removeProperty(dasherize(property));
                        });
                    } else {
                        css = css + dasherize(property) + ":" + maybeAddPx(property, value);
                    }
                    //对于对象
                } else {
                    for (key in property) {
                        if (!property[key] && property[key] !== 0) {
                            this.each(function () {
                                this.style.removeProperty(dasherize(key))
                            });
                        } else {
                            css = css + dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
                        }
                    }
                }

                return this.each(function () {
                    this.style.cssText += ';' + css;
                });
            },
            index: function (element) {
                if (element) {
                    return this.indexOf($(element)[0]);
                } else {
                    return this.parent().children().indexOf(this[0]);
                }
            },
            hasClass: function (name) {
                
                if (!name) {
                    return this;
                } else {
                    return emptyArray.some.call(this, function (el) {
                        return this.test(className(el));
                    }, classRE(name));
                }
            },
            addClass: function (name) {
                if (!name) {
                    return this;
                } else {
                    this.each(function (idx) {
                        if (!('className' in this)) {
                            return;
                        }
                        classList = [];
                        var cls = className(this);
                        var newName = funcArg(this, name, idx, cls);
                        newName.split(/\s+/g).forEach(function (klass) {
                            if (!$(this).hasClass(klass)) {
                                classList.push(klass)
                            }
                        }, this);
                        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
                    });
                }
            },
            removeClass: function (name) {
                return this.each(function (idx) {
                    
                    if (!('className' in this)) {
                        return;
                    }

                    if (name === undefined) {
                        return className(this, '');
                    }

                    classList = className(this);

                    funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
                        
                        classList = classList.replace(classRE(klass), " ");
                    });

                    className(this, classList.trim());

                });
            },
            toggleClass: function (name, when) {
                if (!name) {
                    return this;
                } else {
                    return this.each(function (idx) {
                        
                        var $this = $(this);
                        var names = funcArg(this, name, idx, className(this));
                        names.split(/\s+/g).forEach(function (klass) {
                            
                            if (when === undefined) {
                                when = !$this.hasClass(klass);
                            }

                            if (when) {
                                $this.addClass(klass);
                            } else {
                                $this.removeClass(klass);
                            }
                        });
                    });
                }
            },
            scrollTop: function (value) {
                if (this.length) {
                    var hasScrollTop = 'scrollTop' in this[0];
                    var scrollTopFun;
                    if (value === undefined) {
                        if (hasScrollTop) {
                            return this[0].scrollTop;
                        } else {
                            return this[0].pageYOffset;
                        }
                    }

                    if (hasScrollTop) {
                        scrollTopFun = function scrollTopFun() {
                            this.scrollTop = value;
                        }
                    } else {
                        scrollTopFun = function scrollTopFun() {
                            this.scrollTo(this.scrollX, value);
                        }
                    }

                    return this.each(scrollTopFun);
                }
            },
            scrollLeft: function (value) {
                if (this.length) {
                    var hasScrollLeft = 'scrollLeft' in this[0];
                    var scrollLeftFun;
                    if (value === undefined) {
                        if (hasScrollLeft) {
                            return this[0].scrollLeft;
                        } else {
                            return this[0].pageXOffset;
                        }
                    }

                    if (hasScrollLeft) {
                        scrollLeftFun = function scrollLeftFun() {
                            this.scrollLeft = value;
                        }
                    } else {
                        scrollLeftFun = function scrollLeftFun() {
                            this.scrollTo(value, this.scrollY);
                        }
                    }

                    return this.each(scrollLeftFun);
                }
            },
            position: function () {
                if (this.length) {
                    var elem = this[0];
                    //获取实际父偏移值
                    var offsetParent = this.offsetParent();
                    //获得正确的偏移量
                    var offset = this.offset();
                    var parentOffset;

                    if (rootNodeRE.test(offsetParent[0].nodeName)) {
                        parentOffset = {top: 0, left: 0};
                    } else {
                        parentOffset = offsetParent.offset();
                    }

                    // 减去元素边距
                    // 注意：当元素有margin：auto时offsetLeft和marginLeft
                    // 在Safari中是相同的，导致offset.left不正确地为0
                    offset.top = offset.top - parseFloat($(elem).css('margin-top')) || 0;
                    offset.left = offset.left - parseFloat($(elem).css('margin-left')) || 0;

                    //添加offsetParent边框
                    parentOffset.top = parentOffset.top + parseFloat($(offsetParent[0]).css('border-top-width')) || 0;
                    parentOffset.left = parentOffset.left + parseFloat($(offsetParent[0]).css('border-left-width')) || 0;

                    //减去两个偏移
                    return {
                        top: offset.top - parentOffset.top,
                        left: offset.left - parentOffset.left
                    }
                }
            },
            offsetParent: function () {
                return this.map(function () {
                    var parent = this.offsetParent || document.body;
                    while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") {
                        parent = parent.offsetParent;
                    }
                    return parent;
                });
            }
        };

        // for now
        $.fn.detach = $.fn.remove;

        //生成`width`和`height`函数
        ['width', 'height'].forEach(function (dimension) {
            var dimensionProperty =
                dimension.replace(/./, function (m) {
                    return m[0].toUpperCase()
                });

            $.fn[dimension] = function (value) {
                var offset;
                var el = this[0];

                //获取宽度
                if (value === undefined) {
                    if (isWindow(el)) {
                        return el['inner' + dimensionProperty];
                    } else if (isDocument(el)) {
                        return el.documentElement['scroll' + dimensionProperty];
                    } else {
                        offset = this.offset();
                        return offset && offset[dimension];
                    }

                    //设置宽度
                } else {
                    return this.each(function (idx) {
                        el = $(this);
                        el.css(dimension, funcArg(this, value, idx, el[dimension]()));
                    });
                }
            };
        });


        //遍历节点
        function traverseNode(node, fun) {
            fun(node);
            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                traverseNode(node.childNodes[i], fun);
            }
        }


        //生成`after`，`prepend`，`before`，`append`，
        //`insertAfter`，`insertBefore`，`appendTo`和`prependTo`方法。
        adjacencyOperators.forEach(function (operator, operatorIndex) {
            var inside = operatorIndex % 2; //=> prepend, append
            $.fn[operator] = function () {
                
                //参数可以是节点，节点数组，Zepto对象和HTML字符串
                var argType;
                var parent;
                var copyByClone = this.length > 1;
                var nodes = $.map(arguments, function (arg) {
                    
                    var arr = [];
                    argType = type(arg);
                    //数组
                    if (argType == "array") {
                        arg.forEach(function (el) {
                            
                            if (el.nodeType !== undefined) {
                                return arr.push(el);
                            } else if ($.zepto.isZ(el)) {
                                return arr = arr.concat(el.get());
                            }
                            arr = arr.concat(zepto.fragment(el));
                        });
                        return arr;
                    }

                    if (argType == "object" || arg == null) {
                        return arg;
                    } else {
                        return zepto.fragment(arg);
                    }
                });


                if (nodes.length < 1) {
                    return this;
                }

                return this.each(function (_, target) {
                    
                    parent = inside ? target : target.parentNode;

                    //将所有方法转换为“before”操作
                    if (operatorIndex != 2) {
                        if (operatorIndex == 0) {
                            target = target.nextSibling;
                        } else if (operatorIndex == 1) {
                            target = target.firstChild;
                        } else {
                            target = null;
                        }
                    }

                    var parentInDocument = $.contains(document.documentElement, parent);

                    nodes.forEach(function (node) {
                        
                        if (copyByClone) {
                            node = node.cloneNode(true);
                        } else if (!parent) {
                            return $(node).remove();
                        }

                        parent.insertBefore(node, target);

                        if (parentInDocument) {
                            traverseNode(node, function (el) {
                                if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                                    (!el.type || el.type === 'text/javascript') && !el.src) {
                                    var target = el.ownerDocument ? el.ownerDocument.defaultView : window;
                                    target['eval'].call(target, el.innerHTML);
                                }
                            });
                        }
                    });


                });

            }
        });

        // zepto.Z 原型 和 Z函数原型 指向 $.fn
        zepto.Z.prototype = Z.prototype = $.fn;


        // 导出`$ .zepto`命名空间中的内部API函数
        zepto.uniq = uniq;
        zepto.deserializeValue = deserializeValue;
        $.zepto = zepto;

        return $

    }();


    window.Zepto = Zepto;
    window.$ === undefined && (window.$ = Zepto);


    //事件处理
    (function ($) {
        var _zid = 1;
        var undefined;
        var slice = Array.prototype.slice;
        var isFunction = $.isFunction;
        var isString = function (obj) {
            return typeof obj == 'string'
        };
        var handlers = {};
        var specialEvents = {};
        var focusinSupported = 'onfocusin' in window;
        var focus = {focus: 'focusin', blur: 'focusout'};
        var hover = {mouseenter: 'mouseover', mouseleave: 'mouseout'};

        specialEvents.click
            = specialEvents.mousedown
            = specialEvents.mouseup
            = specialEvents.mousemove = 'MouseEvents';

        function zid(element) {
            return element._zid || (element._zid = _zid = _zid + 1);
        }

        //查找处理程序
        function findHandlers(element, event, fn, selector) {
            // 
            event = parse(event);
            if (event.ns) {
                var matcher = matcherFor(event.ns);
            }

            return (handlers[zid(element)] || []).filter(function (handler) {
                // 
                return handler
                    && (!event.e || handler.e == event.e)
                    && (!event.ns || matcher.test(handler.ns))
                    && (!fn || zid(handler.fn) === zid(fn))
                    && (!selector || handler.sel == selector);
            });
        }

        function parse(event) {
            
            var parts = ('' + event).split('.');
            return {e: parts[0], ns: parts.slice(1).sort().join(' ')};
        }

        function matcherFor(ns) {
            
            return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
        }

        function eventCapture(handler, captureSetting) {
            
            return handler.del &&
                (!focusinSupported && (handler.e in focus)) || !!captureSetting
        }

        function realEvent(type) {
            
            return hover[type] || (focusinSupported && focus[type]) || type;
        }

        function returnTrue() {
            return true;
        }

        function returnFalse() {
            return false;
        }

        var ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/;
        var eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
        };

        //添加事件
        function add(element, events, fn, data, selector, delegator, capture) {
            // 
            var id = zid(element);
            var set = (handlers[id] || (handlers[id] = []));
            events.split(/\s/).forEach(function (event) {
                // 
                if (event == 'ready') {
                    return $(document).ready(fn);
                }
                var handler = parse(event);
                handler.fn = fn;
                handler.sel = selector;
                //模拟mouseenter，mouseleave
                if (handler.e in hover) {
                    fn = function (e) {
                        var related = e.relatedTarget;
                        if (!related || (related !== this && !$.contains(this, related))) {
                            return handler.fn.apply(this, arguments);
                        }
                    }
                }
                handler.del = delegator;
                var callback = delegator || fn;
                handler.proxy = function (e) {
                    
                    e = compatible(e);
                    if (e.isImmediatePropagationStopped()) {
                        return;
                    }
                    e.data = data;
                    var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
                    if (result === false) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return result;
                };
                handler.i = set.length;
                set.push(handler);
                if ('addEventListener' in element) {
                    element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
                }
            });
        }

        //移除事件
        function remove(element, events, fn, selector, capture) {
            // 
            var id = zid(element);
            (events || '').split(/\s/).forEach(function (event) {
                // 
                var currentHandlers = findHandlers(element, event, fn, selector);
                currentHandlers.forEach(function (handler) {
                    // 
                    delete handlers[id][handler.i];
                    if ('removeEventListener' in element) {
                        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
                    }
                });

            });
        }

        $.event = {add: add, remove: remove};

        $.proxy = function (fn, context) {
            var args = (2 in arguments) && slice.call(arguments, 2);

            //判断fn
            if (isFunction(fn)) {
                var proxyFn = function () {
                    return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments)
                };
                proxyFn._zid = zid(fn);
                return proxyFn;
            } else if (isString(context)) {
                if (args) {
                    args.unshift(fn[context], fn);
                    return $.proxy.apply(null, args);
                } else {
                    return $.proxy(fn[context], fn);
                }
            } else {
                throw new TypeError("expected function");
            }

        };

        //兼容 eventMethods 对象
        function compatible(event, source) {
            
            if (source || !event.isDefaultPrevented) {
                source || (source = event);

                $.each(eventMethods, function (name, predicate) {
                    
                    var sourceMethod = source[name];

                    event[name] = function () {
                        this[predicate] = returnTrue;
                        return sourceMethod && sourceMethod.apply(source, arguments);
                    };

                    event[predicate] = returnFalse;
                });

                event.timeStamp || (event.timeStamp = Date.now());

                var defaults;
                if (source.defaultPrevented !== undefined) {
                    defaults = source.defaultPrevented;
                } else if ('returnValue' in source) {
                    defaults = source.returnValue === false
                } else {
                    defaults = source.getPreventDefault && source.getPreventDefault();
                }

                if (defaults) {
                    event.isDefaultPrevented = returnTrue;
                }
            }
            return event;
        }

        //创建代理
        function createProxy(event) {
            // 
            var key;
            var proxy = {originalEvent: event};

            //拷贝 event 对象
            for (key in event) {
                // 
                if (!ignoreProperties.test(key) && event[key] !== undefined) {
                    proxy[key] = event[key];
                }
            }
            return compatible(proxy, event);
        }

        $.fn.bind = function (event, data, callback) {
            return this.on(event, data, callback)
        };

        $.fn.unbind = function (event, callback) {
            return this.off(event, callback)
        };

        $.fn.one = function (event, selector, data, callback) {
            return this.on(event, selector, data, callback, 1)
        };

        $.fn.delegate = function (selector, event, callback) {
            return this.on(event, selector, callback)
        };

        $.fn.undelegate = function (selector, event, callback) {
            return this.off(event, selector, callback)
        };

        $.fn.live = function (event, callback) {
            $(document.body).delegate(this.selector, event, callback)
            return this
        };

        $.fn.die = function (event, callback) {
            $(document.body).undelegate(this.selector, event, callback)
            return this
        };

        //绑定事件
        $.fn.on = function (event, selector, data, callback, one) {
            
            var autoRemove;
            var delegator;
            var $this = this;

            //如果存在 event 并且不是字符串
            if (event && !isString(event)) {
                $.each(event, function (type, fn) {
                    $this.on(type, selector, data, fn, one);
                });
                return $this;
            }

            //非字符串 && 非函数
            if (!isString(selector) && !isFunction(callback) && callback !== false) {
                callback = data;
                data = selector;
                selector = undefined;
            }

            if (callback === undefined || data === false) {
                callback = data;
                data = undefined;
            }

            if (callback === false) {
                callback = returnFalse;
            }

            return $this.each(function (_, element) {
                // 
                if (one) {
                    autoRemove = function (e) {
                        remove(element, e.type, callback);
                        return callback.apply(this, arguments);
                    }
                }

                if (selector) {
                    //事件代理函数
                    delegator = function (e) {
                        // 
                        var evt;
                        var match = $(e.target).closest(selector, element).get(0);
                        if (match && match !== element) {
                            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element});
                            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
                        }
                    }
                }

                //添加事件
                add(element, event, callback, data, selector, delegator || autoRemove);

            });
        };

        //解除事件
        $.fn.off = function (event, selector, callback) {
            var $this = this;
            //如果存在 event 并且不是字符串
            if (event && !isString(event)) {
                $.each(event, function (type, fn) {
                    $this.off(type, selector, fn)
                });
                return $this
            }

            //非字符串 && 非函数
            if (!isString(selector) && !isFunction(callback) && callback !== false) {
                callback = selector;
                selector = undefined;
            }

            if (callback === false) {
                callback = returnFalse;
            }

            //遍历解除
            return $this.each(function () {
                remove(this, event, callback, selector);
            });
        };


        //触发事件
        $.fn.trigger = function (event, args) {
            
            if (isString(event) || $.isPlainObject(event)) {
                event = $.Event(event);
            } else {
                event = compatible(event);
            }

            event._args = args;

            return this.each(function () {
                
                // handle focus（），blur（）直接调用它们
                if (event.type in focus && typeof this[event.type] == "function") {
                    this[event.type]();
                    //集合中的项目可能不是DOM元素
                } else if ('dispatchEvent' in this) {
                    this.dispatchEvent(event);            //触发事件
                } else {
                    $(this).triggerHandler(event, args);  //触发事件
                }
            });
        };

        //触发当前元素上的事件处理程序，就像发生事件一样，
        //不触发实际事件，不会冒泡
        $.fn.triggerHandler = function (event, args) {
            var e;
            var result;
            var currentHandlers;
            this.each(function (i, element) {
                if (isString(event)) {
                    event = $.Event(event);
                }
                e = createProxy(event);
                e._args = args;
                e.target = element;
                currentHandlers = findHandlers(element, event.type || event);
                $.each(currentHandlers, function (i, handler) {
                    result = handler.proxy(e);
                    if (e.isImmediatePropagationStopped()) {
                        return false;
                    }
                });
            });

            return result;
        };


        //用于每个事件类型的`.bind（event，fn）`的快捷方法
        var eventType = ('focusin focusout focus blur load resize scroll unload click dblclick ' +
        'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
        'change select keydown keypress keyup error');
        eventType.split(' ').forEach(function (event) {
            $.fn[event] = function (callback) {
                if (0 in arguments) {
                    return this.bind(event, callback);
                } else {
                    return this.trigger(event);
                }
            };
        });

        $.Event = function (type, props) {
            
            if (!isString(type)) {
                props = type;
                type = props.type;
            }
            var event = document.createEvent(specialEvents[type] || 'Events');
            var bubbles = true;
            if (props) {
                for (var name in props) {
                    
                    if (name == 'bubbles') {
                        bubbles = !!props[name];
                    } else {
                        event[name] = props[name];
                    }
                }
            }
            event.initEvent(type, bubbles, true);
            return compatible(event);
        };

    })(Zepto);

    //网络层
    (function ($) {
        var jsonpID = +new Date();
        var document = window.document;
        var key;
        var name;
        var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
        var scriptTypeRE = /^(?:text|application)\/javascript/i;
        var xmlTypeRE = /^(?:text|application)\/xml/i;
        var jsonType = 'application/json';
        var htmlType = 'text/html';
        var blankRE = /^\s*$/;
        var originAnchor = document.createElement('a');

        originAnchor.href = window.location.href;

        //触发自定义事件，如果已取消，则返回false
        function triggerAndReturn(context, eventName, data) {
            
            var event = $.Event(eventName);
            $(context).trigger(event, data);
            return !event.isDefaultPrevented();
        }

        //触发Ajax“全局”事件
        function triggerGlobal(settings, context, eventName, data) {
            
            if (settings.global) {
                return triggerAndReturn(context || document, eventName, data);
            }
        }

        //活动Ajax请求数
        $.active = 0;

        //请求开始
        function ajaxStart(settings) {
            if (settings.global && ($.active = $.active + 1) === 0) {
                triggerGlobal(settings, null, 'ajaxStart');
            }
        }

        //请求停止
        function ajaxStop(settings) {
            if (settings.global && !($.active = $.active - 1)) {
                triggerGlobal(settings, null, 'ajaxStop');
            }
        }

        //触发一个额外的全局事件“ajaxBeforeSend”，就像“ajaxSend”，但可取消
        function ajaxBeforeSend(xhr, settings) {
            
            var context = settings.context;
            var _beforeSend = settings.beforeSend.call(context, xhr, settings);
            var _triggerGlobal = triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]);
            if (_beforeSend === false || _triggerGlobal === false) {
                return false;
            }
            triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
        }

        //请求成功
        function ajaxSuccess(data, xhr, settings, deferred) {
            var context = settings.context;
            var status = 'success';
            settings.success.call(context, data, status, xhr);
            if (deferred) {
                deferred.resolveWith(context, [data, status, xhr]);
            }
            triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
            ajaxComplete(status, xhr, settings);
        }

        // 请求失败 type: "timeout", "error", "abort", "parsererror"
        function ajaxError(error, type, xhr, settings, deferred) {
            var context = settings.context;
            settings.error.call(context, xhr, type, error);

            if (deferred) {
                deferred.rejectWith(context, [xhr, type, error]);
            }

            triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type]);
            ajaxComplete(type, xhr, settings);
        }

        //请求完成 status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
        function ajaxComplete(status, xhr, settings) {
            var context = settings.context;
            settings.complete.call(context, xhr, status);
            triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
            ajaxStop(settings);
        }

        //数据过滤器回调
        function ajaxDataFilter(data, type, settings) {
            if (settings.dataFilter == empty) {
                return data;
            }
            var context = settings.context;
            return settings.dataFilter.call(context, data, type);
        }

        //空函数，用作默认回调
        function empty() {

        }

        $.ajaxJSONP = function (options, deferred) {
            if (!('type' in options)) {
                return $.ajax(options);
            }

            var _callbackName = options.jsonpCallback;
            var callbackName;
            var script = document.createElement('script');
            var originalCallback = window[callbackName];
            var responseData;
            var abort = function (errorType) {
                $(script).triggerHandler('error', errorType || 'abort')
            };
            var xhr = {abort: abort};
            var abortTimeout;

            if ($.isFunction(_callbackName)) {
                callbackName = _callbackName();
            } else {
                callbackName = _callbackName || ('Zepto' + (jsonpID++));
            }

            if (deferred) {
                deferred.promise(xhr);
            }

            //定义 script 加载成功 加载失败 事件
            $(script).on('load error', function (e, errorType) {
                
                clearTimeout(abortTimeout);
                $(script).off().remove();

                if (e.type == 'error' || !responseData) {
                    ajaxError(null, errorType || 'error', xhr, options, deferred);
                } else {
                    ajaxSuccess(responseData[0], xhr, options, deferred);
                }

                window[callbackName] = originalCallback;

                if (responseData && $.isFunction(originalCallback)) {
                    originalCallback(responseData[0]);
                }

                originalCallback = responseData = undefined;
            });

            var _ajaxBeforeSend = ajaxBeforeSend(xhr, options);
            if (_ajaxBeforeSend === false) {
                abort('abort');
                return xhr;
            }

            window[callbackName] = function () {
                
                responseData = arguments;
            };

            //测试
            window[callbackName]({
                "name": "chen",
                "age": 20,
                "clothes": {
                    "coat": "coat",
                    "underClothing": "Under clothing",
                    "Shoes": "Shoes"
                }
            });

            script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
            document.head.appendChild(script);

            if (options.timeout > 0) {
                abortTimeout = setTimeout(function () {
                    abort('timeout');
                }, options.timeout);
            }

            return xhr;
        };

        $.ajaxSettings = {
            // 默认请求类型
            type: 'GET',
            // 在请求之前执行的回调
            beforeSend: empty,
            // 如果请求成功，则执行回调
            success: empty,
            // 如果请求失败，则执行回调
            error: empty,
            // 如果请求完成，则执行回调(两者：错误和成功)
            complete: empty,
            // 回调的上下文
            context: null,
            // 是否触发“全局”Ajax事件
            global: false,
            // 运输
            xhr: function () {
                return new window.XMLHttpRequest()
            },
            // MIME类型映射
            // IIS将“Javascript”作为“application / x-javascript”
            accepts: {
                script: 'text/javascript, application/javascript, application/x-javascript',
                json: jsonType,
                xml: 'application/xml, text/xml',
                html: htmlType,
                text: 'text/plain'
            },
            //请求是否是另一个域
            crossDomain: false,
            // 默认超时
            timeout: 0,
            // 数据是否应该序列化为字符串
            processData: true,
            // 是否允许浏览器缓存GET响应
            cache: true,
            //用于处理XMLHttpRequest的原始响应数据。
            //这是一个预过滤功能来清理响应。
            //应返回已清理的响应
            dataFilter: empty
        };

        //获取mime数据类型
        function mimeToDataType(mime) {
            var result;
            if (mime) {
                mime = mime.split(';', 2)[0];
            }

            if (mime == htmlType) {
                result = 'html';
            } else if (mime == jsonType) {
                result = 'json';
            } else if (scriptTypeRE.test(mime)) {
                result = 'script';
            } else if (xmlTypeRE.test(mime)) {
                result = 'xml'
            } else {
                result = 'text';
            }

            return mime && result;
        }

        //追加参数
        function appendQuery(url, query) {
            if (query == '') {
                return url;
            }
            return (url + '&' + query).replace(/[&?]{1,2}/, '?');
        }

        // serialize payload 并将其附加到GET请求的URL
        function serializeData(options) {
            if (options.processData && options.data && $.type(options.data) != "string") {
                options.data = $.param(options.data, options.traditional);
            }
            if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType)) {
                options.url = appendQuery(options.url, options.data);
                options.data = undefined;
            }
        }

        $.ajax = function (options) {
            var settings = $.extend({}, options || {});
            var deferred = $.Deferred && $.Deferred();
            var urlAnchor;
            var hashIndex;

            for (key in $.ajaxSettings) {
                if (settings[key] === undefined) {
                    settings[key] = $.ajaxSettings[key];
                }
            }

            ajaxStart(settings);

            //请求是否是另一个域
            if (!settings.crossDomain) {
                urlAnchor = document.createElement('a');
                urlAnchor.href = settings.url;
                //清理.href的网址（仅限IE） 看 https://github.com/madrobby/zepto/pull/1049
                urlAnchor.href = urlAnchor.href;
                settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
            }

            if (!settings.url) {
                settings.url = window.location.toString();
            }

            hashIndex = settings.url.indexOf('#');
            if (hashIndex > -1) {
                settings.url = settings.url.slice(0, hashIndex);
            }

            //序列化数据
            serializeData(settings);

            var dataType = settings.dataType;
            var hasPlaceholder = /\?.+=\?/.test(settings.url);

            if (hasPlaceholder) {
                dataType = 'jsonp';
            }

            if (settings.cache === false || (
                    (!options || options.cache !== true) &&
                    ('script' == dataType || 'jsonp' == dataType)
                )) {

                settings.url = appendQuery(settings.url, '_=' + Date.now());
            }

            
            //判断是否是jsonp
            if ('jsonp' == dataType) {
                if (!hasPlaceholder) {
                    var jsonpQuery;
                    if (settings.jsonp) {
                        jsonpQuery = settings.jsonp + '=?'
                    } else if (settings.jsonp === false) {
                        jsonpQuery = '';
                    } else {
                        jsonpQuery = 'callback=?';
                    }
                    settings.url = appendQuery(settings.url, jsonpQuery);
                }
                return $.ajaxJSONP(settings, deferred);
            }

            var mime = settings.accepts[dataType];
            var headers = {};
            var setHeader = function (name, value) {
                headers[name.toLowerCase()] = [name, value]
            };
            var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
            var xhr = settings.xhr();
            var nativeSetHeader = xhr.setRequestHeader;
            var abortTimeout;

            if (deferred) {
                deferred.promise(xhr);
            }

            //设置请求头信息
            if (!settings.crossDomain) {
                setHeader('X-Requested-With', 'XMLHttpRequest');
            }

            setHeader('Accept', mime || '*/*');

            if (mime = settings.mimeType || mime) {
                if (mime.indexOf(',') > -1) {
                    mime = mime.split(',', 2)[0];
                }
                //覆盖由服务器返回的MIME类型。
                xhr.overrideMimeType && xhr.overrideMimeType(mime);
            }

            if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET')) {
                setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
            }

            if (settings.headers) {
                for (name in settings.headers) {
                    setHeader(name, settings.headers[name]);
                }
            }

            xhr.setRequestHeader = setHeader;

            
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    xhr.onreadystatechange = empty;
                    clearTimeout(abortTimeout);
                    var result;
                    var error = false;
                    
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                        
                        dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));

                        //判断文件类型
                        if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob') {
                            result = xhr.response;
                        } else {
                            result = xhr.responseText;

                            try {
                                // http://perfectionkills.com/global-eval-what-are-the-options/
                                // 如果提供了数据过滤器回调，则相应地进行响应
                                result = ajaxDataFilter(result, dataType, settings);

                                if (dataType == 'script') {
                                    (1, eval)(result);
                                } else if (dataType == 'xml') {
                                    result = xhr.responseXML;
                                } else if (dataType == 'json') {
                                    if (blankRE.test(result)) {
                                        result = null;
                                    } else {
                                        result = $.parseJSON(result);
                                    }
                                }

                            } catch (e) {
                                error = e;
                            }

                            //处理错误
                            if (error) {
                                return ajaxError(error, 'parsererror', xhr, settings, deferred);
                            }
                        }

                        ajaxSuccess(result, xhr, settings, deferred);

                    } else {
                        ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
                    }
                }
            };

            var _ajaxBeforeSend = ajaxBeforeSend(xhr, settings);
            if (_ajaxBeforeSend === false) {
                //中止请求
                xhr.abort();
                ajaxError(null, 'abort', xhr, settings, deferred);
                return xhr;
            }

            var async = 'async' in settings ? settings.async : true;

            //初始化请求
            xhr.open(settings.type, settings.url, async, settings.username, settings.password);

            if (settings.xhrFields) {
                for (name in settings.xhrFields) {
                    xhr[name] = settings.xhrFields[name];
                }
            }

            // 该XMLHttpRequest.setRequestHeader（）方法设置一个HTTP请求头的值。你必须调用setRequestHeader()后  open()，但在此之前send()。
            // 如果此方法用相同的标题叫了几次，值合并成一个单一的请求头。
            for (name in headers) {
                nativeSetHeader.apply(xhr, headers[name]);
            }

            if (settings.timeout > 0) {
                abortTimeout = setTimeout(function () {
                    xhr.onreadystatechange = empty;
                    xhr.abort();
                    ajaxError(null, 'timeout', xhr, settings, deferred);
                }, settings.timeout);
            }

            // 该XMLHttpRequest.send()方法发送请求。如果请求是异步的（这是默认值），这个方法只要发送请求返回。
            // 如果请求是同步的，这个方法不返回，直到响应到达。
            // send()接受请求主体的可选参数。如果请求方法是GET或HEAD，参数被忽略，请求主体设置为null。

            // 避免发送空字符串（＃319）
            xhr.send(settings.data ? settings.data : null);

            return xhr;

        };

        //处理可选数据/成功参数
        function parseArguments(url, data, success, dataType) {
            if ($.isFunction(data)) {
                dataType = success;
                success = data;
                data = undefined;
            }

            if (!$.isFunction(success)) {
                dataType = success;
                success = undefined;
            }

            return {
                url: url,
                data: data,
                success: success,
                dataType: dataType
            }
        }

        $.get = function (/* url, data, success, dataType */) {
            return $.ajax(parseArguments.apply(null, arguments));
        };

        $.post = function (/* url, data, success, dataType */) {
            var options = parseArguments.apply(null, arguments);
            options.type = 'POST';
            return $.ajax(options);
        };

        //获得通过Ajax GET请求JSON数据
        $.getJSON = function (/* url, data, success, dataType */) {
            var options = parseArguments.apply(null, arguments);
            options.dataType = 'json';
            return $.ajax(options);
        };

        // 设置当前收集的HTML内容到一个GET Ajax调用指定URL的结果。
        // 或者，一个CSS选择器可以在URL中指定，像这样，仅使用HTML内容选择更新集合匹配：
        $.fn.load = function (url, data, success) {
            if (!this.length) {
                return this;
            }

            var self = this;
            var parts = url.split(/\s/);
            var selector;
            var options = parseArguments(url, data, success);
            var callback = options.success;

            if (parts.length > 1) {
                options.url = parts[0];
                selector = parts[1];
            }

            options.success = function (response) {
                self.html(selector ?
                    $('<div>').html(response.replace(rscript, "")).find(selector)
                    : response);
                callback && callback.apply(self, arguments);
            };

            $.ajax(options);
            return this;
        };

        var escape = encodeURIComponent;

        function serialize(params, obj, traditional, scope) {
            var type;
            var array = $.isArray(obj);
            var hash = $.isPlainObject(obj);

            $.each(obj, function (key, value) {
                // 
                type = $.type(value);

                if (scope) {
                    if (traditional) {
                        key = scope;
                    } else {
                        key = scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
                    }
                }

                //以serializeArray（）格式处理数据
                if (!scope && array) {
                    params.add(value.name, value.value);
                    //递归到嵌套对象中
                } else if (type == "array" || (!traditional && type == "object")) {
                    serialize(params, value, traditional, key);
                } else {
                    params.add(key, value);
                }
            });
        }

        $.param = function (obj, traditional) {
            // 
            var params = [];
            params.add = function (key, value) {
                if ($.isFunction(value)) {
                    value = value();
                }
                if (value == null) {
                    value = "";
                }
                this.push(escape(key) + '=' + escape(value))
            };

            serialize(params, obj, traditional);
            return params.join('&').replace(/%20/g, '+');
        }

    })(Zepto);


    (function ($) {
        $.fn.serializeArray = function () {
            var name;
            var type;
            var result = [];
            var add = function (value) {
                if (value.forEach) {
                    return value.forEach(add);
                }
                result.push({name: name, value: value});
            };

            if (this[0]) {
                $.each(this[0].elements, function (_, field) {
                    type = field.type;
                    name = field.name;

                    if (name && field.nodeName.toLowerCase() != 'fieldset' && !field.disabled &&
                        type != 'submit' && type != 'reset' && type != 'button' && type != 'file' &&
                        ((type != 'radio' && type != 'checkbox') || field.checked)) {

                        add($(field).val());
                    }
                });
            }
            return result;
        };

        $.fn.serialize = function () {
            var result = [];
            this.serializeArray().forEach(function (elm) {
                result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
            });

            return result.join('&');
        };

        $.fn.submit = function (callback) {
            if (0 in arguments) {
                this.bind('submit', callback);
            } else if (this.length) {
                var event = $.Event('submit');
                this.eq(0).trigger(event);
                if (!event.isDefaultPrevented()) {
                    this.get(0).submit();
                }
            }
        };

    })(Zepto);


    (function () {
        // getComputedStyle不应该在调用时出错
        // 没有有效的元素作为参数
        try {
            getComputedStyle(undefined);
        } catch (e) {
            var nativeGetComputedStyle = getComputedStyle;
            window.getComputedStyle = function (element, pseudoElement) {
                try {
                    return nativeGetComputedStyle(element, pseudoElement);
                } catch (e) {
                    return null;
                }
            }
        }

    })();

    return Zepto
});