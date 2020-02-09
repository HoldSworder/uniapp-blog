(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/pages.json ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25120200103005","_inBundle":false,"_integrity":"sha512-nYoIrRV2e5o/vzr6foSdWi3Rl2p0GuO+LPY3JctyY6uTKgPnuH99d7aL/QQdJ1SacQjBWO+QGK1qankN7oyrWw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25120200103005.tgz","_shasum":"a77a63481f36474f3e86686868051219d1bb12df","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"6be187a3dfe15f95dd6146d9fec08e1f81100987","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25120200103005"};

/***/ }),
/* 7 */
/*!*****************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/pages.json?{"type":"style"} ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "uni-app", "usingComponents": { "body-content": "/components/bodyer/content" }, "usingAutoImportComponents": {} }, "pages/read/read": { "navigationBarTitleText": "uni-app", "usingComponents": { "u-parse": "/components/gaoyia-parse/parse" }, "usingAutoImportComponents": {} }, "pages/archives/archives": { "navigationBarTitleText": "uni-app", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/about/about": { "navigationBarTitleText": "uni-app", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/iframe/blog": { "navigationBarTitleText": "uni-app", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/iframe/note": { "navigationBarTitleText": "uni-app", "usingComponents": {}, "usingAutoImportComponents": {} }, "pages/iframe/github": { "navigationBarTitleText": "uni-app", "usingComponents": {}, "usingAutoImportComponents": {} } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "uni-app", "navigationBarBackgroundColor": "#F8F8F8", "backgroundColor": "#F8F8F8", "navigationStyle": "custom" } };exports.default = _default;

/***/ }),
/* 8 */
/*!****************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/pages.json?{"type":"stat"} ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 15 */
/*!**************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/api/index.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _info = _interopRequireDefault(__webpack_require__(/*! ./content/info */ 16));
var _basic = _interopRequireDefault(__webpack_require__(/*! ./content/basic */ 21));
var _user = _interopRequireDefault(__webpack_require__(/*! ./content/user */ 22));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var apis = {
  basic: _basic.default,
  info: _info.default,
  user: _user.default };var _default =

apis;exports.default = _default;

/***/ }),
/* 16 */
/*!*********************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/api/content/info.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _base = _interopRequireDefault(__webpack_require__(/*! ../base */ 17));
var _fly = _interopRequireDefault(__webpack_require__(/*! @/common/js/fly */ 18));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var info = _base.default.info;
var infoObj = {
  get: function get(data) {
    console.log(data);
    return _fly.default.get("".concat(info), data);
  },
  update: function update(data) {
    return _fly.default.put("".concat(info, "/").concat(data.id), data);
  },
  create: function create(data) {
    return _fly.default.post("".concat(info), data);
  },
  delete: function _delete(data) {
    return _fly.default.delete("".concat(info, "/").concat(data.id));
  } };var _default =

infoObj;exports.default = _default;

/***/ }),
/* 17 */
/*!*************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/api/base.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var apis = {
  overview: '/overview',
  info: '/info',
  login: '/login',
  getUserInfo: '/getUserInfo',
  getAllUser: '/getAllUser',
  signUp: '/signUp',
  delUser: '/delUser',
  uploadImg: '/info/uploadImg',
  archives: '/archives' };var _default =

apis;exports.default = _default;

/***/ }),
/* 18 */
/*!******************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/common/js/fly.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;
var _global = _interopRequireDefault(__webpack_require__(/*! ./global */ 19));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var Fly = __webpack_require__(/*! flyio/dist/npm/wx */ 20);
var fly = new Fly();
fly.config.baseURL = _global.default.baseUrl;
fly.config.timeout = 10000;
// fly.config.responseType = 'json'
// fly.config.withCredentials = true
// fly.config.headers = {
// 	  'Content-Type': 'application/json;charset=utf-8'
// }
fly.interceptors.response.use(function (response) {
  //只将请求结果的data字段返回
  return response.data;
}, function (err) {
  //发生网络错误后会走到这里
  return Promise.resolve(err);
});var _default =
fly;exports.default = _default;

/***/ }),
/* 19 */
/*!*********************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/common/js/global.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; // const baseUrl = 'https://www.easy-mock.com/mock/5c08f24de1c4a705638a802c/wadejerryVXPay'
var baseUrl = 'https://www.qzran.cn/api';
// let baseUrl: string = ''
// if (process.env.NODE_ENV == 'production') {
//   baseUrl = ''
// } else {
//   baseUrl = 'https://www.easy-mock.com/mock/5cdb7945f2f8913ca63714d2/test'
// }
var _default = {
  baseUrl: baseUrl };exports.default = _default;

/***/ }),
/* 20 */
/*!*******************************************!*\
  !*** ./node_modules/flyio/dist/npm/wx.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else { var i, a; }
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
    type: function type(ob) {
        return Object.prototype.toString.call(ob).slice(8, -1).toLowerCase();
    },
    isObject: function isObject(ob, real) {
        if (real) {
            return this.type(ob) === "object";
        } else {
            return ob && (typeof ob === 'undefined' ? 'undefined' : _typeof(ob)) === 'object';
        }
    },
    isFormData: function isFormData(val) {
        return typeof FormData !== 'undefined' && val instanceof FormData;
    },
    trim: function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    encode: function encode(val) {
        return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
    },
    formatParams: function formatParams(data) {
        var str = "";
        var first = true;
        var that = this;
        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) != "object") {
            return data;
        }
        function _encode(sub, path) {
            var encode = that.encode;
            var type = that.type(sub);
            if (type == "array") {
                sub.forEach(function (e, i) {
                    _encode(e, path + "%5B%5D");
                });
            } else if (type == "object") {
                for (var key in sub) {
                    if (path) {
                        _encode(sub[key], path + "%5B" + encode(key) + "%5D");
                    } else {
                        _encode(sub[key], encode(key));
                    }
                }
            } else {
                if (!first) {
                    str += "&";
                }
                first = false;
                str += path + "=" + encode(sub);
            }
        }

        _encode(data, "");
        return str;
    },

    // Do not overwrite existing attributes
    merge: function merge(a, b) {
        for (var key in b) {
            if (!a.hasOwnProperty(key)) {
                a[key] = b[key];
            } else if (this.isObject(b[key], 1) && this.isObject(a[key], 1)) {
                this.merge(a[key], b[key]);
            }
        }
        return a;
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

function KEEP(_,cb){cb();}
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * author: wendu
 * email: 824783146@qq.com
 **/

var util = __webpack_require__(0);
var isBrowser = typeof document !== "undefined";

//EngineWrapper can help  generating  a  http engine quickly through a adapter
function EngineWrapper(adapter) {
    var AjaxEngine = function () {
        function AjaxEngine() {
            _classCallCheck(this, AjaxEngine);

            this.requestHeaders = {};
            this.readyState = 0;
            this.timeout = 0; // 0 stands for no timeout
            this.responseURL = "";
            this.responseHeaders = {};
        }

        _createClass(AjaxEngine, [{
            key: "_call",
            value: function _call(name) {
                this[name] && this[name].apply(this, [].splice.call(arguments, 1));
            }
        }, {
            key: "_changeReadyState",
            value: function _changeReadyState(state) {
                this.readyState = state;
                this._call("onreadystatechange");
            }
        }, {
            key: "open",
            value: function open(method, url) {
                this.method = method;
                if (!url) {
                    url = location.href;
                } else {
                    url = util.trim(url);
                    if (url.indexOf("http") !== 0) {
                        // Normalize the request url
                        if (isBrowser) {
                            var t = document.createElement("a");
                            t.href = url;
                            url = t.href;
                        }
                    }
                }
                this.responseURL = url;
                this._changeReadyState(1);
            }
        }, {
            key: "send",
            value: function send(arg) {
                var _this = this;

                arg = arg || null;
                var self = this;
                if (adapter) {
                    var request = {
                        method: self.method,
                        url: self.responseURL,
                        headers: self.requestHeaders || {},
                        body: arg
                    };
                    util.merge(request, self._options || {});
                    if (request.method === "GET") {
                        request.body = null;
                    }
                    self._changeReadyState(3);
                    var timer;
                    self.timeout = self.timeout || 0;
                    if (self.timeout > 0) {
                        timer = setTimeout(function () {
                            if (self.readyState === 3) {
                                _this._call("onloadend");
                                self._changeReadyState(0);
                                self._call("ontimeout");
                            }
                        }, self.timeout);
                    }
                    request.timeout = self.timeout;
                    adapter(request, function (response) {

                        function getAndDelete(key) {
                            var t = response[key];
                            delete response[key];
                            return t;
                        }

                        // If the request has already timeout, return
                        if (self.readyState !== 3) return;
                        clearTimeout(timer);

                        // Make sure the type of status is integer
                        self.status = getAndDelete("statusCode") - 0;

                        var responseText = getAndDelete("responseText");
                        var statusMessage = getAndDelete("statusMessage");

                        // Network error, set the status code 0
                        if (!self.status) {
                            self.statusText = responseText;
                            self._call("onerror", { msg: statusMessage });
                        } else {
                            // Parsing the response headers to array in a object,  because
                            // there may be multiple values with the same header name
                            var responseHeaders = getAndDelete("headers");
                            var headers = {};
                            for (var field in responseHeaders) {
                                var value = responseHeaders[field];
                                var key = field.toLowerCase();
                                // Is array
                                if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                                    headers[key] = value;
                                } else {
                                    headers[key] = headers[key] || [];
                                    headers[key].push(value);
                                }
                            }
                            var cookies = headers["set-cookie"];
                            if (isBrowser && cookies) {
                                cookies.forEach(function (e) {
                                    // Remove the http-Only property of the  cookie
                                    // so that JavaScript can operate it.
                                    document.cookie = e.replace(/;\s*httpOnly/ig, "");
                                });
                            }
                            self.responseHeaders = headers;
                            // Set the fields of engine from response
                            self.statusText = statusMessage || "";
                            self.response = self.responseText = responseText;
                            self._response = response;
                            self._changeReadyState(4);
                            self._call("onload");
                        }
                        self._call("onloadend");
                    });
                } else {
                    console.error("Ajax require adapter");
                }
            }
        }, {
            key: "setRequestHeader",
            value: function setRequestHeader(key, value) {
                this.requestHeaders[util.trim(key)] = value;
            }
        }, {
            key: "getResponseHeader",
            value: function getResponseHeader(key) {
                return (this.responseHeaders[key.toLowerCase()] || "").toString() || null;
            }
        }, {
            key: "getAllResponseHeaders",
            value: function getAllResponseHeaders() {
                var str = "";
                for (var key in this.responseHeaders) {
                    str += key + ":" + this.getResponseHeader(key) + "\r\n";
                }
                return str || null;
            }
        }, {
            key: "abort",
            value: function abort(msg) {
                this._changeReadyState(0);
                this._call("onerror", { msg: msg });
                this._call("onloadend");
            }
        }], [{
            key: "setAdapter",
            value: function setAdapter(requestAdapter) {
                adapter = requestAdapter;
            }
        }]);

        return AjaxEngine;
    }();

    return AjaxEngine;
}

// learn more about keep-loader: https://github.com/wendux/keep-loader
;
module.exports = EngineWrapper;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

function KEEP(_,cb){cb();}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = __webpack_require__(0);
var isBrowser = typeof document !== "undefined";

var Fly = function () {
    function Fly(engine) {
        _classCallCheck(this, Fly);

        this.engine = engine || XMLHttpRequest;

        this.default = this; //For typeScript

        /**
         * Add  lock/unlock API for interceptor.
         *
         * Once an request/response interceptor is locked, the incoming request/response
         * will be added to a queue before they enter the interceptor, they will not be
         * continued  until the interceptor is unlocked.
         *
         * @param [interceptor] either is interceptors.request or interceptors.response
         */
        function wrap(interceptor) {
            var resolve;
            var reject;

            function _clear() {
                interceptor.p = resolve = reject = null;
            }

            utils.merge(interceptor, {
                lock: function lock() {
                    if (!resolve) {
                        interceptor.p = new Promise(function (_resolve, _reject) {
                            resolve = _resolve;
                            reject = _reject;
                        });
                    }
                },
                unlock: function unlock() {
                    if (resolve) {
                        resolve();
                        _clear();
                    }
                },
                clear: function clear() {
                    if (reject) {
                        reject("cancel");
                        _clear();
                    }
                }
            });
        }

        var interceptors = this.interceptors = {
            response: {
                use: function use(handler, onerror) {
                    this.handler = handler;
                    this.onerror = onerror;
                }
            },
            request: {
                use: function use(handler) {
                    this.handler = handler;
                }
            }
        };

        var irq = interceptors.request;
        var irp = interceptors.response;
        wrap(irp);
        wrap(irq);

        this.config = {
            method: "GET",
            baseURL: "",
            headers: {},
            timeout: 0,
            params: {}, // Default Url params
            parseJson: true, // Convert response data to JSON object automatically.
            withCredentials: false
        };
    }

    _createClass(Fly, [{
        key: "request",
        value: function request(url, data, options) {
            var _this = this;

            var engine = new this.engine();
            var contentType = "Content-Type";
            var contentTypeLowerCase = contentType.toLowerCase();
            var interceptors = this.interceptors;
            var requestInterceptor = interceptors.request;
            var responseInterceptor = interceptors.response;
            var requestInterceptorHandler = requestInterceptor.handler;
            var promise = new Promise(function (resolve, reject) {
                if (utils.isObject(url)) {
                    options = url;
                    url = options.url;
                }
                options = options || {};
                options.headers = options.headers || {};

                function isPromise(p) {
                    // some  polyfill implementation of Promise may be not standard,
                    // so, we test by duck-typing
                    return p && p.then && p.catch;
                }

                /**
                 * If the request/response interceptor has been locked，
                 * the new request/response will enter a queue. otherwise, it will be performed directly.
                 * @param [promise] if the promise exist, means the interceptor is  locked.
                 * @param [callback]
                 */
                function enqueueIfLocked(promise, callback) {
                    if (promise) {
                        promise.then(function () {
                            callback();
                        });
                    } else {
                        callback();
                    }
                }

                // make the http request
                function makeRequest(options) {
                    data = options.body;
                    // Normalize the request url
                    url = utils.trim(options.url);
                    var baseUrl = utils.trim(options.baseURL || "");
                    if (!url && isBrowser && !baseUrl) url = location.href;
                    if (url.indexOf("http") !== 0) {
                        var isAbsolute = url[0] === "/";
                        if (!baseUrl && isBrowser) {
                            var arr = location.pathname.split("/");
                            arr.pop();
                            baseUrl = location.protocol + "//" + location.host + (isAbsolute ? "" : arr.join("/"));
                        }
                        if (baseUrl[baseUrl.length - 1] !== "/") {
                            baseUrl += "/";
                        }
                        url = baseUrl + (isAbsolute ? url.substr(1) : url);
                        if (isBrowser) {

                            // Normalize the url which contains the ".." or ".", such as
                            // "http://xx.com/aa/bb/../../xx" to "http://xx.com/xx" .
                            var t = document.createElement("a");
                            t.href = url;
                            url = t.href;
                        }
                    }

                    var responseType = utils.trim(options.responseType || "");
                    var isGet = options.method === "GET";
                    var dataType = utils.type(data);
                    var params = options.params || {};

                    // merge url params when the method is "GET" (data is object)
                    if (isGet && dataType === "object") {
                        params = utils.merge(data, params);
                    }
                    // encode params to String
                    params = utils.formatParams(params);

                    // save url params
                    var _params = [];
                    if (params) {
                        _params.push(params);
                    }
                    // Add data to url params when the method is "GET" (data is String)
                    if (isGet && data && dataType === "string") {
                        _params.push(data);
                    }

                    // make the final url
                    if (_params.length > 0) {
                        url += (url.indexOf("?") === -1 ? "?" : "&") + _params.join("&");
                    }

                    engine.open(options.method, url);

                    // try catch for ie >=9
                    try {
                        engine.withCredentials = !!options.withCredentials;
                        engine.timeout = options.timeout || 0;
                        if (responseType !== "stream") {
                            engine.responseType = responseType;
                        }
                    } catch (e) {}

                    var customContentType = options.headers[contentType] || options.headers[contentTypeLowerCase];

                    // default content type
                    var _contentType = "application/x-www-form-urlencoded";
                    // If the request data is json object, transforming it  to json string,
                    // and set request content-type to "json". In browser,  the data will
                    // be sent as RequestBody instead of FormData
                    if (utils.trim((customContentType || "").toLowerCase()) === _contentType) {
                        data = utils.formatParams(data);
                    } else if (!utils.isFormData(data) && ["object", "array"].indexOf(utils.type(data)) !== -1) {
                        _contentType = 'application/json;charset=utf-8';
                        data = JSON.stringify(data);
                    }
                    //If user doesn't set content-type, set default.
                    if (!(customContentType || isGet)) {
                        options.headers[contentType] = _contentType;
                    }

                    for (var k in options.headers) {
                        if (k === contentType && utils.isFormData(data)) {
                            // Delete the content-type, Let the browser set it
                            delete options.headers[k];
                        } else {
                            try {
                                // In browser environment, some header fields are readonly,
                                // write will cause the exception .
                                engine.setRequestHeader(k, options.headers[k]);
                            } catch (e) {}
                        }
                    }

                    function onresult(handler, data, type) {
                        enqueueIfLocked(responseInterceptor.p, function () {
                            if (handler) {
                                //如果失败，添加请求信息
                                if (type) {
                                    data.request = options;
                                }
                                var ret = handler.call(responseInterceptor, data, Promise);
                                data = ret === undefined ? data : ret;
                            }
                            if (!isPromise(data)) {
                                data = Promise[type === 0 ? "resolve" : "reject"](data);
                            }
                            data.then(function (d) {
                                resolve(d);
                            }).catch(function (e) {
                                reject(e);
                            });
                        });
                    }

                    function onerror(e) {
                        e.engine = engine;
                        onresult(responseInterceptor.onerror, e, -1);
                    }

                    function Err(msg, status) {
                        this.message = msg;
                        this.status = status;
                    }

                    engine.onload = function () {
                        // The xhr of IE9 has not response field
                        var response = engine.response || engine.responseText;
                        if (response && options.parseJson && (engine.getResponseHeader(contentType) || "").indexOf("json") !== -1
                        // Some third engine implementation may transform the response text to json object automatically,
                        // so we should test the type of response before transforming it
                        && !utils.isObject(response)) {
                            response = JSON.parse(response);
                        }

                        var headers = engine.responseHeaders;
                        // In browser
                        if (!headers) {
                            headers = {};
                            var items = (engine.getAllResponseHeaders() || "").split("\r\n");
                            items.pop();
                            items.forEach(function (e) {
                                if (!e) return;
                                var key = e.split(":")[0];
                                headers[key] = engine.getResponseHeader(key);
                            });
                        }
                        var status = engine.status;
                        var statusText = engine.statusText;
                        var data = { data: response, headers: headers, status: status, statusText: statusText };
                        // The _response filed of engine is set in  adapter which be called in engine-wrapper.js
                        utils.merge(data, engine._response);
                        if (status >= 200 && status < 300 || status === 304) {
                            data.engine = engine;
                            data.request = options;
                            onresult(responseInterceptor.handler, data, 0);
                        } else {
                            var e = new Err(statusText, status);
                            e.response = data;
                            onerror(e);
                        }
                    };

                    engine.onerror = function (e) {
                        onerror(new Err(e.msg || "Network Error", 0));
                    };

                    engine.ontimeout = function () {
                        onerror(new Err("timeout [ " + engine.timeout + "ms ]", 1));
                    };
                    engine._options = options;
                    setTimeout(function () {
                        engine.send(isGet ? null : data);
                    }, 0);
                }

                enqueueIfLocked(requestInterceptor.p, function () {
                    utils.merge(options, _this.config);
                    var headers = options.headers;
                    headers[contentType] = headers[contentType] || headers[contentTypeLowerCase] || "";
                    delete headers[contentTypeLowerCase];
                    options.body = data || options.body;
                    url = utils.trim(url || "");
                    options.method = options.method.toUpperCase();
                    options.url = url;
                    var ret = options;
                    if (requestInterceptorHandler) {
                        ret = requestInterceptorHandler.call(requestInterceptor, options, Promise) || options;
                    }
                    if (!isPromise(ret)) {
                        ret = Promise.resolve(ret);
                    }
                    ret.then(function (d) {
                        //if options continue
                        if (d === options) {
                            makeRequest(d);
                        } else {
                            resolve(d);
                        }
                    }, function (err) {
                        reject(err);
                    });
                });
            });
            promise.engine = engine;
            return promise;
        }
    }, {
        key: "all",
        value: function all(promises) {
            return Promise.all(promises);
        }
    }, {
        key: "spread",
        value: function spread(callback) {
            return function (arr) {
                return callback.apply(null, arr);
            };
        }
    }]);

    return Fly;
}();

//For typeScript


Fly.default = Fly;

["get", "post", "put", "patch", "head", "delete"].forEach(function (e) {
    Fly.prototype[e] = function (url, data, option) {
        return this.request(url, data, utils.merge({ method: e }, option));
    };
});
        ["lock", "unlock", "clear"].forEach(function (e) {
            Fly.prototype[e] = function () {
                this.interceptors.request[e]();
            };
        });
// Learn more about keep-loader: https://github.com/wendux/keep-loader
;
module.exports = Fly;

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//微信小程序适配器
module.exports = function (request, responseCallback) {
    var con = {
        method: request.method,
        url: request.url,
        dataType: request.dataType || undefined,
        header: request.headers,
        data: request.body || {},
        success: function success(res) {
            responseCallback({
                statusCode: res.statusCode,
                responseText: res.data,
                headers: res.header,
                statusMessage: res.errMsg
            });
        },
        fail: function fail(res) {
            responseCallback({
                statusCode: res.statusCode || 0,
                statusMessage: res.errMsg
            });
        }
    };
    wx.request(con);
};

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//微信小程序入口
var Fly = __webpack_require__(2);
var EngineWrapper = __webpack_require__(1);
var adapter = __webpack_require__(6);
var wxEngine = EngineWrapper(adapter);
module.exports = function (engine) {
    return new Fly(engine || wxEngine);
};

/***/ })
/******/ ]);
});

/***/ }),
/* 21 */
/*!**********************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/api/content/basic.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _base = _interopRequireDefault(__webpack_require__(/*! ../base */ 17));
var _fly = _interopRequireDefault(__webpack_require__(/*! @/common/js/fly */ 18));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var overview = _base.default.overview;
var archives = _base.default.archives;
var basic = {
  getOverview: function getOverview() {
    console.log(_fly.default.get);
    return _fly.default.get("".concat(overview));
  },
  getArchives: function getArchives() {
    return _fly.default.get(archives);
  } };var _default =

basic;exports.default = _default;

/***/ }),
/* 22 */
/*!*********************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/api/content/user.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _base = _interopRequireDefault(__webpack_require__(/*! ../base */ 17));
var _fly = _interopRequireDefault(__webpack_require__(/*! @/common/js/fly */ 18));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var basic = {
  login: function login(data) {
    return _fly.default.post(_base.default.login, data);
  },
  getUserInfo: function getUserInfo(data) {
    return _fly.default.post(_base.default.getUserInfo, data);
  },
  getAllUser: function getAllUser() {
    return _fly.default.get(_base.default.getAllUser);
  },
  signUp: function signUp(data) {
    return _fly.default.post(_base.default.signUp, data);
  },
  delUser: function delUser(data) {
    return _fly.default.post(_base.default.delUser, data);
  } };var _default =

basic;exports.default = _default;

/***/ }),
/* 23 */
/*!********************************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_mavon-editor@2.7.7@mavon-editor/dist/mavon-editor.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
!function (e, t) { true ? module.exports = t() : undefined;}(void 0, function () {return function (e) {function t(r) {if (n[r]) return n[r].exports;var o = n[r] = { i: r, l: !1, exports: {} };return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports;}var n = {};return t.m = e, t.c = n, t.i = function (e) {return e;}, t.d = function (e, n, r) {t.o(e, n) || Object.defineProperty(e, n, { configurable: !1, enumerable: !0, get: r });}, t.n = function (e) {var n = e && e.__esModule ? function () {return e.default;} : function () {return e;};return t.d(n, "a", n), n;}, t.o = function (e, t) {return Object.prototype.hasOwnProperty.call(e, t);}, t.p = "", t(t.s = 62);}([function (e, t, n) {"use strict";function r(e) {return Object.prototype.toString.call(e);}function o(e) {return "[object String]" === r(e);}function i(e, t) {return w.call(e, t);}function a(e) {return Array.prototype.slice.call(arguments, 1).forEach(function (t) {if (t) {if ("object" != typeof t) throw new TypeError(t + "must be object");Object.keys(t).forEach(function (n) {e[n] = t[n];});}}), e;}function s(e, t, n) {return [].concat(e.slice(0, t), n, e.slice(t + 1));}function l(e) {return !(e >= 55296 && e <= 57343) && !(e >= 64976 && e <= 65007) && 65535 != (65535 & e) && 65534 != (65535 & e) && !(e >= 0 && e <= 8) && 11 !== e && !(e >= 14 && e <= 31) && !(e >= 127 && e <= 159) && !(e > 1114111);}function c(e) {if (e > 65535) {e -= 65536;var t = 55296 + (e >> 10),n = 56320 + (1023 & e);return String.fromCharCode(t, n);}return String.fromCharCode(e);}function u(e, t) {var n = 0;return i(D, t) ? D[t] : 35 === t.charCodeAt(0) && E.test(t) && (n = "x" === t[1].toLowerCase() ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10), l(n)) ? c(n) : e;}function p(e) {return e.indexOf("\\") < 0 ? e : e.replace(x, "$1");}function _(e) {return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(C, function (e, t, n) {return t || u(e, n);});}function d(e) {return S[e];}function h(e) {return T.test(e) ? e.replace(A, d) : e;}function f(e) {return e.replace(L, "\\$&");}function m(e) {switch (e) {case 9:case 32:return !0;}return !1;}function g(e) {if (e >= 8192 && e <= 8202) return !0;switch (e) {case 9:case 10:case 11:case 12:case 13:case 32:case 160:case 5760:case 8239:case 8287:case 12288:return !0;}return !1;}function b(e) {return M.test(e);}function v(e) {switch (e) {case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 41:case 42:case 43:case 44:case 45:case 46:case 47:case 58:case 59:case 60:case 61:case 62:case 63:case 64:case 91:case 92:case 93:case 94:case 95:case 96:case 123:case 124:case 125:case 126:return !0;default:return !1;}}function k(e) {return e.trim().replace(/\s+/g, " ").toUpperCase();}var w = Object.prototype.hasOwnProperty,x = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g,y = /&([a-z#][a-z0-9]{1,31});/gi,C = new RegExp(x.source + "|" + y.source, "gi"),E = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i,D = n(48),T = /[&<>"]/,A = /[&<>"]/g,S = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" },L = /[.?*+^$[\]\\(){}|-]/g,M = n(33);t.lib = {}, t.lib.mdurl = n(52), t.lib.ucmicro = n(187), t.assign = a, t.isString = o, t.has = i, t.unescapeMd = p, t.unescapeAll = _, t.isValidEntityCode = l, t.fromCodePoint = c, t.escapeHtml = h, t.arrayReplaceAt = s, t.isSpace = m, t.isWhiteSpace = g, t.isMdAsciiPunct = v, t.isPunctChar = b, t.escapeRE = f, t.normalizeReference = k;}, function (e, t) {var n = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();"number" == typeof __g && (__g = n);}, function (e, t) {var n = {}.hasOwnProperty;e.exports = function (e, t) {return n.call(e, t);};}, function (e, t, n) {e.exports = !n(11)(function () {return 7 != Object.defineProperty({}, "a", { get: function get() {return 7;} }).a;});}, function (e, t, n) {var r = n(5),o = n(13);e.exports = n(3) ? function (e, t, n) {return r.f(e, t, o(1, n));} : function (e, t, n) {return e[t] = n, e;};}, function (e, t, n) {var r = n(9),o = n(41),i = n(28),a = Object.defineProperty;t.f = n(3) ? Object.defineProperty : function (e, t, n) {if (r(e), t = i(t, !0), r(n), o) try {return a(e, t, n);} catch (e) {}if ("get" in n || "set" in n) throw TypeError("Accessors not supported!");return "value" in n && (e[t] = n.value), e;};}, function (e, t, n) {var r = n(81),o = n(19);e.exports = function (e) {return r(o(e));};}, function (e, t, n) {var r = n(26)("wks"),o = n(14),i = n(1).Symbol,a = "function" == typeof i;(e.exports = function (e) {return r[e] || (r[e] = a && i[e] || (a ? i : o)("Symbol." + e));}).store = r;}, function (e, t) {e.exports = function (e) {return "object" == typeof e ? null !== e : "function" == typeof e;};}, function (e, t, n) {var r = n(8);e.exports = function (e) {if (!r(e)) throw TypeError(e + " is not an object!");return e;};}, function (e, t) {var n = e.exports = { version: "2.5.7" };"number" == typeof __e && (__e = n);}, function (e, t) {e.exports = function (e) {try {return !!e();} catch (e) {return !0;}};}, function (e, t) {e.exports = !0;}, function (e, t) {e.exports = function (e, t) {return { enumerable: !(1 & e), configurable: !(2 & e), writable: !(4 & e), value: t };};}, function (e, t) {var n = 0,r = Math.random();e.exports = function (e) {return "Symbol(".concat(void 0 === e ? "" : e, ")_", (++n + r).toString(36));};}, function (e, t) {function n(e, t) {var n = e[1] || "",o = e[3];if (!o) return n;if (t && "function" == typeof btoa) {var i = r(o);return [n].concat(o.sources.map(function (e) {return "/*# sourceURL=" + o.sourceRoot + e + " */";})).concat([i]).join("\n");}return [n].join("\n");}function r(e) {return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(e)))) + " */";}e.exports = function (e) {var t = [];return t.toString = function () {return this.map(function (t) {var r = n(t, e);return t[2] ? "@media " + t[2] + "{" + r + "}" : r;}).join("");}, t.i = function (e, n) {"string" == typeof e && (e = [[null, e, ""]]);for (var r = {}, o = 0; o < this.length; o++) {var i = this[o][0];"number" == typeof i && (r[i] = !0);}for (o = 0; o < e.length; o++) {var a = e[o];"number" == typeof a[0] && r[a[0]] || (n && !a[2] ? a[2] = n : n && (a[2] = "(" + a[2] + ") and (" + n + ")"), t.push(a));}}, t;};}, function (e, t) {e.exports = function (e, t, n, r, o) {var i,a = e = e || {},s = typeof e.default;"object" !== s && "function" !== s || (i = e, a = e.default);var l = "function" == typeof a ? a.options : a;t && (l.render = t.render, l.staticRenderFns = t.staticRenderFns), r && (l._scopeId = r);var c;if (o ? (c = function c(e) {e = e || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext, e || "undefined" == typeof __VUE_SSR_CONTEXT__ || (e = __VUE_SSR_CONTEXT__), n && n.call(this, e), e && e._registeredComponents && e._registeredComponents.add(o);}, l._ssrRegister = c) : n && (c = n), c) {var u = l.functional,p = u ? l.render : l.beforeCreate;u ? l.render = function (e, t) {return c.call(t), p(e, t);} : l.beforeCreate = p ? [].concat(p, c) : [c];}return { esModule: i, exports: a, options: l };};}, function (e, t, n) {function r(e) {for (var t = 0; t < e.length; t++) {var n = e[t],r = u[n.id];if (r) {r.refs++;for (var o = 0; o < r.parts.length; o++) {r.parts[o](n.parts[o]);}for (; o < n.parts.length; o++) {r.parts.push(i(n.parts[o]));}r.parts.length > n.parts.length && (r.parts.length = n.parts.length);} else {for (var a = [], o = 0; o < n.parts.length; o++) {a.push(i(n.parts[o]));}u[n.id] = { id: n.id, refs: 1, parts: a };}}}function o() {var e = document.createElement("style");return e.type = "text/css", p.appendChild(e), e;}function i(e) {var t,n,r = document.querySelector("style[" + g + '~="' + e.id + '"]');if (r) {if (h) return f;r.parentNode.removeChild(r);}if (b) {var i = d++;r = _ || (_ = o()), t = a.bind(null, r, i, !1), n = a.bind(null, r, i, !0);} else r = o(), t = s.bind(null, r), n = function n() {r.parentNode.removeChild(r);};return t(e), function (r) {if (r) {if (r.css === e.css && r.media === e.media && r.sourceMap === e.sourceMap) return;t(e = r);} else n();};}function a(e, t, n, r) {var o = n ? "" : r.css;if (e.styleSheet) e.styleSheet.cssText = v(t, o);else {var i = document.createTextNode(o),a = e.childNodes;a[t] && e.removeChild(a[t]), a.length ? e.insertBefore(i, a[t]) : e.appendChild(i);}}function s(e, t) {var n = t.css,r = t.media,o = t.sourceMap;if (r && e.setAttribute("media", r), m.ssrId && e.setAttribute(g, t.id), o && (n += "\n/*# sourceURL=" + o.sources[0] + " */", n += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(o)))) + " */"), e.styleSheet) e.styleSheet.cssText = n;else {for (; e.firstChild;) {e.removeChild(e.firstChild);}e.appendChild(document.createTextNode(n));}}var l = "undefined" != typeof document;if ("undefined" != typeof DEBUG && DEBUG && !l) throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var c = n(197),u = {},p = l && (document.head || document.getElementsByTagName("head")[0]),_ = null,d = 0,h = !1,f = function f() {},m = null,g = "data-vue-ssr-id",b = "undefined" != typeof navigator && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());e.exports = function (e, t, n, o) {h = n, m = o || {};var i = c(e, t);return r(i), function (t) {for (var n = [], o = 0; o < i.length; o++) {var a = i[o],s = u[a.id];s.refs--, n.push(s);}t ? (i = c(e, t), r(i)) : i = [];for (var o = 0; o < n.length; o++) {var s = n[o];if (0 === s.refs) {for (var l = 0; l < s.parts.length; l++) {s.parts[l]();}delete u[s.id];}}};};var v = function () {var e = [];return function (t, n) {return e[t] = n, e.filter(Boolean).join("\n");};}();}, function (e, t, n) {"use strict";function r(e, t, n, r, o) {return "*" !== e || "*" !== t || "*" !== n.substring(r - 2, r - 1) || "*" !== n.substring(o + 1, o + 2);}function o(e, t) {"function" != typeof t && (t = function t() {});var n = document.querySelectorAll("script[src='" + e + "']");if (n.length > 0) return n[0].addEventListener("load", function () {t();}), void t();var r = document.createElement("script"),o = document.getElementsByTagName("head")[0];r.type = "text/javascript", r.charset = "UTF-8", r.src = e, r.addEventListener ? r.addEventListener("load", function () {t();}, !1) : r.attachEvent && r.attachEvent("onreadystatechange", function () {"loaded" === window.event.srcElement.readyState && t();}), o.appendChild(r);}function i(e, t) {if ("function" != typeof t && (t = function t() {}), document.querySelectorAll("link[href='" + e + "']").length > 0) return void t();var n = document.createElement("link"),r = document.getElementsByTagName("head")[0];n.rel = "stylesheet", n.href = e, n.addEventListener ? n.addEventListener("load", function () {t();}, !1) : n.attachEvent && n.attachEvent("onreadystatechange", function () {"loaded" === window.event.srcElement.readyState && t();}), r.appendChild(n);}n.d(t, "g", function () {return a;}), n.d(t, "i", function () {return s;}), n.d(t, "j", function () {return l;}), n.d(t, "k", function () {return c;}), n.d(t, "h", function () {return u;}), n.d(t, "l", function () {return p;}), n.d(t, "m", function () {return _;}), n.d(t, "e", function () {return d;}), n.d(t, "f", function () {return h;}), n.d(t, "b", function () {return f;}), t.d = o, t.c = i, n.d(t, "a", function () {return m;});var a = function a(e, t, n) {var o = t.prefix,i = t.subfix,a = t.str;t.type;if (e.focus(), "number" == typeof e.selectionStart && "number" == typeof e.selectionEnd) {var s = e.selectionStart,l = e.selectionEnd,c = e.value;s === l ? (e.value = c.substring(0, s) + o + a + i + c.substring(l, c.length), e.selectionStart = s + o.length, e.selectionEnd = s + (a.length + o.length)) : c.substring(s - o.length, s) === o && c.substring(l, l + i.length) === i && r(o, i, c, s, l) ? (e.value = c.substring(0, s - o.length) + c.substring(s, l) + c.substring(l + i.length, c.length), e.selectionStart = s - o.length, e.selectionEnd = l - o.length) : (e.value = c.substring(0, s) + o + c.substring(s, l) + i + c.substring(l, c.length), e.selectionStart = s + o.length, e.selectionEnd = s + (l - s + o.length));} else alert("Error: Browser version is too low");n.d_value = e.value, e.focus();},s = function s(e) {var t = e.getTextareaDom();if ("number" == typeof t.selectionStart && "number" == typeof t.selectionEnd) {var n = t.selectionStart,r = t.selectionEnd,o = t.value;if (n === r) t.value = o.substring(0, n) + "1. " + o.substring(r, o.length), t.selectionEnd = t.selectionStart = n + 3;else {for (var i = n; i > 0 && "\n" !== o.substring(i - 1, i);) {i--;}for (var a = o.substring(i, r), s = a.split("\n"), l = 0; l < s.length; l++) {s[l] = l + 1 + ". " + s[l];}var c = s.join("\n");t.value = o.substring(0, i) + c + o.substring(r, o.length), t.selectionStart = i, t.selectionEnd = r + c.length - a.length;}} else alert("Error: Browser version is too low");e.d_value = t.value, t.focus();},l = function l(e) {var t = e.getTextareaDom();if ("number" == typeof t.selectionStart && "number" == typeof t.selectionEnd) {for (var n = t.selectionStart, r = t.selectionEnd, o = t.value, i = n; i > 0 && "\n" !== o.substring(i - 1, i);) {i--;}for (var a = r; a < o.length && "\n" !== o.substring(a, a + 1);) {a++;}a < o.length && a++, t.value = o.substring(0, i) + o.substring(a, o.length), t.selectionEnd = t.selectionStart = 0 === i ? 0 : i - 1;} else alert("Error: Browser version is too low");e.d_value = t.value, t.focus();},c = function c(e) {var t = e.getTextareaDom();if ("number" == typeof t.selectionStart && "number" == typeof t.selectionEnd) {var n = t.selectionStart,r = t.selectionEnd,o = t.value;if (n === r) t.value = o.substring(0, n) + "- " + o.substring(r, o.length), t.selectionEnd = t.selectionStart = n + 2;else {for (var i = n; i > 0 && "\n" !== o.substring(i - 1, i);) {i--;}var a = o.substring(i, r),s = a.replace(/\n/g, "\n- ");s = "- " + s, t.value = o.substring(0, i) + s + o.substring(r, o.length), t.selectionStart = i, t.selectionEnd = r + s.length - a.length;}} else alert("Error: Browser version is too low");e.d_value = t.value, t.focus();},u = function u(e, t) {t = t ? new Array(t).fill(" ").join("") : "\t";var n = e.getTextareaDom();if ("number" == typeof n.selectionStart && "number" == typeof n.selectionEnd) {var r = n.selectionStart,o = n.selectionEnd,i = n.value,a = i.substring(0, r).split("\n").pop();if (a.match(/^\s*[0-9]+\.\s+\S*/)) {var s = a.replace(/(\d+)/, 1);n.value = i.substring(0, r - s.length) + t + s + i.substring(o, i.length);} else a.match(/^\s*-\s+\S*/) ? n.value = i.substring(0, r - a.length) + t + a + i.substring(o, i.length) : n.value = i.substring(0, r) + t + i.substring(o, i.length);n.selectionStart = n.selectionEnd = r + t.length;} else alert("Error: Browser version is too low");e.d_value = n.value, n.focus();},p = function p(e, t) {var n = new RegExp(t ? "\\s{" + t + "}" : "\t");console.log("regTab:", n);var r = e.getTextareaDom();if ("number" == typeof r.selectionStart && "number" == typeof r.selectionEnd) {var o = r.selectionStart,i = r.selectionEnd,a = r.value,s = a.substring(0, o).split("\n").pop();s.search(n) >= 0 && (r.value = a.substring(0, o - s.length) + s.replace(n, "") + a.substring(i, a.length), r.selectionStart = r.selectionEnd = o - (t || 1));} else alert("Error: Browser version is too low");e.d_value = r.value, r.focus();},_ = function _(e, t) {var n = e.getTextareaDom();if ("number" == typeof n.selectionStart && "number" == typeof n.selectionEnd) {var r = n.selectionStart,o = n.selectionEnd,i = n.value,a = i.substring(0, r).split("\n").pop(),s = a.match(/^\s*(?:[0-9]+\.|-)\s+\S+/);if (s) {t.preventDefault();var l = s.shift().match(/^\s*(?:[0-9]+\.|-)\s/).shift();if (l.search(/-/) >= 0) n.value = i.substring(0, r) + "\n" + l + i.substring(o, i.length), n.selectionStart = n.selectionEnd = r + l.length + 1;else {var c = l.replace(/(\d+)/, parseInt(l) + 1);n.value = i.substring(0, r) + "\n" + c + i.substring(o, i.length), n.selectionStart = n.selectionEnd = r + c.length + 1;}} else {var u = a.match(/^\s*(?:[0-9]+\.|-)\s+$/);if (u) {t.preventDefault();var p = u.shift().length;n.value = i.substring(0, r - p) + "\n" + i.substring(o, i.length), n.selectionStart = n.selectionEnd = r - p;}}} else alert("Error: Browser version is too low");e.d_value = n.value, n.focus();},d = function d(e, t) {var n = void 0;n = e.$refs.navigationContent, n.innerHTML = e.d_render;var r = n.children;if (r.length) for (var o = 0; o < r.length; o++) {!function (t, n, r) {/^H[1-6]{1}$/.exec(t.tagName) ? t.onclick = function () {var t = e.$refs.vShowContent,r = e.$refs.vNoteEdit;e.s_subfield ? e.s_preview_switch && (r.scrollTop = t.children[n].offsetTop * (r.scrollHeight - r.offsetHeight) / (t.scrollHeight - t.offsetHeight)) : e.s_preview_switch && (t.scrollTop = t.children[n].offsetTop);} : t.style.display = "none";}(r[o], o);}},h = function h(e, t) {var n = e.srcElement ? e.srcElement : e.target,r = n.scrollTop / (n.scrollHeight - n.offsetHeight);t.edit_scroll_height >= 0 && n.scrollHeight !== t.edit_scroll_height && n.scrollHeight - n.offsetHeight - n.scrollTop <= 30 && (t.$refs.vNoteEdit.scrollTop = n.scrollHeight - n.offsetHeight, r = 1), t.edit_scroll_height = n.scrollHeight, t.$refs.vShowContent.scrollHeight > t.$refs.vShowContent.offsetHeight && (t.$refs.vShowContent.scrollTop = (t.$refs.vShowContent.scrollHeight - t.$refs.vShowContent.offsetHeight) * r);},f = function f(e) {e.$el.addEventListener("fullscreenchange", function (t) {e.$toolbar_right_read_change_status();}, !1), e.$el.addEventListener("mozfullscreenchange", function (t) {e.$toolbar_right_read_change_status();}, !1), e.$el.addEventListener("webkitfullscreenchange", function (t) {e.$toolbar_right_read_change_status();}, !1), e.$el.addEventListener("msfullscreenchange", function (t) {e.$toolbar_right_read_change_status();}, !1);},m = function m(e) {e.$refs.vShowContent.addEventListener("click", function (t) {t = t || window.event;var n = t.srcElement ? t.srcElement : t.target;"IMG" === n.tagName && (null != e.imageClick ? e.imageClick(n) : e.d_preview_imgsrc = n.src);});};}, function (e, t) {e.exports = function (e) {if (void 0 == e) throw TypeError("Can't call method on  " + e);return e;};}, function (e, t) {e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");}, function (e, t) {e.exports = {};}, function (e, t, n) {var r = n(46),o = n(20);e.exports = Object.keys || function (e) {return r(e, o);};}, function (e, t) {t.f = {}.propertyIsEnumerable;}, function (e, t, n) {var r = n(5).f,o = n(2),i = n(7)("toStringTag");e.exports = function (e, t, n) {e && !o(e = n ? e : e.prototype, i) && r(e, i, { configurable: !0, value: t });};}, function (e, t, n) {var r = n(26)("keys"),o = n(14);e.exports = function (e) {return r[e] || (r[e] = o(e));};}, function (e, t, n) {var r = n(10),o = n(1),i = o["__core-js_shared__"] || (o["__core-js_shared__"] = {});(e.exports = function (e, t) {return i[e] || (i[e] = void 0 !== t ? t : {});})("versions", []).push({ version: r.version, mode: n(12) ? "pure" : "global", copyright: "© 2018 Denis Pushkarev (zloirock.ru)" });}, function (e, t) {var n = Math.ceil,r = Math.floor;e.exports = function (e) {return isNaN(e = +e) ? 0 : (e > 0 ? r : n)(e);};}, function (e, t, n) {var r = n(8);e.exports = function (e, t) {if (!r(e)) return e;var n, o;if (t && "function" == typeof (n = e.toString) && !r(o = n.call(e))) return o;if ("function" == typeof (n = e.valueOf) && !r(o = n.call(e))) return o;if (!t && "function" == typeof (n = e.toString) && !r(o = n.call(e))) return o;throw TypeError("Can't convert object to primitive value");};}, function (e, t, n) {var r = n(1),o = n(10),i = n(12),a = n(30),s = n(5).f;e.exports = function (e) {var t = o.Symbol || (o.Symbol = i ? {} : r.Symbol || {});"_" == e.charAt(0) || e in t || s(t, e, { value: a.f(e) });};}, function (e, t, n) {t.f = n(7);}, function (e, t, n) {"use strict";function r() {this.__rules__ = [], this.__cache__ = null;}r.prototype.__find__ = function (e) {for (var t = 0; t < this.__rules__.length; t++) {if (this.__rules__[t].name === e) return t;}return -1;}, r.prototype.__compile__ = function () {var e = this,t = [""];e.__rules__.forEach(function (e) {e.enabled && e.alt.forEach(function (e) {t.indexOf(e) < 0 && t.push(e);});}), e.__cache__ = {}, t.forEach(function (t) {e.__cache__[t] = [], e.__rules__.forEach(function (n) {n.enabled && (t && n.alt.indexOf(t) < 0 || e.__cache__[t].push(n.fn));});});}, r.prototype.at = function (e, t, n) {var r = this.__find__(e),o = n || {};if (-1 === r) throw new Error("Parser rule not found: " + e);this.__rules__[r].fn = t, this.__rules__[r].alt = o.alt || [], this.__cache__ = null;}, r.prototype.before = function (e, t, n, r) {var o = this.__find__(e),i = r || {};if (-1 === o) throw new Error("Parser rule not found: " + e);this.__rules__.splice(o, 0, { name: t, enabled: !0, fn: n, alt: i.alt || [] }), this.__cache__ = null;}, r.prototype.after = function (e, t, n, r) {var o = this.__find__(e),i = r || {};if (-1 === o) throw new Error("Parser rule not found: " + e);this.__rules__.splice(o + 1, 0, { name: t, enabled: !0, fn: n, alt: i.alt || [] }), this.__cache__ = null;}, r.prototype.push = function (e, t, n) {var r = n || {};this.__rules__.push({ name: e, enabled: !0, fn: t, alt: r.alt || [] }), this.__cache__ = null;}, r.prototype.enable = function (e, t) {Array.isArray(e) || (e = [e]);var n = [];return e.forEach(function (e) {var r = this.__find__(e);if (r < 0) {if (t) return;throw new Error("Rules manager: invalid rule name " + e);}this.__rules__[r].enabled = !0, n.push(e);}, this), this.__cache__ = null, n;}, r.prototype.enableOnly = function (e, t) {Array.isArray(e) || (e = [e]), this.__rules__.forEach(function (e) {e.enabled = !1;}), this.enable(e, t);}, r.prototype.disable = function (e, t) {Array.isArray(e) || (e = [e]);var n = [];return e.forEach(function (e) {var r = this.__find__(e);if (r < 0) {if (t) return;throw new Error("Rules manager: invalid rule name " + e);}this.__rules__[r].enabled = !1, n.push(e);}, this), this.__cache__ = null, n;}, r.prototype.getRules = function (e) {return null === this.__cache__ && this.__compile__(), this.__cache__[e] || [];}, e.exports = r;}, function (e, t, n) {"use strict";function r(e, t, n) {this.type = e, this.tag = t, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;}r.prototype.attrIndex = function (e) {var t, n, r;if (!this.attrs) return -1;for (t = this.attrs, n = 0, r = t.length; n < r; n++) {if (t[n][0] === e) return n;}return -1;}, r.prototype.attrPush = function (e) {this.attrs ? this.attrs.push(e) : this.attrs = [e];}, r.prototype.attrSet = function (e, t) {var n = this.attrIndex(e),r = [e, t];n < 0 ? this.attrPush(r) : this.attrs[n] = r;}, r.prototype.attrGet = function (e) {var t = this.attrIndex(e),n = null;return t >= 0 && (n = this.attrs[t][1]), n;}, r.prototype.attrJoin = function (e, t) {var n = this.attrIndex(e);n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = this.attrs[n][1] + " " + t;}, e.exports = r;}, function (e, t) {e.exports = /[!-#%-\*,-/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E49\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;}, function (e, t, n) {function r(e) {o || n(194);}var o = !1,i = n(16)(n(59), n(191), r, "data-v-62b9e4d1", null);i.options.__file = "C:\\Users\\LWK\\Desktop\\mavonEditor-master\\mavonEditor-master\\src\\components\\md-toolbar-left.vue", i.esModule && Object.keys(i.esModule).some(function (e) {return "default" !== e && "__" !== e.substr(0, 2);}) && console.error("named exports are not supported in *.vue files."), i.options.functional && console.error("[vue-loader] md-toolbar-left.vue: functional components are not supported with templates, they should use render functions."), e.exports = i.exports;}, function (e, t, n) {var r = n(16)(n(60), n(189), null, null, null);r.options.__file = "C:\\Users\\LWK\\Desktop\\mavonEditor-master\\mavonEditor-master\\src\\components\\md-toolbar-right.vue", r.esModule && Object.keys(r.esModule).some(function (e) {return "default" !== e && "__" !== e.substr(0, 2);}) && console.error("named exports are not supported in *.vue files."), r.options.functional && console.error("[vue-loader] md-toolbar-right.vue: functional components are not supported with templates, they should use render functions."), e.exports = r.exports;}, function (e, t, n) {"use strict";t.a = { "1c": "1c", abnf: "abnf", accesslog: "accesslog", actionscript: "actionscript", as: "actionscript", ada: "ada", apache: "apache", apacheconf: "apache", applescript: "applescript", osascript: "applescript", arduino: "arduino", armasm: "armasm", arm: "armasm", asciidoc: "asciidoc", adoc: "asciidoc", aspectj: "aspectj", autohotkey: "autohotkey", ahk: "autohotkey", autoit: "autoit", avrasm: "avrasm", awk: "awk", axapta: "axapta", bash: "bash", sh: "bash", zsh: "bash", basic: "basic", bnf: "bnf", brainfuck: "brainfuck", bf: "brainfuck", cal: "cal", capnproto: "capnproto", capnp: "capnproto", ceylon: "ceylon", clean: "clean", icl: "clean", dcl: "clean", "clojure-repl": "clojure-repl", clojure: "clojure", clj: "clojure", cmake: "cmake", "cmake.in": "cmake", coffeescript: "coffeescript", coffee: "coffeescript", cson: "coffeescript", iced: "coffeescript", coq: "coq", cos: "cos", cls: "cos", cpp: "cpp", c: "cpp", cc: "cpp", h: "cpp", "c++": "cpp", "h++": "cpp", hpp: "cpp", crmsh: "crmsh", crm: "crmsh", pcmk: "crmsh", crystal: "crystal", cr: "crystal", cs: "cs", csharp: "cs", csp: "csp", css: "css", d: "d", dart: "dart", delphi: "delphi", dpr: "delphi", dfm: "delphi", pas: "delphi", pascal: "delphi", freepascal: "delphi", lazarus: "delphi", lpr: "delphi", lfm: "delphi", diff: "diff", patch: "diff", django: "django", jinja: "django", dns: "dns", bind: "dns", zone: "dns", dockerfile: "dockerfile", docker: "dockerfile", dos: "dos", bat: "dos", cmd: "dos", dsconfig: "dsconfig", dts: "dts", dust: "dust", dst: "dust", ebnf: "ebnf", elixir: "elixir", elm: "elm", erb: "erb", "erlang-repl": "erlang-repl", erlang: "erlang", erl: "erlang", excel: "excel", xlsx: "excel", xls: "excel", fix: "fix", flix: "flix", fortran: "fortran", f90: "fortran", f95: "fortran", fsharp: "fsharp", fs: "fsharp", gams: "gams", gms: "gams", gauss: "gauss", gss: "gauss", gcode: "gcode", nc: "gcode", gherkin: "gherkin", feature: "gherkin", glsl: "glsl", go: "go", golang: "go", golo: "golo", gradle: "gradle", groovy: "groovy", haml: "haml", handlebars: "handlebars", hbs: "handlebars", "html.hbs": "handlebars", "html.handlebars": "handlebars", haskell: "haskell", hs: "haskell", haxe: "haxe", hx: "haxe", hsp: "hsp", htmlbars: "htmlbars", http: "http", https: "http", hy: "hy", hylang: "hy", inform7: "inform7", i7: "inform7", ini: "ini", toml: "ini", irpf90: "irpf90", java: "java", jsp: "java", javascript: "javascript", js: "javascript", jsx: "javascript", "jboss-cli": "jboss-cli", "wildfly-cli": "jboss-cli", json: "json", "julia-repl": "julia-repl", julia: "julia", kotlin: "kotlin", lasso: "lasso", ls: "livescript", lassoscript: "lasso", ldif: "ldif", leaf: "leaf", less: "less", lisp: "lisp", livecodeserver: "livecodeserver", livescript: "livescript", llvm: "llvm", lsl: "lsl", lua: "lua", makefile: "makefile", mk: "makefile", mak: "makefile", markdown: "markdown", md: "markdown", mkdown: "markdown", mkd: "markdown", mathematica: "mathematica", mma: "mathematica", matlab: "matlab", maxima: "maxima", mel: "mel", mercury: "mercury", m: "mercury", moo: "mercury", mipsasm: "mipsasm", mips: "mipsasm", mizar: "mizar", mojolicious: "mojolicious", monkey: "monkey", moonscript: "moonscript", moon: "moonscript", n1ql: "n1ql", nginx: "nginx", nginxconf: "nginx", nimrod: "nimrod", nim: "nimrod", nix: "nix", nixos: "nix", nsis: "nsis", objectivec: "objectivec", mm: "objectivec", objc: "objectivec", "obj-c": "objectivec", ocaml: "ocaml", ml: "sml", openscad: "openscad", scad: "openscad", oxygene: "oxygene", parser3: "parser3", perl: "perl", pl: "perl", pm: "perl", pf: "pf", "pf.conf": "pf", php: "php", php3: "php", php4: "php", php5: "php", php6: "php", pony: "pony", powershell: "powershell", ps: "powershell", processing: "processing", profile: "profile", prolog: "prolog", protobuf: "protobuf", puppet: "puppet", pp: "puppet", purebasic: "purebasic", pb: "purebasic", pbi: "purebasic", python: "python", py: "python", gyp: "python", q: "q", k: "q", kdb: "q", qml: "qml", qt: "qml", r: "r", rib: "rib", roboconf: "roboconf", graph: "roboconf", instances: "roboconf", routeros: "routeros", mikrotik: "routeros", rsl: "rsl", ruby: "ruby", rb: "ruby", gemspec: "ruby", podspec: "ruby", thor: "ruby", irb: "ruby", ruleslanguage: "ruleslanguage", rust: "rust", rs: "rust", scala: "scala", scheme: "scheme", scilab: "scilab", sci: "scilab", scss: "scss", shell: "shell", console: "shell", smali: "smali", smalltalk: "smalltalk", st: "smalltalk", sml: "sml", sqf: "sqf", sql: "sql", stan: "stan", stata: "stata", do: "stata", ado: "stata", step21: "step21", p21: "step21", step: "step21", stp: "step21", stylus: "stylus", styl: "stylus", subunit: "subunit", swift: "swift", taggerscript: "taggerscript", tap: "tap", tcl: "tcl", tk: "tcl", tex: "tex", thrift: "thrift", tp: "tp", twig: "twig", craftcms: "twig", typescript: "typescript", ts: "typescript", vala: "vala", vbnet: "vbnet", vb: "vbnet", "vbscript-html": "vbscript-html", vbscript: "vbscript", vbs: "vbscript", verilog: "verilog", v: "verilog", sv: "verilog", svh: "verilog", vhdl: "vhdl", vim: "vim", x86asm: "x86asm", xl: "xl", tao: "xl", xml: "xml", html: "xml", xhtml: "xml", rss: "xml", atom: "xml", xjb: "xml", xsd: "xml", xsl: "xml", plist: "xml", xquery: "xquery", xpath: "xquery", xq: "xquery", yaml: "yaml", yml: "yaml", YAML: "yaml", zephir: "zephir", zep: "zephir" };}, function (e, t, n) {"use strict";function r(e) {return e && e.__esModule ? e : { default: e };}t.__esModule = !0;var o = n(72),i = r(o),a = n(71),s = r(a),l = "function" == typeof s.default && "symbol" == typeof i.default ? function (e) {return typeof e;} : function (e) {return e && "function" == typeof s.default && e.constructor === s.default && e !== s.default.prototype ? "symbol" : typeof e;};t.default = "function" == typeof s.default && "symbol" === l(i.default) ? function (e) {return void 0 === e ? "undefined" : l(e);} : function (e) {return e && "function" == typeof s.default && e.constructor === s.default && e !== s.default.prototype ? "symbol" : void 0 === e ? "undefined" : l(e);};}, function (e, t) {var n = {}.toString;e.exports = function (e) {return n.call(e).slice(8, -1);};}, function (e, t, n) {var r = n(8),o = n(1).document,i = r(o) && r(o.createElement);e.exports = function (e) {return i ? o.createElement(e) : {};};}, function (e, t, n) {var r = n(1),o = n(10),i = n(78),a = n(4),s = n(2),l = function l(e, t, n) {var c,u,p,_ = e & l.F,d = e & l.G,h = e & l.S,f = e & l.P,m = e & l.B,g = e & l.W,b = d ? o : o[t] || (o[t] = {}),v = b.prototype,k = d ? r : h ? r[t] : (r[t] || {}).prototype;d && (n = t);for (c in n) {(u = !_ && k && void 0 !== k[c]) && s(b, c) || (p = u ? k[c] : n[c], b[c] = d && "function" != typeof k[c] ? n[c] : m && u ? i(p, r) : g && k[c] == p ? function (e) {var t = function t(_t, n, r) {if (this instanceof e) {switch (arguments.length) {case 0:return new e();case 1:return new e(_t);case 2:return new e(_t, n);}return new e(_t, n, r);}return e.apply(this, arguments);};return t.prototype = e.prototype, t;}(p) : f && "function" == typeof p ? i(Function.call, p) : p, f && ((b.virtual || (b.virtual = {}))[c] = p, e & l.R && v && !v[c] && a(v, c, p)));}};l.F = 1, l.G = 2, l.S = 4, l.P = 8, l.B = 16, l.W = 32, l.U = 64, l.R = 128, e.exports = l;}, function (e, t, n) {e.exports = !n(3) && !n(11)(function () {return 7 != Object.defineProperty(n(39)("div"), "a", { get: function get() {return 7;} }).a;});}, function (e, t, n) {"use strict";var r = n(12),o = n(40),i = n(47),a = n(4),s = n(21),l = n(83),c = n(24),u = n(89),p = n(7)("iterator"),_ = !([].keys && "next" in [].keys()),d = function d() {return this;};e.exports = function (e, t, n, h, f, m, g) {l(n, t, h);var b,v,k,w = function w(e) {if (!_ && e in E) return E[e];switch (e) {case "keys":case "values":return function () {return new n(this, e);};}return function () {return new n(this, e);};},x = t + " Iterator",y = "values" == f,C = !1,E = e.prototype,D = E[p] || E["@@iterator"] || f && E[f],T = D || w(f),A = f ? y ? w("entries") : T : void 0,S = "Array" == t ? E.entries || D : D;if (S && (k = u(S.call(new e()))) !== Object.prototype && k.next && (c(k, x, !0), r || "function" == typeof k[p] || a(k, p, d)), y && D && "values" !== D.name && (C = !0, T = function T() {return D.call(this);}), r && !g || !_ && !C && E[p] || a(E, p, T), s[t] = T, s[x] = d, f) if (b = { values: y ? T : w("values"), keys: m ? T : w("keys"), entries: A }, g) for (v in b) {v in E || i(E, v, b[v]);} else o(o.P + o.F * (_ || C), t, b);return b;};}, function (e, t, n) {var r = n(9),o = n(86),i = n(20),a = n(25)("IE_PROTO"),s = function s() {},_l = function l() {var e,t = n(39)("iframe"),r = i.length;for (t.style.display = "none", n(80).appendChild(t), t.src = "javascript:", e = t.contentWindow.document, e.open(), e.write("<script>document.F=Object<\/script>"), e.close(), _l = e.F; r--;) {delete _l.prototype[i[r]];}return _l();};e.exports = Object.create || function (e, t) {var n;return null !== e ? (s.prototype = r(e), n = new s(), s.prototype = null, n[a] = e) : n = _l(), void 0 === t ? n : o(n, t);};}, function (e, t, n) {var r = n(46),o = n(20).concat("length", "prototype");t.f = Object.getOwnPropertyNames || function (e) {return r(e, o);};}, function (e, t) {t.f = Object.getOwnPropertySymbols;}, function (e, t, n) {var r = n(2),o = n(6),i = n(77)(!1),a = n(25)("IE_PROTO");e.exports = function (e, t) {var n,s = o(e),l = 0,c = [];for (n in s) {n != a && r(s, n) && c.push(n);}for (; t.length > l;) {r(s, n = t[l++]) && (~i(c, n) || c.push(n));}return c;};}, function (e, t, n) {e.exports = n(4);}, function (e, t, n) {"use strict";e.exports = n(105);}, function (e, t, n) {"use strict";var r = "<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^\"'=<>`\\x00-\\x20]+|'[^']*'|\"[^\"]*\"))?)*\\s*\\/?>",o = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>",i = new RegExp("^(?:" + r + "|" + o + "|\x3c!----\x3e|\x3c!--(?:-?[^>-])(?:-?[^-])*--\x3e|<[?].*?[?]>|<![A-Z]+\\s+[^>]*>|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>)"),a = new RegExp("^(?:" + r + "|" + o + ")");e.exports.HTML_TAG_RE = i, e.exports.HTML_OPEN_CLOSE_TAG_RE = a;}, function (e, t, n) {"use strict";e.exports.tokenize = function (e, t) {var n,r,o,i = e.pos,a = e.src.charCodeAt(i);if (t) return !1;if (95 !== a && 42 !== a) return !1;for (r = e.scanDelims(e.pos, 42 === a), n = 0; n < r.length; n++) {o = e.push("text", "", 0), o.content = String.fromCharCode(a), e.delimiters.push({ marker: a, length: r.length, jump: n, token: e.tokens.length - 1, level: e.level, end: -1, open: r.can_open, close: r.can_close });}return e.pos += r.length, !0;}, e.exports.postProcess = function (e) {var t,n,r,o,i,a,s = e.delimiters,l = e.delimiters.length;for (t = l - 1; t >= 0; t--) {n = s[t], 95 !== n.marker && 42 !== n.marker || -1 !== n.end && (r = s[n.end], a = t > 0 && s[t - 1].end === n.end + 1 && s[t - 1].token === n.token - 1 && s[n.end + 1].token === r.token + 1 && s[t - 1].marker === n.marker, i = String.fromCharCode(n.marker), o = e.tokens[n.token], o.type = a ? "strong_open" : "em_open", o.tag = a ? "strong" : "em", o.nesting = 1, o.markup = a ? i + i : i, o.content = "", o = e.tokens[r.token], o.type = a ? "strong_close" : "em_close", o.tag = a ? "strong" : "em", o.nesting = -1, o.markup = a ? i + i : i, o.content = "", a && (e.tokens[s[t - 1].token].content = "", e.tokens[s[n.end + 1].token].content = "", t--));}};}, function (e, t, n) {"use strict";e.exports.tokenize = function (e, t) {var n,r,o,i,a,s = e.pos,l = e.src.charCodeAt(s);if (t) return !1;if (126 !== l) return !1;if (r = e.scanDelims(e.pos, !0), i = r.length, a = String.fromCharCode(l), i < 2) return !1;for (i % 2 && (o = e.push("text", "", 0), o.content = a, i--), n = 0; n < i; n += 2) {o = e.push("text", "", 0), o.content = a + a, e.delimiters.push({ marker: l, jump: n, token: e.tokens.length - 1, level: e.level, end: -1, open: r.can_open, close: r.can_close });}return e.pos += r.length, !0;}, e.exports.postProcess = function (e) {var t,n,r,o,i,a = [],s = e.delimiters,l = e.delimiters.length;for (t = 0; t < l; t++) {r = s[t], 126 === r.marker && -1 !== r.end && (o = s[r.end], i = e.tokens[r.token], i.type = "s_open", i.tag = "s", i.nesting = 1, i.markup = "~~", i.content = "", i = e.tokens[o.token], i.type = "s_close", i.tag = "s", i.nesting = -1, i.markup = "~~", i.content = "", "text" === e.tokens[o.token - 1].type && "~" === e.tokens[o.token - 1].content && a.push(o.token - 1));}for (; a.length;) {for (t = a.pop(), n = t + 1; n < e.tokens.length && "s_close" === e.tokens[n].type;) {n++;}n--, t !== n && (i = e.tokens[n], e.tokens[n] = e.tokens[t], e.tokens[t] = i);}};}, function (e, t, n) {"use strict";e.exports.encode = n(175), e.exports.decode = n(174), e.exports.format = n(176), e.exports.parse = n(177);}, function (e, t) {e.exports = /[\0-\x1F\x7F-\x9F]/;}, function (e, t) {e.exports = /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;}, function (e, t) {e.exports = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;}, function (e, t, n) {function r(e) {o || (n(195), n(196));}var o = !1,i = n(16)(n(61), n(192), r, "data-v-f49bc018", null);i.options.__file = "C:\\Users\\LWK\\Desktop\\mavonEditor-master\\mavonEditor-master\\src\\mavon-editor.vue", i.esModule && Object.keys(i.esModule).some(function (e) {return "default" !== e && "__" !== e.substr(0, 2);}) && console.error("named exports are not supported in *.vue files."), i.options.functional && console.error("[vue-loader] mavon-editor.vue: functional components are not supported with templates, they should use render functions."), e.exports = i.exports;}, function (e, t, n) {"use strict";var r = n(188),o = { autoTextarea: r, install: function install(e) {e.component("auto-textarea", r);} };e.exports = o;}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 }), t.default = { data: function data() {var e = this;return { temp_value: function () {return e.value;}(), s_autofocus: function () {if (e.autofocus) return "autofocus";}() };}, created: function created() {}, props: { fullHeight: { type: Boolean, default: !1 }, autofocus: { type: Boolean, default: !1 }, value: { type: String, default: "" }, placeholder: { type: String, default: "" }, border: { type: Boolean, default: !1 }, resize: { type: Boolean, default: !1 }, onchange: { type: Function, default: null }, fontSize: { type: String, default: "14px" }, lineHeight: { type: String, default: "18px" } }, methods: { change: function change(e) {this.onchange && this.onchange(this.temp_value, e);} }, watch: { value: function value(e, t) {this.temp_value = e;}, temp_value: function temp_value(e, t) {this.$emit("input", e);} } };}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 }), t.default = { name: "s-md-toolbar-left", props: { editable: { type: Boolean, default: !0 }, transition: { type: Boolean, default: !0 }, toolbars: { type: Object, required: !0 }, d_words: { type: Object, required: !0 }, image_filter: { type: Function, default: null } }, data: function data() {return { img_file: [[0, null]], img_timer: null, header_timer: null, s_img_dropdown_open: !1, s_header_dropdown_open: !1, s_img_link_open: !1, trigger: null, num: 0, link_text: "", link_addr: "", link_type: "link" };}, methods: { $imgLinkAdd: function $imgLinkAdd() {this.$emit("toolbar_left_addlink", this.link_type, this.link_text, this.link_addr), this.s_img_link_open = !1;}, $toggle_imgLinkAdd: function $toggle_imgLinkAdd(e) {var t = this;this.link_type = e, this.link_text = this.link_addr = "", this.s_img_link_open = !0, this.$nextTick(function () {t.$refs.linkTextInput.focus();}), this.s_img_dropdown_open = !1;}, $imgFileListClick: function $imgFileListClick(e) {this.$emit("imgTouch", this.img_file[e]);}, $changeUrl: function $changeUrl(e, t) {this.img_file[e][0] = t;}, $imgFileAdd: function $imgFileAdd(e) {this.img_file.push([++this.num, e]), this.$emit("imgAdd", this.num, e), this.s_img_dropdown_open = !1;}, $imgFilesAdd: function $imgFilesAdd(e) {for (var t = "function" == typeof this.image_filter, n = 0; n < e.length; n++) {t && !0 === this.image_filter(e[n]) ? this.$imgFileAdd(e[n]) : !t && e[n].type.match(/^image\//i) && this.$imgFileAdd(e[n]);}}, $imgAdd: function $imgAdd(e) {this.$imgFilesAdd(e.target.files), e.target.value = "";}, $imgDel: function $imgDel(e) {this.$emit("imgDel", this.img_file[e]), this.img_file.splice(e, 1), this.num--, this.s_img_dropdown_open = !1;}, isEqualName: function isEqualName(e, t) {return !(!this.img_file[t][1] || this.img_file[t][1].name != e && this.img_file[t][1]._name != e);}, $imgDelByFilename: function $imgDelByFilename(e) {for (var t = 0; this.img_file.length > t;) {if (this.img_file[t][1] == e || this.isEqualName(e, t)) return this.$imgDel(t), !0;t += 1;}return !1;}, $imgAddByFilename: function $imgAddByFilename(e, t) {for (var n = 0; n < this.img_file.length; n++) {if (this.img_file[n][0] == e) return !1;}return this.img_file[0][0] = e, this.img_file[0][1] = t, this.img_file[0][2] = e, this.img_file.unshift(["./" + this.num, null]), this.$emit("imgAdd", this.img_file[1][0], t, !1), !0;}, $imgAddByUrl: function $imgAddByUrl(e, t) {for (var n = 0; n < this.img_file.length; n++) {if (this.img_file[n][0] == e) return !1;}return this.img_file[0][0] = e, this.img_file[0][1] = t, this.img_file.unshift(["./" + this.num, null]), !0;}, $imgUpdateByFilename: function $imgUpdateByFilename(e, t) {for (var n = 0; n < this.img_file.length; n++) {if (this.img_file[n][0] == e || this.isEqualName(e, n)) return this.img_file[n][1] = t, this.$emit("imgAdd", e, t, !1), !0;}return !1;}, $mouseenter_img_dropdown: function $mouseenter_img_dropdown() {this.editable && (clearTimeout(this.img_timer), this.s_img_dropdown_open = !0);}, $mouseleave_img_dropdown: function $mouseleave_img_dropdown() {var e = this;this.img_timer = setTimeout(function () {e.s_img_dropdown_open = !1;}, 200);}, $mouseenter_header_dropdown: function $mouseenter_header_dropdown() {this.editable && (clearTimeout(this.header_timer), this.s_header_dropdown_open = !0);}, $mouseleave_header_dropdown: function $mouseleave_header_dropdown() {var e = this;this.header_timer = setTimeout(function () {e.s_header_dropdown_open = !1;}, 200);}, $clicks: function $clicks(e) {this.editable && this.$emit("toolbar_left_click", e);}, $click_header: function $click_header(e) {this.$emit("toolbar_left_click", e), this.s_header_dropdown_open = !1;}, handleClose: function handleClose(e) {this.s_img_dropdown_open = !1;} } };}, function (e, t, n) {"use strict";Object.defineProperty(t, "__esModule", { value: !0 }), t.default = { name: "s-md-toolbar-right", props: { s_subfield: { type: Boolean, required: !0 }, toolbars: { type: Object, required: !0 }, s_preview_switch: { type: Boolean, required: !0 }, s_fullScreen: { type: Boolean, required: !0 }, s_html_code: { type: Boolean, required: !0 }, s_navigation: { type: Boolean, required: !0 }, d_words: { type: Object, required: !0 } }, methods: { $clicks: function $clicks(e) {this.$emit("toolbar_right_click", e);} } };}, function (module, __webpack_exports__, __webpack_require__) {"use strict";Object.defineProperty(__webpack_exports__, "__esModule", { value: !0 });var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__ = __webpack_require__(37),__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__),__WEBPACK_IMPORTED_MODULE_1_auto_textarea__ = __webpack_require__(57),__WEBPACK_IMPORTED_MODULE_1_auto_textarea___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_auto_textarea__),__WEBPACK_IMPORTED_MODULE_2__lib_core_keydown_listen_js__ = __webpack_require__(66),__WEBPACK_IMPORTED_MODULE_3__lib_core_hljs_lang_hljs_css_js__ = __webpack_require__(65),__WEBPACK_IMPORTED_MODULE_4__lib_core_hljs_lang_hljs_js__ = __webpack_require__(36),__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__ = __webpack_require__(18),__WEBPACK_IMPORTED_MODULE_6__lib_util_js__ = __webpack_require__(70),__WEBPACK_IMPORTED_MODULE_7__lib_toolbar_left_click_js__ = __webpack_require__(68),__WEBPACK_IMPORTED_MODULE_8__lib_toolbar_right_click_js__ = __webpack_require__(69),__WEBPACK_IMPORTED_MODULE_9__lib_config_js__ = __webpack_require__(63),__WEBPACK_IMPORTED_MODULE_10__lib_core_highlight_js__ = __webpack_require__(64),__WEBPACK_IMPORTED_MODULE_11__lib_mixins_markdown_js__ = __webpack_require__(67),__WEBPACK_IMPORTED_MODULE_12__components_md_toolbar_left_vue__ = __webpack_require__(34),__WEBPACK_IMPORTED_MODULE_12__components_md_toolbar_left_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__components_md_toolbar_left_vue__),__WEBPACK_IMPORTED_MODULE_13__components_md_toolbar_right_vue__ = __webpack_require__(35),__WEBPACK_IMPORTED_MODULE_13__components_md_toolbar_right_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__components_md_toolbar_right_vue__),__WEBPACK_IMPORTED_MODULE_14__lib_font_css_fontello_css__ = __webpack_require__(107),__WEBPACK_IMPORTED_MODULE_14__lib_font_css_fontello_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__lib_font_css_fontello_css__),__WEBPACK_IMPORTED_MODULE_15__lib_css_md_css__ = __webpack_require__(106),__WEBPACK_IMPORTED_MODULE_15__lib_css_md_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__lib_css_md_css__);__webpack_exports__.default = { mixins: [__WEBPACK_IMPORTED_MODULE_11__lib_mixins_markdown_js__.a], props: { scrollStyle: { type: Boolean, default: !0 }, boxShadow: { type: Boolean, default: !0 }, transition: { type: Boolean, default: !0 }, autofocus: { type: Boolean, default: !0 }, fontSize: { type: String, default: "15px" }, toolbarsBackground: { type: String, default: "#ffffff" }, editorBackground: { type: String, default: "#ffffff" }, previewBackground: { type: String, default: "#fbfbfb" }, boxShadowStyle: { type: String, default: "0 2px 12px 0 rgba(0, 0, 0, 0.1)" }, help: { type: String, default: null }, value: { type: String, default: "" }, language: { type: String, default: "zh-CN" }, subfield: { type: Boolean, default: !0 }, navigation: { type: Boolean, default: !1 }, defaultOpen: { type: String, default: null }, editable: { type: Boolean, default: !0 }, toolbarsFlag: { type: Boolean, default: !0 }, toolbars: { type: Object, default: function _default() {return __WEBPACK_IMPORTED_MODULE_9__lib_config_js__.a.toolbars;} }, codeStyle: { type: String, default: function _default() {return "github";} }, placeholder: { type: String, default: null }, ishljs: { type: Boolean, default: !0 }, externalLink: { type: [Object, Boolean], default: !0 }, imageFilter: { type: Function, default: null }, imageClick: { type: Function, default: null }, tabSize: { type: Number, default: 0 }, shortCut: { type: Boolean, default: !0 } }, data: function data() {var e = this;return { s_right_click_menu_show: !1, right_click_menu_top: 0, right_click_menu_left: 0, s_subfield: function () {return e.subfield;}(), s_autofocus: !0, s_navigation: function () {return e.navigation;}(), s_scrollStyle: function () {return e.scrollStyle;}(), d_value: "", d_render: "", s_preview_switch: function () {var t = e.defaultOpen;return t || (t = e.subfield ? "preview" : "edit"), "preview" === t;}(), s_fullScreen: !1, s_help: !1, s_html_code: !1, d_help: null, d_words: null, edit_scroll_height: -1, s_readmodel: !1, s_table_enter: !1, d_history: function () {var t = [];return t.push(e.value), t;}(), d_history_index: 0, currentTimeout: "", d_image_file: [], d_preview_imgsrc: null, s_external_link: { markdown_css: function markdown_css() {return "https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.9.0/github-markdown.min.css";}, hljs_js: function hljs_js() {return "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js";}, hljs_lang: function hljs_lang(e) {return "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/languages/" + e + ".min.js";}, hljs_css: function hljs_css(e) {return __WEBPACK_IMPORTED_MODULE_3__lib_core_hljs_lang_hljs_css_js__.a[e] ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/" + e + ".min.css" : "";}, katex_js: function katex_js() {return "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.8.3/katex.min.js";}, katex_css: function katex_css() {return "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.8.3/katex.min.css";} }, p_external_link: {} };}, created: function created() {var e = this;this.initLanguage(), this.initExternalFuc(), this.$nextTick(function () {e.editableTextarea();});}, mounted: function mounted() {var e = this;this.$el.addEventListener("paste", function (t) {e.$paste(t);}), this.$el.addEventListener("drop", function (t) {e.$drag(t);}), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib_core_keydown_listen_js__.a)(this), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.a)(this), this.autofocus && this.getTextareaDom().focus(), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.b)(this), this.d_value = this.value, document.body.appendChild(this.$refs.help), this.loadExternalLink("markdown_css", "css"), this.loadExternalLink("katex_css", "css"), this.loadExternalLink("katex_js", "js", function () {e.iRender(!0);}), this.loadExternalLink("hljs_js", "js", function () {e.iRender(!0);}), "object" === __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default()(e.externalLink) && "function" == typeof e.externalLink.markdown_css || e.codeStyleChange(e.codeStyle, !0);}, beforeDestroy: function beforeDestroy() {document.body.removeChild(this.$refs.help);}, getMarkdownIt: function getMarkdownIt() {return this.mixins[0].data().markdownIt;}, methods: { loadExternalLink: function loadExternalLink(e, t, n) {if ("function" != typeof this.p_external_link[e]) return void (0 != this.p_external_link[e] && console.error("external_link." + e, "is not a function, if you want to disabled this error log, set external_link." + e, "to function or false"));var r = { css: __WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.c, js: __WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.d };r.hasOwnProperty(t) && r[t](this.p_external_link[e](), n);}, initExternalFuc: function initExternalFuc() {for (var e = this, t = ["markdown_css", "hljs_js", "hljs_css", "hljs_lang", "katex_js", "katex_css"], n = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default()(e.externalLink), r = "object" === n, o = "boolean" === n, i = 0; i < t.length; i++) {o && !e.externalLink || r && !1 === e.externalLink[t[i]] ? e.p_external_link[t[i]] = !1 : r && "function" == typeof e.externalLink[t[i]] ? e.p_external_link[t[i]] = e.externalLink[t[i]] : e.p_external_link[t[i]] = e.s_external_link[t[i]];}}, textAreaFocus: function textAreaFocus() {this.$refs.vNoteTextarea.$refs.vTextarea.focus();}, $drag: function $drag(e) {var t = e.dataTransfer;if (t) {var n = t.files;n.length > 0 && (e.preventDefault(), this.$refs.toolbar_left.$imgFilesAdd(n));}}, $paste: function $paste(e) {var t = e.clipboardData;if (t) {var n = t.items;if (!n) return;for (var r = t.types || [], o = null, i = 0; i < r.length; i++) {if ("Files" === r[i]) {o = n[i];break;}}if (o && "file" === o.kind) {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib_util_js__.a)(e);var a = o.getAsFile();this.$refs.toolbar_left.$imgFilesAdd([a]);}}}, $imgTouch: function $imgTouch(e) {}, $imgDel: function $imgDel(e) {this.markdownIt.image_del(e[1]);var t = e[0],n = new RegExp("\\!\\[" + e[1]._name + "\\]\\(" + t + "\\)", "g");this.d_value = this.d_value.replace(n, ""), this.iRender(), this.$emit("imgDel", e);}, $imgAdd: function $imgAdd(e, t, n) {void 0 === n && (n = !0);var r = this;if (null == this.__rFilter && (this.__rFilter = /^image\//i), this.__oFReader = new FileReader(), this.__oFReader.onload = function (o) {r.markdownIt.image_add(e, o.target.result), t.miniurl = o.target.result, !0 === n && (t._name = t.name.replace(/[\[\]\(\)\+\{\}&\|\\\*^%$#@\-]/g, ""), r.insertText(r.getTextareaDom(), { prefix: "![" + t._name + "](" + e + ")", subfix: "", str: "" }), r.$nextTick(function () {r.$emit("imgAdd", e, t);}));}, t) {var o = t;this.__rFilter.test(o.type) && this.__oFReader.readAsDataURL(o);}}, $imgUpdateByUrl: function $imgUpdateByUrl(e, t) {var n = this;this.markdownIt.image_add(e, t), this.$nextTick(function () {n.d_render = this.markdownIt.render(this.d_value);});}, $imgAddByUrl: function $imgAddByUrl(e, t) {return !!this.$refs.toolbar_left.$imgAddByUrl(e, t) && (this.$imgUpdateByUrl(e, t), !0);}, $img2Url: function $img2Url(fileIndex, url) {var reg_str = "/(!\\[[^\\[]*?\\](?=\\())\\(\\s*(" + fileIndex + ")\\s*\\)/g",reg = eval(reg_str);this.d_value = this.d_value.replace(reg, "$1(" + url + ")"), this.$refs.toolbar_left.$changeUrl(fileIndex, url), this.iRender();}, $imglst2Url: function $imglst2Url(e) {if (e instanceof Array) for (var t = 0; t < e.length; t++) {this.$img2Url(e[t][0], e[t][1]);}}, toolbar_left_click: function toolbar_left_click(e) {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__lib_toolbar_left_click_js__.a)(e, this);}, toolbar_left_addlink: function toolbar_left_addlink(e, t, n) {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__lib_toolbar_left_click_js__.b)(e, t, n, this);}, toolbar_right_click: function toolbar_right_click(e) {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__lib_toolbar_right_click_js__.a)(e, this);}, getNavigation: function getNavigation(e, t) {return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.e)(e, t);}, change: function change(e, t) {this.$emit("change", e, t);}, fullscreen: function fullscreen(e, t) {this.$emit("fullScreen", e, t);}, readmodel: function readmodel(e, t) {this.$emit("readModel", e, t);}, previewtoggle: function previewtoggle(e, t) {this.$emit("previewToggle", e, t);}, subfieldtoggle: function subfieldtoggle(e, t) {this.$emit("subfieldToggle", e, t);}, htmlcode: function htmlcode(e, t) {this.$emit("htmlCode", e, t);}, helptoggle: function helptoggle(e, t) {this.$emit("helpToggle", e, t);}, save: function save(e, t) {this.$emit("save", e, t);}, navigationtoggle: function navigationtoggle(e, t) {this.$emit("navigationToggle", e, t);}, $toolbar_right_read_change_status: function $toolbar_right_read_change_status() {this.s_readmodel = !this.s_readmodel, this.readmodel && this.readmodel(this.s_readmodel, this.d_value), this.s_readmodel && this.toolbars.navigation && this.getNavigation(this, !0);}, $v_edit_scroll: function $v_edit_scroll(e) {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.f)(e, this);}, getTextareaDom: function getTextareaDom() {return this.$refs.vNoteTextarea.$refs.vTextarea;}, insertText: function insertText(e, t) {var n = t.prefix,r = t.subfix,o = t.str,i = t.type;__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.g)(e, { prefix: n, subfix: r, str: o, type: i }, this);}, insertTab: function insertTab() {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.h)(this, this.tabSize);}, insertOl: function insertOl() {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.i)(this);}, removeLine: function removeLine() {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.j)(this);}, insertUl: function insertUl() {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.k)(this);}, unInsertTab: function unInsertTab() {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.l)(this, this.tabSize);}, insertEnter: function insertEnter(e) {__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.m)(this, e);}, saveHistory: function saveHistory() {this.d_history.splice(this.d_history_index + 1, this.d_history.length), this.d_history.push(this.d_value), this.d_history_index = this.d_history.length - 1;}, initLanguage: function initLanguage() {var e = __WEBPACK_IMPORTED_MODULE_9__lib_config_js__.a.langList.indexOf(this.language) >= 0 ? this.language : "zh-CN",t = this;t.$render(__WEBPACK_IMPORTED_MODULE_9__lib_config_js__.a["help_" + e], function (e) {t.d_help = e;}), this.d_words = __WEBPACK_IMPORTED_MODULE_9__lib_config_js__.a["words_" + e];}, editableTextarea: function editableTextarea() {var e = this.$refs.vNoteTextarea.$refs.vTextarea;this.editable ? e.removeAttribute("disabled") : e.setAttribute("disabled", "disabled");}, codeStyleChange: function codeStyleChange(e, t) {if (t = t || !1, "function" != typeof this.p_external_link.hljs_css) return void (0 != this.p_external_link.hljs_css && console.error("external_link.hljs_css is not a function, if you want to disabled this error log, set external_link.hljs_css to function or false"));var n = this.p_external_link.hljs_css(e);0 === n.length && t && (console.warn("hljs color scheme", e, "do not exist, loading default github"), n = this.p_external_link.hljs_css("github")), n.length > 0 ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.c)(n) : console.warn("hljs color scheme", e, "do not exist, hljs color scheme will not change");}, iRender: function iRender(e) {var t = this;this.$render(t.d_value, function (n) {t.d_render = n, e || t.change && t.change(t.d_value, t.d_render), t.s_navigation && __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__lib_core_extra_function_js__.e)(t, !1), t.$emit("input", t.d_value), t.d_value !== t.d_history[t.d_history_index] && (window.clearTimeout(t.currentTimeout), t.currentTimeout = setTimeout(function () {t.saveHistory();}, 500));});}, $emptyHistory: function $emptyHistory() {this.d_history = [this.d_value], this.d_history_index = 0;} }, watch: { d_value: function d_value(e, t) {this.iRender();}, value: function value(e, t) {e !== this.d_value && (this.d_value = e);}, subfield: function subfield(e, t) {this.s_subfield = e;}, d_history_index: function d_history_index() {this.d_history_index > 20 && (this.d_history.shift(), this.d_history_index = this.d_history_index - 1), this.d_value = this.d_history[this.d_history_index];}, language: function language(e) {this.initLanguage();}, editable: function editable() {this.editableTextarea();}, defaultOpen: function defaultOpen(e) {var t = e;return t || (t = this.subfield ? "preview" : "edit"), this.s_preview_switch = "preview" === t;}, codeStyle: function codeStyle(e) {this.codeStyleChange(e);} }, components: { "v-autoTextarea": __WEBPACK_IMPORTED_MODULE_1_auto_textarea__.autoTextarea, "v-md-toolbar-left": __WEBPACK_IMPORTED_MODULE_12__components_md_toolbar_left_vue___default.a, "v-md-toolbar-right": __WEBPACK_IMPORTED_MODULE_13__components_md_toolbar_right_vue___default.a } };}, function (e, t, n) {"use strict";var r = n(56),o = { markdownIt: r.mixins[0].data().markdownIt, mavonEditor: r, LeftToolbar: n(34), RightToolbar: n(35), install: function install(e) {e.component("mavon-editor", r);} };e.exports = o;}, function (e, t, n) {"use strict";n.d(t, "a", function () {return M;});var r = n(185),o = n.n(r),i = n(180),a = n.n(i),s = n(181),l = n.n(s),c = n(183),u = n.n(c),p = n(184),_ = n.n(p),d = n(179),h = n.n(d),f = n(182),m = n.n(f),g = n(206),b = n.n(g),v = n(201),k = n.n(v),w = n(202),x = n.n(w),y = n(204),C = n.n(y),E = n(205),D = n.n(E),T = n(200),A = n.n(T),S = n(203),L = n.n(S),M = { "help_zh-CN": o.a, "help_pt-BR": u.a, help_en: a.a, help_fr: l.a, help_ru: _.a, help_de: h.a, help_ja: m.a, "words_zh-CN": b.a, "words_pt-BR": C.a, words_en: k.a, words_fr: x.a, words_ru: D.a, words_de: A.a, words_ja: L.a, langList: ["en", "zh-CN", "fr", "pt-BR", "ru", "de", "ja"], toolbars: { bold: !0, italic: !0, header: !0, underline: !0, strikethrough: !0, mark: !0, superscript: !0, subscript: !0, quote: !0, ol: !0, ul: !0, link: !0, imagelink: !0, code: !0, table: !0, undo: !0, redo: !0, trash: !0, save: !0, alignleft: !0, aligncenter: !0, alignright: !0, navigation: !0, subfield: !0, fullscreen: !0, readmodel: !0, htmlcode: !0, help: !0, preview: !0 } };}, function (e, t, n) {"use strict";n(18);}, function (e, t, n) {"use strict";t.a = { agate: 1, androidstudio: 1, "arduino-light": 1, arta: 1, ascetic: 1, "atelier-cave-dark": 1, "atelier-cave-light": 1, "atelier-dune-dark": 1, "atelier-dune-light": 1, "atelier-estuary-dark": 1, "atelier-estuary-light": 1, "atelier-forest-dark": 1, "atelier-forest-light": 1, "atelier-heath-dark": 1, "atelier-heath-light": 1, "atelier-lakeside-dark": 1, "atelier-lakeside-light": 1, "atelier-plateau-dark": 1, "atelier-plateau-light": 1, "atelier-savanna-dark": 1, "atelier-savanna-light": 1, "atelier-seaside-dark": 1, "atelier-seaside-light": 1, "atelier-sulphurpool-dark": 1, "atelier-sulphurpool-light": 1, "atom-one-dark": 1, "atom-one-light": 1, "brown-paper": 1, "codepen-embed": 1, "color-brewer": 1, darcula: 1, dark: 1, darkula: 1, default: 1, docco: 1, dracula: 1, far: 1, foundation: 1, "github-gist": 1, github: 1, googlecode: 1, grayscale: 1, "gruvbox-dark": 1, "gruvbox-light": 1, hopscotch: 1, hybrid: 1, idea: 1, "ir-black": 1, "kimbie.dark": 1, "kimbie.light": 1, magula: 1, "mono-blue": 1, "monokai-sublime": 1, monokai: 1, obsidian: 1, ocean: 1, "paraiso-dark": 1, "paraiso-light": 1, pojoaque: 1, purebasic: 1, qtcreator_dark: 1, qtcreator_light: 1, railscasts: 1, rainbow: 1, routeros: 1, "school-book": 1, "solarized-dark": 1, "solarized-light": 1, sunburst: 1, "tomorrow-night-blue": 1, "tomorrow-night-bright": 1, "tomorrow-night-eighties": 1, "tomorrow-night": 1, tomorrow: 1, vs: 1, vs2015: 1, xcode: 1, xt256: 1, zenburn: 1 };}, function (e, t, n) {"use strict";n.d(t, "a", function () {return o;});var r = { F8: 119, F9: 120, F10: 121, F11: 122, F12: 123, B: 66, I: 73, H: 72, U: 85, D: 68, M: 77, Q: 81, O: 79, L: 76, S: 83, Z: 90, Y: 89, C: 67, T: 84, R: 82, DELETE: 8, TAB: 9, ENTER: 13, ONE: 97, TWO: 98, THREE: 99, FOUR: 100, FIVE: 101, SIX: 102, _ONE: 49, _TWO: 50, _THREE: 51, _FOUR: 52, _FIVE: 53, _SIX: 54 },o = function o(e) {e.shortCut && e.$el.addEventListener("keydown", function (t) {if (t.ctrlKey || t.metaKey || t.altKey || t.shiftKey) {if (!t.ctrlKey && !t.metaKey || t.altKey || t.shiftKey) {if ((t.ctrlKey || t.metaKey) && t.altKey && !t.shiftKey) switch (t.keyCode) {case r.S:t.preventDefault(), e.toolbar_left_click("superscript");break;case r.U:t.preventDefault(), e.toolbar_left_click("ul");break;case r.L:t.preventDefault(), e.toolbar_left_click("imagelink");break;case r.C:t.preventDefault(), e.toolbar_left_click("code");break;case r.T:t.preventDefault(), e.toolbar_left_click("table");} else if ((t.ctrlKey || t.metaKey) && t.shiftKey && !t.altKey) switch (t.keyCode) {case r.S:t.preventDefault(), e.toolbar_left_click("subscript");break;case r.D:t.preventDefault(), e.toolbar_left_click("strikethrough");break;case r.L:t.preventDefault(), e.toolbar_left_click("alignleft");break;case r.R:t.preventDefault(), e.toolbar_left_click("alignright");break;case r.C:t.preventDefault(), e.toolbar_left_click("aligncenter");} else if (!t.ctrlKey && !t.metaKey && t.shiftKey && !t.altKey) switch (t.keyCode) {case r.TAB:e.$refs.toolbar_left.s_img_link_open || (t.preventDefault(), e.unInsertTab());}} else switch (t.keyCode) {case r.B:t.preventDefault(), e.toolbar_left_click("bold");break;case r.I:t.preventDefault(), e.toolbar_left_click("italic");break;case r.H:t.preventDefault(), e.toolbar_left_click("header");break;case r.U:t.preventDefault(), e.toolbar_left_click("underline");break;case r.D:t.preventDefault(), e.toolbar_left_click("removeLine");break;case r.M:t.preventDefault(), e.toolbar_left_click("mark");break;case r.Q:t.preventDefault(), e.toolbar_left_click("quote");break;case r.O:t.preventDefault(), e.toolbar_left_click("ol");break;case r.L:t.preventDefault(), e.toolbar_left_click("link");break;case r.S:t.preventDefault(), e.toolbar_left_click("save");break;case r.Z:t.preventDefault(), e.toolbar_left_click("undo");break;case r.Y:t.preventDefault(), e.toolbar_left_click("redo");break;case r.DELETE:t.preventDefault(), e.toolbar_left_click("trash");break;case r.ONE:t.preventDefault(), e.toolbar_left_click("header1");break;case r.TWO:t.preventDefault(), e.toolbar_left_click("header2");break;case r.THREE:t.preventDefault(), e.toolbar_left_click("header3");break;case r.FOUR:t.preventDefault(), e.toolbar_left_click("header4");break;case r.FIVE:t.preventDefault(), e.toolbar_left_click("header5");break;case r.SIX:t.preventDefault(), e.toolbar_left_click("header6");break;case r._ONE:t.preventDefault(), e.toolbar_left_click("header1");break;case r._TWO:t.preventDefault(), e.toolbar_left_click("header2");break;case r._THREE:t.preventDefault(), e.toolbar_left_click("header3");break;case r._FOUR:t.preventDefault(), e.toolbar_left_click("header4");break;case r._FIVE:t.preventDefault(), e.toolbar_left_click("header5");break;case r._SIX:t.preventDefault(), e.toolbar_left_click("header6");}} else switch (t.keyCode) {case r.F8:e.toolbars.navigation && (t.preventDefault(), e.toolbar_right_click("navigation"));break;case r.F9:e.toolbars.preview && (t.preventDefault(), e.toolbar_right_click("preview"));break;case r.F10:e.toolbars.fullscreen && (t.preventDefault(), e.toolbar_right_click("fullscreen"));break;case r.F11:e.toolbars.readmodel && (t.preventDefault(), e.toolbar_right_click("read"));break;case r.F12:e.toolbars.subfield && (t.preventDefault(), e.toolbar_right_click("subfield"));break;case r.TAB:e.$refs.toolbar_left.s_img_link_open || (t.preventDefault(), e.insertTab());break;case r.ENTER:e.$refs.toolbar_left.s_img_link_open ? (t.preventDefault(), e.$refs.toolbar_left.$imgLinkAdd()) : e.insertEnter(t);}});};}, function (e, t, n) {"use strict";var r = n(36),o = n(18),i = { html: !0, xhtmlOut: !0, breaks: !0, langPrefix: "lang-", linkify: !1, typographer: !0, quotes: "“”‘’" },a = n(129)(i),s = n(113),l = n(125),c = n(126),u = n(112),p = n(110),_ = n(119),d = n(122),h = n(124),f = n(127),m = n(111),g = n(128),b = a.renderer.rules.link_open || function (e, t, n, r, o) {return o.renderToken(e, t, n);};a.renderer.rules.link_open = function (e, t, n, r, o) {var i = e[t].attrIndex("href");if (e[t].attrs[i][1].startsWith("#")) return b(e, t, n, r, o);var a = e[t].attrIndex("target");return a < 0 ? e[t].attrPush(["target", "_blank"]) : e[t].attrs[a][1] = "_blank", b(e, t, n, r, o);};var v = n(120),k = n(123),w = n(121),x = {},y = [],C = { hljs: "auto", highlighted: !0, langCheck: function langCheck(e) {e && r.a[e] && !x[e] && (x[e] = 1, y.push(r.a[e]));} };a.use(v, C).use(s).use(c).use(l).use(m).use(m, "hljs-left").use(m, "hljs-center").use(m, "hljs-right").use(u).use(p).use(_).use(d).use(h).use(m).use(w).use(k).use(f).use(g), t.a = { data: function data() {return { markdownIt: a };}, mounted: function mounted() {C.highlighted = this.ishljs;}, methods: { $render: function $render(e, t) {var n = this;x = {}, y = [];var r = a.render(e);this.ishljs && y.length > 0 && n.$_render(e, t, r), t(r);}, $_render: function $_render(e, t, r) {for (var i = this, s = 0, l = 0; l < y.length; l++) {var c = i.p_external_link.hljs_lang(y[l]);n.i(o.d)(c, function () {(s += 1) === y.length && (r = a.render(e), t(r));});}} }, watch: { ishljs: function ishljs(e) {C.highlighted = e;} } };}, function (e, t, n) {"use strict";function r(e) {if (e.d_history_index > 0 && e.d_history_index--, e.s_preview_switch) {var t = e.getTextareaDom().selectionStart,n = e.d_value.length;e.$nextTick(function () {t -= n - e.d_value.length, e.getTextareaDom().selectionStart = t, e.getTextareaDom().selectionEnd = t;});}e.getTextareaDom().focus();}function o(e) {e.d_history_index < e.d_history.length - 1 && e.d_history_index++, e.getTextareaDom().focus();}function i(e) {e.d_value = "", e.getTextareaDom().focus();}function a(e) {e.save(e.d_value, e.d_render);}function s(e) {e.insertOl();}function l(e) {e.insertUl();}function c(e) {e.removeLine();}n.d(t, "b", function () {return u;}), n.d(t, "a", function () {return p;});var u = function u(e, t, n, r) {var o = { prefix: "link" === e ? "[" + t + "](" : "![" + t + "](", subfix: ")", str: n };r.insertText(r.getTextareaDom(), o);},p = function p(e, t) {var n = { bold: { prefix: "**", subfix: "**", str: t.d_words.tl_bold }, italic: { prefix: "*", subfix: "*", str: t.d_words.tl_italic }, header: { prefix: "# ", subfix: "", str: t.d_words.tl_header }, header1: { prefix: "# ", subfix: "", str: t.d_words.tl_header_one }, header2: { prefix: "## ", subfix: "", str: t.d_words.tl_header_two }, header3: { prefix: "### ", subfix: "", str: t.d_words.tl_header_three }, header4: { prefix: "#### ", subfix: "", str: t.d_words.tl_header_four }, header5: { prefix: "##### ", subfix: "", str: t.d_words.tl_header_five }, header6: { prefix: "###### ", subfix: "", str: t.d_words.tl_header_six }, underline: { prefix: "++", subfix: "++", str: t.d_words.tl_underline }, strikethrough: { prefix: "~~", subfix: "~~", str: t.d_words.tl_strikethrough }, mark: { prefix: "==", subfix: "==", str: t.d_words.tl_mark }, superscript: { prefix: "^", subfix: "^", str: t.d_words.tl_superscript }, subscript: { prefix: "~", subfix: "~", str: t.d_words.tl_subscript }, quote: { prefix: "> ", subfix: "", str: t.d_words.tl_quote }, link: { prefix: "[](", subfix: ")", str: t.d_words.tl_link }, imagelink: { prefix: "![](", subfix: ")", str: t.d_words.tl_image }, code: { prefix: "```", subfix: "\n\n```\n", str: "language" }, table: { prefix: "", subfix: "", str: "|column1|column2|column3|\n|-|-|-|\n|content1|content2|content3|\n" }, aligncenter: { prefix: "::: hljs-center\n\n", subfix: "\n\n:::\n", str: t.d_words.tl_aligncenter }, alignright: { prefix: "::: hljs-right\n\n", subfix: "\n\n:::\n", str: t.d_words.tl_alignright }, alignleft: { prefix: "::: hljs-left\n\n", subfix: "\n\n:::\n", str: t.d_words.tl_alignleft } };n.hasOwnProperty(e) && t.insertText(t.getTextareaDom(), n[e]);var u = { undo: r, redo: o, trash: i, save: a, ol: s, ul: l, removeLine: c };u.hasOwnProperty(e) && u[e](t);};}, function (e, t, n) {"use strict";function r(e) {e.s_html_code = !e.s_html_code, e.htmlcode && e.htmlcode(e.s_html_code, e.d_value);}function o(e) {e.s_help = !e.s_help, e.helptoggle && e.helptoggle(e.s_help, e.d_value);}function i(e) {var t = e.$refs.vReadModel;t.requestFullscreen ? t.requestFullscreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.webkitRequestFullscreen ? t.webkitRequestFullscreen() : t.msRequestFullscreen && t.msRequestFullscreen();}function a(e) {e.s_preview_switch = !e.s_preview_switch, e.previewtoggle && e.previewtoggle(e.s_preview_switch, e.d_value);}function s(e) {e.s_fullScreen = !e.s_fullScreen, e.fullscreen && e.fullscreen(e.s_fullScreen, e.d_value);}function l(e) {e.s_subfield = !e.s_subfield, e.s_preview_switch = e.s_subfield, e.previewtoggle && e.previewtoggle(e.s_preview_switch, e.d_value), e.subfieldtoggle && e.subfieldtoggle(e.s_subfield, e.d_value);}function c(e) {e.s_navigation = !e.s_navigation, e.s_navigation && (e.s_preview_switch = !0), e.navigationtoggle && e.navigationtoggle(e.s_navigation, e.d_value), e.s_navigation && e.getNavigation(e, !1);}n.d(t, "a", function () {return u;});var u = function u(e, t) {var n = { help: o, html: r, read: i, preview: a, fullscreen: s, navigation: c, subfield: l };n.hasOwnProperty(e) && n[e](t);};}, function (e, t, n) {"use strict";function r(e) {e && (e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation());}t.a = r;var o = n(37);n.n(o);}, function (e, t, n) {e.exports = { default: n(73), __esModule: !0 };}, function (e, t, n) {e.exports = { default: n(74), __esModule: !0 };}, function (e, t, n) {n(97), n(95), n(98), n(99), e.exports = n(10).Symbol;}, function (e, t, n) {n(96), n(100), e.exports = n(30).f("iterator");}, function (e, t) {e.exports = function (e) {if ("function" != typeof e) throw TypeError(e + " is not a function!");return e;};}, function (e, t) {e.exports = function () {};}, function (e, t, n) {var r = n(6),o = n(92),i = n(91);e.exports = function (e) {return function (t, n, a) {var s,l = r(t),c = o(l.length),u = i(a, c);if (e && n != n) {for (; c > u;) {if ((s = l[u++]) != s) return !0;}} else for (; c > u; u++) {if ((e || u in l) && l[u] === n) return e || u || 0;}return !e && -1;};};}, function (e, t, n) {var r = n(75);e.exports = function (e, t, n) {if (r(e), void 0 === t) return e;switch (n) {case 1:return function (n) {return e.call(t, n);};case 2:return function (n, r) {return e.call(t, n, r);};case 3:return function (n, r, o) {return e.call(t, n, r, o);};}return function () {return e.apply(t, arguments);};};}, function (e, t, n) {var r = n(22),o = n(45),i = n(23);e.exports = function (e) {var t = r(e),n = o.f;if (n) for (var a, s = n(e), l = i.f, c = 0; s.length > c;) {l.call(e, a = s[c++]) && t.push(a);}return t;};}, function (e, t, n) {var r = n(1).document;e.exports = r && r.documentElement;}, function (e, t, n) {var r = n(38);e.exports = Object("z").propertyIsEnumerable(0) ? Object : function (e) {return "String" == r(e) ? e.split("") : Object(e);};}, function (e, t, n) {var r = n(38);e.exports = Array.isArray || function (e) {return "Array" == r(e);};}, function (e, t, n) {"use strict";var r = n(43),o = n(13),i = n(24),a = {};n(4)(a, n(7)("iterator"), function () {return this;}), e.exports = function (e, t, n) {e.prototype = r(a, { next: o(1, n) }), i(e, t + " Iterator");};}, function (e, t) {e.exports = function (e, t) {return { value: t, done: !!e };};}, function (e, t, n) {var r = n(14)("meta"),o = n(8),i = n(2),a = n(5).f,s = 0,l = Object.isExtensible || function () {return !0;},c = !n(11)(function () {return l(Object.preventExtensions({}));}),u = function u(e) {a(e, r, { value: { i: "O" + ++s, w: {} } });},p = function p(e, t) {if (!o(e)) return "symbol" == typeof e ? e : ("string" == typeof e ? "S" : "P") + e;if (!i(e, r)) {if (!l(e)) return "F";if (!t) return "E";u(e);}return e[r].i;},_ = function _(e, t) {if (!i(e, r)) {if (!l(e)) return !0;if (!t) return !1;u(e);}return e[r].w;},d = function d(e) {return c && h.NEED && l(e) && !i(e, r) && u(e), e;},h = e.exports = { KEY: r, NEED: !1, fastKey: p, getWeak: _, onFreeze: d };}, function (e, t, n) {var r = n(5),o = n(9),i = n(22);e.exports = n(3) ? Object.defineProperties : function (e, t) {o(e);for (var n, a = i(t), s = a.length, l = 0; s > l;) {r.f(e, n = a[l++], t[n]);}return e;};}, function (e, t, n) {var r = n(23),o = n(13),i = n(6),a = n(28),s = n(2),l = n(41),c = Object.getOwnPropertyDescriptor;t.f = n(3) ? c : function (e, t) {if (e = i(e), t = a(t, !0), l) try {return c(e, t);} catch (e) {}if (s(e, t)) return o(!r.f.call(e, t), e[t]);};}, function (e, t, n) {var r = n(6),o = n(44).f,i = {}.toString,a = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],s = function s(e) {try {return o(e);} catch (e) {return a.slice();}};e.exports.f = function (e) {return a && "[object Window]" == i.call(e) ? s(e) : o(r(e));};}, function (e, t, n) {var r = n(2),o = n(93),i = n(25)("IE_PROTO"),a = Object.prototype;e.exports = Object.getPrototypeOf || function (e) {return e = o(e), r(e, i) ? e[i] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? a : null;};}, function (e, t, n) {var r = n(27),o = n(19);e.exports = function (e) {return function (t, n) {var i,a,s = String(o(t)),l = r(n),c = s.length;return l < 0 || l >= c ? e ? "" : void 0 : (i = s.charCodeAt(l), i < 55296 || i > 56319 || l + 1 === c || (a = s.charCodeAt(l + 1)) < 56320 || a > 57343 ? e ? s.charAt(l) : i : e ? s.slice(l, l + 2) : a - 56320 + (i - 55296 << 10) + 65536);};};}, function (e, t, n) {var r = n(27),o = Math.max,i = Math.min;e.exports = function (e, t) {return e = r(e), e < 0 ? o(e + t, 0) : i(e, t);};}, function (e, t, n) {var r = n(27),o = Math.min;e.exports = function (e) {return e > 0 ? o(r(e), 9007199254740991) : 0;};}, function (e, t, n) {var r = n(19);e.exports = function (e) {return Object(r(e));};}, function (e, t, n) {"use strict";var r = n(76),o = n(84),i = n(21),a = n(6);e.exports = n(42)(Array, "Array", function (e, t) {this._t = a(e), this._i = 0, this._k = t;}, function () {var e = this._t,t = this._k,n = this._i++;return !e || n >= e.length ? (this._t = void 0, o(1)) : "keys" == t ? o(0, n) : "values" == t ? o(0, e[n]) : o(0, [n, e[n]]);}, "values"), i.Arguments = i.Array, r("keys"), r("values"), r("entries");}, function (e, t) {}, function (e, t, n) {"use strict";var r = n(90)(!0);n(42)(String, "String", function (e) {this._t = String(e), this._i = 0;}, function () {var e,t = this._t,n = this._i;return n >= t.length ? { value: void 0, done: !0 } : (e = r(t, n), this._i += e.length, { value: e, done: !1 });});}, function (e, t, n) {"use strict";var r = n(1),o = n(2),i = n(3),a = n(40),s = n(47),l = n(85).KEY,c = n(11),u = n(26),p = n(24),_ = n(14),d = n(7),h = n(30),f = n(29),m = n(79),g = n(82),b = n(9),v = n(8),k = n(6),w = n(28),x = n(13),y = n(43),C = n(88),E = n(87),D = n(5),T = n(22),A = E.f,S = D.f,L = C.f,_M = r.Symbol,j = r.JSON,q = j && j.stringify,O = d("_hidden"),$ = d("toPrimitive"),z = {}.propertyIsEnumerable,F = u("symbol-registry"),I = u("symbols"),P = u("op-symbols"),R = Object.prototype,B = "function" == typeof _M,N = r.QObject,U = !N || !N.prototype || !N.prototype.findChild,H = i && c(function () {return 7 != y(S({}, "a", { get: function get() {return S(this, "a", { value: 7 }).a;} })).a;}) ? function (e, t, n) {var r = A(R, t);r && delete R[t], S(e, t, n), r && e !== R && S(R, t, r);} : S,W = function W(e) {var t = I[e] = y(_M.prototype);return t._k = e, t;},K = B && "symbol" == typeof _M.iterator ? function (e) {return "symbol" == typeof e;} : function (e) {return e instanceof _M;},V = function V(e, t, n) {return e === R && V(P, t, n), b(e), t = w(t, !0), b(n), o(I, t) ? (n.enumerable ? (o(e, O) && e[O][t] && (e[O][t] = !1), n = y(n, { enumerable: x(0, !1) })) : (o(e, O) || S(e, O, x(1, {})), e[O][t] = !0), H(e, t, n)) : S(e, t, n);},G = function G(e, t) {b(e);for (var n, r = m(t = k(t)), o = 0, i = r.length; i > o;) {V(e, n = r[o++], t[n]);}return e;},Z = function Z(e, t) {return void 0 === t ? y(e) : G(y(e), t);},X = function X(e) {var t = z.call(this, e = w(e, !0));return !(this === R && o(I, e) && !o(P, e)) && (!(t || !o(this, e) || !o(I, e) || o(this, O) && this[O][e]) || t);},J = function J(e, t) {if (e = k(e), t = w(t, !0), e !== R || !o(I, t) || o(P, t)) {var n = A(e, t);return !n || !o(I, t) || o(e, O) && e[O][t] || (n.enumerable = !0), n;}},Y = function Y(e) {for (var t, n = L(k(e)), r = [], i = 0; n.length > i;) {o(I, t = n[i++]) || t == O || t == l || r.push(t);}return r;},Q = function Q(e) {for (var t, n = e === R, r = L(n ? P : k(e)), i = [], a = 0; r.length > a;) {!o(I, t = r[a++]) || n && !o(R, t) || i.push(I[t]);}return i;};B || (_M = function M() {if (this instanceof _M) throw TypeError("Symbol is not a constructor!");var e = _(arguments.length > 0 ? arguments[0] : void 0),t = function t(n) {this === R && t.call(P, n), o(this, O) && o(this[O], e) && (this[O][e] = !1), H(this, e, x(1, n));};return i && U && H(R, e, { configurable: !0, set: t }), W(e);}, s(_M.prototype, "toString", function () {return this._k;}), E.f = J, D.f = V, n(44).f = C.f = Y, n(23).f = X, n(45).f = Q, i && !n(12) && s(R, "propertyIsEnumerable", X, !0), h.f = function (e) {return W(d(e));}), a(a.G + a.W + a.F * !B, { Symbol: _M });for (var ee = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), te = 0; ee.length > te;) {d(ee[te++]);}for (var ne = T(d.store), re = 0; ne.length > re;) {f(ne[re++]);}a(a.S + a.F * !B, "Symbol", { for: function _for(e) {return o(F, e += "") ? F[e] : F[e] = _M(e);}, keyFor: function keyFor(e) {if (!K(e)) throw TypeError(e + " is not a symbol!");for (var t in F) {if (F[t] === e) return t;}}, useSetter: function useSetter() {U = !0;}, useSimple: function useSimple() {U = !1;} }), a(a.S + a.F * !B, "Object", { create: Z, defineProperty: V, defineProperties: G, getOwnPropertyDescriptor: J, getOwnPropertyNames: Y, getOwnPropertySymbols: Q }), j && a(a.S + a.F * (!B || c(function () {var e = _M();return "[null]" != q([e]) || "{}" != q({ a: e }) || "{}" != q(Object(e));})), "JSON", { stringify: function stringify(e) {for (var t, n, r = [e], o = 1; arguments.length > o;) {r.push(arguments[o++]);}if (n = t = r[1], (v(t) || void 0 !== e) && !K(e)) return g(t) || (t = function t(e, _t2) {if ("function" == typeof n && (_t2 = n.call(this, e, _t2)), !K(_t2)) return _t2;}), r[1] = t, q.apply(j, r);} }), _M.prototype[$] || n(4)(_M.prototype, $, _M.prototype.valueOf), p(_M, "Symbol"), p(Math, "Math", !0), p(r.JSON, "JSON", !0);}, function (e, t, n) {n(29)("asyncIterator");}, function (e, t, n) {n(29)("observable");}, function (e, t, n) {n(94);for (var r = n(1), o = n(4), i = n(21), a = n(7)("toStringTag"), s = "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","), l = 0; l < s.length; l++) {var c = s[l],u = r[c],p = u && u.prototype;p && !p[a] && o(p, a, c), i[c] = i.Array;}}, function (e, t, n) {t = e.exports = n(15)(!1), t.push([e.i, '\n.auto-textarea-wrapper {\n  position: relative;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  line-height: normal;\n}\n.auto-textarea-wrapper .auto-textarea-block {\n  display: block;\n  white-space: pre-wrap;\n  word-wrap: break-word !important;\n  visibility: hidden;\n  overflow: hidden;\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  font-size: 100%;\n}\n.auto-textarea-wrapper .auto-textarea-input {\n  font-family: Menlo, "Ubuntu Mono", Consolas, "Courier New", "Microsoft Yahei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  overflow-y: hidden;\n  color: #2c3e50;\n}\n.auto-textarea-wrapper .auto-textarea-input.no-border {\n  outline: 0 none;\n  border: none !important;\n}\n.auto-textarea-wrapper .auto-textarea-input.no-resize {\n  resize: none;\n}\n', ""]);}, function (e, t, n) {t = e.exports = n(15)(!1), t.push([e.i, "\n.op-icon.dropdown-wrapper.dropdown[data-v-62b9e4d1] {\n  position: relative;\n}\n.op-icon.dropdown-wrapper.dropdown[type=button][data-v-62b9e4d1] {\n  -webkit-appearance: unset;\n}\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown[data-v-62b9e4d1] {\n  position: absolute;\n  display: block;\n  background: #fff;\n  top: 32px;\n  left: -45px;\n  min-width: 130px;\n  z-index: 1600;\n  border: 1px solid #ebeef5;\n  border-radius: 4px;\n  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);\n}\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown .dropdown-item[data-v-62b9e4d1]:first-child {\n  border-top-left-radius: 3px;\n  border-top-right-radius: 3px;\n}\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown .dropdown-item[data-v-62b9e4d1]:last-child {\n  border-bottom-left-radius: 3px;\n  border-bottom-right-radius: 3px;\n}\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown.op-header[data-v-62b9e4d1] {\n  left: -30px;\n  min-width: 90px;\n}\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown.fade-enter-active[data-v-62b9e4d1],\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown.fade-leave-active[data-v-62b9e4d1] {\n  opacity: 1;\n}\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown.fade-enter[data-v-62b9e4d1],\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown.fade-leave-active[data-v-62b9e4d1] {\n  opacity: 0;\n}\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown.transition[data-v-62b9e4d1],\n.op-icon.dropdown-wrapper.dropdown .popup-dropdown.transition .dropdown-item[data-v-62b9e4d1] {\n  -webkit-transition: all 0.2s linear 0s;\n  transition: all 0.2s linear 0s;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-item[data-v-62b9e4d1] {\n  height: 40px;\n  line-height: 40px;\n  font-size: 14px;\n  color: #606266;\n  position: relative;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-item[data-v-62b9e4d1]:hover {\n  color: #303133;\n  background-color: #e9e9eb;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-item input[data-v-62b9e4d1] {\n  position: absolute;\n  font-size: 100px;\n  right: 0;\n  top: 0;\n  opacity: 0;\n  cursor: pointer;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-images[data-v-62b9e4d1] {\n  box-sizing: border-box;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-images button[data-v-62b9e4d1] {\n  position: absolute;\n  top: -1px;\n  right: 5px;\n  font-size: 14px;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-images button[data-v-62b9e4d1]:hover {\n  color: #f56c6c;\n  background-color: transparent;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-images span[data-v-62b9e4d1] {\n  display: inline-block;\n  width: 80px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-images:hover .image-show[data-v-62b9e4d1] {\n  display: block !important;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-images .image-show[data-v-62b9e4d1] {\n  display: none;\n  position: absolute;\n  left: -128px;\n  top: 0;\n  width: 120px;\n  height: 90px;\n  object-fit: contain;\n  border: 1px solid #f2f6fc;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-images .image-show.transition[data-v-62b9e4d1] {\n  -webkit-transition: all 0.2s linear 0s;\n  transition: all 0.2s linear 0s;\n}\n.op-icon.dropdown-wrapper.dropdown .dropdown-images.transition[data-v-62b9e4d1] {\n  -webkit-transition: all 0.2s linear 0s;\n  transition: all 0.2s linear 0s;\n}\n.add-image-link-wrapper[data-v-62b9e4d1] {\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  background: rgba(0,0,0,0.7);\n  z-index: 1600;\n  -webkit-transition: all 0.1s linear 0s;\n  transition: all 0.1s linear 0s;\n}\n.add-image-link-wrapper.fade-enter-active[data-v-62b9e4d1],\n.add-image-link-wrapper.fade-leave-active[data-v-62b9e4d1] {\n  opacity: 1;\n}\n.add-image-link-wrapper.fade-enter[data-v-62b9e4d1],\n.add-image-link-wrapper.fade-leave-active[data-v-62b9e4d1] {\n  opacity: 0;\n}\n.add-image-link-wrapper .add-image-link[data-v-62b9e4d1] {\n  position: fixed;\n  box-sizing: border-box;\n  text-align: center;\n  width: 24%;\n  left: 38%;\n  height: auto;\n  padding: 40px;\n  top: 25%;\n  -webkit-transition: all 0.1s linear 0s;\n  transition: all 0.1s linear 0s;\n  z-index: 3;\n  background: #fff;\n  border-radius: 2px;\n}\n@media only screen and (max-width: 1500px) {\n.add-image-link-wrapper .add-image-link[data-v-62b9e4d1] {\n    width: 34%;\n    left: 33%;\n}\n}\n@media only screen and (max-width: 1000px) {\n.add-image-link-wrapper .add-image-link[data-v-62b9e4d1] {\n    width: 50%;\n    left: 25%;\n}\n}\n@media only screen and (max-width: 600px) {\n.add-image-link-wrapper .add-image-link[data-v-62b9e4d1] {\n    width: 80%;\n    left: 10%;\n}\n}\n.add-image-link-wrapper .add-image-link i[data-v-62b9e4d1] {\n  font-size: 24px;\n  position: absolute;\n  right: 8px;\n  top: 6px;\n  color: rgba(0,0,0,0.7);\n  cursor: pointer;\n}\n.add-image-link-wrapper .add-image-link .title[data-v-62b9e4d1] {\n  font-size: 20px;\n  margin-bottom: 30px;\n  margin-top: 10px;\n  font-weight: 500 !important;\n}\n.add-image-link-wrapper .add-image-link .input-wrapper[data-v-62b9e4d1] {\n  margin-top: 10px;\n  width: 80%;\n  border: 1px solid #eeece8;\n  text-align: left;\n  margin-left: 10%;\n  height: 35px;\n}\n.add-image-link-wrapper .add-image-link .input-wrapper input[data-v-62b9e4d1] {\n  height: 32px;\n  line-height: 32px;\n  font-size: 15px;\n  width: 90%;\n  margin-left: 8px;\n  border: none;\n  outline: none;\n}\n.add-image-link-wrapper .add-image-link .op-btn[data-v-62b9e4d1] {\n  width: 100px;\n  height: 35px;\n  display: inline-block;\n  margin-top: 30px;\n  cursor: pointer;\n  text-align: center;\n  line-height: 35px;\n  opacity: 0.9;\n  border-radius: 2px;\n  letter-spacing: 1px;\n  font-size: 15px;\n}\n.add-image-link-wrapper .add-image-link .op-btn.sure[data-v-62b9e4d1] {\n  background: #2185d0;\n  color: #fff;\n  margin-left: 5%;\n}\n.add-image-link-wrapper .add-image-link .op-btn.sure[data-v-62b9e4d1]:hover {\n  opacity: 1;\n}\n.add-image-link-wrapper .add-image-link .op-btn.cancel[data-v-62b9e4d1] {\n  border: 1px solid #bcbcbc;\n  color: #bcbcbc;\n}\n.add-image-link-wrapper .add-image-link .op-btn.cancel[data-v-62b9e4d1]:hover {\n  color: #000;\n}\n", ""]);}, function (e, t, n) {t = e.exports = n(15)(!1), t.push([e.i, "\ntextarea:disabled {\n  background-color: #fff;\n}\n.v-note-wrapper {\n  position: relative;\n  min-width: 300px;\n  min-height: 300px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  background-color: #fff;\n  z-index: 1500;\n  text-align: left;\n  border: 1px solid #f2f6fc;\n  border-radius: 4px;\n}\n.v-note-wrapper.fullscreen {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  margin: 0;\n  height: auto;\n  z-index: 1501;\n}\n.v-note-wrapper .v-note-op {\n  padding: 1px;\n  width: 100%;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  white-space: pre-line;\n  -webkit-box-flex: 0;\n  -webkit-flex: none;\n      -ms-flex: none;\n          flex: none;\n  min-height: 40px;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  border-bottom: 1px solid #f2f6fc;\n  border-radius: 4px 4px 0 0;\n  background-color: #fff;\n  z-index: 1;\n}\n.v-note-wrapper .v-note-op .v-left-item,\n.v-note-wrapper .v-note-op .v-right-item {\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  min-height: 40px;\n  box-sizing: border-box;\n}\n.v-note-wrapper .v-note-op .v-left-item .op-icon-divider,\n.v-note-wrapper .v-note-op .v-right-item .op-icon-divider {\n  height: 40px;\n  border-left: 1px solid #e5e5e5;\n  margin: 0 6px 0 4px;\n}\n.v-note-wrapper .v-note-op .v-left-item .op-icon,\n.v-note-wrapper .v-note-op .v-right-item .op-icon {\n  box-sizing: border-box;\n  display: inline-block;\n  cursor: pointer;\n  height: 28px;\n  width: 28px;\n  margin: 6px 0 5px 0px;\n  font-size: 15px;\n  padding: 4.5px 6px 5px 3.5px;\n  color: #757575;\n  border-radius: 5px;\n  text-align: center;\n  background: none;\n  border: none;\n  outline: none;\n  line-height: 1;\n}\n.v-note-wrapper .v-note-op .v-left-item .op-icon.dropdown-wrapper,\n.v-note-wrapper .v-note-op .v-right-item .op-icon.dropdown-wrapper {\n  line-height: 18px;\n}\n.v-note-wrapper .v-note-op .v-left-item .op-icon.selected,\n.v-note-wrapper .v-note-op .v-right-item .op-icon.selected {\n  color: rgba(0,0,0,0.8);\n  background: #eaeaea;\n}\n.v-note-wrapper .v-note-op .v-left-item .op-icon:hover,\n.v-note-wrapper .v-note-op .v-right-item .op-icon:hover {\n  color: rgba(0,0,0,0.8);\n  background: #e9e9eb;\n}\n.v-note-wrapper .v-note-op .v-left-item.transition .op-icon,\n.v-note-wrapper .v-note-op .v-right-item.transition .op-icon {\n  -webkit-transition: all 0.2s linear 0s;\n  transition: all 0.2s linear 0s;\n}\n.v-note-wrapper .v-note-op .v-right-item {\n  text-align: right;\n  padding-right: 6px;\n  max-width: 30%;\n}\n.v-note-wrapper .v-note-op .v-left-item {\n  text-align: left;\n  padding-left: 6px;\n}\n.v-note-wrapper .v-note-panel {\n  position: relative;\n  border-top: none;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  width: 100%;\n  box-sizing: border-box;\n  overflow: hidden;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 50%;\n      -ms-flex: 0 0 50%;\n          flex: 0 0 50%;\n  width: 50%;\n  padding: 0;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  box-sizing: border-box;\n  cursor: text;\n  border-bottom-left-radius: 4px;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.scroll-style::-webkit-scrollbar {\n  width: 6px;\n  background-color: #e5e5e5;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.scroll-style::-webkit-scrollbar-thumb {\n  background-color: #b7b7b7;\n  border-radius: 4px;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.scroll-style::-webkit-scrollbar-thumb:hover {\n  background-color: #a1a1a1;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.scroll-style::-webkit-scrollbar-thumb:active {\n  background-color: #a1a1a1;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.scroll-style::-webkit-scrollbar-track {\n  -webkit-box-shadow: 0 0 0px #808080 inset;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.scroll-style-border-radius::-webkit-scrollbar {\n  border-bottom-right-radius: 4px;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.transition {\n  -webkit-transition: all 0.2s linear 0s;\n  transition: all 0.2s linear 0s;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.single-edit {\n  width: 100%;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 100%;\n      -ms-flex: 0 0 100%;\n          flex: 0 0 100%;\n  overflow-y: auto;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper.single-show {\n  width: 0;\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 0;\n      -ms-flex: 0 0 0px;\n          flex: 0 0 0;\n  display: none;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper .content-div {\n  width: 100%;\n  padding: 20px 25px;\n  box-sizing: border-box;\n  outline: 0 none;\n  border: none !important;\n  color: #2c3e50;\n  font-size: 16px;\n}\n.v-note-wrapper .v-note-panel .v-note-edit.divarea-wrapper .content-input-wrapper {\n  width: 100%;\n  padding: 8px 25px 15px 25px;\n}\n.v-note-wrapper .v-note-panel .v-note-show {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 50%;\n      -ms-flex: 0 0 50%;\n          flex: 0 0 50%;\n  width: 50%;\n  overflow-y: auto;\n  padding: 0 0;\n  -webkit-transition: all 0.2s linear 0s;\n  transition: all 0.2s linear 0s;\n}\n.v-note-wrapper .v-note-panel .v-note-show.single-show {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 100%;\n      -ms-flex: 0 0 100%;\n          flex: 0 0 100%;\n  width: 100%;\n}\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content,\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {\n  width: 100%;\n  height: 100%;\n  padding: 8px 25px 15px 25px;\n  overflow-y: auto;\n  box-sizing: border-box;\n  overflow-x: hidden;\n}\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content.scroll-style::-webkit-scrollbar,\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html.scroll-style::-webkit-scrollbar {\n  width: 6px;\n  background-color: #e5e5e5;\n}\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content.scroll-style::-webkit-scrollbar-thumb,\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html.scroll-style::-webkit-scrollbar-thumb {\n  background-color: #b7b7b7;\n  border-radius: 4px;\n}\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content.scroll-style::-webkit-scrollbar-thumb:hover,\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html.scroll-style::-webkit-scrollbar-thumb:hover {\n  background-color: #a1a1a1;\n}\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content.scroll-style::-webkit-scrollbar-thumb:active,\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html.scroll-style::-webkit-scrollbar-thumb:active {\n  background-color: #a1a1a1;\n}\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content.scroll-style::-webkit-scrollbar-track,\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html.scroll-style::-webkit-scrollbar-track {\n  -webkit-box-shadow: 0 0 0px #808080 inset;\n}\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content.scroll-style-border-radius::-webkit-scrollbar,\n.v-note-wrapper .v-note-panel .v-note-show .v-show-content-html.scroll-style-border-radius::-webkit-scrollbar {\n  border-bottom-right-radius: 4px;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  position: absolute;\n  width: 250px;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  background-color: rgba(255,255,255,0.98);\n  border-left: 1px solid #f2f6fc;\n  border-right: 1px solid #f2f6fc;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper.transition {\n  -webkit-transition: all 0.1s linear 0s;\n  transition: all 0.1s linear 0s;\n}\n@media only screen and (max-width: 768px) {\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper {\n    width: 50%;\n}\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper.slideTop-enter-active,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper.slideTop-leave-active {\n  height: 100%;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper.slideTop-enter,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper.slideTop-leave-active {\n  height: 0;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-title {\n  height: 50px;\n  width: 100%;\n  border-bottom: 1px solid #f2f6fc;\n  -webkit-box-flex: 0;\n  -webkit-flex: none;\n      -ms-flex: none;\n          flex: none;\n  line-height: 50px;\n  font-size: 16px;\n  box-sizing: border-box;\n  padding: 0 12px 0 18px;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-title .v-note-navigation-close {\n  float: right;\n  color: #606266;\n  font-size: 18px;\n  cursor: pointer;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-title .v-note-navigation-close:hover {\n  color: #303133;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content {\n  overflow-y: auto;\n  -webkit-box-flex: 1;\n  -webkit-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  padding: 8px 0;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content.scroll-style::-webkit-scrollbar {\n  width: 6px;\n  background-color: #e5e5e5;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content.scroll-style::-webkit-scrollbar-thumb {\n  background-color: #b7b7b7;\n  border-radius: 4px;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content.scroll-style::-webkit-scrollbar-thumb:hover {\n  background-color: #a1a1a1;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content.scroll-style::-webkit-scrollbar-thumb:active {\n  background-color: #a1a1a1;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content.scroll-style::-webkit-scrollbar-track {\n  -webkit-box-shadow: 0 0 0px #808080 inset;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content.scroll-style-border-radius::-webkit-scrollbar {\n  border-bottom-right-radius: 4px;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h1,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h2,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h3,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h4,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h5,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h6 {\n  margin: 2px 0;\n  font-weight: 500;\n  font-size: 17px;\n  color: #2185d0;\n  cursor: pointer;\n  line-height: normal;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  padding: 0 12px;\n  border-bottom: none;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h1:hover,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h2:hover,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h3:hover,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h4:hover,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h5:hover,\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h6:hover {\n  color: #483d8b;\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h2 {\n  padding-left: 27px;\n  font-size: 17px;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h3 {\n  padding-left: 42px;\n  font-size: 17px;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h4 {\n  padding-left: 58px;\n  font-size: 15px;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h5 {\n  padding-left: 72px;\n  font-size: 15px;\n}\n.v-note-wrapper .v-note-panel .v-note-navigation-wrapper .v-note-navigation-content h6 {\n  padding-left: 87px;\n  font-size: 15px;\n}\n.v-note-wrapper .v-note-read-model {\n  position: relative;\n  display: none;\n  width: 100%;\n  height: 100%;\n  background: #fbfbfb;\n  padding: 30px 8% 50px 8%;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n.v-note-wrapper .v-note-read-model.scroll-style::-webkit-scrollbar {\n  width: 6px;\n  background-color: #e5e5e5;\n}\n.v-note-wrapper .v-note-read-model.scroll-style::-webkit-scrollbar-thumb {\n  background-color: #b7b7b7;\n  border-radius: 4px;\n}\n.v-note-wrapper .v-note-read-model.scroll-style::-webkit-scrollbar-thumb:hover {\n  background-color: #a1a1a1;\n}\n.v-note-wrapper .v-note-read-model.scroll-style::-webkit-scrollbar-thumb:active {\n  background-color: #a1a1a1;\n}\n.v-note-wrapper .v-note-read-model.scroll-style::-webkit-scrollbar-track {\n  -webkit-box-shadow: 0 0 0px #808080 inset;\n}\n.v-note-wrapper .v-note-read-model.scroll-style-border-radius::-webkit-scrollbar {\n  border-bottom-right-radius: 4px;\n}\n.v-note-wrapper .v-note-read-model.show {\n  display: block;\n}\n.v-note-wrapper.shadow {\n  border: none;\n}\n.v-note-help-wrapper {\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  background: rgba(0,0,0,0.7);\n  z-index: 1600;\n  -webkit-transition: all 0.1s linear 0s;\n  transition: all 0.1s linear 0s;\n}\n.v-note-help-wrapper.fade-enter-active,\n.v-note-help-wrapper.fade-leave-active {\n  opacity: 1;\n}\n.v-note-help-wrapper.fade-enter,\n.v-note-help-wrapper.fade-leave-active {\n  opacity: 0;\n}\n.v-note-help-wrapper .v-note-help-content {\n  position: relative;\n  width: 60%;\n  max-width: 800px;\n  margin: 30px auto;\n  height: 90%;\n  min-width: 320px;\n  -webkit-transition: all 0.1s linear 0s;\n  transition: all 0.1s linear 0s;\n  z-index: 3;\n  border: 1px solid #f2f6fc;\n}\n.v-note-help-wrapper .v-note-help-content.shadow {\n  border: none;\n  box-shadow: 0 0px 5px rgba(0,0,0,0.157), 0 0px 5px rgba(0,0,0,0.227);\n}\n.v-note-help-wrapper .v-note-help-content i {\n  font-size: 28px;\n  position: absolute;\n  right: 15px;\n  top: 8px;\n  color: rgba(0,0,0,0.7);\n  cursor: pointer;\n}\n.v-note-help-wrapper .v-note-help-content i:hover {\n  color: #000;\n}\n.v-note-help-wrapper .v-note-help-content .v-note-help-show {\n  width: 100%;\n  height: 100%;\n  font-size: 18px;\n  background: #fbfbfb;\n  overflow-y: auto;\n  padding: 2% 6%;\n}\n.v-note-help-wrapper .v-note-help-content .v-note-help-show.scroll-style::-webkit-scrollbar {\n  width: 6px;\n  background-color: #e5e5e5;\n}\n.v-note-help-wrapper .v-note-help-content .v-note-help-show.scroll-style::-webkit-scrollbar-thumb {\n  background-color: #b7b7b7;\n  border-radius: 4px;\n}\n.v-note-help-wrapper .v-note-help-content .v-note-help-show.scroll-style::-webkit-scrollbar-thumb:hover {\n  background-color: #a1a1a1;\n}\n.v-note-help-wrapper .v-note-help-content .v-note-help-show.scroll-style::-webkit-scrollbar-thumb:active {\n  background-color: #a1a1a1;\n}\n.v-note-help-wrapper .v-note-help-content .v-note-help-show.scroll-style::-webkit-scrollbar-track {\n  -webkit-box-shadow: 0 0 0px #808080 inset;\n}\n.v-note-help-wrapper .v-note-help-content .v-note-help-show.scroll-style-border-radius::-webkit-scrollbar {\n  border-bottom-right-radius: 4px;\n}\n.v-note-img-wrapper {\n  position: fixed;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  background: rgba(0,0,0,0.7);\n  z-index: 1600;\n  -webkit-transition: all 0.1s linear 0s;\n  transition: all 0.1s linear 0s;\n}\n.v-note-img-wrapper.fade-enter-active,\n.v-note-img-wrapper.fade-leave-active {\n  opacity: 1;\n}\n.v-note-img-wrapper.fade-enter,\n.v-note-img-wrapper.fade-leave-active {\n  opacity: 0;\n}\n.v-note-img-wrapper img {\n  -webkit-box-flex: 0;\n  -webkit-flex: 0 0 auto;\n      -ms-flex: 0 0 auto;\n          flex: 0 0 auto;\n  z-index: 3;\n}\n.v-note-img-wrapper i {\n  font-size: 28px;\n  position: absolute;\n  right: 15px;\n  top: 8px;\n  color: rgba(255,255,255,0.7);\n  cursor: pointer;\n}\n.v-note-img-wrapper i:hover {\n  color: #fff;\n}\n", ""]);}, function (e, t, n) {t = e.exports = n(15)(!1), t.push([e.i, "\n.auto-textarea-wrapper[data-v-f49bc018] {\n    height: 100%;\n}\n", ""]);}, function (e, t) {e.exports = { Aacute: "Á", aacute: "á", Abreve: "Ă", abreve: "ă", ac: "∾", acd: "∿", acE: "∾̳", Acirc: "Â", acirc: "â", acute: "´", Acy: "А", acy: "а", AElig: "Æ", aelig: "æ", af: "⁡", Afr: "𝔄", afr: "𝔞", Agrave: "À", agrave: "à", alefsym: "ℵ", aleph: "ℵ", Alpha: "Α", alpha: "α", Amacr: "Ā", amacr: "ā", amalg: "⨿", amp: "&", AMP: "&", andand: "⩕", And: "⩓", and: "∧", andd: "⩜", andslope: "⩘", andv: "⩚", ang: "∠", ange: "⦤", angle: "∠", angmsdaa: "⦨", angmsdab: "⦩", angmsdac: "⦪", angmsdad: "⦫", angmsdae: "⦬", angmsdaf: "⦭", angmsdag: "⦮", angmsdah: "⦯", angmsd: "∡", angrt: "∟", angrtvb: "⊾", angrtvbd: "⦝", angsph: "∢", angst: "Å", angzarr: "⍼", Aogon: "Ą", aogon: "ą", Aopf: "𝔸", aopf: "𝕒", apacir: "⩯", ap: "≈", apE: "⩰", ape: "≊", apid: "≋", apos: "'", ApplyFunction: "⁡", approx: "≈", approxeq: "≊", Aring: "Å", aring: "å", Ascr: "𝒜", ascr: "𝒶", Assign: "≔", ast: "*", asymp: "≈", asympeq: "≍", Atilde: "Ã", atilde: "ã", Auml: "Ä", auml: "ä", awconint: "∳", awint: "⨑", backcong: "≌", backepsilon: "϶", backprime: "‵", backsim: "∽", backsimeq: "⋍", Backslash: "∖", Barv: "⫧", barvee: "⊽", barwed: "⌅", Barwed: "⌆", barwedge: "⌅", bbrk: "⎵", bbrktbrk: "⎶", bcong: "≌", Bcy: "Б", bcy: "б", bdquo: "„", becaus: "∵", because: "∵", Because: "∵", bemptyv: "⦰", bepsi: "϶", bernou: "ℬ", Bernoullis: "ℬ", Beta: "Β", beta: "β", beth: "ℶ", between: "≬", Bfr: "𝔅", bfr: "𝔟", bigcap: "⋂", bigcirc: "◯", bigcup: "⋃", bigodot: "⨀", bigoplus: "⨁", bigotimes: "⨂", bigsqcup: "⨆", bigstar: "★", bigtriangledown: "▽", bigtriangleup: "△", biguplus: "⨄", bigvee: "⋁", bigwedge: "⋀", bkarow: "⤍", blacklozenge: "⧫", blacksquare: "▪", blacktriangle: "▴", blacktriangledown: "▾", blacktriangleleft: "◂", blacktriangleright: "▸", blank: "␣", blk12: "▒", blk14: "░", blk34: "▓", block: "█", bne: "=⃥", bnequiv: "≡⃥", bNot: "⫭", bnot: "⌐", Bopf: "𝔹", bopf: "𝕓", bot: "⊥", bottom: "⊥", bowtie: "⋈", boxbox: "⧉", boxdl: "┐", boxdL: "╕", boxDl: "╖", boxDL: "╗", boxdr: "┌", boxdR: "╒", boxDr: "╓", boxDR: "╔", boxh: "─", boxH: "═", boxhd: "┬", boxHd: "╤", boxhD: "╥", boxHD: "╦", boxhu: "┴", boxHu: "╧", boxhU: "╨", boxHU: "╩", boxminus: "⊟", boxplus: "⊞", boxtimes: "⊠", boxul: "┘", boxuL: "╛", boxUl: "╜", boxUL: "╝", boxur: "└", boxuR: "╘", boxUr: "╙", boxUR: "╚", boxv: "│", boxV: "║", boxvh: "┼", boxvH: "╪", boxVh: "╫", boxVH: "╬", boxvl: "┤", boxvL: "╡", boxVl: "╢", boxVL: "╣", boxvr: "├", boxvR: "╞", boxVr: "╟", boxVR: "╠", bprime: "‵", breve: "˘", Breve: "˘", brvbar: "¦", bscr: "𝒷", Bscr: "ℬ", bsemi: "⁏", bsim: "∽", bsime: "⋍", bsolb: "⧅", bsol: "\\", bsolhsub: "⟈", bull: "•", bullet: "•", bump: "≎", bumpE: "⪮", bumpe: "≏", Bumpeq: "≎", bumpeq: "≏", Cacute: "Ć", cacute: "ć", capand: "⩄", capbrcup: "⩉", capcap: "⩋", cap: "∩", Cap: "⋒", capcup: "⩇", capdot: "⩀", CapitalDifferentialD: "ⅅ", caps: "∩︀", caret: "⁁", caron: "ˇ", Cayleys: "ℭ", ccaps: "⩍", Ccaron: "Č", ccaron: "č", Ccedil: "Ç", ccedil: "ç", Ccirc: "Ĉ", ccirc: "ĉ", Cconint: "∰", ccups: "⩌", ccupssm: "⩐", Cdot: "Ċ", cdot: "ċ", cedil: "¸", Cedilla: "¸", cemptyv: "⦲", cent: "¢", centerdot: "·", CenterDot: "·", cfr: "𝔠", Cfr: "ℭ", CHcy: "Ч", chcy: "ч", check: "✓", checkmark: "✓", Chi: "Χ", chi: "χ", circ: "ˆ", circeq: "≗", circlearrowleft: "↺", circlearrowright: "↻", circledast: "⊛", circledcirc: "⊚", circleddash: "⊝", CircleDot: "⊙", circledR: "®", circledS: "Ⓢ", CircleMinus: "⊖", CirclePlus: "⊕", CircleTimes: "⊗", cir: "○", cirE: "⧃", cire: "≗", cirfnint: "⨐", cirmid: "⫯", cirscir: "⧂", ClockwiseContourIntegral: "∲", CloseCurlyDoubleQuote: "”", CloseCurlyQuote: "’", clubs: "♣", clubsuit: "♣", colon: ":", Colon: "∷", Colone: "⩴", colone: "≔", coloneq: "≔", comma: ",", commat: "@", comp: "∁", compfn: "∘", complement: "∁", complexes: "ℂ", cong: "≅", congdot: "⩭", Congruent: "≡", conint: "∮", Conint: "∯", ContourIntegral: "∮", copf: "𝕔", Copf: "ℂ", coprod: "∐", Coproduct: "∐", copy: "©", COPY: "©", copysr: "℗", CounterClockwiseContourIntegral: "∳", crarr: "↵", cross: "✗", Cross: "⨯", Cscr: "𝒞", cscr: "𝒸", csub: "⫏", csube: "⫑", csup: "⫐", csupe: "⫒", ctdot: "⋯", cudarrl: "⤸", cudarrr: "⤵", cuepr: "⋞", cuesc: "⋟", cularr: "↶", cularrp: "⤽", cupbrcap: "⩈", cupcap: "⩆", CupCap: "≍", cup: "∪", Cup: "⋓", cupcup: "⩊", cupdot: "⊍", cupor: "⩅", cups: "∪︀", curarr: "↷", curarrm: "⤼", curlyeqprec: "⋞", curlyeqsucc: "⋟", curlyvee: "⋎", curlywedge: "⋏", curren: "¤", curvearrowleft: "↶", curvearrowright: "↷", cuvee: "⋎", cuwed: "⋏", cwconint: "∲", cwint: "∱", cylcty: "⌭", dagger: "†", Dagger: "‡", daleth: "ℸ", darr: "↓", Darr: "↡", dArr: "⇓", dash: "‐", Dashv: "⫤", dashv: "⊣", dbkarow: "⤏", dblac: "˝", Dcaron: "Ď", dcaron: "ď", Dcy: "Д", dcy: "д", ddagger: "‡", ddarr: "⇊", DD: "ⅅ", dd: "ⅆ", DDotrahd: "⤑", ddotseq: "⩷", deg: "°", Del: "∇", Delta: "Δ", delta: "δ", demptyv: "⦱", dfisht: "⥿", Dfr: "𝔇", dfr: "𝔡", dHar: "⥥", dharl: "⇃", dharr: "⇂", DiacriticalAcute: "´", DiacriticalDot: "˙", DiacriticalDoubleAcute: "˝", DiacriticalGrave: "`", DiacriticalTilde: "˜", diam: "⋄", diamond: "⋄", Diamond: "⋄", diamondsuit: "♦", diams: "♦", die: "¨", DifferentialD: "ⅆ", digamma: "ϝ", disin: "⋲", div: "÷", divide: "÷", divideontimes: "⋇", divonx: "⋇", DJcy: "Ђ", djcy: "ђ", dlcorn: "⌞", dlcrop: "⌍", dollar: "$", Dopf: "𝔻", dopf: "𝕕", Dot: "¨", dot: "˙", DotDot: "⃜", doteq: "≐", doteqdot: "≑", DotEqual: "≐", dotminus: "∸", dotplus: "∔", dotsquare: "⊡", doublebarwedge: "⌆", DoubleContourIntegral: "∯", DoubleDot: "¨", DoubleDownArrow: "⇓", DoubleLeftArrow: "⇐", DoubleLeftRightArrow: "⇔", DoubleLeftTee: "⫤", DoubleLongLeftArrow: "⟸", DoubleLongLeftRightArrow: "⟺", DoubleLongRightArrow: "⟹", DoubleRightArrow: "⇒", DoubleRightTee: "⊨", DoubleUpArrow: "⇑", DoubleUpDownArrow: "⇕", DoubleVerticalBar: "∥", DownArrowBar: "⤓", downarrow: "↓", DownArrow: "↓", Downarrow: "⇓", DownArrowUpArrow: "⇵", DownBreve: "̑", downdownarrows: "⇊", downharpoonleft: "⇃", downharpoonright: "⇂", DownLeftRightVector: "⥐", DownLeftTeeVector: "⥞", DownLeftVectorBar: "⥖", DownLeftVector: "↽", DownRightTeeVector: "⥟", DownRightVectorBar: "⥗", DownRightVector: "⇁", DownTeeArrow: "↧", DownTee: "⊤", drbkarow: "⤐", drcorn: "⌟", drcrop: "⌌", Dscr: "𝒟", dscr: "𝒹", DScy: "Ѕ", dscy: "ѕ", dsol: "⧶", Dstrok: "Đ", dstrok: "đ", dtdot: "⋱", dtri: "▿", dtrif: "▾", duarr: "⇵", duhar: "⥯", dwangle: "⦦", DZcy: "Џ", dzcy: "џ", dzigrarr: "⟿", Eacute: "É", eacute: "é", easter: "⩮", Ecaron: "Ě", ecaron: "ě", Ecirc: "Ê", ecirc: "ê", ecir: "≖", ecolon: "≕", Ecy: "Э", ecy: "э", eDDot: "⩷", Edot: "Ė", edot: "ė", eDot: "≑", ee: "ⅇ", efDot: "≒", Efr: "𝔈", efr: "𝔢", eg: "⪚", Egrave: "È", egrave: "è", egs: "⪖", egsdot: "⪘", el: "⪙", Element: "∈", elinters: "⏧", ell: "ℓ", els: "⪕", elsdot: "⪗", Emacr: "Ē", emacr: "ē", empty: "∅", emptyset: "∅", EmptySmallSquare: "◻", emptyv: "∅", EmptyVerySmallSquare: "▫", emsp13: " ", emsp14: " ", emsp: " ", ENG: "Ŋ", eng: "ŋ", ensp: " ", Eogon: "Ę", eogon: "ę", Eopf: "𝔼", eopf: "𝕖", epar: "⋕", eparsl: "⧣", eplus: "⩱", epsi: "ε", Epsilon: "Ε", epsilon: "ε", epsiv: "ϵ", eqcirc: "≖", eqcolon: "≕", eqsim: "≂", eqslantgtr: "⪖", eqslantless: "⪕", Equal: "⩵", equals: "=", EqualTilde: "≂", equest: "≟", Equilibrium: "⇌", equiv: "≡", equivDD: "⩸", eqvparsl: "⧥", erarr: "⥱", erDot: "≓", escr: "ℯ", Escr: "ℰ", esdot: "≐", Esim: "⩳", esim: "≂", Eta: "Η", eta: "η", ETH: "Ð", eth: "ð", Euml: "Ë", euml: "ë", euro: "€", excl: "!", exist: "∃", Exists: "∃", expectation: "ℰ", exponentiale: "ⅇ", ExponentialE: "ⅇ", fallingdotseq: "≒", Fcy: "Ф", fcy: "ф", female: "♀", ffilig: "ﬃ", fflig: "ﬀ", ffllig: "ﬄ", Ffr: "𝔉", ffr: "𝔣", filig: "ﬁ", FilledSmallSquare: "◼", FilledVerySmallSquare: "▪", fjlig: "fj", flat: "♭", fllig: "ﬂ", fltns: "▱", fnof: "ƒ", Fopf: "𝔽", fopf: "𝕗", forall: "∀", ForAll: "∀", fork: "⋔", forkv: "⫙", Fouriertrf: "ℱ", fpartint: "⨍", frac12: "½", frac13: "⅓", frac14: "¼", frac15: "⅕", frac16: "⅙", frac18: "⅛", frac23: "⅔", frac25: "⅖", frac34: "¾", frac35: "⅗", frac38: "⅜", frac45: "⅘", frac56: "⅚", frac58: "⅝", frac78: "⅞", frasl: "⁄", frown: "⌢", fscr: "𝒻", Fscr: "ℱ", gacute: "ǵ", Gamma: "Γ", gamma: "γ", Gammad: "Ϝ", gammad: "ϝ", gap: "⪆", Gbreve: "Ğ", gbreve: "ğ", Gcedil: "Ģ", Gcirc: "Ĝ", gcirc: "ĝ", Gcy: "Г", gcy: "г", Gdot: "Ġ", gdot: "ġ", ge: "≥", gE: "≧", gEl: "⪌", gel: "⋛", geq: "≥", geqq: "≧", geqslant: "⩾", gescc: "⪩", ges: "⩾", gesdot: "⪀", gesdoto: "⪂", gesdotol: "⪄", gesl: "⋛︀", gesles: "⪔", Gfr: "𝔊", gfr: "𝔤", gg: "≫", Gg: "⋙", ggg: "⋙", gimel: "ℷ", GJcy: "Ѓ", gjcy: "ѓ", gla: "⪥", gl: "≷", glE: "⪒", glj: "⪤", gnap: "⪊", gnapprox: "⪊", gne: "⪈", gnE: "≩", gneq: "⪈", gneqq: "≩", gnsim: "⋧", Gopf: "𝔾", gopf: "𝕘", grave: "`", GreaterEqual: "≥", GreaterEqualLess: "⋛", GreaterFullEqual: "≧", GreaterGreater: "⪢", GreaterLess: "≷", GreaterSlantEqual: "⩾", GreaterTilde: "≳", Gscr: "𝒢", gscr: "ℊ", gsim: "≳", gsime: "⪎", gsiml: "⪐", gtcc: "⪧", gtcir: "⩺", gt: ">", GT: ">", Gt: "≫", gtdot: "⋗", gtlPar: "⦕", gtquest: "⩼", gtrapprox: "⪆", gtrarr: "⥸", gtrdot: "⋗", gtreqless: "⋛", gtreqqless: "⪌", gtrless: "≷", gtrsim: "≳", gvertneqq: "≩︀", gvnE: "≩︀", Hacek: "ˇ", hairsp: " ", half: "½", hamilt: "ℋ", HARDcy: "Ъ", hardcy: "ъ", harrcir: "⥈", harr: "↔", hArr: "⇔", harrw: "↭", Hat: "^", hbar: "ℏ", Hcirc: "Ĥ", hcirc: "ĥ", hearts: "♥", heartsuit: "♥", hellip: "…", hercon: "⊹", hfr: "𝔥", Hfr: "ℌ", HilbertSpace: "ℋ", hksearow: "⤥", hkswarow: "⤦", hoarr: "⇿", homtht: "∻", hookleftarrow: "↩", hookrightarrow: "↪", hopf: "𝕙", Hopf: "ℍ", horbar: "―", HorizontalLine: "─", hscr: "𝒽", Hscr: "ℋ", hslash: "ℏ", Hstrok: "Ħ", hstrok: "ħ", HumpDownHump: "≎", HumpEqual: "≏", hybull: "⁃", hyphen: "‐", Iacute: "Í", iacute: "í", ic: "⁣", Icirc: "Î", icirc: "î", Icy: "И", icy: "и", Idot: "İ", IEcy: "Е", iecy: "е", iexcl: "¡", iff: "⇔", ifr: "𝔦", Ifr: "ℑ", Igrave: "Ì", igrave: "ì", ii: "ⅈ", iiiint: "⨌", iiint: "∭", iinfin: "⧜", iiota: "℩", IJlig: "Ĳ", ijlig: "ĳ", Imacr: "Ī", imacr: "ī", image: "ℑ", ImaginaryI: "ⅈ", imagline: "ℐ", imagpart: "ℑ", imath: "ı", Im: "ℑ", imof: "⊷", imped: "Ƶ", Implies: "⇒", incare: "℅", in: "∈", infin: "∞", infintie: "⧝", inodot: "ı", intcal: "⊺", int: "∫", Int: "∬", integers: "ℤ", Integral: "∫", intercal: "⊺", Intersection: "⋂", intlarhk: "⨗", intprod: "⨼", InvisibleComma: "⁣", InvisibleTimes: "⁢", IOcy: "Ё", iocy: "ё", Iogon: "Į", iogon: "į", Iopf: "𝕀", iopf: "𝕚", Iota: "Ι", iota: "ι", iprod: "⨼", iquest: "¿", iscr: "𝒾", Iscr: "ℐ", isin: "∈", isindot: "⋵", isinE: "⋹", isins: "⋴", isinsv: "⋳", isinv: "∈", it: "⁢", Itilde: "Ĩ", itilde: "ĩ", Iukcy: "І", iukcy: "і", Iuml: "Ï", iuml: "ï", Jcirc: "Ĵ", jcirc: "ĵ", Jcy: "Й", jcy: "й", Jfr: "𝔍", jfr: "𝔧", jmath: "ȷ", Jopf: "𝕁", jopf: "𝕛", Jscr: "𝒥", jscr: "𝒿", Jsercy: "Ј", jsercy: "ј", Jukcy: "Є", jukcy: "є", Kappa: "Κ", kappa: "κ", kappav: "ϰ", Kcedil: "Ķ", kcedil: "ķ", Kcy: "К", kcy: "к", Kfr: "𝔎", kfr: "𝔨", kgreen: "ĸ", KHcy: "Х", khcy: "х", KJcy: "Ќ", kjcy: "ќ", Kopf: "𝕂", kopf: "𝕜", Kscr: "𝒦", kscr: "𝓀", lAarr: "⇚", Lacute: "Ĺ", lacute: "ĺ", laemptyv: "⦴", lagran: "ℒ", Lambda: "Λ", lambda: "λ", lang: "⟨", Lang: "⟪", langd: "⦑", langle: "⟨", lap: "⪅", Laplacetrf: "ℒ", laquo: "«", larrb: "⇤", larrbfs: "⤟", larr: "←", Larr: "↞", lArr: "⇐", larrfs: "⤝", larrhk: "↩", larrlp: "↫", larrpl: "⤹", larrsim: "⥳", larrtl: "↢", latail: "⤙", lAtail: "⤛", lat: "⪫", late: "⪭", lates: "⪭︀", lbarr: "⤌", lBarr: "⤎", lbbrk: "❲", lbrace: "{", lbrack: "[", lbrke: "⦋", lbrksld: "⦏", lbrkslu: "⦍", Lcaron: "Ľ", lcaron: "ľ", Lcedil: "Ļ", lcedil: "ļ", lceil: "⌈", lcub: "{", Lcy: "Л", lcy: "л", ldca: "⤶", ldquo: "“", ldquor: "„", ldrdhar: "⥧", ldrushar: "⥋", ldsh: "↲", le: "≤", lE: "≦", LeftAngleBracket: "⟨", LeftArrowBar: "⇤", leftarrow: "←", LeftArrow: "←", Leftarrow: "⇐", LeftArrowRightArrow: "⇆", leftarrowtail: "↢", LeftCeiling: "⌈", LeftDoubleBracket: "⟦", LeftDownTeeVector: "⥡", LeftDownVectorBar: "⥙", LeftDownVector: "⇃", LeftFloor: "⌊", leftharpoondown: "↽", leftharpoonup: "↼", leftleftarrows: "⇇", leftrightarrow: "↔", LeftRightArrow: "↔", Leftrightarrow: "⇔", leftrightarrows: "⇆", leftrightharpoons: "⇋", leftrightsquigarrow: "↭", LeftRightVector: "⥎", LeftTeeArrow: "↤", LeftTee: "⊣", LeftTeeVector: "⥚", leftthreetimes: "⋋", LeftTriangleBar: "⧏", LeftTriangle: "⊲", LeftTriangleEqual: "⊴", LeftUpDownVector: "⥑", LeftUpTeeVector: "⥠", LeftUpVectorBar: "⥘", LeftUpVector: "↿", LeftVectorBar: "⥒", LeftVector: "↼", lEg: "⪋", leg: "⋚", leq: "≤", leqq: "≦", leqslant: "⩽", lescc: "⪨", les: "⩽", lesdot: "⩿", lesdoto: "⪁", lesdotor: "⪃", lesg: "⋚︀", lesges: "⪓", lessapprox: "⪅", lessdot: "⋖", lesseqgtr: "⋚", lesseqqgtr: "⪋", LessEqualGreater: "⋚", LessFullEqual: "≦", LessGreater: "≶", lessgtr: "≶", LessLess: "⪡", lesssim: "≲", LessSlantEqual: "⩽", LessTilde: "≲", lfisht: "⥼", lfloor: "⌊", Lfr: "𝔏", lfr: "𝔩", lg: "≶", lgE: "⪑", lHar: "⥢", lhard: "↽", lharu: "↼", lharul: "⥪", lhblk: "▄", LJcy: "Љ", ljcy: "љ", llarr: "⇇", ll: "≪", Ll: "⋘", llcorner: "⌞", Lleftarrow: "⇚", llhard: "⥫", lltri: "◺", Lmidot: "Ŀ", lmidot: "ŀ", lmoustache: "⎰", lmoust: "⎰", lnap: "⪉", lnapprox: "⪉", lne: "⪇", lnE: "≨", lneq: "⪇", lneqq: "≨", lnsim: "⋦", loang: "⟬", loarr: "⇽", lobrk: "⟦", longleftarrow: "⟵", LongLeftArrow: "⟵", Longleftarrow: "⟸", longleftrightarrow: "⟷", LongLeftRightArrow: "⟷", Longleftrightarrow: "⟺", longmapsto: "⟼", longrightarrow: "⟶", LongRightArrow: "⟶", Longrightarrow: "⟹", looparrowleft: "↫", looparrowright: "↬", lopar: "⦅", Lopf: "𝕃", lopf: "𝕝", loplus: "⨭", lotimes: "⨴", lowast: "∗", lowbar: "_", LowerLeftArrow: "↙", LowerRightArrow: "↘", loz: "◊", lozenge: "◊", lozf: "⧫", lpar: "(", lparlt: "⦓", lrarr: "⇆", lrcorner: "⌟", lrhar: "⇋", lrhard: "⥭", lrm: "‎", lrtri: "⊿", lsaquo: "‹", lscr: "𝓁", Lscr: "ℒ", lsh: "↰", Lsh: "↰", lsim: "≲", lsime: "⪍", lsimg: "⪏", lsqb: "[", lsquo: "‘", lsquor: "‚", Lstrok: "Ł", lstrok: "ł", ltcc: "⪦", ltcir: "⩹", lt: "<", LT: "<", Lt: "≪", ltdot: "⋖", lthree: "⋋", ltimes: "⋉", ltlarr: "⥶", ltquest: "⩻", ltri: "◃", ltrie: "⊴", ltrif: "◂", ltrPar: "⦖", lurdshar: "⥊", luruhar: "⥦", lvertneqq: "≨︀", lvnE: "≨︀", macr: "¯", male: "♂", malt: "✠", maltese: "✠", Map: "⤅", map: "↦", mapsto: "↦", mapstodown: "↧", mapstoleft: "↤", mapstoup: "↥", marker: "▮", mcomma: "⨩", Mcy: "М", mcy: "м", mdash: "—", mDDot: "∺", measuredangle: "∡", MediumSpace: " ", Mellintrf: "ℳ", Mfr: "𝔐", mfr: "𝔪", mho: "℧", micro: "µ", midast: "*", midcir: "⫰", mid: "∣", middot: "·", minusb: "⊟", minus: "−", minusd: "∸", minusdu: "⨪", MinusPlus: "∓", mlcp: "⫛", mldr: "…", mnplus: "∓", models: "⊧", Mopf: "𝕄", mopf: "𝕞", mp: "∓", mscr: "𝓂", Mscr: "ℳ", mstpos: "∾", Mu: "Μ", mu: "μ", multimap: "⊸", mumap: "⊸", nabla: "∇", Nacute: "Ń", nacute: "ń", nang: "∠⃒", nap: "≉", napE: "⩰̸", napid: "≋̸", napos: "ŉ", napprox: "≉", natural: "♮", naturals: "ℕ", natur: "♮", nbsp: " ", nbump: "≎̸", nbumpe: "≏̸", ncap: "⩃", Ncaron: "Ň", ncaron: "ň", Ncedil: "Ņ", ncedil: "ņ", ncong: "≇", ncongdot: "⩭̸", ncup: "⩂", Ncy: "Н", ncy: "н", ndash: "–", nearhk: "⤤", nearr: "↗", neArr: "⇗", nearrow: "↗", ne: "≠", nedot: "≐̸", NegativeMediumSpace: "​", NegativeThickSpace: "​", NegativeThinSpace: "​", NegativeVeryThinSpace: "​", nequiv: "≢", nesear: "⤨", nesim: "≂̸", NestedGreaterGreater: "≫", NestedLessLess: "≪", NewLine: "\n", nexist: "∄", nexists: "∄", Nfr: "𝔑", nfr: "𝔫", ngE: "≧̸", nge: "≱", ngeq: "≱", ngeqq: "≧̸", ngeqslant: "⩾̸", nges: "⩾̸", nGg: "⋙̸", ngsim: "≵", nGt: "≫⃒", ngt: "≯", ngtr: "≯", nGtv: "≫̸", nharr: "↮", nhArr: "⇎", nhpar: "⫲", ni: "∋", nis: "⋼", nisd: "⋺", niv: "∋", NJcy: "Њ", njcy: "њ", nlarr: "↚", nlArr: "⇍", nldr: "‥", nlE: "≦̸", nle: "≰", nleftarrow: "↚", nLeftarrow: "⇍", nleftrightarrow: "↮", nLeftrightarrow: "⇎", nleq: "≰", nleqq: "≦̸", nleqslant: "⩽̸", nles: "⩽̸", nless: "≮", nLl: "⋘̸", nlsim: "≴", nLt: "≪⃒", nlt: "≮", nltri: "⋪", nltrie: "⋬", nLtv: "≪̸", nmid: "∤", NoBreak: "⁠", NonBreakingSpace: " ", nopf: "𝕟", Nopf: "ℕ", Not: "⫬", not: "¬", NotCongruent: "≢", NotCupCap: "≭", NotDoubleVerticalBar: "∦", NotElement: "∉", NotEqual: "≠", NotEqualTilde: "≂̸", NotExists: "∄", NotGreater: "≯", NotGreaterEqual: "≱", NotGreaterFullEqual: "≧̸", NotGreaterGreater: "≫̸", NotGreaterLess: "≹", NotGreaterSlantEqual: "⩾̸", NotGreaterTilde: "≵", NotHumpDownHump: "≎̸", NotHumpEqual: "≏̸", notin: "∉", notindot: "⋵̸", notinE: "⋹̸", notinva: "∉", notinvb: "⋷", notinvc: "⋶", NotLeftTriangleBar: "⧏̸", NotLeftTriangle: "⋪", NotLeftTriangleEqual: "⋬", NotLess: "≮", NotLessEqual: "≰", NotLessGreater: "≸", NotLessLess: "≪̸", NotLessSlantEqual: "⩽̸", NotLessTilde: "≴", NotNestedGreaterGreater: "⪢̸", NotNestedLessLess: "⪡̸", notni: "∌", notniva: "∌", notnivb: "⋾", notnivc: "⋽", NotPrecedes: "⊀", NotPrecedesEqual: "⪯̸", NotPrecedesSlantEqual: "⋠", NotReverseElement: "∌", NotRightTriangleBar: "⧐̸", NotRightTriangle: "⋫", NotRightTriangleEqual: "⋭", NotSquareSubset: "⊏̸", NotSquareSubsetEqual: "⋢", NotSquareSuperset: "⊐̸", NotSquareSupersetEqual: "⋣", NotSubset: "⊂⃒", NotSubsetEqual: "⊈", NotSucceeds: "⊁", NotSucceedsEqual: "⪰̸", NotSucceedsSlantEqual: "⋡", NotSucceedsTilde: "≿̸", NotSuperset: "⊃⃒", NotSupersetEqual: "⊉", NotTilde: "≁", NotTildeEqual: "≄", NotTildeFullEqual: "≇", NotTildeTilde: "≉", NotVerticalBar: "∤", nparallel: "∦", npar: "∦", nparsl: "⫽⃥", npart: "∂̸", npolint: "⨔", npr: "⊀", nprcue: "⋠", nprec: "⊀", npreceq: "⪯̸", npre: "⪯̸", nrarrc: "⤳̸", nrarr: "↛", nrArr: "⇏", nrarrw: "↝̸", nrightarrow: "↛", nRightarrow: "⇏", nrtri: "⋫", nrtrie: "⋭", nsc: "⊁", nsccue: "⋡", nsce: "⪰̸", Nscr: "𝒩", nscr: "𝓃", nshortmid: "∤", nshortparallel: "∦", nsim: "≁", nsime: "≄", nsimeq: "≄", nsmid: "∤", nspar: "∦", nsqsube: "⋢", nsqsupe: "⋣", nsub: "⊄", nsubE: "⫅̸", nsube: "⊈", nsubset: "⊂⃒", nsubseteq: "⊈", nsubseteqq: "⫅̸", nsucc: "⊁", nsucceq: "⪰̸", nsup: "⊅", nsupE: "⫆̸", nsupe: "⊉", nsupset: "⊃⃒", nsupseteq: "⊉", nsupseteqq: "⫆̸", ntgl: "≹", Ntilde: "Ñ", ntilde: "ñ", ntlg: "≸", ntriangleleft: "⋪", ntrianglelefteq: "⋬", ntriangleright: "⋫", ntrianglerighteq: "⋭", Nu: "Ν", nu: "ν", num: "#", numero: "№", numsp: " ", nvap: "≍⃒", nvdash: "⊬", nvDash: "⊭", nVdash: "⊮", nVDash: "⊯", nvge: "≥⃒", nvgt: ">⃒", nvHarr: "⤄", nvinfin: "⧞", nvlArr: "⤂", nvle: "≤⃒", nvlt: "<⃒", nvltrie: "⊴⃒", nvrArr: "⤃", nvrtrie: "⊵⃒", nvsim: "∼⃒", nwarhk: "⤣", nwarr: "↖", nwArr: "⇖", nwarrow: "↖", nwnear: "⤧", Oacute: "Ó", oacute: "ó", oast: "⊛", Ocirc: "Ô", ocirc: "ô", ocir: "⊚", Ocy: "О", ocy: "о", odash: "⊝", Odblac: "Ő", odblac: "ő", odiv: "⨸", odot: "⊙", odsold: "⦼", OElig: "Œ", oelig: "œ", ofcir: "⦿", Ofr: "𝔒", ofr: "𝔬", ogon: "˛", Ograve: "Ò", ograve: "ò", ogt: "⧁", ohbar: "⦵", ohm: "Ω", oint: "∮", olarr: "↺", olcir: "⦾", olcross: "⦻", oline: "‾", olt: "⧀", Omacr: "Ō", omacr: "ō", Omega: "Ω", omega: "ω", Omicron: "Ο", omicron: "ο", omid: "⦶", ominus: "⊖", Oopf: "𝕆", oopf: "𝕠", opar: "⦷", OpenCurlyDoubleQuote: "“", OpenCurlyQuote: "‘", operp: "⦹", oplus: "⊕", orarr: "↻", Or: "⩔", or: "∨", ord: "⩝", order: "ℴ", orderof: "ℴ", ordf: "ª", ordm: "º", origof: "⊶", oror: "⩖", orslope: "⩗", orv: "⩛", oS: "Ⓢ", Oscr: "𝒪", oscr: "ℴ", Oslash: "Ø", oslash: "ø", osol: "⊘", Otilde: "Õ", otilde: "õ", otimesas: "⨶", Otimes: "⨷", otimes: "⊗", Ouml: "Ö", ouml: "ö", ovbar: "⌽", OverBar: "‾", OverBrace: "⏞", OverBracket: "⎴", OverParenthesis: "⏜", para: "¶", parallel: "∥", par: "∥", parsim: "⫳", parsl: "⫽", part: "∂", PartialD: "∂", Pcy: "П", pcy: "п", percnt: "%", period: ".", permil: "‰", perp: "⊥", pertenk: "‱", Pfr: "𝔓", pfr: "𝔭", Phi: "Φ", phi: "φ", phiv: "ϕ", phmmat: "ℳ", phone: "☎", Pi: "Π", pi: "π", pitchfork: "⋔", piv: "ϖ", planck: "ℏ", planckh: "ℎ", plankv: "ℏ", plusacir: "⨣", plusb: "⊞", pluscir: "⨢", plus: "+", plusdo: "∔", plusdu: "⨥", pluse: "⩲", PlusMinus: "±", plusmn: "±", plussim: "⨦", plustwo: "⨧", pm: "±", Poincareplane: "ℌ", pointint: "⨕", popf: "𝕡", Popf: "ℙ", pound: "£", prap: "⪷", Pr: "⪻", pr: "≺", prcue: "≼", precapprox: "⪷", prec: "≺", preccurlyeq: "≼", Precedes: "≺", PrecedesEqual: "⪯", PrecedesSlantEqual: "≼", PrecedesTilde: "≾", preceq: "⪯", precnapprox: "⪹", precneqq: "⪵", precnsim: "⋨", pre: "⪯", prE: "⪳", precsim: "≾", prime: "′", Prime: "″", primes: "ℙ", prnap: "⪹", prnE: "⪵", prnsim: "⋨", prod: "∏", Product: "∏", profalar: "⌮", profline: "⌒", profsurf: "⌓", prop: "∝", Proportional: "∝", Proportion: "∷", propto: "∝", prsim: "≾", prurel: "⊰", Pscr: "𝒫", pscr: "𝓅", Psi: "Ψ", psi: "ψ", puncsp: " ", Qfr: "𝔔", qfr: "𝔮", qint: "⨌", qopf: "𝕢", Qopf: "ℚ", qprime: "⁗", Qscr: "𝒬", qscr: "𝓆", quaternions: "ℍ", quatint: "⨖", quest: "?", questeq: "≟", quot: '"', QUOT: '"', rAarr: "⇛", race: "∽̱", Racute: "Ŕ", racute: "ŕ", radic: "√", raemptyv: "⦳", rang: "⟩", Rang: "⟫", rangd: "⦒", range: "⦥", rangle: "⟩", raquo: "»", rarrap: "⥵", rarrb: "⇥", rarrbfs: "⤠", rarrc: "⤳", rarr: "→", Rarr: "↠", rArr: "⇒", rarrfs: "⤞", rarrhk: "↪", rarrlp: "↬", rarrpl: "⥅", rarrsim: "⥴", Rarrtl: "⤖", rarrtl: "↣", rarrw: "↝", ratail: "⤚", rAtail: "⤜", ratio: "∶", rationals: "ℚ", rbarr: "⤍", rBarr: "⤏", RBarr: "⤐", rbbrk: "❳", rbrace: "}", rbrack: "]", rbrke: "⦌", rbrksld: "⦎", rbrkslu: "⦐", Rcaron: "Ř", rcaron: "ř", Rcedil: "Ŗ", rcedil: "ŗ", rceil: "⌉", rcub: "}", Rcy: "Р", rcy: "р", rdca: "⤷", rdldhar: "⥩", rdquo: "”", rdquor: "”", rdsh: "↳", real: "ℜ", realine: "ℛ", realpart: "ℜ", reals: "ℝ", Re: "ℜ", rect: "▭", reg: "®", REG: "®", ReverseElement: "∋", ReverseEquilibrium: "⇋", ReverseUpEquilibrium: "⥯", rfisht: "⥽", rfloor: "⌋", rfr: "𝔯", Rfr: "ℜ", rHar: "⥤", rhard: "⇁", rharu: "⇀", rharul: "⥬", Rho: "Ρ", rho: "ρ", rhov: "ϱ", RightAngleBracket: "⟩", RightArrowBar: "⇥", rightarrow: "→", RightArrow: "→", Rightarrow: "⇒", RightArrowLeftArrow: "⇄", rightarrowtail: "↣", RightCeiling: "⌉", RightDoubleBracket: "⟧", RightDownTeeVector: "⥝", RightDownVectorBar: "⥕", RightDownVector: "⇂", RightFloor: "⌋", rightharpoondown: "⇁", rightharpoonup: "⇀", rightleftarrows: "⇄", rightleftharpoons: "⇌", rightrightarrows: "⇉", rightsquigarrow: "↝", RightTeeArrow: "↦", RightTee: "⊢", RightTeeVector: "⥛", rightthreetimes: "⋌", RightTriangleBar: "⧐", RightTriangle: "⊳", RightTriangleEqual: "⊵", RightUpDownVector: "⥏", RightUpTeeVector: "⥜", RightUpVectorBar: "⥔", RightUpVector: "↾", RightVectorBar: "⥓", RightVector: "⇀", ring: "˚", risingdotseq: "≓", rlarr: "⇄", rlhar: "⇌", rlm: "‏", rmoustache: "⎱", rmoust: "⎱", rnmid: "⫮", roang: "⟭", roarr: "⇾", robrk: "⟧", ropar: "⦆", ropf: "𝕣", Ropf: "ℝ", roplus: "⨮", rotimes: "⨵", RoundImplies: "⥰", rpar: ")", rpargt: "⦔", rppolint: "⨒", rrarr: "⇉", Rrightarrow: "⇛", rsaquo: "›", rscr: "𝓇", Rscr: "ℛ", rsh: "↱", Rsh: "↱", rsqb: "]", rsquo: "’", rsquor: "’", rthree: "⋌", rtimes: "⋊", rtri: "▹", rtrie: "⊵", rtrif: "▸", rtriltri: "⧎", RuleDelayed: "⧴", ruluhar: "⥨", rx: "℞", Sacute: "Ś", sacute: "ś", sbquo: "‚", scap: "⪸", Scaron: "Š", scaron: "š", Sc: "⪼", sc: "≻", sccue: "≽", sce: "⪰", scE: "⪴", Scedil: "Ş", scedil: "ş", Scirc: "Ŝ", scirc: "ŝ", scnap: "⪺", scnE: "⪶", scnsim: "⋩", scpolint: "⨓", scsim: "≿", Scy: "С", scy: "с", sdotb: "⊡", sdot: "⋅", sdote: "⩦", searhk: "⤥", searr: "↘", seArr: "⇘", searrow: "↘", sect: "§", semi: ";", seswar: "⤩", setminus: "∖", setmn: "∖", sext: "✶", Sfr: "𝔖", sfr: "𝔰", sfrown: "⌢", sharp: "♯", SHCHcy: "Щ", shchcy: "щ", SHcy: "Ш", shcy: "ш", ShortDownArrow: "↓", ShortLeftArrow: "←", shortmid: "∣", shortparallel: "∥", ShortRightArrow: "→", ShortUpArrow: "↑", shy: "­", Sigma: "Σ", sigma: "σ", sigmaf: "ς", sigmav: "ς", sim: "∼", simdot: "⩪", sime: "≃", simeq: "≃", simg: "⪞", simgE: "⪠", siml: "⪝", simlE: "⪟", simne: "≆", simplus: "⨤", simrarr: "⥲", slarr: "←", SmallCircle: "∘", smallsetminus: "∖", smashp: "⨳", smeparsl: "⧤", smid: "∣", smile: "⌣", smt: "⪪", smte: "⪬", smtes: "⪬︀", SOFTcy: "Ь", softcy: "ь", solbar: "⌿", solb: "⧄", sol: "/", Sopf: "𝕊", sopf: "𝕤", spades: "♠", spadesuit: "♠", spar: "∥", sqcap: "⊓", sqcaps: "⊓︀", sqcup: "⊔", sqcups: "⊔︀", Sqrt: "√", sqsub: "⊏", sqsube: "⊑", sqsubset: "⊏", sqsubseteq: "⊑", sqsup: "⊐", sqsupe: "⊒", sqsupset: "⊐", sqsupseteq: "⊒", square: "□", Square: "□", SquareIntersection: "⊓", SquareSubset: "⊏", SquareSubsetEqual: "⊑", SquareSuperset: "⊐", SquareSupersetEqual: "⊒", SquareUnion: "⊔", squarf: "▪", squ: "□", squf: "▪", srarr: "→", Sscr: "𝒮", sscr: "𝓈", ssetmn: "∖", ssmile: "⌣", sstarf: "⋆", Star: "⋆", star: "☆", starf: "★", straightepsilon: "ϵ", straightphi: "ϕ", strns: "¯", sub: "⊂", Sub: "⋐", subdot: "⪽", subE: "⫅", sube: "⊆", subedot: "⫃", submult: "⫁", subnE: "⫋", subne: "⊊", subplus: "⪿", subrarr: "⥹", subset: "⊂", Subset: "⋐", subseteq: "⊆", subseteqq: "⫅", SubsetEqual: "⊆", subsetneq: "⊊", subsetneqq: "⫋", subsim: "⫇", subsub: "⫕", subsup: "⫓", succapprox: "⪸", succ: "≻", succcurlyeq: "≽", Succeeds: "≻", SucceedsEqual: "⪰", SucceedsSlantEqual: "≽", SucceedsTilde: "≿", succeq: "⪰", succnapprox: "⪺", succneqq: "⪶", succnsim: "⋩", succsim: "≿", SuchThat: "∋", sum: "∑", Sum: "∑", sung: "♪", sup1: "¹", sup2: "²", sup3: "³", sup: "⊃", Sup: "⋑", supdot: "⪾", supdsub: "⫘", supE: "⫆", supe: "⊇", supedot: "⫄", Superset: "⊃", SupersetEqual: "⊇", suphsol: "⟉", suphsub: "⫗", suplarr: "⥻", supmult: "⫂", supnE: "⫌", supne: "⊋", supplus: "⫀", supset: "⊃", Supset: "⋑", supseteq: "⊇", supseteqq: "⫆", supsetneq: "⊋", supsetneqq: "⫌", supsim: "⫈", supsub: "⫔", supsup: "⫖", swarhk: "⤦", swarr: "↙", swArr: "⇙", swarrow: "↙", swnwar: "⤪", szlig: "ß", Tab: "\t", target: "⌖", Tau: "Τ", tau: "τ", tbrk: "⎴", Tcaron: "Ť", tcaron: "ť", Tcedil: "Ţ", tcedil: "ţ", Tcy: "Т", tcy: "т", tdot: "⃛", telrec: "⌕", Tfr: "𝔗", tfr: "𝔱", there4: "∴", therefore: "∴", Therefore: "∴", Theta: "Θ", theta: "θ", thetasym: "ϑ", thetav: "ϑ", thickapprox: "≈", thicksim: "∼", ThickSpace: "  ", ThinSpace: " ", thinsp: " ", thkap: "≈", thksim: "∼", THORN: "Þ", thorn: "þ", tilde: "˜", Tilde: "∼", TildeEqual: "≃", TildeFullEqual: "≅", TildeTilde: "≈", timesbar: "⨱", timesb: "⊠", times: "×", timesd: "⨰", tint: "∭", toea: "⤨", topbot: "⌶", topcir: "⫱", top: "⊤", Topf: "𝕋", topf: "𝕥", topfork: "⫚", tosa: "⤩", tprime: "‴", trade: "™", TRADE: "™", triangle: "▵", triangledown: "▿", triangleleft: "◃", trianglelefteq: "⊴", triangleq: "≜", triangleright: "▹", trianglerighteq: "⊵", tridot: "◬", trie: "≜", triminus: "⨺", TripleDot: "⃛", triplus: "⨹", trisb: "⧍", tritime: "⨻", trpezium: "⏢", Tscr: "𝒯", tscr: "𝓉", TScy: "Ц", tscy: "ц", TSHcy: "Ћ", tshcy: "ћ", Tstrok: "Ŧ", tstrok: "ŧ", twixt: "≬", twoheadleftarrow: "↞", twoheadrightarrow: "↠", Uacute: "Ú", uacute: "ú", uarr: "↑", Uarr: "↟", uArr: "⇑", Uarrocir: "⥉", Ubrcy: "Ў", ubrcy: "ў", Ubreve: "Ŭ", ubreve: "ŭ", Ucirc: "Û", ucirc: "û", Ucy: "У", ucy: "у", udarr: "⇅", Udblac: "Ű", udblac: "ű", udhar: "⥮", ufisht: "⥾", Ufr: "𝔘", ufr: "𝔲", Ugrave: "Ù", ugrave: "ù", uHar: "⥣", uharl: "↿", uharr: "↾", uhblk: "▀", ulcorn: "⌜", ulcorner: "⌜", ulcrop: "⌏", ultri: "◸", Umacr: "Ū", umacr: "ū", uml: "¨", UnderBar: "_", UnderBrace: "⏟", UnderBracket: "⎵", UnderParenthesis: "⏝", Union: "⋃", UnionPlus: "⊎", Uogon: "Ų", uogon: "ų", Uopf: "𝕌", uopf: "𝕦", UpArrowBar: "⤒", uparrow: "↑", UpArrow: "↑", Uparrow: "⇑", UpArrowDownArrow: "⇅", updownarrow: "↕", UpDownArrow: "↕", Updownarrow: "⇕", UpEquilibrium: "⥮", upharpoonleft: "↿", upharpoonright: "↾", uplus: "⊎", UpperLeftArrow: "↖", UpperRightArrow: "↗", upsi: "υ", Upsi: "ϒ", upsih: "ϒ", Upsilon: "Υ", upsilon: "υ", UpTeeArrow: "↥", UpTee: "⊥", upuparrows: "⇈", urcorn: "⌝", urcorner: "⌝", urcrop: "⌎", Uring: "Ů", uring: "ů", urtri: "◹", Uscr: "𝒰", uscr: "𝓊", utdot: "⋰", Utilde: "Ũ", utilde: "ũ", utri: "▵", utrif: "▴", uuarr: "⇈", Uuml: "Ü", uuml: "ü", uwangle: "⦧", vangrt: "⦜", varepsilon: "ϵ", varkappa: "ϰ", varnothing: "∅", varphi: "ϕ", varpi: "ϖ", varpropto: "∝", varr: "↕", vArr: "⇕", varrho: "ϱ", varsigma: "ς", varsubsetneq: "⊊︀", varsubsetneqq: "⫋︀", varsupsetneq: "⊋︀", varsupsetneqq: "⫌︀", vartheta: "ϑ", vartriangleleft: "⊲", vartriangleright: "⊳", vBar: "⫨", Vbar: "⫫", vBarv: "⫩", Vcy: "В", vcy: "в", vdash: "⊢", vDash: "⊨", Vdash: "⊩", VDash: "⊫", Vdashl: "⫦", veebar: "⊻", vee: "∨", Vee: "⋁", veeeq: "≚", vellip: "⋮", verbar: "|", Verbar: "‖", vert: "|", Vert: "‖", VerticalBar: "∣", VerticalLine: "|", VerticalSeparator: "❘", VerticalTilde: "≀", VeryThinSpace: " ", Vfr: "𝔙", vfr: "𝔳", vltri: "⊲", vnsub: "⊂⃒", vnsup: "⊃⃒", Vopf: "𝕍", vopf: "𝕧", vprop: "∝", vrtri: "⊳", Vscr: "𝒱", vscr: "𝓋", vsubnE: "⫋︀", vsubne: "⊊︀", vsupnE: "⫌︀", vsupne: "⊋︀", Vvdash: "⊪", vzigzag: "⦚", Wcirc: "Ŵ", wcirc: "ŵ", wedbar: "⩟", wedge: "∧", Wedge: "⋀", wedgeq: "≙", weierp: "℘", Wfr: "𝔚", wfr: "𝔴", Wopf: "𝕎", wopf: "𝕨", wp: "℘", wr: "≀", wreath: "≀", Wscr: "𝒲", wscr: "𝓌", xcap: "⋂", xcirc: "◯", xcup: "⋃", xdtri: "▽", Xfr: "𝔛", xfr: "𝔵", xharr: "⟷", xhArr: "⟺", Xi: "Ξ", xi: "ξ", xlarr: "⟵", xlArr: "⟸", xmap: "⟼", xnis: "⋻", xodot: "⨀", Xopf: "𝕏", xopf: "𝕩", xoplus: "⨁", xotime: "⨂", xrarr: "⟶", xrArr: "⟹", Xscr: "𝒳", xscr: "𝓍", xsqcup: "⨆", xuplus: "⨄", xutri: "△", xvee: "⋁", xwedge: "⋀", Yacute: "Ý", yacute: "ý", YAcy: "Я", yacy: "я", Ycirc: "Ŷ", ycirc: "ŷ", Ycy: "Ы", ycy: "ы", yen: "¥", Yfr: "𝔜", yfr: "𝔶", YIcy: "Ї", yicy: "ї", Yopf: "𝕐", yopf: "𝕪", Yscr: "𝒴", yscr: "𝓎", YUcy: "Ю", yucy: "ю", yuml: "ÿ", Yuml: "Ÿ", Zacute: "Ź", zacute: "ź", Zcaron: "Ž", zcaron: "ž", Zcy: "З", zcy: "з", Zdot: "Ż", zdot: "ż", zeetrf: "ℨ", ZeroWidthSpace: "​", Zeta: "Ζ", zeta: "ζ", zfr: "𝔷", Zfr: "ℨ", ZHcy: "Ж", zhcy: "ж", zigrarr: "⇝", zopf: "𝕫", Zopf: "ℤ", Zscr: "𝒵", zscr: "𝓏", zwj: "‍", zwnj: "‌" };}, function (e, t) {}, function (e, t) {}, function (e, t, n) {"use strict";function r(e) {return Array.prototype.slice.call(arguments, 1).forEach(function (t) {t && Object.keys(t).forEach(function (n) {e[n] = t[n];});}), e;}function o(e) {return Object.prototype.toString.call(e);}function i(e) {return "[object String]" === o(e);}function a(e) {return "[object Object]" === o(e);}function s(e) {return "[object RegExp]" === o(e);}function l(e) {return "[object Function]" === o(e);}function c(e) {return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");}function u(e) {return Object.keys(e || {}).reduce(function (e, t) {return e || b.hasOwnProperty(t);}, !1);}function p(e) {e.__index__ = -1, e.__text_cache__ = "";}function _(e) {return function (t, n) {var r = t.slice(n);return e.test(r) ? r.match(e)[0].length : 0;};}function d() {return function (e, t) {t.normalize(e);};}function h(e) {function t(e) {return e.replace("%TLDS%", o.src_tlds);}function r(e, t) {throw new Error('(LinkifyIt) Invalid schema "' + e + '": ' + t);}var o = e.re = n(109)(e.__opts__),u = e.__tlds__.slice();e.onCompile(), e.__tlds_replaced__ || u.push(k), u.push(o.src_xn), o.src_tlds = u.join("|"), o.email_fuzzy = RegExp(t(o.tpl_email_fuzzy), "i"), o.link_fuzzy = RegExp(t(o.tpl_link_fuzzy), "i"), o.link_no_ip_fuzzy = RegExp(t(o.tpl_link_no_ip_fuzzy), "i"), o.host_fuzzy_test = RegExp(t(o.tpl_host_fuzzy_test), "i");var h = [];e.__compiled__ = {}, Object.keys(e.__schemas__).forEach(function (t) {var n = e.__schemas__[t];if (null !== n) {var o = { validate: null, link: null };return e.__compiled__[t] = o, a(n) ? (s(n.validate) ? o.validate = _(n.validate) : l(n.validate) ? o.validate = n.validate : r(t, n), void (l(n.normalize) ? o.normalize = n.normalize : n.normalize ? r(t, n) : o.normalize = d())) : i(n) ? void h.push(t) : void r(t, n);}}), h.forEach(function (t) {e.__compiled__[e.__schemas__[t]] && (e.__compiled__[t].validate = e.__compiled__[e.__schemas__[t]].validate, e.__compiled__[t].normalize = e.__compiled__[e.__schemas__[t]].normalize);}), e.__compiled__[""] = { validate: null, normalize: d() };var f = Object.keys(e.__compiled__).filter(function (t) {return t.length > 0 && e.__compiled__[t];}).map(c).join("|");e.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + o.src_ZPCc + "))(" + f + ")", "i"), e.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + o.src_ZPCc + "))(" + f + ")", "ig"), e.re.pretest = RegExp("(" + e.re.schema_test.source + ")|(" + e.re.host_fuzzy_test.source + ")|@", "i"), p(e);}function f(e, t) {var n = e.__index__,r = e.__last_index__,o = e.__text_cache__.slice(n, r);this.schema = e.__schema__.toLowerCase(), this.index = n + t, this.lastIndex = r + t, this.raw = o, this.text = o, this.url = o;}function m(e, t) {var n = new f(e, t);return e.__compiled__[n.schema].normalize(n, e), n;}function g(e, t) {if (!(this instanceof g)) return new g(e, t);t || u(e) && (t = e, e = {}), this.__opts__ = r({}, b, t), this.__index__ = -1, this.__last_index__ = -1, this.__schema__ = "", this.__text_cache__ = "", this.__schemas__ = r({}, v, e), this.__compiled__ = {}, this.__tlds__ = w, this.__tlds_replaced__ = !1, this.re = {}, h(this);}var b = { fuzzyLink: !0, fuzzyEmail: !0, fuzzyIP: !1 },v = { "http:": { validate: function validate(e, t, n) {var r = e.slice(t);return n.re.http || (n.re.http = new RegExp("^\\/\\/" + n.re.src_auth + n.re.src_host_port_strict + n.re.src_path, "i")), n.re.http.test(r) ? r.match(n.re.http)[0].length : 0;} }, "https:": "http:", "ftp:": "http:", "//": { validate: function validate(e, t, n) {var r = e.slice(t);return n.re.no_http || (n.re.no_http = new RegExp("^" + n.re.src_auth + "(?:localhost|(?:(?:" + n.re.src_domain + ")\\.)+" + n.re.src_domain_root + ")" + n.re.src_port + n.re.src_host_terminator + n.re.src_path, "i")), n.re.no_http.test(r) ? t >= 3 && ":" === e[t - 3] ? 0 : t >= 3 && "/" === e[t - 3] ? 0 : r.match(n.re.no_http)[0].length : 0;} }, "mailto:": { validate: function validate(e, t, n) {var r = e.slice(t);return n.re.mailto || (n.re.mailto = new RegExp("^" + n.re.src_email_name + "@" + n.re.src_host_strict, "i")), n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0;} } },k = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]",w = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");g.prototype.add = function (e, t) {return this.__schemas__[e] = t, h(this), this;}, g.prototype.set = function (e) {return this.__opts__ = r(this.__opts__, e), this;}, g.prototype.test = function (e) {if (this.__text_cache__ = e, this.__index__ = -1, !e.length) return !1;var t, n, r, o, i, a, s, l;if (this.re.schema_test.test(e)) for (s = this.re.schema_search, s.lastIndex = 0; null !== (t = s.exec(e));) {if (o = this.testSchemaAt(e, t[2], s.lastIndex)) {this.__schema__ = t[2], this.__index__ = t.index + t[1].length, this.__last_index__ = t.index + t[0].length + o;break;}}return this.__opts__.fuzzyLink && this.__compiled__["http:"] && (l = e.search(this.re.host_fuzzy_test)) >= 0 && (this.__index__ < 0 || l < this.__index__) && null !== (n = e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) && (i = n.index + n[1].length, (this.__index__ < 0 || i < this.__index__) && (this.__schema__ = "", this.__index__ = i, this.__last_index__ = n.index + n[0].length)), this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && e.indexOf("@") >= 0 && null !== (r = e.match(this.re.email_fuzzy)) && (i = r.index + r[1].length, a = r.index + r[0].length, (this.__index__ < 0 || i < this.__index__ || i === this.__index__ && a > this.__last_index__) && (this.__schema__ = "mailto:", this.__index__ = i, this.__last_index__ = a)), this.__index__ >= 0;}, g.prototype.pretest = function (e) {return this.re.pretest.test(e);}, g.prototype.testSchemaAt = function (e, t, n) {return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, n, this) : 0;}, g.prototype.match = function (e) {var t = 0,n = [];this.__index__ >= 0 && this.__text_cache__ === e && (n.push(m(this, t)), t = this.__last_index__);for (var r = t ? e.slice(t) : e; this.test(r);) {n.push(m(this, t)), r = r.slice(this.__last_index__), t += this.__last_index__;}return n.length ? n : null;}, g.prototype.tlds = function (e, t) {return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function (e, t, n) {return e !== n[t - 1];}).reverse(), h(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, h(this), this);}, g.prototype.normalize = function (e) {e.schema || (e.url = "http://" + e.url), "mailto:" !== e.schema || /^mailto:/i.test(e.url) || (e.url = "mailto:" + e.url);}, g.prototype.onCompile = function () {}, e.exports = g;}, function (e, t, n) {"use strict";e.exports = function (e) {var t = {};t.src_Any = n(55).source, t.src_Cc = n(53).source, t.src_Z = n(54).source, t.src_P = n(33).source, t.src_ZPCc = [t.src_Z, t.src_P, t.src_Cc].join("|"), t.src_ZCc = [t.src_Z, t.src_Cc].join("|");return t.src_pseudo_letter = "(?:(?![><｜]|" + t.src_ZPCc + ")" + t.src_Any + ")", t.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", t.src_auth = "(?:(?:(?!" + t.src_ZCc + "|[@/\\[\\]()]).)+@)?", t.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", t.src_host_terminator = "(?=$|[><｜]|" + t.src_ZPCc + ")(?!-|_|:\\d|\\.-|\\.(?!$|" + t.src_ZPCc + "))", t.src_path = "(?:[/?#](?:(?!" + t.src_ZCc + "|[><｜]|[()[\\]{}.,\"'?!\\-]).|\\[(?:(?!" + t.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + t.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + t.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + t.src_ZCc + '|["]).)+\\"|\\\'(?:(?!' + t.src_ZCc + "|[']).)+\\'|\\'(?=" + t.src_pseudo_letter + "|[-]).|\\.{2,3}[a-zA-Z0-9%/]|\\.(?!" + t.src_ZCc + "|[.]).|" + (e && e["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + "\\,(?!" + t.src_ZCc + ").|\\!(?!" + t.src_ZCc + "|[!]).|\\?(?!" + t.src_ZCc + "|[?]).)+|\\/)?", t.src_email_name = '[\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]+', t.src_xn = "xn--[a-z0-9\\-]{1,59}", t.src_domain_root = "(?:" + t.src_xn + "|" + t.src_pseudo_letter + "{1,63})", t.src_domain = "(?:" + t.src_xn + "|(?:" + t.src_pseudo_letter + ")|(?:" + t.src_pseudo_letter + "(?:-(?!-)|" + t.src_pseudo_letter + "){0,61}" + t.src_pseudo_letter + "))", t.src_host = "(?:(?:(?:(?:" + t.src_domain + ")\\.)*" + t.src_domain + "))", t.tpl_host_fuzzy = "(?:" + t.src_ip4 + "|(?:(?:(?:" + t.src_domain + ")\\.)+(?:%TLDS%)))", t.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + t.src_domain + ")\\.)+(?:%TLDS%))", t.src_host_strict = t.src_host + t.src_host_terminator, t.tpl_host_fuzzy_strict = t.tpl_host_fuzzy + t.src_host_terminator, t.src_host_port_strict = t.src_host + t.src_port + t.src_host_terminator, t.tpl_host_port_fuzzy_strict = t.tpl_host_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_port_no_ip_fuzzy_strict = t.tpl_host_no_ip_fuzzy + t.src_port + t.src_host_terminator, t.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + t.src_ZPCc + "|>|$))", t.tpl_email_fuzzy = "(^|[><｜]|\\(|" + t.src_ZCc + ")(" + t.src_email_name + "@" + t.tpl_host_fuzzy_strict + ")", t.tpl_link_fuzzy = "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + t.src_ZPCc + "))((?![$+<=>^`|｜])" + t.tpl_host_port_fuzzy_strict + t.src_path + ")", t.tpl_link_no_ip_fuzzy = "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + t.src_ZPCc + "))((?![$+<=>^`|｜])" + t.tpl_host_port_no_ip_fuzzy_strict + t.src_path + ")", t;};}, function (e, t, n) {"use strict";e.exports = function (e) {function t(e, t, n, r) {var o,i,a,s,l,c = e.bMarks[t] + e.tShift[t],u = e.eMarks[t];if (c + 2 >= u) return !1;if (42 !== e.src.charCodeAt(c++)) return !1;if (91 !== e.src.charCodeAt(c++)) return !1;for (s = c; c < u; c++) {if (91 === (a = e.src.charCodeAt(c))) return !1;if (93 === a) {l = c;break;}92 === a && c++;}return !(l < 0 || 58 !== e.src.charCodeAt(l + 1)) && (!!r || (o = e.src.slice(s, l).replace(/\\(.)/g, "$1"), i = e.src.slice(l + 2, u).trim(), 0 !== o.length && 0 !== i.length && (e.env.abbreviations || (e.env.abbreviations = {}), void 0 === e.env.abbreviations[":" + o] && (e.env.abbreviations[":" + o] = i), e.line = t + 1, !0)));}function n(e) {var t,n,l,c,u,p,_,d,h,f,m,g,b,v = e.tokens;if (e.env.abbreviations) for (g = new RegExp("(?:" + Object.keys(e.env.abbreviations).map(function (e) {return e.substr(1);}).sort(function (e, t) {return t.length - e.length;}).map(r).join("|") + ")"), m = "(^|" + a + "|" + s + "|[" + i.split("").map(r).join("") + "])(" + Object.keys(e.env.abbreviations).map(function (e) {return e.substr(1);}).sort(function (e, t) {return t.length - e.length;}).map(r).join("|") + ")($|" + a + "|" + s + "|[" + i.split("").map(r).join("") + "])", h = new RegExp(m, "g"), n = 0, l = v.length; n < l; n++) {if ("inline" === v[n].type) for (c = v[n].children, t = c.length - 1; t >= 0; t--) {if (b = c[t], "text" === b.type && (d = 0, p = b.content, h.lastIndex = 0, _ = [], g.test(p))) {for (; f = h.exec(p);) {(f.index > 0 || f[1].length > 0) && (u = new e.Token("text", "", 0), u.content = p.slice(d, f.index + f[1].length), _.push(u)), u = new e.Token("abbr_open", "abbr", 1), u.attrs = [["title", e.env.abbreviations[":" + f[2]]]], _.push(u), u = new e.Token("text", "", 0), u.content = f[2], _.push(u), u = new e.Token("abbr_close", "abbr", -1), _.push(u), h.lastIndex -= f[3].length, d = h.lastIndex;}_.length && (d < p.length && (u = new e.Token("text", "", 0), u.content = p.slice(d), _.push(u)), v[n].children = c = o(c, t, _));}}}}var r = e.utils.escapeRE,o = e.utils.arrayReplaceAt,i = " \r\n$+<=>^`|~",a = e.utils.lib.ucmicro.P.source,s = e.utils.lib.ucmicro.Z.source;e.block.ruler.before("reference", "abbr_def", t, { alt: ["paragraph", "reference"] }), e.core.ruler.after("linkify", "abbr_replace", n);};}, function (e, t, n) {"use strict";e.exports = function (e, t, n) {function r(e) {return e.trim().split(" ", 2)[0] === t;}function o(e, n, r, o, i) {return 1 === e[n].nesting && e[n].attrPush(["class", t]), i.renderToken(e, n, r, o, i);}function i(e, n, r, o) {var i,p,_,d,h,f,m,g,b = !1,v = e.bMarks[n] + e.tShift[n],k = e.eMarks[n];if (l !== e.src.charCodeAt(v)) return !1;for (i = v + 1; i <= k && s[(i - v) % c] === e.src[i]; i++) {;}if ((_ = Math.floor((i - v) / c)) < a) return !1;if (i -= (i - v) % c, d = e.src.slice(v, i), h = e.src.slice(i, k), !u(h)) return !1;if (o) return !0;for (p = n; !(++p >= r) && (v = e.bMarks[p] + e.tShift[p], k = e.eMarks[p], !(v < k && e.sCount[p] < e.blkIndent));) {if (l === e.src.charCodeAt(v) && !(e.sCount[p] - e.blkIndent >= 4)) {for (i = v + 1; i <= k && s[(i - v) % c] === e.src[i]; i++) {;}if (!(Math.floor((i - v) / c) < _ || (i -= (i - v) % c, (i = e.skipSpaces(i)) < k))) {b = !0;break;}}}return m = e.parentType, g = e.lineMax, e.parentType = "container", e.lineMax = p, f = e.push("container_" + t + "_open", "div", 1), f.markup = d, f.block = !0, f.info = h, f.map = [n, p], e.md.block.tokenize(e, n + 1, p), f = e.push("container_" + t + "_close", "div", -1), f.markup = e.src.slice(v, i), f.block = !0, e.parentType = m, e.lineMax = g, e.line = p + (b ? 1 : 0), !0;}n = n || {};var a = 3,s = n.marker || ":",l = s.charCodeAt(0),c = s.length,u = n.validate || r,p = n.render || o;e.block.ruler.before("fence", "container_" + t, i, { alt: ["paragraph", "reference", "blockquote", "list"] }), e.renderer.rules["container_" + t + "_open"] = p, e.renderer.rules["container_" + t + "_close"] = p;};}, function (e, t, n) {"use strict";e.exports = function (e) {function t(e, t) {var n,r,o = e.bMarks[t] + e.tShift[t],i = e.eMarks[t];return o >= i ? -1 : 126 !== (r = e.src.charCodeAt(o++)) && 58 !== r ? -1 : (n = e.skipSpaces(o), o === n ? -1 : n >= i ? -1 : o);}function n(e, t) {var n,r,o = e.level + 2;for (n = t + 2, r = e.tokens.length - 2; n < r; n++) {e.tokens[n].level === o && "paragraph_open" === e.tokens[n].type && (e.tokens[n + 2].hidden = !0, e.tokens[n].hidden = !0, n += 2);}}function r(e, r, i, a) {var s, l, c, u, p, _, d, h, f, m, g, b, v, k, w, x, y, C, E, D;if (a) return !(e.ddIndent < 0) && t(e, r) >= 0;if ((f = r + 1) >= i) return !1;if (e.isEmpty(f) && ++f >= i) return !1;if (e.sCount[f] < e.blkIndent) return !1;if ((l = t(e, f)) < 0) return !1;d = e.tokens.length, E = !0, D = e.push("dl_open", "dl", 1), D.map = _ = [r, 0], u = r, c = f;e: for (;;) {for (C = !1, D = e.push("dt_open", "dt", 1), D.map = [u, u], D = e.push("inline", "", 0), D.map = [u, u], D.content = e.getLines(u, u + 1, e.blkIndent, !1).trim(), D.children = [], D = e.push("dt_close", "dt", -1);;) {for (D = e.push("dd_open", "dd", 1), D.map = p = [f, 0], y = l, h = e.eMarks[c], m = e.sCount[c] + l - (e.bMarks[c] + e.tShift[c]); y < h && (s = e.src.charCodeAt(y), o(s));) {9 === s ? m += 4 - m % 4 : m++, y++;}if (l = y, x = e.tight, g = e.ddIndent, b = e.blkIndent, w = e.tShift[c], k = e.sCount[c], v = e.parentType, e.blkIndent = e.ddIndent = e.sCount[c] + 2, e.tShift[c] = l - e.bMarks[c], e.sCount[c] = m, e.tight = !0, e.parentType = "deflist", e.md.block.tokenize(e, c, i, !0), e.tight && !C || (E = !1), C = e.line - c > 1 && e.isEmpty(e.line - 1), e.tShift[c] = w, e.sCount[c] = k, e.tight = x, e.parentType = v, e.blkIndent = b, e.ddIndent = g, D = e.push("dd_close", "dd", -1), p[1] = f = e.line, f >= i) break e;if (e.sCount[f] < e.blkIndent) break e;if ((l = t(e, f)) < 0) break;c = f;}if (f >= i) break;if (u = f, e.isEmpty(u)) break;if (e.sCount[u] < e.blkIndent) break;if ((c = u + 1) >= i) break;if (e.isEmpty(c) && c++, c >= i) break;if (e.sCount[c] < e.blkIndent) break;if ((l = t(e, c)) < 0) break;}return D = e.push("dl_close", "dl", -1), _[1] = f, e.line = f, E && n(e, d), !0;}var o = e.utils.isSpace;e.block.ruler.before("paragraph", "deflist", r, { alt: ["paragraph", "reference"] });};}, function (e, t, n) {"use strict";var r = n(114),o = n(115),i = n(117),a = n(118),s = n(116);e.exports = function (e, t) {var n = { defs: r, shortcuts: o, enabled: [] },l = s(e.utils.assign({}, n, t || {}));e.renderer.rules.emoji = i, e.core.ruler.push("emoji", a(e, l.defs, l.shortcuts, l.scanRE, l.replaceRE));};}, function (e, t) {e.exports = { 100: "💯", 1234: "🔢", grinning: "😀", smiley: "😃", smile: "😄", grin: "😁", laughing: "😆", satisfied: "😆", sweat_smile: "😅", joy: "😂", rofl: "🤣", relaxed: "☺️", blush: "😊", innocent: "😇", slightly_smiling_face: "🙂", upside_down_face: "🙃", wink: "😉", relieved: "😌", heart_eyes: "😍", kissing_heart: "😘", kissing: "😗", kissing_smiling_eyes: "😙", kissing_closed_eyes: "😚", yum: "😋", stuck_out_tongue_winking_eye: "😜", stuck_out_tongue_closed_eyes: "😝", stuck_out_tongue: "😛", money_mouth_face: "🤑", hugs: "🤗", nerd_face: "🤓", sunglasses: "😎", clown_face: "🤡", cowboy_hat_face: "🤠", smirk: "😏", unamused: "😒", disappointed: "😞", pensive: "😔", worried: "😟", confused: "😕", slightly_frowning_face: "🙁", frowning_face: "☹️", persevere: "😣", confounded: "😖", tired_face: "😫", weary: "😩", triumph: "😤", angry: "😠", rage: "😡", pout: "😡", no_mouth: "😶", neutral_face: "😐", expressionless: "😑", hushed: "😯", frowning: "😦", anguished: "😧", open_mouth: "😮", astonished: "😲", dizzy_face: "😵", flushed: "😳", scream: "😱", fearful: "😨", cold_sweat: "😰", cry: "😢", disappointed_relieved: "😥", drooling_face: "🤤", sob: "😭", sweat: "😓", sleepy: "😪", sleeping: "😴", roll_eyes: "🙄", thinking: "🤔", lying_face: "🤥", grimacing: "😬", zipper_mouth_face: "🤐", nauseated_face: "🤢", sneezing_face: "🤧", mask: "😷", face_with_thermometer: "🤒", face_with_head_bandage: "🤕", smiling_imp: "😈", imp: "👿", japanese_ogre: "👹", japanese_goblin: "👺", hankey: "💩", poop: "💩", shit: "💩", ghost: "👻", skull: "💀", skull_and_crossbones: "☠️", alien: "👽", space_invader: "👾", robot: "🤖", jack_o_lantern: "🎃", smiley_cat: "😺", smile_cat: "😸", joy_cat: "😹", heart_eyes_cat: "😻", smirk_cat: "😼", kissing_cat: "😽", scream_cat: "🙀", crying_cat_face: "😿", pouting_cat: "😾", open_hands: "👐", raised_hands: "🙌", clap: "👏", pray: "🙏", handshake: "🤝", "+1": "👍", thumbsup: "👍", "-1": "👎", thumbsdown: "👎", fist_oncoming: "👊", facepunch: "👊", punch: "👊", fist_raised: "✊", fist: "✊", fist_left: "🤛", fist_right: "🤜", crossed_fingers: "🤞", v: "✌️", metal: "🤘", ok_hand: "👌", point_left: "👈", point_right: "👉", point_up_2: "👆", point_down: "👇", point_up: "☝️", hand: "✋", raised_hand: "✋", raised_back_of_hand: "🤚", raised_hand_with_fingers_splayed: "🖐", vulcan_salute: "🖖", wave: "👋", call_me_hand: "🤙", muscle: "💪", middle_finger: "🖕", fu: "🖕", writing_hand: "✍️", selfie: "🤳", nail_care: "💅", ring: "💍", lipstick: "💄", kiss: "💋", lips: "👄", tongue: "👅", ear: "👂", nose: "👃", footprints: "👣", eye: "👁", eyes: "👀", speaking_head: "🗣", bust_in_silhouette: "👤", busts_in_silhouette: "👥", baby: "👶", boy: "👦", girl: "👧", man: "👨", woman: "👩", blonde_woman: "👱‍♀", blonde_man: "👱", person_with_blond_hair: "👱", older_man: "👴", older_woman: "👵", man_with_gua_pi_mao: "👲", woman_with_turban: "👳‍♀", man_with_turban: "👳", policewoman: "👮‍♀", policeman: "👮", cop: "👮", construction_worker_woman: "👷‍♀", construction_worker_man: "👷", construction_worker: "👷", guardswoman: "💂‍♀", guardsman: "💂", female_detective: "🕵️‍♀️", male_detective: "🕵", detective: "🕵", woman_health_worker: "👩‍⚕", man_health_worker: "👨‍⚕", woman_farmer: "👩‍🌾", man_farmer: "👨‍🌾", woman_cook: "👩‍🍳", man_cook: "👨‍🍳", woman_student: "👩‍🎓", man_student: "👨‍🎓", woman_singer: "👩‍🎤", man_singer: "👨‍🎤", woman_teacher: "👩‍🏫", man_teacher: "👨‍🏫", woman_factory_worker: "👩‍🏭", man_factory_worker: "👨‍🏭", woman_technologist: "👩‍💻", man_technologist: "👨‍💻", woman_office_worker: "👩‍💼", man_office_worker: "👨‍💼", woman_mechanic: "👩‍🔧", man_mechanic: "👨‍🔧", woman_scientist: "👩‍🔬", man_scientist: "👨‍🔬", woman_artist: "👩‍🎨", man_artist: "👨‍🎨", woman_firefighter: "👩‍🚒", man_firefighter: "👨‍🚒", woman_pilot: "👩‍✈", man_pilot: "👨‍✈", woman_astronaut: "👩‍🚀", man_astronaut: "👨‍🚀", woman_judge: "👩‍⚖", man_judge: "👨‍⚖", mrs_claus: "🤶", santa: "🎅", princess: "👸", prince: "🤴", bride_with_veil: "👰", man_in_tuxedo: "🤵", angel: "👼", pregnant_woman: "🤰", bowing_woman: "🙇‍♀", bowing_man: "🙇", bow: "🙇", tipping_hand_woman: "💁", information_desk_person: "💁", sassy_woman: "💁", tipping_hand_man: "💁‍♂", sassy_man: "💁‍♂", no_good_woman: "🙅", no_good: "🙅", ng_woman: "🙅", no_good_man: "🙅‍♂", ng_man: "🙅‍♂", ok_woman: "🙆", ok_man: "🙆‍♂", raising_hand_woman: "🙋", raising_hand: "🙋", raising_hand_man: "🙋‍♂", woman_facepalming: "🤦‍♀", man_facepalming: "🤦‍♂", woman_shrugging: "🤷‍♀", man_shrugging: "🤷‍♂", pouting_woman: "🙎", person_with_pouting_face: "🙎", pouting_man: "🙎‍♂", frowning_woman: "🙍", person_frowning: "🙍", frowning_man: "🙍‍♂", haircut_woman: "💇", haircut: "💇", haircut_man: "💇‍♂", massage_woman: "💆", massage: "💆", massage_man: "💆‍♂", business_suit_levitating: "🕴", dancer: "💃", man_dancing: "🕺", dancing_women: "👯", dancers: "👯", dancing_men: "👯‍♂", walking_woman: "🚶‍♀", walking_man: "🚶", walking: "🚶", running_woman: "🏃‍♀", running_man: "🏃", runner: "🏃", running: "🏃", couple: "👫", two_women_holding_hands: "👭", two_men_holding_hands: "👬", couple_with_heart_woman_man: "💑", couple_with_heart: "💑", couple_with_heart_woman_woman: "👩‍❤️‍👩", couple_with_heart_man_man: "👨‍❤️‍👨", couplekiss_man_woman: "💏", couplekiss_woman_woman: "👩‍❤️‍💋‍👩", couplekiss_man_man: "👨‍❤️‍💋‍👨", family_man_woman_boy: "👪", family: "👪", family_man_woman_girl: "👨‍👩‍👧", family_man_woman_girl_boy: "👨‍👩‍👧‍👦", family_man_woman_boy_boy: "👨‍👩‍👦‍👦", family_man_woman_girl_girl: "👨‍👩‍👧‍👧", family_woman_woman_boy: "👩‍👩‍👦", family_woman_woman_girl: "👩‍👩‍👧", family_woman_woman_girl_boy: "👩‍👩‍👧‍👦", family_woman_woman_boy_boy: "👩‍👩‍👦‍👦", family_woman_woman_girl_girl: "👩‍👩‍👧‍👧", family_man_man_boy: "👨‍👨‍👦", family_man_man_girl: "👨‍👨‍👧", family_man_man_girl_boy: "👨‍👨‍👧‍👦", family_man_man_boy_boy: "👨‍👨‍👦‍👦", family_man_man_girl_girl: "👨‍👨‍👧‍👧", family_woman_boy: "👩‍👦", family_woman_girl: "👩‍👧", family_woman_girl_boy: "👩‍👧‍👦", family_woman_boy_boy: "👩‍👦‍👦", family_woman_girl_girl: "👩‍👧‍👧", family_man_boy: "👨‍👦", family_man_girl: "👨‍👧", family_man_girl_boy: "👨‍👧‍👦", family_man_boy_boy: "👨‍👦‍👦", family_man_girl_girl: "👨‍👧‍👧", womans_clothes: "👚", shirt: "👕", tshirt: "👕", jeans: "👖", necktie: "👔", dress: "👗", bikini: "👙", kimono: "👘", high_heel: "👠", sandal: "👡", boot: "👢", mans_shoe: "👞", shoe: "👞", athletic_shoe: "👟", womans_hat: "👒", tophat: "🎩", mortar_board: "🎓", crown: "👑", rescue_worker_helmet: "⛑", school_satchel: "🎒", pouch: "👝", purse: "👛", handbag: "👜", briefcase: "💼", eyeglasses: "👓", dark_sunglasses: "🕶", closed_umbrella: "🌂", open_umbrella: "☂️", dog: "🐶", cat: "🐱", mouse: "🐭", hamster: "🐹", rabbit: "🐰", fox_face: "🦊", bear: "🐻", panda_face: "🐼", koala: "🐨", tiger: "🐯", lion: "🦁", cow: "🐮", pig: "🐷", pig_nose: "🐽", frog: "🐸", monkey_face: "🐵", see_no_evil: "🙈", hear_no_evil: "🙉", speak_no_evil: "🙊", monkey: "🐒", chicken: "🐔", penguin: "🐧", bird: "🐦", baby_chick: "🐤", hatching_chick: "🐣", hatched_chick: "🐥", duck: "🦆", eagle: "🦅", owl: "🦉", bat: "🦇", wolf: "🐺", boar: "🐗", horse: "🐴", unicorn: "🦄", bee: "🐝", honeybee: "🐝", bug: "🐛", butterfly: "🦋", snail: "🐌", shell: "🐚", beetle: "🐞", ant: "🐜", spider: "🕷", spider_web: "🕸", turtle: "🐢", snake: "🐍", lizard: "🦎", scorpion: "🦂", crab: "🦀", squid: "🦑", octopus: "🐙", shrimp: "🦐", tropical_fish: "🐠", fish: "🐟", blowfish: "🐡", dolphin: "🐬", flipper: "🐬", shark: "🦈", whale: "🐳", whale2: "🐋", crocodile: "🐊", leopard: "🐆", tiger2: "🐅", water_buffalo: "🐃", ox: "🐂", cow2: "🐄", deer: "🦌", dromedary_camel: "🐪", camel: "🐫", elephant: "🐘", rhinoceros: "🦏", gorilla: "🦍", racehorse: "🐎", pig2: "🐖", goat: "🐐", ram: "🐏", sheep: "🐑", dog2: "🐕", poodle: "🐩", cat2: "🐈", rooster: "🐓", turkey: "🦃", dove: "🕊", rabbit2: "🐇", mouse2: "🐁", rat: "🐀", chipmunk: "🐿", feet: "🐾", paw_prints: "🐾", dragon: "🐉", dragon_face: "🐲", cactus: "🌵", christmas_tree: "🎄", evergreen_tree: "🌲", deciduous_tree: "🌳", palm_tree: "🌴", seedling: "🌱", herb: "🌿", shamrock: "☘️", four_leaf_clover: "🍀", bamboo: "🎍", tanabata_tree: "🎋", leaves: "🍃", fallen_leaf: "🍂", maple_leaf: "🍁", mushroom: "🍄", ear_of_rice: "🌾", bouquet: "💐", tulip: "🌷", rose: "🌹", wilted_flower: "🥀", sunflower: "🌻", blossom: "🌼", cherry_blossom: "🌸", hibiscus: "🌺", earth_americas: "🌎", earth_africa: "🌍", earth_asia: "🌏", full_moon: "🌕", waning_gibbous_moon: "🌖", last_quarter_moon: "🌗", waning_crescent_moon: "🌘", new_moon: "🌑", waxing_crescent_moon: "🌒", first_quarter_moon: "🌓", moon: "🌔", waxing_gibbous_moon: "🌔", new_moon_with_face: "🌚", full_moon_with_face: "🌝", sun_with_face: "🌞", first_quarter_moon_with_face: "🌛", last_quarter_moon_with_face: "🌜", crescent_moon: "🌙", dizzy: "💫", star: "⭐️", star2: "🌟", sparkles: "✨", zap: "⚡️", fire: "🔥", boom: "💥", collision: "💥", comet: "☄", sunny: "☀️", sun_behind_small_cloud: "🌤", partly_sunny: "⛅️", sun_behind_large_cloud: "🌥", sun_behind_rain_cloud: "🌦", rainbow: "🌈", cloud: "☁️", cloud_with_rain: "🌧", cloud_with_lightning_and_rain: "⛈", cloud_with_lightning: "🌩", cloud_with_snow: "🌨", snowman_with_snow: "☃️", snowman: "⛄️", snowflake: "❄️", wind_face: "🌬", dash: "💨", tornado: "🌪", fog: "🌫", ocean: "🌊", droplet: "💧", sweat_drops: "💦", umbrella: "☔️", green_apple: "🍏", apple: "🍎", pear: "🍐", tangerine: "🍊", orange: "🍊", mandarin: "🍊", lemon: "🍋", banana: "🍌", watermelon: "🍉", grapes: "🍇", strawberry: "🍓", melon: "🍈", cherries: "🍒", peach: "🍑", pineapple: "🍍", kiwi_fruit: "🥝", avocado: "🥑", tomato: "🍅", eggplant: "🍆", cucumber: "🥒", carrot: "🥕", corn: "🌽", hot_pepper: "🌶", potato: "🥔", sweet_potato: "🍠", chestnut: "🌰", peanuts: "🥜", honey_pot: "🍯", croissant: "🥐", bread: "🍞", baguette_bread: "🥖", cheese: "🧀", egg: "🥚", fried_egg: "🍳", bacon: "🥓", pancakes: "🥞", fried_shrimp: "🍤", poultry_leg: "🍗", meat_on_bone: "🍖", pizza: "🍕", hotdog: "🌭", hamburger: "🍔", fries: "🍟", stuffed_flatbread: "🥙", taco: "🌮", burrito: "🌯", green_salad: "🥗", shallow_pan_of_food: "🥘", spaghetti: "🍝", ramen: "🍜", stew: "🍲", fish_cake: "🍥", sushi: "🍣", bento: "🍱", curry: "🍛", rice: "🍚", rice_ball: "🍙", rice_cracker: "🍘", oden: "🍢", dango: "🍡", shaved_ice: "🍧", ice_cream: "🍨", icecream: "🍦", cake: "🍰", birthday: "🎂", custard: "🍮", lollipop: "🍭", candy: "🍬", chocolate_bar: "🍫", popcorn: "🍿", doughnut: "🍩", cookie: "🍪", milk_glass: "🥛", baby_bottle: "🍼", coffee: "☕️", tea: "🍵", sake: "🍶", beer: "🍺", beers: "🍻", clinking_glasses: "🥂", wine_glass: "🍷", tumbler_glass: "🥃", cocktail: "🍸", tropical_drink: "🍹", champagne: "🍾", spoon: "🥄", fork_and_knife: "🍴", plate_with_cutlery: "🍽", soccer: "⚽️", basketball: "🏀", football: "🏈", baseball: "⚾️", tennis: "🎾", volleyball: "🏐", rugby_football: "🏉", "8ball": "🎱", ping_pong: "🏓", badminton: "🏸", goal_net: "🥅", ice_hockey: "🏒", field_hockey: "🏑", cricket: "🏏", golf: "⛳️", bow_and_arrow: "🏹", fishing_pole_and_fish: "🎣", boxing_glove: "🥊", martial_arts_uniform: "🥋", ice_skate: "⛸", ski: "🎿", skier: "⛷", snowboarder: "🏂", weight_lifting_woman: "🏋️‍♀️", weight_lifting_man: "🏋", person_fencing: "🤺", women_wrestling: "🤼‍♀", men_wrestling: "🤼‍♂", woman_cartwheeling: "🤸‍♀", man_cartwheeling: "🤸‍♂", basketball_woman: "⛹️‍♀️", basketball_man: "⛹", woman_playing_handball: "🤾‍♀", man_playing_handball: "🤾‍♂", golfing_woman: "🏌️‍♀️", golfing_man: "🏌", surfing_woman: "🏄‍♀", surfing_man: "🏄", surfer: "🏄", swimming_woman: "🏊‍♀", swimming_man: "🏊", swimmer: "🏊", woman_playing_water_polo: "🤽‍♀", man_playing_water_polo: "🤽‍♂", rowing_woman: "🚣‍♀", rowing_man: "🚣", rowboat: "🚣", horse_racing: "🏇", biking_woman: "🚴‍♀", biking_man: "🚴", bicyclist: "🚴", mountain_biking_woman: "🚵‍♀", mountain_biking_man: "🚵", mountain_bicyclist: "🚵", running_shirt_with_sash: "🎽", medal_sports: "🏅", medal_military: "🎖", "1st_place_medal": "🥇", "2nd_place_medal": "🥈", "3rd_place_medal": "🥉", trophy: "🏆", rosette: "🏵", reminder_ribbon: "🎗", ticket: "🎫", tickets: "🎟", circus_tent: "🎪", woman_juggling: "🤹‍♀", man_juggling: "🤹‍♂", performing_arts: "🎭", art: "🎨", clapper: "🎬", microphone: "🎤", headphones: "🎧", musical_score: "🎼", musical_keyboard: "🎹", drum: "🥁", saxophone: "🎷", trumpet: "🎺", guitar: "🎸", violin: "🎻", game_die: "🎲", dart: "🎯", bowling: "🎳", video_game: "🎮", slot_machine: "🎰", car: "🚗", red_car: "🚗", taxi: "🚕", blue_car: "🚙", bus: "🚌", trolleybus: "🚎", racing_car: "🏎", police_car: "🚓", ambulance: "🚑", fire_engine: "🚒", minibus: "🚐", truck: "🚚", articulated_lorry: "🚛", tractor: "🚜", kick_scooter: "🛴", bike: "🚲", motor_scooter: "🛵", motorcycle: "🏍", rotating_light: "🚨", oncoming_police_car: "🚔", oncoming_bus: "🚍", oncoming_automobile: "🚘", oncoming_taxi: "🚖", aerial_tramway: "🚡", mountain_cableway: "🚠", suspension_railway: "🚟", railway_car: "🚃", train: "🚋", mountain_railway: "🚞", monorail: "🚝", bullettrain_side: "🚄", bullettrain_front: "🚅", light_rail: "🚈", steam_locomotive: "🚂", train2: "🚆", metro: "🚇", tram: "🚊", station: "🚉", helicopter: "🚁", small_airplane: "🛩", airplane: "✈️", flight_departure: "🛫", flight_arrival: "🛬", rocket: "🚀", artificial_satellite: "🛰", seat: "💺", canoe: "🛶", boat: "⛵️", sailboat: "⛵️", motor_boat: "🛥", speedboat: "🚤", passenger_ship: "🛳", ferry: "⛴", ship: "🚢", anchor: "⚓️", construction: "🚧", fuelpump: "⛽️", busstop: "🚏", vertical_traffic_light: "🚦", traffic_light: "🚥", world_map: "🗺", moyai: "🗿", statue_of_liberty: "🗽", fountain: "⛲️", tokyo_tower: "🗼", european_castle: "🏰", japanese_castle: "🏯", stadium: "🏟", ferris_wheel: "🎡", roller_coaster: "🎢", carousel_horse: "🎠", parasol_on_ground: "⛱", beach_umbrella: "🏖", desert_island: "🏝", mountain: "⛰", mountain_snow: "🏔", mount_fuji: "🗻", volcano: "🌋", desert: "🏜", camping: "🏕", tent: "⛺️", railway_track: "🛤", motorway: "🛣", building_construction: "🏗", factory: "🏭", house: "🏠", house_with_garden: "🏡", houses: "🏘", derelict_house: "🏚", office: "🏢", department_store: "🏬", post_office: "🏣", european_post_office: "🏤", hospital: "🏥", bank: "🏦", hotel: "🏨", convenience_store: "🏪", school: "🏫", love_hotel: "🏩", wedding: "💒", classical_building: "🏛", church: "⛪️", mosque: "🕌", synagogue: "🕍", kaaba: "🕋", shinto_shrine: "⛩", japan: "🗾", rice_scene: "🎑", national_park: "🏞", sunrise: "🌅", sunrise_over_mountains: "🌄", stars: "🌠", sparkler: "🎇", fireworks: "🎆", city_sunrise: "🌇", city_sunset: "🌆", cityscape: "🏙", night_with_stars: "🌃", milky_way: "🌌", bridge_at_night: "🌉", foggy: "🌁", watch: "⌚️", iphone: "📱", calling: "📲", computer: "💻", keyboard: "⌨️", desktop_computer: "🖥", printer: "🖨", computer_mouse: "🖱", trackball: "🖲", joystick: "🕹", clamp: "🗜", minidisc: "💽", floppy_disk: "💾", cd: "💿", dvd: "📀", vhs: "📼", camera: "📷", camera_flash: "📸", video_camera: "📹", movie_camera: "🎥", film_projector: "📽", film_strip: "🎞", telephone_receiver: "📞", phone: "☎️", telephone: "☎️", pager: "📟", fax: "📠", tv: "📺", radio: "📻", studio_microphone: "🎙", level_slider: "🎚", control_knobs: "🎛", stopwatch: "⏱", timer_clock: "⏲", alarm_clock: "⏰", mantelpiece_clock: "🕰", hourglass: "⌛️", hourglass_flowing_sand: "⏳", satellite: "📡", battery: "🔋", electric_plug: "🔌", bulb: "💡", flashlight: "🔦", candle: "🕯", wastebasket: "🗑", oil_drum: "🛢", money_with_wings: "💸", dollar: "💵", yen: "💴", euro: "💶", pound: "💷", moneybag: "💰", credit_card: "💳", gem: "💎", balance_scale: "⚖️", wrench: "🔧", hammer: "🔨", hammer_and_pick: "⚒", hammer_and_wrench: "🛠", pick: "⛏", nut_and_bolt: "🔩", gear: "⚙️", chains: "⛓", gun: "🔫", bomb: "💣", hocho: "🔪", knife: "🔪", dagger: "🗡", crossed_swords: "⚔️", shield: "🛡", smoking: "🚬", coffin: "⚰️", funeral_urn: "⚱️", amphora: "🏺", crystal_ball: "🔮", prayer_beads: "📿", barber: "💈", alembic: "⚗️", telescope: "🔭", microscope: "🔬", hole: "🕳", pill: "💊", syringe: "💉", thermometer: "🌡", toilet: "🚽", potable_water: "🚰", shower: "🚿", bathtub: "🛁", bath: "🛀", bellhop_bell: "🛎", key: "🔑", old_key: "🗝", door: "🚪", couch_and_lamp: "🛋", bed: "🛏", sleeping_bed: "🛌", framed_picture: "🖼", shopping: "🛍", shopping_cart: "🛒", gift: "🎁", balloon: "🎈", flags: "🎏", ribbon: "🎀", confetti_ball: "🎊", tada: "🎉", dolls: "🎎", izakaya_lantern: "🏮", lantern: "🏮", wind_chime: "🎐", email: "✉️", envelope: "✉️", envelope_with_arrow: "📩", incoming_envelope: "📨", "e-mail": "📧", love_letter: "💌", inbox_tray: "📥", outbox_tray: "📤", package: "📦", label: "🏷", mailbox_closed: "📪", mailbox: "📫", mailbox_with_mail: "📬", mailbox_with_no_mail: "📭", postbox: "📮", postal_horn: "📯", scroll: "📜", page_with_curl: "📃", page_facing_up: "📄", bookmark_tabs: "📑", bar_chart: "📊", chart_with_upwards_trend: "📈", chart_with_downwards_trend: "📉", spiral_notepad: "🗒", spiral_calendar: "🗓", calendar: "📆", date: "📅", card_index: "📇", card_file_box: "🗃", ballot_box: "🗳", file_cabinet: "🗄", clipboard: "📋", file_folder: "📁", open_file_folder: "📂", card_index_dividers: "🗂", newspaper_roll: "🗞", newspaper: "📰", notebook: "📓", notebook_with_decorative_cover: "📔", ledger: "📒", closed_book: "📕", green_book: "📗", blue_book: "📘", orange_book: "📙", books: "📚", book: "📖", open_book: "📖", bookmark: "🔖", link: "🔗", paperclip: "📎", paperclips: "🖇", triangular_ruler: "📐", straight_ruler: "📏", pushpin: "📌", round_pushpin: "📍", scissors: "✂️", pen: "🖊", fountain_pen: "🖋", black_nib: "✒️", paintbrush: "🖌", crayon: "🖍", memo: "📝", pencil: "📝", pencil2: "✏️", mag: "🔍", mag_right: "🔎", lock_with_ink_pen: "🔏", closed_lock_with_key: "🔐", lock: "🔒", unlock: "🔓", heart: "❤️", yellow_heart: "💛", green_heart: "💚", blue_heart: "💙", purple_heart: "💜", black_heart: "🖤", broken_heart: "💔", heavy_heart_exclamation: "❣️", two_hearts: "💕", revolving_hearts: "💞", heartbeat: "💓", heartpulse: "💗", sparkling_heart: "💖", cupid: "💘", gift_heart: "💝", heart_decoration: "💟", peace_symbol: "☮️", latin_cross: "✝️", star_and_crescent: "☪️", om: "🕉", wheel_of_dharma: "☸️", star_of_david: "✡️", six_pointed_star: "🔯", menorah: "🕎", yin_yang: "☯️", orthodox_cross: "☦️", place_of_worship: "🛐", ophiuchus: "⛎", aries: "♈️", taurus: "♉️", gemini: "♊️", cancer: "♋️", leo: "♌️", virgo: "♍️", libra: "♎️", scorpius: "♏️", sagittarius: "♐️", capricorn: "♑️", aquarius: "♒️", pisces: "♓️", id: "🆔", atom_symbol: "⚛️", accept: "🉑", radioactive: "☢️", biohazard: "☣️", mobile_phone_off: "📴", vibration_mode: "📳", eight_pointed_black_star: "✴️", vs: "🆚", white_flower: "💮", ideograph_advantage: "🉐", secret: "㊙️", congratulations: "㊗️", u6e80: "🈵", a: "🅰️", b: "🅱️", ab: "🆎", cl: "🆑", o2: "🅾️", sos: "🆘", x: "❌", o: "⭕️", stop_sign: "🛑", no_entry: "⛔️", name_badge: "📛", no_entry_sign: "🚫", anger: "💢", hotsprings: "♨️", no_pedestrians: "🚷", do_not_litter: "🚯", no_bicycles: "🚳", "non-potable_water": "🚱", underage: "🔞", no_mobile_phones: "📵", no_smoking: "🚭", exclamation: "❗️", heavy_exclamation_mark: "❗️", grey_exclamation: "❕", question: "❓", grey_question: "❔", bangbang: "‼️", interrobang: "⁉️", low_brightness: "🔅", high_brightness: "🔆", part_alternation_mark: "〽️", warning: "⚠️", children_crossing: "🚸", trident: "🔱", fleur_de_lis: "⚜️", beginner: "🔰", recycle: "♻️", white_check_mark: "✅", chart: "💹", sparkle: "❇️", eight_spoked_asterisk: "✳️", negative_squared_cross_mark: "❎", globe_with_meridians: "🌐", diamond_shape_with_a_dot_inside: "💠", m: "Ⓜ️", cyclone: "🌀", zzz: "💤", atm: "🏧", wc: "🚾", wheelchair: "♿️", parking: "🅿️", sa: "🈂️", passport_control: "🛂", customs: "🛃", baggage_claim: "🛄", left_luggage: "🛅", mens: "🚹", womens: "🚺", baby_symbol: "🚼", restroom: "🚻", put_litter_in_its_place: "🚮", cinema: "🎦", signal_strength: "📶", koko: "🈁", symbols: "🔣", information_source: "ℹ️", abc: "🔤", abcd: "🔡", capital_abcd: "🔠", ng: "🆖", ok: "🆗", up: "🆙", cool: "🆒", new: "🆕", free: "🆓", zero: "0️⃣", one: "1️⃣", two: "2️⃣", three: "3️⃣", four: "4️⃣", five: "5️⃣", six: "6️⃣", seven: "7️⃣", eight: "8️⃣", nine: "9️⃣", keycap_ten: "🔟", hash: "#️⃣", asterisk: "*️⃣", arrow_forward: "▶️", pause_button: "⏸", play_or_pause_button: "⏯", stop_button: "⏹", record_button: "⏺", next_track_button: "⏭", previous_track_button: "⏮", fast_forward: "⏩", rewind: "⏪", arrow_double_up: "⏫", arrow_double_down: "⏬", arrow_backward: "◀️", arrow_up_small: "🔼", arrow_down_small: "🔽", arrow_right: "➡️", arrow_left: "⬅️", arrow_up: "⬆️", arrow_down: "⬇️", arrow_upper_right: "↗️", arrow_lower_right: "↘️", arrow_lower_left: "↙️", arrow_upper_left: "↖️", arrow_up_down: "↕️", left_right_arrow: "↔️", arrow_right_hook: "↪️", leftwards_arrow_with_hook: "↩️", arrow_heading_up: "⤴️", arrow_heading_down: "⤵️", twisted_rightwards_arrows: "🔀", repeat: "🔁", repeat_one: "🔂", arrows_counterclockwise: "🔄", arrows_clockwise: "🔃", musical_note: "🎵", notes: "🎶", heavy_plus_sign: "➕", heavy_minus_sign: "➖", heavy_division_sign: "➗", heavy_multiplication_x: "✖️", heavy_dollar_sign: "💲", currency_exchange: "💱", tm: "™️", copyright: "©️", registered: "®️", wavy_dash: "〰️", curly_loop: "➰", loop: "➿", end: "🔚", back: "🔙", on: "🔛", top: "🔝", soon: "🔜", heavy_check_mark: "✔️", ballot_box_with_check: "☑️", radio_button: "🔘", white_circle: "⚪️", black_circle: "⚫️", red_circle: "🔴", large_blue_circle: "🔵", small_red_triangle: "🔺", small_red_triangle_down: "🔻", small_orange_diamond: "🔸", small_blue_diamond: "🔹", large_orange_diamond: "🔶", large_blue_diamond: "🔷", white_square_button: "🔳", black_square_button: "🔲", black_small_square: "▪️", white_small_square: "▫️", black_medium_small_square: "◾️", white_medium_small_square: "◽️", black_medium_square: "◼️", white_medium_square: "◻️", black_large_square: "⬛️", white_large_square: "⬜️", speaker: "🔈", mute: "🔇", sound: "🔉", loud_sound: "🔊", bell: "🔔", no_bell: "🔕", mega: "📣", loudspeaker: "📢", eye_speech_bubble: "👁‍🗨", speech_balloon: "💬", thought_balloon: "💭", right_anger_bubble: "🗯", spades: "♠️", clubs: "♣️", hearts: "♥️", diamonds: "♦️", black_joker: "🃏", flower_playing_cards: "🎴", mahjong: "🀄️", clock1: "🕐", clock2: "🕑", clock3: "🕒", clock4: "🕓", clock5: "🕔", clock6: "🕕", clock7: "🕖", clock8: "🕗", clock9: "🕘", clock10: "🕙", clock11: "🕚", clock12: "🕛", clock130: "🕜", clock230: "🕝", clock330: "🕞", clock430: "🕟", clock530: "🕠", clock630: "🕡", clock730: "🕢", clock830: "🕣", clock930: "🕤", clock1030: "🕥", clock1130: "🕦", clock1230: "🕧", white_flag: "🏳️", black_flag: "🏴", checkered_flag: "🏁", triangular_flag_on_post: "🚩", rainbow_flag: "🏳️‍🌈", afghanistan: "🇦🇫", aland_islands: "🇦🇽", albania: "🇦🇱", algeria: "🇩🇿", american_samoa: "🇦🇸", andorra: "🇦🇩", angola: "🇦🇴", anguilla: "🇦🇮", antarctica: "🇦🇶", antigua_barbuda: "🇦🇬", argentina: "🇦🇷", armenia: "🇦🇲", aruba: "🇦🇼", australia: "🇦🇺", austria: "🇦🇹", azerbaijan: "🇦🇿", bahamas: "🇧🇸", bahrain: "🇧🇭", bangladesh: "🇧🇩", barbados: "🇧🇧", belarus: "🇧🇾", belgium: "🇧🇪", belize: "🇧🇿", benin: "🇧🇯", bermuda: "🇧🇲", bhutan: "🇧🇹", bolivia: "🇧🇴", caribbean_netherlands: "🇧🇶", bosnia_herzegovina: "🇧🇦", botswana: "🇧🇼", brazil: "🇧🇷", british_indian_ocean_territory: "🇮🇴", british_virgin_islands: "🇻🇬", brunei: "🇧🇳", bulgaria: "🇧🇬", burkina_faso: "🇧🇫", burundi: "🇧🇮", cape_verde: "🇨🇻", cambodia: "🇰🇭", cameroon: "🇨🇲", canada: "🇨🇦", canary_islands: "🇮🇨", cayman_islands: "🇰🇾", central_african_republic: "🇨🇫", chad: "🇹🇩", chile: "🇨🇱", cn: "🇨🇳", christmas_island: "🇨🇽", cocos_islands: "🇨🇨", colombia: "🇨🇴", comoros: "🇰🇲", congo_brazzaville: "🇨🇬", congo_kinshasa: "🇨🇩", cook_islands: "🇨🇰", costa_rica: "🇨🇷", cote_divoire: "🇨🇮", croatia: "🇭🇷", cuba: "🇨🇺", curacao: "🇨🇼", cyprus: "🇨🇾", czech_republic: "🇨🇿", denmark: "🇩🇰", djibouti: "🇩🇯", dominica: "🇩🇲", dominican_republic: "🇩🇴", ecuador: "🇪🇨", egypt: "🇪🇬", el_salvador: "🇸🇻", equatorial_guinea: "🇬🇶", eritrea: "🇪🇷", estonia: "🇪🇪", ethiopia: "🇪🇹", eu: "🇪🇺", european_union: "🇪🇺", falkland_islands: "🇫🇰", faroe_islands: "🇫🇴", fiji: "🇫🇯", finland: "🇫🇮", fr: "🇫🇷", french_guiana: "🇬🇫", french_polynesia: "🇵🇫", french_southern_territories: "🇹🇫", gabon: "🇬🇦", gambia: "🇬🇲", georgia: "🇬🇪", de: "🇩🇪", ghana: "🇬🇭", gibraltar: "🇬🇮", greece: "🇬🇷", greenland: "🇬🇱", grenada: "🇬🇩", guadeloupe: "🇬🇵", guam: "🇬🇺", guatemala: "🇬🇹", guernsey: "🇬🇬", guinea: "🇬🇳", guinea_bissau: "🇬🇼", guyana: "🇬🇾", haiti: "🇭🇹", honduras: "🇭🇳", hong_kong: "🇭🇰", hungary: "🇭🇺", iceland: "🇮🇸", india: "🇮🇳", indonesia: "🇮🇩", iran: "🇮🇷", iraq: "🇮🇶", ireland: "🇮🇪", isle_of_man: "🇮🇲", israel: "🇮🇱", it: "🇮🇹", jamaica: "🇯🇲", jp: "🇯🇵", crossed_flags: "🎌", jersey: "🇯🇪", jordan: "🇯🇴", kazakhstan: "🇰🇿", kenya: "🇰🇪", kiribati: "🇰🇮", kosovo: "🇽🇰", kuwait: "🇰🇼", kyrgyzstan: "🇰🇬", laos: "🇱🇦", latvia: "🇱🇻", lebanon: "🇱🇧", lesotho: "🇱🇸", liberia: "🇱🇷", libya: "🇱🇾", liechtenstein: "🇱🇮", lithuania: "🇱🇹", luxembourg: "🇱🇺", macau: "🇲🇴", macedonia: "🇲🇰", madagascar: "🇲🇬", malawi: "🇲🇼", malaysia: "🇲🇾", maldives: "🇲🇻", mali: "🇲🇱", malta: "🇲🇹", marshall_islands: "🇲🇭", martinique: "🇲🇶", mauritania: "🇲🇷", mauritius: "🇲🇺", mayotte: "🇾🇹", mexico: "🇲🇽", micronesia: "🇫🇲", moldova: "🇲🇩", monaco: "🇲🇨", mongolia: "🇲🇳", montenegro: "🇲🇪", montserrat: "🇲🇸", morocco: "🇲🇦", mozambique: "🇲🇿", myanmar: "🇲🇲", namibia: "🇳🇦", nauru: "🇳🇷", nepal: "🇳🇵", netherlands: "🇳🇱", new_caledonia: "🇳🇨", new_zealand: "🇳🇿", nicaragua: "🇳🇮", niger: "🇳🇪", nigeria: "🇳🇬", niue: "🇳🇺", norfolk_island: "🇳🇫", northern_mariana_islands: "🇲🇵", north_korea: "🇰🇵", norway: "🇳🇴", oman: "🇴🇲", pakistan: "🇵🇰", palau: "🇵🇼", palestinian_territories: "🇵🇸", panama: "🇵🇦", papua_new_guinea: "🇵🇬", paraguay: "🇵🇾", peru: "🇵🇪", philippines: "🇵🇭", pitcairn_islands: "🇵🇳", poland: "🇵🇱", portugal: "🇵🇹", puerto_rico: "🇵🇷", qatar: "🇶🇦", reunion: "🇷🇪", romania: "🇷🇴", ru: "🇷🇺", rwanda: "🇷🇼", st_barthelemy: "🇧🇱", st_helena: "🇸🇭", st_kitts_nevis: "🇰🇳", st_lucia: "🇱🇨", st_pierre_miquelon: "🇵🇲", st_vincent_grenadines: "🇻🇨", samoa: "🇼🇸", san_marino: "🇸🇲", sao_tome_principe: "🇸🇹", saudi_arabia: "🇸🇦", senegal: "🇸🇳", serbia: "🇷🇸", seychelles: "🇸🇨", sierra_leone: "🇸🇱", singapore: "🇸🇬", sint_maarten: "🇸🇽", slovakia: "🇸🇰", slovenia: "🇸🇮", solomon_islands: "🇸🇧", somalia: "🇸🇴", south_africa: "🇿🇦", south_georgia_south_sandwich_islands: "🇬🇸", kr: "🇰🇷", south_sudan: "🇸🇸", es: "🇪🇸", sri_lanka: "🇱🇰", sudan: "🇸🇩", suriname: "🇸🇷", swaziland: "🇸🇿", sweden: "🇸🇪", switzerland: "🇨🇭", syria: "🇸🇾", taiwan: "🇹🇼", tajikistan: "🇹🇯", tanzania: "🇹🇿", thailand: "🇹🇭", timor_leste: "🇹🇱", togo: "🇹🇬", tokelau: "🇹🇰", tonga: "🇹🇴", trinidad_tobago: "🇹🇹", tunisia: "🇹🇳", tr: "🇹🇷", turkmenistan: "🇹🇲", turks_caicos_islands: "🇹🇨", tuvalu: "🇹🇻", uganda: "🇺🇬", ukraine: "🇺🇦", united_arab_emirates: "🇦🇪", gb: "🇬🇧", uk: "🇬🇧", us: "🇺🇸", us_virgin_islands: "🇻🇮", uruguay: "🇺🇾", uzbekistan: "🇺🇿", vanuatu: "🇻🇺", vatican_city: "🇻🇦", venezuela: "🇻🇪", vietnam: "🇻🇳", wallis_futuna: "🇼🇫", western_sahara: "🇪🇭", yemen: "🇾🇪", zambia: "🇿🇲", zimbabwe: "🇿🇼" };}, function (e, t, n) {"use strict";e.exports = { angry: [">:(", ">:-("], blush: [':")', ':-")'], broken_heart: ["</3", "<\\3"], confused: [":/", ":-/"], cry: [":'(", ":'-(", ":,(", ":,-("], frowning: [":(", ":-("], heart: ["<3"], imp: ["]:(", "]:-("], innocent: ["o:)", "O:)", "o:-)", "O:-)", "0:)", "0:-)"], joy: [":')", ":'-)", ":,)", ":,-)", ":'D", ":'-D", ":,D", ":,-D"], kissing: [":*", ":-*"], laughing: ["x-)", "X-)"], neutral_face: [":|", ":-|"], open_mouth: [":o", ":-o", ":O", ":-O"], rage: [":@", ":-@"], smile: [":D", ":-D"], smiley: [":)", ":-)"], smiling_imp: ["]:)", "]:-)"], sob: [":,'(", ":,'-(", ";(", ";-("], stuck_out_tongue: [":P", ":-P"], sunglasses: ["8-)", "B-)"], sweat: [",:(", ",:-("], sweat_smile: [",:)", ",:-)"], unamused: [":s", ":-S", ":z", ":-Z", ":$", ":-$"], wink: [";)", ";-)"] };}, function (e, t, n) {"use strict";function r(e) {return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");}e.exports = function (e) {var t,n = e.defs;e.enabled.length && (n = Object.keys(n).reduce(function (t, r) {return e.enabled.indexOf(r) >= 0 && (t[r] = n[r]), t;}, {})), t = Object.keys(e.shortcuts).reduce(function (t, r) {return n[r] ? Array.isArray(e.shortcuts[r]) ? (e.shortcuts[r].forEach(function (e) {t[e] = r;}), t) : (t[e.shortcuts[r]] = r, t) : t;}, {});var o = Object.keys(n).map(function (e) {return ":" + e + ":";}).concat(Object.keys(t)).sort().reverse().map(function (e) {return r(e);}).join("|"),i = RegExp(o),a = RegExp(o, "g");return { defs: n, shortcuts: t, scanRE: i, replaceRE: a };};}, function (e, t, n) {"use strict";e.exports = function (e, t) {return e[t].content;};}, function (e, t, n) {"use strict";e.exports = function (e, t, n, r, o) {function i(e, r, i) {var a,s = 0,c = [];return e.replace(o, function (r, o, u) {var p;if (n.hasOwnProperty(r)) {if (p = n[r], o > 0 && !l.test(u[o - 1])) return;if (o + r.length < u.length && !l.test(u[o + r.length])) return;} else p = r.slice(1, -1);o > s && (a = new i("text", "", 0), a.content = e.slice(s, o), c.push(a)), a = new i("emoji", "", 0), a.markup = p, a.content = t[p], c.push(a), s = o + r.length;}), s < e.length && (a = new i("text", "", 0), a.content = e.slice(s), c.push(a)), c;}var a = e.utils.arrayReplaceAt,s = e.utils.lib.ucmicro,l = new RegExp([s.Z.source, s.P.source, s.Cc.source].join("|"));return function (e) {var t,n,o,s,l,c = e.tokens,u = 0;for (n = 0, o = c.length; n < o; n++) {if ("inline" === c[n].type) for (s = c[n].children, t = s.length - 1; t >= 0; t--) {l = s[t], "link_open" !== l.type && "link_close" !== l.type || "auto" === l.info && (u -= l.nesting), "text" === l.type && 0 === u && r.test(l.content) && (c[n].children = s = a(s, t, i(l.content, l.level, e.Token)));}}};};}, function (e, t, n) {"use strict";function r(e, t, n, r) {var o = Number(e[t].meta.id + 1).toString(),i = "";return "string" == typeof r.docId && (i = "-" + r.docId + "-"), i + o;}function o(e, t) {var n = Number(e[t].meta.id + 1).toString();return e[t].meta.subId > 0 && (n += ":" + e[t].meta.subId), "[" + n + "]";}function i(e, t, n, r, o) {var i = o.rules.footnote_anchor_name(e, t, n, r, o),a = o.rules.footnote_caption(e, t, n, r, o),s = i;return e[t].meta.subId > 0 && (s += ":" + e[t].meta.subId), '<sup class="footnote-ref"><a href="#fn' + i + '" id="fnref' + s + '">' + a + "</a></sup>";}function a(e, t, n) {return (n.xhtmlOut ? '<hr class="footnotes-sep" />\n' : '<hr class="footnotes-sep">\n') + '<section class="footnotes">\n<ol class="footnotes-list">\n';}function s() {return "</ol>\n</section>\n";}function l(e, t, n, r, o) {var i = o.rules.footnote_anchor_name(e, t, n, r, o);return e[t].meta.subId > 0 && (i += ":" + e[t].meta.subId), '<li id="fn' + i + '" class="footnote-item">';}function c() {return "</li>\n";}function u(e, t, n, r, o) {var i = o.rules.footnote_anchor_name(e, t, n, r, o);return e[t].meta.subId > 0 && (i += ":" + e[t].meta.subId), ' <a href="#fnref' + i + '" class="footnote-backref">↩︎</a>';}e.exports = function (e) {function t(e, t, n, r) {var o,i,a,s,l,c,u,p,_,d,f,m = e.bMarks[t] + e.tShift[t],g = e.eMarks[t];if (m + 4 > g) return !1;if (91 !== e.src.charCodeAt(m)) return !1;if (94 !== e.src.charCodeAt(m + 1)) return !1;for (l = m + 2; l < g; l++) {if (32 === e.src.charCodeAt(l)) return !1;if (93 === e.src.charCodeAt(l)) break;}if (l === m + 2) return !1;if (l + 1 >= g || 58 !== e.src.charCodeAt(++l)) return !1;if (r) return !0;for (l++, e.env.footnotes || (e.env.footnotes = {}), e.env.footnotes.refs || (e.env.footnotes.refs = {}), c = e.src.slice(m + 2, l - 2), e.env.footnotes.refs[":" + c] = -1, u = new e.Token("footnote_reference_open", "", 1), u.meta = { label: c }, u.level = e.level++, e.tokens.push(u), o = e.bMarks[t], i = e.tShift[t], a = e.sCount[t], s = e.parentType, f = l, p = _ = e.sCount[t] + l - (e.bMarks[t] + e.tShift[t]); l < g && (d = e.src.charCodeAt(l), h(d));) {9 === d ? _ += 4 - _ % 4 : _++, l++;}return e.tShift[t] = l - f, e.sCount[t] = _ - p, e.bMarks[t] = f, e.blkIndent += 4, e.parentType = "footnote", e.sCount[t] < e.blkIndent && (e.sCount[t] += e.blkIndent), e.md.block.tokenize(e, t, n, !0), e.parentType = s, e.blkIndent -= 4, e.tShift[t] = i, e.sCount[t] = a, e.bMarks[t] = o, u = new e.Token("footnote_reference_close", "", -1), u.level = --e.level, e.tokens.push(u), !0;}function n(e, t) {var n,r,o,i,a,s = e.posMax,l = e.pos;return !(l + 2 >= s) && 94 === e.src.charCodeAt(l) && 91 === e.src.charCodeAt(l + 1) && (n = l + 2, !((r = d(e, l + 1)) < 0) && (t || (e.env.footnotes || (e.env.footnotes = {}), e.env.footnotes.list || (e.env.footnotes.list = []), o = e.env.footnotes.list.length, e.md.inline.parse(e.src.slice(n, r), e.md, e.env, a = []), i = e.push("footnote_ref", "", 0), i.meta = { id: o }, e.env.footnotes.list[o] = { tokens: a }), e.pos = r + 1, e.posMax = s, !0));}function p(e, t) {var n,r,o,i,a,s = e.posMax,l = e.pos;if (l + 3 > s) return !1;if (!e.env.footnotes || !e.env.footnotes.refs) return !1;if (91 !== e.src.charCodeAt(l)) return !1;if (94 !== e.src.charCodeAt(l + 1)) return !1;for (r = l + 2; r < s; r++) {if (32 === e.src.charCodeAt(r)) return !1;if (10 === e.src.charCodeAt(r)) return !1;if (93 === e.src.charCodeAt(r)) break;}return r !== l + 2 && !(r >= s) && (r++, n = e.src.slice(l + 2, r - 1), void 0 !== e.env.footnotes.refs[":" + n] && (t || (e.env.footnotes.list || (e.env.footnotes.list = []), e.env.footnotes.refs[":" + n] < 0 ? (o = e.env.footnotes.list.length, e.env.footnotes.list[o] = { label: n, count: 0 }, e.env.footnotes.refs[":" + n] = o) : o = e.env.footnotes.refs[":" + n], i = e.env.footnotes.list[o].count, e.env.footnotes.list[o].count++, a = e.push("footnote_ref", "", 0), a.meta = { id: o, subId: i, label: n }), e.pos = r, e.posMax = s, !0));}function _(e) {var t,n,r,o,i,a,s,l,c,u,p = !1,_ = {};if (e.env.footnotes && (e.tokens = e.tokens.filter(function (e) {return "footnote_reference_open" === e.type ? (p = !0, c = [], u = e.meta.label, !1) : "footnote_reference_close" === e.type ? (p = !1, _[":" + u] = c, !1) : (p && c.push(e), !p);}), e.env.footnotes.list)) {for (a = e.env.footnotes.list, s = new e.Token("footnote_block_open", "", 1), e.tokens.push(s), t = 0, n = a.length; t < n; t++) {for (s = new e.Token("footnote_open", "", 1), s.meta = { id: t, label: a[t].label }, e.tokens.push(s), a[t].tokens ? (l = [], s = new e.Token("paragraph_open", "p", 1), s.block = !0, l.push(s), s = new e.Token("inline", "", 0), s.children = a[t].tokens, s.content = "", l.push(s), s = new e.Token("paragraph_close", "p", -1), s.block = !0, l.push(s)) : a[t].label && (l = _[":" + a[t].label]), e.tokens = e.tokens.concat(l), i = "paragraph_close" === e.tokens[e.tokens.length - 1].type ? e.tokens.pop() : null, o = a[t].count > 0 ? a[t].count : 1, r = 0; r < o; r++) {s = new e.Token("footnote_anchor", "", 0), s.meta = { id: t, subId: r, label: a[t].label }, e.tokens.push(s);}i && e.tokens.push(i), s = new e.Token("footnote_close", "", -1), e.tokens.push(s);}s = new e.Token("footnote_block_close", "", -1), e.tokens.push(s);}}var d = e.helpers.parseLinkLabel,h = e.utils.isSpace;e.renderer.rules.footnote_ref = i, e.renderer.rules.footnote_block_open = a, e.renderer.rules.footnote_block_close = s, e.renderer.rules.footnote_open = l, e.renderer.rules.footnote_close = c, e.renderer.rules.footnote_anchor = u, e.renderer.rules.footnote_caption = o, e.renderer.rules.footnote_anchor_name = r, e.block.ruler.before("reference", "footnote_def", t, { alt: ["paragraph", "reference"] }), e.inline.ruler.after("image", "footnote_inline", n), e.inline.ruler.after("footnote_inline", "footnote_ref", p), e.core.ruler.after("inline", "footnote_tail", _);};}, function (e, t) {var n = function n(e, t) {t = t || {}, void 0 === t.highlighted && (t.highlighted = !0), void 0 === t.hljs && (t.hljs = "auto"), "function" != typeof t.langCheck && (t.langCheck = function () {}), e.options.highlight = function (n, r) {var o = t.hljs;if ("auto" === t.hljs && (o = window.hljs), t.highlighted && r && o) {if (o.getLanguage(r)) return '<pre><div class="hljs"><code class="' + e.options.langPrefix + r + '">' + o.highlight(r, n, !0).value + "</code></div></pre>";"function" == typeof t.langCheck && t.langCheck(r);}return '<pre><code class="' + e.options.langPrefix + r + '">' + e.utils.escapeHtml(n) + "</code></pre>";};};e.exports = n;}, function (e, t) {e.exports = function (e, t) {e.image_add = function (t, n) {e.__image instanceof Object || (e.__image = {}), e.__image[t] = n;}, e.image_del = function (t) {e.__image instanceof Object || (e.__image = {}), delete e.__image[t];};var n = e.renderer.rules.image;e.renderer.rules.image = function (t, r, o, i, a) {var s = t[r].attrs;if (e.__image instanceof Object) for (var l = 0; l < s.length; l++) {if ("src" == s[l][0] && e.__image.hasOwnProperty(t[r].attrs[l][1])) {s.push(["rel", s[l][1]]), s[l][1] = e.__image[t[r].attrs[l][1]];break;}}return n(t, r, o, i, a);};};}, function (e, t, n) {"use strict";e.exports = function (e) {function t(e, t) {var n,r,o,i,a,s = e.pos,l = e.src.charCodeAt(s);if (t) return !1;if (43 !== l) return !1;if (r = e.scanDelims(e.pos, !0), i = r.length, a = String.fromCharCode(l), i < 2) return !1;for (i % 2 && (o = e.push("text", "", 0), o.content = a, i--), n = 0; n < i; n += 2) {o = e.push("text", "", 0), o.content = a + a, e.delimiters.push({ marker: l, jump: n, token: e.tokens.length - 1, level: e.level, end: -1, open: r.can_open, close: r.can_close });}return e.pos += r.length, !0;}function n(e) {var t,n,r,o,i,a = [],s = e.delimiters,l = e.delimiters.length;for (t = 0; t < l; t++) {r = s[t], 43 === r.marker && -1 !== r.end && (o = s[r.end], i = e.tokens[r.token], i.type = "ins_open", i.tag = "ins", i.nesting = 1, i.markup = "++", i.content = "", i = e.tokens[o.token], i.type = "ins_close", i.tag = "ins", i.nesting = -1, i.markup = "++", i.content = "", "text" === e.tokens[o.token - 1].type && "+" === e.tokens[o.token - 1].content && a.push(o.token - 1));}for (; a.length;) {for (t = a.pop(), n = t + 1; n < e.tokens.length && "ins_close" === e.tokens[n].type;) {n++;}n--, t !== n && (i = e.tokens[n], e.tokens[n] = e.tokens[t], e.tokens[t] = i);}}e.inline.ruler.before("emphasis", "ins", t), e.inline.ruler2.before("emphasis", "ins", n);};}, function (e, t, n) {"use strict";function r(e, t) {var n,r,o = e.posMax,i = !0,a = !0;return n = t > 0 ? e.src.charCodeAt(t - 1) : -1, r = t + 1 <= o ? e.src.charCodeAt(t + 1) : -1, (32 === n || 9 === n || r >= 48 && r <= 57) && (a = !1), 32 !== r && 9 !== r || (i = !1), { can_open: i, can_close: a };}function o(e, t) {if (!a && window.katex && (a = window.katex), !a) return !1;var n, o, i, s, l;if ("$" !== e.src[e.pos]) return !1;if (s = r(e, e.pos), !s.can_open) return t || (e.pending += "$"), e.pos += 1, !0;for (n = e.pos + 1, o = n; -1 !== (o = e.src.indexOf("$", o));) {for (l = o - 1; "\\" === e.src[l];) {l -= 1;}if ((o - l) % 2 == 1) break;o += 1;}return -1 === o ? (t || (e.pending += "$"), e.pos = n, !0) : o - n == 0 ? (t || (e.pending += "$$"), e.pos = n + 1, !0) : (s = r(e, o), s.can_close ? (t || (i = e.push("math_inline", "math", 0), i.markup = "$", i.content = e.src.slice(n, o)), e.pos = o + 1, !0) : (t || (e.pending += "$"), e.pos = n, !0));}function i(e, t, n, r) {if (!a && window.katex && (a = window.katex), !a) return !1;var o,i,s,l,c,u = !1,p = e.bMarks[t] + e.tShift[t],_ = e.eMarks[t];if (p + 2 > _) return !1;if ("$$" !== e.src.slice(p, p + 2)) return !1;if (p += 2, o = e.src.slice(p, _), r) return !0;for ("$$" === o.trim().slice(-2) && (o = o.trim().slice(0, -2), u = !0), s = t; !u && !(++s >= n) && (p = e.bMarks[s] + e.tShift[s], _ = e.eMarks[s], !(p < _ && e.tShift[s] < e.blkIndent));) {"$$" === e.src.slice(p, _).trim().slice(-2) && (l = e.src.slice(0, _).lastIndexOf("$$"), i = e.src.slice(p, l), u = !0);}return e.line = s + 1, c = e.push("math_block", "math", 0), c.block = !0, c.content = (o && o.trim() ? o + "\n" : "") + e.getLines(t + 1, s, e.tShift[t], !0) + (i && i.trim() ? i : ""), c.map = [t, e.line], c.markup = "$$", !0;}var a = null;e.exports = function (e, t) {t = t || {};var n = function n(e) {!a && window.katex && (a = window.katex), t.displayMode = !1;try {return a.renderToString(e, t);} catch (n) {return t.throwOnError && console.log(n), e;}},r = function r(e, t) {return n(e[t].content);},s = function s(e) {!a && window.katex && (a = window.katex), t.displayMode = !0;try {return "<p>" + a.renderToString(e, t) + "</p>";} catch (n) {return t.throwOnError && console.log(n), e;}},l = function l(e, t) {return s(e[t].content) + "\n";};e.inline.ruler.after("escape", "math_inline", o), e.block.ruler.after("blockquote", "math_block", i, { alt: ["paragraph", "reference", "blockquote", "list"] }), e.renderer.rules.math_inline = r, e.renderer.rules.math_block = l;};}, function (e, t, n) {"use strict";e.exports = function (e) {function t(e, t) {var n,r,o,i,a,s = e.pos,l = e.src.charCodeAt(s);if (t) return !1;if (61 !== l) return !1;if (r = e.scanDelims(e.pos, !0), i = r.length, a = String.fromCharCode(l), i < 2) return !1;for (i % 2 && (o = e.push("text", "", 0), o.content = a, i--), n = 0; n < i; n += 2) {o = e.push("text", "", 0), o.content = a + a, e.delimiters.push({ marker: l, jump: n, token: e.tokens.length - 1, level: e.level, end: -1, open: r.can_open, close: r.can_close });}return e.pos += r.length, !0;}function n(e) {var t,n,r,o,i,a = [],s = e.delimiters,l = e.delimiters.length;for (t = 0; t < l; t++) {r = s[t], 61 === r.marker && -1 !== r.end && (o = s[r.end], i = e.tokens[r.token], i.type = "mark_open", i.tag = "mark", i.nesting = 1, i.markup = "==", i.content = "", i = e.tokens[o.token], i.type = "mark_close", i.tag = "mark", i.nesting = -1, i.markup = "==", i.content = "", "text" === e.tokens[o.token - 1].type && "=" === e.tokens[o.token - 1].content && a.push(o.token - 1));}for (; a.length;) {for (t = a.pop(), n = t + 1; n < e.tokens.length && "mark_close" === e.tokens[n].type;) {n++;}n--, t !== n && (i = e.tokens[n], e.tokens[n] = e.tokens[t], e.tokens[t] = i);}}e.inline.ruler.before("emphasis", "mark", t), e.inline.ruler2.before("emphasis", "mark", n);};}, function (e, t, n) {"use strict";function r(e, t) {var n,r,i,a = e.posMax,s = e.pos;if (126 !== e.src.charCodeAt(s)) return !1;if (t) return !1;if (s + 2 >= a) return !1;for (e.pos = s + 1; e.pos < a;) {if (126 === e.src.charCodeAt(e.pos)) {n = !0;break;}e.md.inline.skipToken(e);}return n && s + 1 !== e.pos ? (r = e.src.slice(s + 1, e.pos), r.match(/(^|[^\\])(\\\\)*\s/) ? (e.pos = s, !1) : (e.posMax = e.pos, e.pos = s + 1, i = e.push("sub_open", "sub", 1), i.markup = "~", i = e.push("text", "", 0), i.content = r.replace(o, "$1"), i = e.push("sub_close", "sub", -1), i.markup = "~", e.pos = e.posMax + 1, e.posMax = a, !0)) : (e.pos = s, !1);}var o = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;e.exports = function (e) {e.inline.ruler.after("emphasis", "sub", r);};}, function (e, t, n) {"use strict";function r(e, t) {var n,r,i,a = e.posMax,s = e.pos;if (94 !== e.src.charCodeAt(s)) return !1;if (t) return !1;if (s + 2 >= a) return !1;for (e.pos = s + 1; e.pos < a;) {if (94 === e.src.charCodeAt(e.pos)) {n = !0;break;}e.md.inline.skipToken(e);}return n && s + 1 !== e.pos ? (r = e.src.slice(s + 1, e.pos), r.match(/(^|[^\\])(\\\\)*\s/) ? (e.pos = s, !1) : (e.posMax = e.pos, e.pos = s + 1, i = e.push("sup_open", "sup", 1), i.markup = "^", i = e.push("text", "", 0), i.content = r.replace(o, "$1"), i = e.push("sup_close", "sup", -1), i.markup = "^", e.pos = e.posMax + 1, e.posMax = a, !0)) : (e.pos = s, !1);}var o = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;e.exports = function (e) {e.inline.ruler.after("emphasis", "sup", r);};}, function (e, t) {function n(e, t, n) {var r = e.attrIndex(t),o = [t, n];r < 0 ? e.attrPush(o) : e.attrs[r] = o;}function r(e, t) {for (var n = e[t].level - 1, r = t - 1; r >= 0; r--) {if (e[r].level === n) return r;}return -1;}function o(e, t) {return u(e[t]) && p(e[t - 1]) && _(e[t - 2]) && d(e[t]);}function i(e, t) {if (e.children.unshift(a(e, t)), e.children[1].content = e.children[1].content.slice(3), e.content = e.content.slice(3), f) if (m) {e.children.pop();var n = "task-item-" + Math.ceil(1e7 * Math.random() - 1e3);e.children[0].content = e.children[0].content.slice(0, -1) + ' id="' + n + '">', e.children.push(c(e.content, n, t));} else e.children.unshift(s(t)), e.children.push(l(t));}function a(e, t) {var n = new t("html_inline", "", 0),r = h ? ' disabled="" ' : "";return 0 === e.content.indexOf("[ ] ") ? n.content = '<input class="task-list-item-checkbox"' + r + 'type="checkbox">' : 0 !== e.content.indexOf("[x] ") && 0 !== e.content.indexOf("[X] ") || (n.content = '<input class="task-list-item-checkbox" checked=""' + r + 'type="checkbox">'), n;}function s(e) {var t = new e("html_inline", "", 0);return t.content = "<label>", t;}function l(e) {var t = new e("html_inline", "", 0);return t.content = "</label>", t;}function c(e, t, n) {var r = new n("html_inline", "", 0);return r.content = '<label class="task-list-item-label" for="' + t + '">' + e + "</label>", r.attrs = [{ for: t }], r;}function u(e) {return "inline" === e.type;}function p(e) {return "paragraph_open" === e.type;}function _(e) {return "list_item_open" === e.type;}function d(e) {return 0 === e.content.indexOf("[ ] ") || 0 === e.content.indexOf("[x] ") || 0 === e.content.indexOf("[X] ");}var h = !0,f = !1,m = !1;e.exports = function (e, t) {t && (h = !t.enabled, f = !!t.label, m = !!t.labelAfter), e.core.ruler.after("inline", "github-task-lists", function (e) {for (var t = e.tokens, a = 2; a < t.length; a++) {o(t, a) && (i(t[a], e.Token), n(t[a - 2], "class", "task-list-item" + (h ? "" : " enabled")), n(t[r(t, a - 2)], "class", "contains-task-list"));}});};}, function (e, t, n) {"use strict";e.exports = function (e) {function t(e, t) {for (; e.src.indexOf("\n") >= 0 && e.src.indexOf("\n") < e.src.indexOf("@[toc]");) {"softbreak" === e.tokens.slice(-1)[0].type && (e.src = e.src.split("\n").slice(1).join("\n"), e.pos = 0);}var n;if (64 !== e.src.charCodeAt(e.pos)) return !1;if (91 !== e.src.charCodeAt(e.pos + 1)) return !1;var i = r.exec(e.src);if (!i) return !1;if (i = i.filter(function (e) {return e;}), i.length < 1) return !1;if (t) return !1;n = e.push("toc_open", "toc", 1), n.markup = "@[toc]", n = e.push("toc_body", "", 0);var a = o;i.length > 1 && (a = i.pop()), n.content = a, n = e.push("toc_close", "toc", -1);var s = 0,l = e.src.indexOf("\n");return s = -1 !== l ? e.pos + l : e.pos + e.posMax + 1, e.pos = s, !0;}var n,r = /^@\[toc\](?:\((?:\s+)?([^\)]+)(?:\s+)?\)?)?(?:\s+?)?$/im,o = "Table of Contents",i = function i(e) {return e.replace(/[^\w\s]/gi, "").split(" ").join("_");};e.renderer.rules.heading_open = function (e, t) {var n = e[t].tag,r = e[t + 1];if ("inline" === r.type) {return "<" + n + '><a id="' + (i(r.content) + "_" + r.map[0]) + '"></a>';}return "</h1>";}, e.renderer.rules.toc_open = function (e, t) {return "";}, e.renderer.rules.toc_close = function (e, t) {return "";}, e.renderer.rules.toc_body = function (e, t) {for (var r = [], o = n.tokens, a = o.length, s = 0; s < a; s++) {if ("heading_close" === o[s].type) {var l = o[s],c = o[s - 1];"inline" === c.type && r.push({ level: +l.tag.substr(1, 1), anchor: i(c.content) + "_" + c.map[0], content: c.content });}}var u = 0,p = r.map(function (e) {var t = [];if (e.level > u) for (var n = e.level - u, r = 0; r < n; r++) {t.push("<ul>"), u++;} else if (e.level < u) for (var n = u - e.level, r = 0; r < n; r++) {t.push("</ul>"), u--;}return t = t.concat(['<li><a href="#', e.anchor, '">', e.content, "</a></li>"]), t.join("");});return "<h3>" + e[t].content + "</h3>" + p.join("") + new Array(u + 1).join("</ul>");}, e.core.ruler.push("grab_state", function (e) {n = e;}), e.inline.ruler.after("emphasis", "toc", t);};}, function (e, t, n) {"use strict";e.exports = n(135);}, function (e, t, n) {"use strict";e.exports = ["address", "article", "aside", "base", "basefont", "blockquote", "body", "caption", "center", "col", "colgroup", "dd", "details", "dialog", "dir", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "iframe", "legend", "li", "link", "main", "menu", "menuitem", "meta", "nav", "noframes", "ol", "optgroup", "option", "p", "param", "section", "source", "summary", "table", "tbody", "td", "tfoot", "th", "thead", "title", "tr", "track", "ul"];}, function (e, t, n) {"use strict";t.parseLinkLabel = n(133), t.parseLinkDestination = n(132), t.parseLinkTitle = n(134);}, function (e, t, n) {"use strict";var r = n(0).isSpace,o = n(0).unescapeAll;e.exports = function (e, t, n) {var i,a,s = t,l = { ok: !1, pos: 0, lines: 0, str: "" };if (60 === e.charCodeAt(t)) {for (t++; t < n;) {if (10 === (i = e.charCodeAt(t)) || r(i)) return l;if (62 === i) return l.pos = t + 1, l.str = o(e.slice(s + 1, t)), l.ok = !0, l;92 === i && t + 1 < n ? t += 2 : t++;}return l;}for (a = 0; t < n && 32 !== (i = e.charCodeAt(t)) && !(i < 32 || 127 === i);) {if (92 === i && t + 1 < n) t += 2;else {if (40 === i && a++, 41 === i) {if (0 === a) break;a--;}t++;}}return s === t ? l : 0 !== a ? l : (l.str = o(e.slice(s, t)), l.lines = 0, l.pos = t, l.ok = !0, l);};}, function (e, t, n) {"use strict";e.exports = function (e, t, n) {var r,o,i,a,s = -1,l = e.posMax,c = e.pos;for (e.pos = t + 1, r = 1; e.pos < l;) {if (93 === (i = e.src.charCodeAt(e.pos)) && 0 === --r) {o = !0;break;}if (a = e.pos, e.md.inline.skipToken(e), 91 === i) if (a === e.pos - 1) r++;else if (n) return e.pos = c, -1;}return o && (s = e.pos), e.pos = c, s;};}, function (e, t, n) {"use strict";var r = n(0).unescapeAll;e.exports = function (e, t, n) {var o,i,a = 0,s = t,l = { ok: !1, pos: 0, lines: 0, str: "" };if (t >= n) return l;if (34 !== (i = e.charCodeAt(t)) && 39 !== i && 40 !== i) return l;for (t++, 40 === i && (i = 41); t < n;) {if ((o = e.charCodeAt(t)) === i) return l.pos = t + 1, l.lines = a, l.str = r(e.slice(s + 1, t)), l.ok = !0, l;10 === o ? a++ : 92 === o && t + 1 < n && (t++, 10 === e.charCodeAt(t) && a++), t++;}return l;};}, function (e, t, n) {"use strict";function r(e) {var t = e.trim().toLowerCase();return !g.test(t) || !!b.test(t);}function o(e) {var t = h.parse(e, !0);if (t.hostname && (!t.protocol || v.indexOf(t.protocol) >= 0)) try {t.hostname = f.toASCII(t.hostname);} catch (e) {}return h.encode(h.format(t));}function i(e) {var t = h.parse(e, !0);if (t.hostname && (!t.protocol || v.indexOf(t.protocol) >= 0)) try {t.hostname = f.toUnicode(t.hostname);} catch (e) {}return h.decode(h.format(t));}function a(e, t) {if (!(this instanceof a)) return new a(e, t);t || s.isString(e) || (t = e || {}, e = "default"), this.inline = new _(), this.block = new p(), this.core = new u(), this.renderer = new c(), this.linkify = new d(), this.validateLink = r, this.normalizeLink = o, this.normalizeLinkText = i, this.utils = s, this.helpers = s.assign({}, l), this.options = {}, this.configure(e), t && this.set(t);}var s = n(0),l = n(131),c = n(142),u = n(137),p = n(136),_ = n(138),d = n(108),h = n(52),f = n(178),m = { default: n(140), zero: n(141), commonmark: n(139) },g = /^(vbscript|javascript|file|data):/,b = /^data:image\/(gif|png|jpeg|webp);/,v = ["http:", "https:", "mailto:"];a.prototype.set = function (e) {return s.assign(this.options, e), this;}, a.prototype.configure = function (e) {var t,n = this;if (s.isString(e) && (t = e, !(e = m[t]))) throw new Error('Wrong `markdown-it` preset "' + t + '", check name');if (!e) throw new Error("Wrong `markdown-it` preset, can't be empty");return e.options && n.set(e.options), e.components && Object.keys(e.components).forEach(function (t) {e.components[t].rules && n[t].ruler.enableOnly(e.components[t].rules), e.components[t].rules2 && n[t].ruler2.enableOnly(e.components[t].rules2);}), this;}, a.prototype.enable = function (e, t) {var n = [];Array.isArray(e) || (e = [e]), ["core", "block", "inline"].forEach(function (t) {n = n.concat(this[t].ruler.enable(e, !0));}, this), n = n.concat(this.inline.ruler2.enable(e, !0));var r = e.filter(function (e) {return n.indexOf(e) < 0;});if (r.length && !t) throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + r);return this;}, a.prototype.disable = function (e, t) {var n = [];Array.isArray(e) || (e = [e]), ["core", "block", "inline"].forEach(function (t) {n = n.concat(this[t].ruler.disable(e, !0));}, this), n = n.concat(this.inline.ruler2.disable(e, !0));var r = e.filter(function (e) {return n.indexOf(e) < 0;});if (r.length && !t) throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + r);return this;}, a.prototype.use = function (e) {var t = [this].concat(Array.prototype.slice.call(arguments, 1));return e.apply(e, t), this;}, a.prototype.parse = function (e, t) {if ("string" != typeof e) throw new Error("Input data should be a String");var n = new this.core.State(e, this, t);return this.core.process(n), n.tokens;}, a.prototype.render = function (e, t) {return t = t || {}, this.renderer.render(this.parse(e, t), this.options, t);}, a.prototype.parseInline = function (e, t) {var n = new this.core.State(e, this, t);return n.inlineMode = !0, this.core.process(n), n.tokens;}, a.prototype.renderInline = function (e, t) {return t = t || {}, this.renderer.render(this.parseInline(e, t), this.options, t);}, e.exports = a;}, function (e, t, n) {"use strict";function r() {this.ruler = new o();for (var e = 0; e < i.length; e++) {this.ruler.push(i[e][0], i[e][1], { alt: (i[e][2] || []).slice() });}}var o = n(31),i = [["table", n(154), ["paragraph", "reference"]], ["code", n(144)], ["fence", n(145), ["paragraph", "reference", "blockquote", "list"]], ["blockquote", n(143), ["paragraph", "reference", "blockquote", "list"]], ["hr", n(147), ["paragraph", "reference", "blockquote", "list"]], ["list", n(150), ["paragraph", "reference", "blockquote"]], ["reference", n(152)], ["heading", n(146), ["paragraph", "reference", "blockquote"]], ["lheading", n(149)], ["html_block", n(148), ["paragraph", "reference", "blockquote"]], ["paragraph", n(151)]];r.prototype.tokenize = function (e, t, n) {for (var r, o = this.ruler.getRules(""), i = o.length, a = t, s = !1, l = e.md.options.maxNesting; a < n && (e.line = a = e.skipEmptyLines(a), !(a >= n)) && !(e.sCount[a] < e.blkIndent);) {if (e.level >= l) {e.line = n;break;}for (r = 0; r < i && !o[r](e, a, n, !1); r++) {;}e.tight = !s, e.isEmpty(e.line - 1) && (s = !0), (a = e.line) < n && e.isEmpty(a) && (s = !0, a++, e.line = a);}}, r.prototype.parse = function (e, t, n, r) {var o;e && (o = new this.State(e, t, n, r), this.tokenize(o, o.line, o.lineMax));}, r.prototype.State = n(153), e.exports = r;}, function (e, t, n) {"use strict";function r() {this.ruler = new o();for (var e = 0; e < i.length; e++) {this.ruler.push(i[e][0], i[e][1]);}}var o = n(31),i = [["normalize", n(158)], ["block", n(155)], ["inline", n(156)], ["linkify", n(157)], ["replacements", n(159)], ["smartquotes", n(160)]];r.prototype.process = function (e) {var t, n, r;for (r = this.ruler.getRules(""), t = 0, n = r.length; t < n; t++) {r[t](e);}}, r.prototype.State = n(161), e.exports = r;}, function (e, t, n) {"use strict";function r() {var e;for (this.ruler = new o(), e = 0; e < i.length; e++) {this.ruler.push(i[e][0], i[e][1]);}for (this.ruler2 = new o(), e = 0; e < a.length; e++) {this.ruler2.push(a[e][0], a[e][1]);}}var o = n(31),i = [["text", n(172)], ["newline", n(170)], ["escape", n(166)], ["backticks", n(163)], ["strikethrough", n(51).tokenize], ["emphasis", n(50).tokenize], ["link", n(169)], ["image", n(168)], ["autolink", n(162)], ["html_inline", n(167)], ["entity", n(165)]],a = [["balance_pairs", n(164)], ["strikethrough", n(51).postProcess], ["emphasis", n(50).postProcess], ["text_collapse", n(173)]];r.prototype.skipToken = function (e) {var t,n,r = e.pos,o = this.ruler.getRules(""),i = o.length,a = e.md.options.maxNesting,s = e.cache;if (void 0 !== s[r]) return void (e.pos = s[r]);if (e.level < a) for (n = 0; n < i && (e.level++, t = o[n](e, !0), e.level--, !t); n++) {;} else e.pos = e.posMax;t || e.pos++, s[r] = e.pos;}, r.prototype.tokenize = function (e) {for (var t, n, r = this.ruler.getRules(""), o = r.length, i = e.posMax, a = e.md.options.maxNesting; e.pos < i;) {if (e.level < a) for (n = 0; n < o && !(t = r[n](e, !1)); n++) {;}if (t) {if (e.pos >= i) break;} else e.pending += e.src[e.pos++];}e.pending && e.pushPending();}, r.prototype.parse = function (e, t, n, r) {var o,i,a,s = new this.State(e, t, n, r);for (this.tokenize(s), i = this.ruler2.getRules(""), a = i.length, o = 0; o < a; o++) {i[o](s);}}, r.prototype.State = n(171), e.exports = r;}, function (e, t, n) {"use strict";e.exports = { options: { html: !0, xhtmlOut: !0, breaks: !1, langPrefix: "language-", linkify: !1, typographer: !1, quotes: "“”‘’", highlight: null, maxNesting: 20 }, components: { core: { rules: ["normalize", "block", "inline"] }, block: { rules: ["blockquote", "code", "fence", "heading", "hr", "html_block", "lheading", "list", "reference", "paragraph"] }, inline: { rules: ["autolink", "backticks", "emphasis", "entity", "escape", "html_inline", "image", "link", "newline", "text"], rules2: ["balance_pairs", "emphasis", "text_collapse"] } } };}, function (e, t, n) {"use strict";e.exports = { options: { html: !1, xhtmlOut: !1, breaks: !1, langPrefix: "language-", linkify: !1, typographer: !1, quotes: "“”‘’", highlight: null, maxNesting: 100 }, components: { core: {}, block: {}, inline: {} } };}, function (e, t, n) {"use strict";e.exports = { options: { html: !1, xhtmlOut: !1, breaks: !1, langPrefix: "language-", linkify: !1, typographer: !1, quotes: "“”‘’", highlight: null, maxNesting: 20 }, components: { core: { rules: ["normalize", "block", "inline"] }, block: { rules: ["paragraph"] }, inline: { rules: ["text"], rules2: ["balance_pairs", "text_collapse"] } } };}, function (e, t, n) {"use strict";function r() {this.rules = o({}, s);}var o = n(0).assign,i = n(0).unescapeAll,a = n(0).escapeHtml,s = {};s.code_inline = function (e, t, n, r, o) {var i = e[t];return "<code" + o.renderAttrs(i) + ">" + a(e[t].content) + "</code>";}, s.code_block = function (e, t, n, r, o) {var i = e[t];return "<pre" + o.renderAttrs(i) + "><code>" + a(e[t].content) + "</code></pre>\n";}, s.fence = function (e, t, n, r, o) {var s,l,c,u,p = e[t],_ = p.info ? i(p.info).trim() : "",d = "";return _ && (d = _.split(/\s+/g)[0]), s = n.highlight ? n.highlight(p.content, d) || a(p.content) : a(p.content), 0 === s.indexOf("<pre") ? s + "\n" : _ ? (l = p.attrIndex("class"), c = p.attrs ? p.attrs.slice() : [], l < 0 ? c.push(["class", n.langPrefix + d]) : c[l][1] += " " + n.langPrefix + d, u = { attrs: c }, "<pre><code" + o.renderAttrs(u) + ">" + s + "</code></pre>\n") : "<pre><code" + o.renderAttrs(p) + ">" + s + "</code></pre>\n";}, s.image = function (e, t, n, r, o) {var i = e[t];return i.attrs[i.attrIndex("alt")][1] = o.renderInlineAsText(i.children, n, r), o.renderToken(e, t, n);}, s.hardbreak = function (e, t, n) {return n.xhtmlOut ? "<br />\n" : "<br>\n";}, s.softbreak = function (e, t, n) {return n.breaks ? n.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";}, s.text = function (e, t) {return a(e[t].content);}, s.html_block = function (e, t) {return e[t].content;}, s.html_inline = function (e, t) {return e[t].content;}, r.prototype.renderAttrs = function (e) {var t, n, r;if (!e.attrs) return "";for (r = "", t = 0, n = e.attrs.length; t < n; t++) {r += " " + a(e.attrs[t][0]) + '="' + a(e.attrs[t][1]) + '"';}return r;}, r.prototype.renderToken = function (e, t, n) {var r,o = "",i = !1,a = e[t];return a.hidden ? "" : (a.block && -1 !== a.nesting && t && e[t - 1].hidden && (o += "\n"), o += (-1 === a.nesting ? "</" : "<") + a.tag, o += this.renderAttrs(a), 0 === a.nesting && n.xhtmlOut && (o += " /"), a.block && (i = !0, 1 === a.nesting && t + 1 < e.length && (r = e[t + 1], "inline" === r.type || r.hidden ? i = !1 : -1 === r.nesting && r.tag === a.tag && (i = !1))), o += i ? ">\n" : ">");}, r.prototype.renderInline = function (e, t, n) {for (var r, o = "", i = this.rules, a = 0, s = e.length; a < s; a++) {r = e[a].type, void 0 !== i[r] ? o += i[r](e, a, t, n, this) : o += this.renderToken(e, a, t);}return o;}, r.prototype.renderInlineAsText = function (e, t, n) {for (var r = "", o = 0, i = e.length; o < i; o++) {"text" === e[o].type ? r += e[o].content : "image" === e[o].type && (r += this.renderInlineAsText(e[o].children, t, n));}return r;}, r.prototype.render = function (e, t, n) {var r,o,i,a = "",s = this.rules;for (r = 0, o = e.length; r < o; r++) {i = e[r].type, "inline" === i ? a += this.renderInline(e[r].children, t, n) : void 0 !== s[i] ? a += s[e[r].type](e, r, t, n, this) : a += this.renderToken(e, r, t, n);}return a;}, e.exports = r;}, function (e, t, n) {"use strict";var r = n(0).isSpace;e.exports = function (e, t, n, o) {var i,a,s,l,c,u,p,_,d,h,f,m,g,b,v,k,w,x,y,C,E = e.lineMax,D = e.bMarks[t] + e.tShift[t],T = e.eMarks[t];if (e.sCount[t] - e.blkIndent >= 4) return !1;if (62 !== e.src.charCodeAt(D++)) return !1;if (o) return !0;for (l = d = e.sCount[t] + D - (e.bMarks[t] + e.tShift[t]), 32 === e.src.charCodeAt(D) ? (D++, l++, d++, i = !1, k = !0) : 9 === e.src.charCodeAt(D) ? (k = !0, (e.bsCount[t] + d) % 4 == 3 ? (D++, l++, d++, i = !1) : i = !0) : k = !1, h = [e.bMarks[t]], e.bMarks[t] = D; D < T && (a = e.src.charCodeAt(D), r(a));) {9 === a ? d += 4 - (d + e.bsCount[t] + (i ? 1 : 0)) % 4 : d++, D++;}for (f = [e.bsCount[t]], e.bsCount[t] = e.sCount[t] + 1 + (k ? 1 : 0), u = D >= T, b = [e.sCount[t]], e.sCount[t] = d - l, v = [e.tShift[t]], e.tShift[t] = D - e.bMarks[t], x = e.md.block.ruler.getRules("blockquote"), g = e.parentType, e.parentType = "blockquote", C = !1, _ = t + 1; _ < n && (e.sCount[_] < e.blkIndent && (C = !0), D = e.bMarks[_] + e.tShift[_], T = e.eMarks[_], !(D >= T)); _++) {if (62 !== e.src.charCodeAt(D++) || C) {if (u) break;for (w = !1, s = 0, c = x.length; s < c; s++) {if (x[s](e, _, n, !0)) {w = !0;break;}}if (w) {e.lineMax = _, 0 !== e.blkIndent && (h.push(e.bMarks[_]), f.push(e.bsCount[_]), v.push(e.tShift[_]), b.push(e.sCount[_]), e.sCount[_] -= e.blkIndent);break;}h.push(e.bMarks[_]), f.push(e.bsCount[_]), v.push(e.tShift[_]), b.push(e.sCount[_]), e.sCount[_] = -1;} else {for (l = d = e.sCount[_] + D - (e.bMarks[_] + e.tShift[_]), 32 === e.src.charCodeAt(D) ? (D++, l++, d++, i = !1, k = !0) : 9 === e.src.charCodeAt(D) ? (k = !0, (e.bsCount[_] + d) % 4 == 3 ? (D++, l++, d++, i = !1) : i = !0) : k = !1, h.push(e.bMarks[_]), e.bMarks[_] = D; D < T && (a = e.src.charCodeAt(D), r(a));) {9 === a ? d += 4 - (d + e.bsCount[_] + (i ? 1 : 0)) % 4 : d++, D++;}u = D >= T, f.push(e.bsCount[_]), e.bsCount[_] = e.sCount[_] + 1 + (k ? 1 : 0), b.push(e.sCount[_]), e.sCount[_] = d - l, v.push(e.tShift[_]), e.tShift[_] = D - e.bMarks[_];}}for (m = e.blkIndent, e.blkIndent = 0, y = e.push("blockquote_open", "blockquote", 1), y.markup = ">", y.map = p = [t, 0], e.md.block.tokenize(e, t, _), y = e.push("blockquote_close", "blockquote", -1), y.markup = ">", e.lineMax = E, e.parentType = g, p[1] = e.line, s = 0; s < v.length; s++) {e.bMarks[s + t] = h[s], e.tShift[s + t] = v[s], e.sCount[s + t] = b[s], e.bsCount[s + t] = f[s];}return e.blkIndent = m, !0;};}, function (e, t, n) {"use strict";e.exports = function (e, t, n) {var r, o, i;if (e.sCount[t] - e.blkIndent < 4) return !1;for (o = r = t + 1; r < n;) {if (e.isEmpty(r)) r++;else {if (!(e.sCount[r] - e.blkIndent >= 4)) break;r++, o = r;}}return e.line = o, i = e.push("code_block", "code", 0), i.content = e.getLines(t, o, 4 + e.blkIndent, !0), i.map = [t, e.line], !0;};}, function (e, t, n) {"use strict";e.exports = function (e, t, n, r) {var o,i,a,s,l,c,u,p = !1,_ = e.bMarks[t] + e.tShift[t],d = e.eMarks[t];if (e.sCount[t] - e.blkIndent >= 4) return !1;if (_ + 3 > d) return !1;if (126 !== (o = e.src.charCodeAt(_)) && 96 !== o) return !1;if (l = _, _ = e.skipChars(_, o), (i = _ - l) < 3) return !1;if (u = e.src.slice(l, _), a = e.src.slice(_, d), a.indexOf(String.fromCharCode(o)) >= 0) return !1;if (r) return !0;for (s = t; !(++s >= n) && (_ = l = e.bMarks[s] + e.tShift[s], d = e.eMarks[s], !(_ < d && e.sCount[s] < e.blkIndent));) {if (e.src.charCodeAt(_) === o && !(e.sCount[s] - e.blkIndent >= 4 || (_ = e.skipChars(_, o)) - l < i || (_ = e.skipSpaces(_)) < d)) {p = !0;break;}}return i = e.sCount[t], e.line = s + (p ? 1 : 0), c = e.push("fence", "code", 0), c.info = a, c.content = e.getLines(t + 1, s, i, !0), c.markup = u, c.map = [t, e.line], !0;};}, function (e, t, n) {"use strict";var r = n(0).isSpace;e.exports = function (e, t, n, o) {var i,a,s,l,c = e.bMarks[t] + e.tShift[t],u = e.eMarks[t];if (e.sCount[t] - e.blkIndent >= 4) return !1;if (35 !== (i = e.src.charCodeAt(c)) || c >= u) return !1;for (a = 1, i = e.src.charCodeAt(++c); 35 === i && c < u && a <= 6;) {a++, i = e.src.charCodeAt(++c);}return !(a > 6 || c < u && !r(i)) && (!!o || (u = e.skipSpacesBack(u, c), s = e.skipCharsBack(u, 35, c), s > c && r(e.src.charCodeAt(s - 1)) && (u = s), e.line = t + 1, l = e.push("heading_open", "h" + String(a), 1), l.markup = "########".slice(0, a), l.map = [t, e.line], l = e.push("inline", "", 0), l.content = e.src.slice(c, u).trim(), l.map = [t, e.line], l.children = [], l = e.push("heading_close", "h" + String(a), -1), l.markup = "########".slice(0, a), !0));};}, function (e, t, n) {"use strict";var r = n(0).isSpace;e.exports = function (e, t, n, o) {var i,a,s,l,c = e.bMarks[t] + e.tShift[t],u = e.eMarks[t];if (e.sCount[t] - e.blkIndent >= 4) return !1;if (42 !== (i = e.src.charCodeAt(c++)) && 45 !== i && 95 !== i) return !1;for (a = 1; c < u;) {if ((s = e.src.charCodeAt(c++)) !== i && !r(s)) return !1;s === i && a++;}return !(a < 3) && (!!o || (e.line = t + 1, l = e.push("hr", "hr", 0), l.map = [t, e.line], l.markup = Array(a + 1).join(String.fromCharCode(i)), !0));};}, function (e, t, n) {"use strict";var r = n(130),o = n(49).HTML_OPEN_CLOSE_TAG_RE,i = [[/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, !0], [/^<!--/, /-->/, !0], [/^<\?/, /\?>/, !0], [/^<![A-Z]/, />/, !0], [/^<!\[CDATA\[/, /\]\]>/, !0], [new RegExp("^</?(" + r.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0], [new RegExp(o.source + "\\s*$"), /^$/, !1]];e.exports = function (e, t, n, r) {var o,a,s,l,c = e.bMarks[t] + e.tShift[t],u = e.eMarks[t];if (e.sCount[t] - e.blkIndent >= 4) return !1;if (!e.md.options.html) return !1;if (60 !== e.src.charCodeAt(c)) return !1;for (l = e.src.slice(c, u), o = 0; o < i.length && !i[o][0].test(l); o++) {;}if (o === i.length) return !1;if (r) return i[o][2];if (a = t + 1, !i[o][1].test(l)) for (; a < n && !(e.sCount[a] < e.blkIndent); a++) {if (c = e.bMarks[a] + e.tShift[a], u = e.eMarks[a], l = e.src.slice(c, u), i[o][1].test(l)) {0 !== l.length && a++;break;}}return e.line = a, s = e.push("html_block", "", 0), s.map = [t, a], s.content = e.getLines(t, a, e.blkIndent, !0), !0;};}, function (e, t, n) {"use strict";e.exports = function (e, t, n) {var r,o,i,a,s,l,c,u,p,_,d = t + 1,h = e.md.block.ruler.getRules("paragraph");if (e.sCount[t] - e.blkIndent >= 4) return !1;for (_ = e.parentType, e.parentType = "paragraph"; d < n && !e.isEmpty(d); d++) {if (!(e.sCount[d] - e.blkIndent > 3)) {if (e.sCount[d] >= e.blkIndent && (l = e.bMarks[d] + e.tShift[d], c = e.eMarks[d], l < c && (45 === (p = e.src.charCodeAt(l)) || 61 === p) && (l = e.skipChars(l, p), (l = e.skipSpaces(l)) >= c))) {u = 61 === p ? 1 : 2;break;}if (!(e.sCount[d] < 0)) {for (o = !1, i = 0, a = h.length; i < a; i++) {if (h[i](e, d, n, !0)) {o = !0;break;}}if (o) break;}}}return !!u && (r = e.getLines(t, d, e.blkIndent, !1).trim(), e.line = d + 1, s = e.push("heading_open", "h" + String(u), 1), s.markup = String.fromCharCode(p), s.map = [t, e.line], s = e.push("inline", "", 0), s.content = r, s.map = [t, e.line - 1], s.children = [], s = e.push("heading_close", "h" + String(u), -1), s.markup = String.fromCharCode(p), e.parentType = _, !0);};}, function (e, t, n) {"use strict";function r(e, t) {var n, r, o, i;return r = e.bMarks[t] + e.tShift[t], o = e.eMarks[t], n = e.src.charCodeAt(r++), 42 !== n && 45 !== n && 43 !== n ? -1 : r < o && (i = e.src.charCodeAt(r), !a(i)) ? -1 : r;}function o(e, t) {var n,r = e.bMarks[t] + e.tShift[t],o = r,i = e.eMarks[t];if (o + 1 >= i) return -1;if ((n = e.src.charCodeAt(o++)) < 48 || n > 57) return -1;for (;;) {if (o >= i) return -1;n = e.src.charCodeAt(o++);{if (!(n >= 48 && n <= 57)) {if (41 === n || 46 === n) break;return -1;}if (o - r >= 10) return -1;}}return o < i && (n = e.src.charCodeAt(o), !a(n)) ? -1 : o;}function i(e, t) {var n,r,o = e.level + 2;for (n = t + 2, r = e.tokens.length - 2; n < r; n++) {e.tokens[n].level === o && "paragraph_open" === e.tokens[n].type && (e.tokens[n + 2].hidden = !0, e.tokens[n].hidden = !0, n += 2);}}var a = n(0).isSpace;e.exports = function (e, t, n, a) {var s,l,c,u,p,_,d,h,f,m,g,b,v,k,w,x,y,C,E,D,T,A,S,L,M,j,q,O,$ = !1,z = !0;if (e.sCount[t] - e.blkIndent >= 4) return !1;if (a && "paragraph" === e.parentType && e.tShift[t] >= e.blkIndent && ($ = !0), (S = o(e, t)) >= 0) {if (d = !0, M = e.bMarks[t] + e.tShift[t], v = Number(e.src.substr(M, S - M - 1)), $ && 1 !== v) return !1;} else {if (!((S = r(e, t)) >= 0)) return !1;d = !1;}if ($ && e.skipSpaces(S) >= e.eMarks[t]) return !1;if (b = e.src.charCodeAt(S - 1), a) return !0;for (g = e.tokens.length, d ? (O = e.push("ordered_list_open", "ol", 1), 1 !== v && (O.attrs = [["start", v]])) : O = e.push("bullet_list_open", "ul", 1), O.map = m = [t, 0], O.markup = String.fromCharCode(b), w = t, L = !1, q = e.md.block.ruler.getRules("list"), E = e.parentType, e.parentType = "list"; w < n;) {for (A = S, k = e.eMarks[w], _ = x = e.sCount[w] + S - (e.bMarks[t] + e.tShift[t]); A < k;) {if (9 === (s = e.src.charCodeAt(A))) x += 4 - (x + e.bsCount[w]) % 4;else {if (32 !== s) break;x++;}A++;}if (l = A, p = l >= k ? 1 : x - _, p > 4 && (p = 1), u = _ + p, O = e.push("list_item_open", "li", 1), O.markup = String.fromCharCode(b), O.map = h = [t, 0], y = e.blkIndent, T = e.tight, D = e.tShift[t], C = e.sCount[t], e.blkIndent = u, e.tight = !0, e.tShift[t] = l - e.bMarks[t], e.sCount[t] = x, l >= k && e.isEmpty(t + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, t, n, !0), e.tight && !L || (z = !1), L = e.line - t > 1 && e.isEmpty(e.line - 1), e.blkIndent = y, e.tShift[t] = D, e.sCount[t] = C, e.tight = T, O = e.push("list_item_close", "li", -1), O.markup = String.fromCharCode(b), w = t = e.line, h[1] = w, l = e.bMarks[t], w >= n) break;if (e.sCount[w] < e.blkIndent) break;for (j = !1, c = 0, f = q.length; c < f; c++) {if (q[c](e, w, n, !0)) {j = !0;break;}}if (j) break;if (d) {if ((S = o(e, w)) < 0) break;} else if ((S = r(e, w)) < 0) break;if (b !== e.src.charCodeAt(S - 1)) break;}return O = d ? e.push("ordered_list_close", "ol", -1) : e.push("bullet_list_close", "ul", -1), O.markup = String.fromCharCode(b), m[1] = w, e.line = w, e.parentType = E, z && i(e, g), !0;};}, function (e, t, n) {"use strict";e.exports = function (e, t) {var n,r,o,i,a,s,l = t + 1,c = e.md.block.ruler.getRules("paragraph"),u = e.lineMax;for (s = e.parentType, e.parentType = "paragraph"; l < u && !e.isEmpty(l); l++) {if (!(e.sCount[l] - e.blkIndent > 3 || e.sCount[l] < 0)) {for (r = !1, o = 0, i = c.length; o < i; o++) {if (c[o](e, l, u, !0)) {r = !0;break;}}if (r) break;}}return n = e.getLines(t, l, e.blkIndent, !1).trim(), e.line = l, a = e.push("paragraph_open", "p", 1), a.map = [t, e.line], a = e.push("inline", "", 0), a.content = n, a.map = [t, e.line], a.children = [], a = e.push("paragraph_close", "p", -1), e.parentType = s, !0;};}, function (e, t, n) {"use strict";var r = n(0).normalizeReference,o = n(0).isSpace;e.exports = function (e, t, n, i) {var a,s,l,c,u,p,_,d,h,f,m,g,b,v,k,w,x = 0,y = e.bMarks[t] + e.tShift[t],C = e.eMarks[t],E = t + 1;if (e.sCount[t] - e.blkIndent >= 4) return !1;if (91 !== e.src.charCodeAt(y)) return !1;for (; ++y < C;) {if (93 === e.src.charCodeAt(y) && 92 !== e.src.charCodeAt(y - 1)) {if (y + 1 === C) return !1;if (58 !== e.src.charCodeAt(y + 1)) return !1;break;}}for (c = e.lineMax, k = e.md.block.ruler.getRules("reference"), f = e.parentType, e.parentType = "reference"; E < c && !e.isEmpty(E); E++) {if (!(e.sCount[E] - e.blkIndent > 3 || e.sCount[E] < 0)) {for (v = !1, p = 0, _ = k.length; p < _; p++) {if (k[p](e, E, c, !0)) {v = !0;break;}}if (v) break;}}for (b = e.getLines(t, E, e.blkIndent, !1).trim(), C = b.length, y = 1; y < C; y++) {if (91 === (a = b.charCodeAt(y))) return !1;if (93 === a) {h = y;break;}10 === a ? x++ : 92 === a && ++y < C && 10 === b.charCodeAt(y) && x++;}if (h < 0 || 58 !== b.charCodeAt(h + 1)) return !1;for (y = h + 2; y < C; y++) {if (10 === (a = b.charCodeAt(y))) x++;else if (!o(a)) break;}if (m = e.md.helpers.parseLinkDestination(b, y, C), !m.ok) return !1;if (u = e.md.normalizeLink(m.str), !e.md.validateLink(u)) return !1;for (y = m.pos, x += m.lines, s = y, l = x, g = y; y < C; y++) {if (10 === (a = b.charCodeAt(y))) x++;else if (!o(a)) break;}for (m = e.md.helpers.parseLinkTitle(b, y, C), y < C && g !== y && m.ok ? (w = m.str, y = m.pos, x += m.lines) : (w = "", y = s, x = l); y < C && (a = b.charCodeAt(y), o(a));) {y++;}if (y < C && 10 !== b.charCodeAt(y) && w) for (w = "", y = s, x = l; y < C && (a = b.charCodeAt(y), o(a));) {y++;}return !(y < C && 10 !== b.charCodeAt(y)) && !!(d = r(b.slice(1, h))) && (!!i || (void 0 === e.env.references && (e.env.references = {}), void 0 === e.env.references[d] && (e.env.references[d] = { title: w, href: u }), e.parentType = f, e.line = t + x + 1, !0));};}, function (e, t, n) {"use strict";function r(e, t, n, r) {var o, a, s, l, c, u, p, _;for (this.src = e, this.md = t, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.parentType = "root", this.level = 0, this.result = "", a = this.src, _ = !1, s = l = u = p = 0, c = a.length; l < c; l++) {if (o = a.charCodeAt(l), !_) {if (i(o)) {u++, 9 === o ? p += 4 - p % 4 : p++;continue;}_ = !0;}10 !== o && l !== c - 1 || (10 !== o && l++, this.bMarks.push(s), this.eMarks.push(l), this.tShift.push(u), this.sCount.push(p), this.bsCount.push(0), _ = !1, u = 0, p = 0, s = l + 1);}this.bMarks.push(a.length), this.eMarks.push(a.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;}var o = n(32),i = n(0).isSpace;r.prototype.push = function (e, t, n) {var r = new o(e, t, n);return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;}, r.prototype.isEmpty = function (e) {return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];}, r.prototype.skipEmptyLines = function (e) {for (var t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++) {;}return e;}, r.prototype.skipSpaces = function (e) {for (var t, n = this.src.length; e < n && (t = this.src.charCodeAt(e), i(t)); e++) {;}return e;}, r.prototype.skipSpacesBack = function (e, t) {if (e <= t) return e;for (; e > t;) {if (!i(this.src.charCodeAt(--e))) return e + 1;}return e;}, r.prototype.skipChars = function (e, t) {for (var n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++) {;}return e;}, r.prototype.skipCharsBack = function (e, t, n) {if (e <= n) return e;for (; e > n;) {if (t !== this.src.charCodeAt(--e)) return e + 1;}return e;}, r.prototype.getLines = function (e, t, n, r) {var o,a,s,l,c,u,p,_ = e;if (e >= t) return "";for (u = new Array(t - e), o = 0; _ < t; _++, o++) {for (a = 0, p = l = this.bMarks[_], c = _ + 1 < t || r ? this.eMarks[_] + 1 : this.eMarks[_]; l < c && a < n;) {if (s = this.src.charCodeAt(l), i(s)) 9 === s ? a += 4 - (a + this.bsCount[_]) % 4 : a++;else {if (!(l - p < this.tShift[_])) break;a++;}l++;}u[o] = a > n ? new Array(a - n + 1).join(" ") + this.src.slice(l, c) : this.src.slice(l, c);}return u.join("");}, r.prototype.Token = o, e.exports = r;}, function (e, t, n) {"use strict";function r(e, t) {var n = e.bMarks[t] + e.blkIndent,r = e.eMarks[t];return e.src.substr(n, r - n);}function o(e) {var t,n = [],r = 0,o = e.length,i = 0,a = 0,s = !1,l = 0;for (t = e.charCodeAt(r); r < o;) {96 === t ? s ? (s = !1, l = r) : i % 2 == 0 && (s = !0, l = r) : 124 !== t || i % 2 != 0 || s || (n.push(e.substring(a, r)), a = r + 1), 92 === t ? i++ : i = 0, r++, r === o && s && (s = !1, r = l + 1), t = e.charCodeAt(r);}return n.push(e.substring(a)), n;}var i = n(0).isSpace;e.exports = function (e, t, n, a) {var s, l, c, u, p, _, d, h, f, m, g, b;if (t + 2 > n) return !1;if (p = t + 1, e.sCount[p] < e.blkIndent) return !1;if (e.sCount[p] - e.blkIndent >= 4) return !1;if ((c = e.bMarks[p] + e.tShift[p]) >= e.eMarks[p]) return !1;if (124 !== (s = e.src.charCodeAt(c++)) && 45 !== s && 58 !== s) return !1;for (; c < e.eMarks[p];) {if (124 !== (s = e.src.charCodeAt(c)) && 45 !== s && 58 !== s && !i(s)) return !1;c++;}for (l = r(e, t + 1), _ = l.split("|"), f = [], u = 0; u < _.length; u++) {if (!(m = _[u].trim())) {if (0 === u || u === _.length - 1) continue;return !1;}if (!/^:?-+:?$/.test(m)) return !1;58 === m.charCodeAt(m.length - 1) ? f.push(58 === m.charCodeAt(0) ? "center" : "right") : 58 === m.charCodeAt(0) ? f.push("left") : f.push("");}if (l = r(e, t).trim(), -1 === l.indexOf("|")) return !1;if (e.sCount[t] - e.blkIndent >= 4) return !1;if (_ = o(l.replace(/^\||\|$/g, "")), (d = _.length) > f.length) return !1;if (a) return !0;for (h = e.push("table_open", "table", 1), h.map = g = [t, 0], h = e.push("thead_open", "thead", 1), h.map = [t, t + 1], h = e.push("tr_open", "tr", 1), h.map = [t, t + 1], u = 0; u < _.length; u++) {h = e.push("th_open", "th", 1), h.map = [t, t + 1], f[u] && (h.attrs = [["style", "text-align:" + f[u]]]), h = e.push("inline", "", 0), h.content = _[u].trim(), h.map = [t, t + 1], h.children = [], h = e.push("th_close", "th", -1);}for (h = e.push("tr_close", "tr", -1), h = e.push("thead_close", "thead", -1), h = e.push("tbody_open", "tbody", 1), h.map = b = [t + 2, 0], p = t + 2; p < n && !(e.sCount[p] < e.blkIndent) && (l = r(e, p).trim(), -1 !== l.indexOf("|")) && !(e.sCount[p] - e.blkIndent >= 4); p++) {for (_ = o(l.replace(/^\||\|$/g, "")), h = e.push("tr_open", "tr", 1), u = 0; u < d; u++) {h = e.push("td_open", "td", 1), f[u] && (h.attrs = [["style", "text-align:" + f[u]]]), h = e.push("inline", "", 0), h.content = _[u] ? _[u].trim() : "", h.children = [], h = e.push("td_close", "td", -1);}h = e.push("tr_close", "tr", -1);}return h = e.push("tbody_close", "tbody", -1), h = e.push("table_close", "table", -1), g[1] = b[1] = p, e.line = p, !0;};}, function (e, t, n) {"use strict";e.exports = function (e) {var t;e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);};}, function (e, t, n) {"use strict";e.exports = function (e) {var t,n,r,o = e.tokens;for (n = 0, r = o.length; n < r; n++) {t = o[n], "inline" === t.type && e.md.inline.parse(t.content, e.md, e.env, t.children);}};}, function (e, t, n) {"use strict";function r(e) {return /^<a[>\s]/i.test(e);}function o(e) {return /^<\/a\s*>/i.test(e);}var i = n(0).arrayReplaceAt;e.exports = function (e) {var t,n,a,s,l,c,u,p,_,d,h,f,m,g,b,v,k,w = e.tokens;if (e.md.options.linkify) for (n = 0, a = w.length; n < a; n++) {if ("inline" === w[n].type && e.md.linkify.pretest(w[n].content)) for (s = w[n].children, m = 0, t = s.length - 1; t >= 0; t--) {if (c = s[t], "link_close" !== c.type) {if ("html_inline" === c.type && (r(c.content) && m > 0 && m--, o(c.content) && m++), !(m > 0) && "text" === c.type && e.md.linkify.test(c.content)) {for (_ = c.content, k = e.md.linkify.match(_), u = [], f = c.level, h = 0, p = 0; p < k.length; p++) {g = k[p].url, b = e.md.normalizeLink(g), e.md.validateLink(b) && (v = k[p].text, v = k[p].schema ? "mailto:" !== k[p].schema || /^mailto:/i.test(v) ? e.md.normalizeLinkText(v) : e.md.normalizeLinkText("mailto:" + v).replace(/^mailto:/, "") : e.md.normalizeLinkText("http://" + v).replace(/^http:\/\//, ""), d = k[p].index, d > h && (l = new e.Token("text", "", 0), l.content = _.slice(h, d), l.level = f, u.push(l)), l = new e.Token("link_open", "a", 1), l.attrs = [["href", b]], l.level = f++, l.markup = "linkify", l.info = "auto", u.push(l), l = new e.Token("text", "", 0), l.content = v, l.level = f, u.push(l), l = new e.Token("link_close", "a", -1), l.level = --f, l.markup = "linkify", l.info = "auto", u.push(l), h = k[p].lastIndex);}h < _.length && (l = new e.Token("text", "", 0), l.content = _.slice(h), l.level = f, u.push(l)), w[n].children = s = i(s, t, u);}} else for (t--; s[t].level !== c.level && "link_open" !== s[t].type;) {t--;}}}};}, function (e, t, n) {"use strict";var r = /\r[\n\u0085]?|[\u2424\u2028\u0085]/g,o = /\u0000/g;e.exports = function (e) {var t;t = e.src.replace(r, "\n"), t = t.replace(o, "�"), e.src = t;};}, function (e, t, n) {"use strict";function r(e, t) {return c[t.toLowerCase()];}function o(e) {var t,n,o = 0;for (t = e.length - 1; t >= 0; t--) {n = e[t], "text" !== n.type || o || (n.content = n.content.replace(l, r)), "link_open" === n.type && "auto" === n.info && o--, "link_close" === n.type && "auto" === n.info && o++;}}function i(e) {var t,n,r = 0;for (t = e.length - 1; t >= 0; t--) {n = e[t], "text" !== n.type || r || a.test(n.content) && (n.content = n.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---([^-]|$)/gm, "$1—$2").replace(/(^|\s)--(\s|$)/gm, "$1–$2").replace(/(^|[^-\s])--([^-\s]|$)/gm, "$1–$2")), "link_open" === n.type && "auto" === n.info && r--, "link_close" === n.type && "auto" === n.info && r++;}}var a = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/,s = /\((c|tm|r|p)\)/i,l = /\((c|tm|r|p)\)/gi,c = { c: "©", r: "®", p: "§", tm: "™" };e.exports = function (e) {var t;if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) {"inline" === e.tokens[t].type && (s.test(e.tokens[t].content) && o(e.tokens[t].children), a.test(e.tokens[t].content) && i(e.tokens[t].children));}};}, function (e, t, n) {"use strict";function r(e, t, n) {return e.substr(0, t) + n + e.substr(t + 1);}function o(e, t) {var n, o, l, p, _, d, h, f, m, g, b, v, k, w, x, y, C, E, D, T, A;for (D = [], n = 0; n < e.length; n++) {for (o = e[n], h = e[n].level, C = D.length - 1; C >= 0 && !(D[C].level <= h); C--) {;}if (D.length = C + 1, "text" === o.type) {l = o.content, _ = 0, d = l.length;e: for (; _ < d && (c.lastIndex = _, p = c.exec(l));) {if (x = y = !0, _ = p.index + 1, E = "'" === p[0], m = 32, p.index - 1 >= 0) m = l.charCodeAt(p.index - 1);else for (C = n - 1; C >= 0 && "softbreak" !== e[C].type && "hardbreak" !== e[C].type; C--) {if ("text" === e[C].type) {m = e[C].content.charCodeAt(e[C].content.length - 1);break;}}if (g = 32, _ < d) g = l.charCodeAt(_);else for (C = n + 1; C < e.length && "softbreak" !== e[C].type && "hardbreak" !== e[C].type; C++) {if ("text" === e[C].type) {g = e[C].content.charCodeAt(0);break;}}if (b = s(m) || a(String.fromCharCode(m)), v = s(g) || a(String.fromCharCode(g)), k = i(m), w = i(g), w ? x = !1 : v && (k || b || (x = !1)), k ? y = !1 : b && (w || v || (y = !1)), 34 === g && '"' === p[0] && m >= 48 && m <= 57 && (y = x = !1), x && y && (x = !1, y = v), x || y) {if (y) for (C = D.length - 1; C >= 0 && (f = D[C], !(D[C].level < h)); C--) {if (f.single === E && D[C].level === h) {f = D[C], E ? (T = t.md.options.quotes[2], A = t.md.options.quotes[3]) : (T = t.md.options.quotes[0], A = t.md.options.quotes[1]), o.content = r(o.content, p.index, A), e[f.token].content = r(e[f.token].content, f.pos, T), _ += A.length - 1, f.token === n && (_ += T.length - 1), l = o.content, d = l.length, D.length = C;continue e;}}x ? D.push({ token: n, pos: p.index, single: E, level: h }) : y && E && (o.content = r(o.content, p.index, u));} else E && (o.content = r(o.content, p.index, u));}}}}var i = n(0).isWhiteSpace,a = n(0).isPunctChar,s = n(0).isMdAsciiPunct,l = /['"]/,c = /['"]/g,u = "’";e.exports = function (e) {var t;if (e.md.options.typographer) for (t = e.tokens.length - 1; t >= 0; t--) {"inline" === e.tokens[t].type && l.test(e.tokens[t].content) && o(e.tokens[t].children, e);}};}, function (e, t, n) {"use strict";function r(e, t, n) {this.src = e, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = t;}var o = n(32);r.prototype.Token = o, e.exports = r;}, function (e, t, n) {"use strict";var r = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/,o = /^<([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)>/;e.exports = function (e, t) {var n,i,a,s,l,c,u = e.pos;return 60 === e.src.charCodeAt(u) && (n = e.src.slice(u), !(n.indexOf(">") < 0) && (o.test(n) ? (i = n.match(o), s = i[0].slice(1, -1), l = e.md.normalizeLink(s), !!e.md.validateLink(l) && (t || (c = e.push("link_open", "a", 1), c.attrs = [["href", l]], c.markup = "autolink", c.info = "auto", c = e.push("text", "", 0), c.content = e.md.normalizeLinkText(s), c = e.push("link_close", "a", -1), c.markup = "autolink", c.info = "auto"), e.pos += i[0].length, !0)) : !!r.test(n) && (a = n.match(r), s = a[0].slice(1, -1), l = e.md.normalizeLink("mailto:" + s), !!e.md.validateLink(l) && (t || (c = e.push("link_open", "a", 1), c.attrs = [["href", l]], c.markup = "autolink", c.info = "auto", c = e.push("text", "", 0), c.content = e.md.normalizeLinkText(s), c = e.push("link_close", "a", -1), c.markup = "autolink", c.info = "auto"), e.pos += a[0].length, !0))));};}, function (e, t, n) {"use strict";e.exports = function (e, t) {var n,r,o,i,a,s,l = e.pos;if (96 !== e.src.charCodeAt(l)) return !1;for (n = l, l++, r = e.posMax; l < r && 96 === e.src.charCodeAt(l);) {l++;}for (o = e.src.slice(n, l), i = a = l; -1 !== (i = e.src.indexOf("`", a));) {for (a = i + 1; a < r && 96 === e.src.charCodeAt(a);) {a++;}if (a - i === o.length) return t || (s = e.push("code_inline", "code", 0), s.markup = o, s.content = e.src.slice(l, i).replace(/[ \n]+/g, " ").trim()), e.pos = a, !0;}return t || (e.pending += o), e.pos += o.length, !0;};}, function (e, t, n) {"use strict";e.exports = function (e) {var t,n,r,o,i = e.delimiters,a = e.delimiters.length;for (t = 0; t < a; t++) {if (r = i[t], r.close) for (n = t - r.jump - 1; n >= 0;) {if (o = i[n], o.open && o.marker === r.marker && o.end < 0 && o.level === r.level) {var s = (o.close || r.open) && void 0 !== o.length && void 0 !== r.length && (o.length + r.length) % 3 == 0;if (!s) {r.jump = t - n, r.open = !1, o.end = t, o.jump = 0;break;}}n -= o.jump + 1;}}};}, function (e, t, n) {"use strict";var r = n(48),o = n(0).has,i = n(0).isValidEntityCode,a = n(0).fromCodePoint,s = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i,l = /^&([a-z][a-z0-9]{1,31});/i;e.exports = function (e, t) {var n,c,u = e.pos,p = e.posMax;if (38 !== e.src.charCodeAt(u)) return !1;if (u + 1 < p) if (35 === e.src.charCodeAt(u + 1)) {if (c = e.src.slice(u).match(s)) return t || (n = "x" === c[1][0].toLowerCase() ? parseInt(c[1].slice(1), 16) : parseInt(c[1], 10), e.pending += a(i(n) ? n : 65533)), e.pos += c[0].length, !0;} else if ((c = e.src.slice(u).match(l)) && o(r, c[1])) return t || (e.pending += r[c[1]]), e.pos += c[0].length, !0;return t || (e.pending += "&"), e.pos++, !0;};}, function (e, t, n) {"use strict";for (var r = n(0).isSpace, o = [], i = 0; i < 256; i++) {o.push(0);}"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function (e) {o[e.charCodeAt(0)] = 1;}), e.exports = function (e, t) {var n,i = e.pos,a = e.posMax;if (92 !== e.src.charCodeAt(i)) return !1;if (++i < a) {if ((n = e.src.charCodeAt(i)) < 256 && 0 !== o[n]) return t || (e.pending += e.src[i]), e.pos += 2, !0;if (10 === n) {for (t || e.push("hardbreak", "br", 0), i++; i < a && (n = e.src.charCodeAt(i), r(n));) {i++;}return e.pos = i, !0;}}return t || (e.pending += "\\"), e.pos++, !0;};}, function (e, t, n) {"use strict";function r(e) {var t = 32 | e;return t >= 97 && t <= 122;}var o = n(49).HTML_TAG_RE;e.exports = function (e, t) {var n,i,a,s,l = e.pos;return !!e.md.options.html && (a = e.posMax, !(60 !== e.src.charCodeAt(l) || l + 2 >= a) && !(33 !== (n = e.src.charCodeAt(l + 1)) && 63 !== n && 47 !== n && !r(n)) && !!(i = e.src.slice(l).match(o)) && (t || (s = e.push("html_inline", "", 0), s.content = e.src.slice(l, l + i[0].length)), e.pos += i[0].length, !0));};}, function (e, t, n) {"use strict";var r = n(0).normalizeReference,o = n(0).isSpace;e.exports = function (e, t) {var n,i,a,s,l,c,u,p,_,d,h,f,m,g = "",b = e.pos,v = e.posMax;if (33 !== e.src.charCodeAt(e.pos)) return !1;if (91 !== e.src.charCodeAt(e.pos + 1)) return !1;if (c = e.pos + 2, (l = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1)) < 0) return !1;if ((u = l + 1) < v && 40 === e.src.charCodeAt(u)) {for (u++; u < v && (i = e.src.charCodeAt(u), o(i) || 10 === i); u++) {;}if (u >= v) return !1;for (m = u, _ = e.md.helpers.parseLinkDestination(e.src, u, e.posMax), _.ok && (g = e.md.normalizeLink(_.str), e.md.validateLink(g) ? u = _.pos : g = ""), m = u; u < v && (i = e.src.charCodeAt(u), o(i) || 10 === i); u++) {;}if (_ = e.md.helpers.parseLinkTitle(e.src, u, e.posMax), u < v && m !== u && _.ok) for (d = _.str, u = _.pos; u < v && (i = e.src.charCodeAt(u), o(i) || 10 === i); u++) {;} else d = "";if (u >= v || 41 !== e.src.charCodeAt(u)) return e.pos = b, !1;u++;} else {if (void 0 === e.env.references) return !1;if (u < v && 91 === e.src.charCodeAt(u) ? (m = u + 1, u = e.md.helpers.parseLinkLabel(e, u), u >= 0 ? s = e.src.slice(m, u++) : u = l + 1) : u = l + 1, s || (s = e.src.slice(c, l)), !(p = e.env.references[r(s)])) return e.pos = b, !1;g = p.href, d = p.title;}return t || (a = e.src.slice(c, l), e.md.inline.parse(a, e.md, e.env, f = []), h = e.push("image", "img", 0), h.attrs = n = [["src", g], ["alt", ""]], h.children = f, h.content = a, d && n.push(["title", d])), e.pos = u, e.posMax = v, !0;};}, function (e, t, n) {"use strict";var r = n(0).normalizeReference,o = n(0).isSpace;e.exports = function (e, t) {var n,i,a,s,l,c,u,p,_,d,h = "",f = e.pos,m = e.posMax,g = e.pos,b = !0;if (91 !== e.src.charCodeAt(e.pos)) return !1;if (l = e.pos + 1, (s = e.md.helpers.parseLinkLabel(e, e.pos, !0)) < 0) return !1;if ((c = s + 1) < m && 40 === e.src.charCodeAt(c)) {for (b = !1, c++; c < m && (i = e.src.charCodeAt(c), o(i) || 10 === i); c++) {;}if (c >= m) return !1;for (g = c, u = e.md.helpers.parseLinkDestination(e.src, c, e.posMax), u.ok && (h = e.md.normalizeLink(u.str), e.md.validateLink(h) ? c = u.pos : h = ""), g = c; c < m && (i = e.src.charCodeAt(c), o(i) || 10 === i); c++) {;}if (u = e.md.helpers.parseLinkTitle(e.src, c, e.posMax), c < m && g !== c && u.ok) for (_ = u.str, c = u.pos; c < m && (i = e.src.charCodeAt(c), o(i) || 10 === i); c++) {;} else _ = "";(c >= m || 41 !== e.src.charCodeAt(c)) && (b = !0), c++;}if (b) {if (void 0 === e.env.references) return !1;if (c < m && 91 === e.src.charCodeAt(c) ? (g = c + 1, c = e.md.helpers.parseLinkLabel(e, c), c >= 0 ? a = e.src.slice(g, c++) : c = s + 1) : c = s + 1, a || (a = e.src.slice(l, s)), !(p = e.env.references[r(a)])) return e.pos = f, !1;h = p.href, _ = p.title;}return t || (e.pos = l, e.posMax = s, d = e.push("link_open", "a", 1), d.attrs = n = [["href", h]], _ && n.push(["title", _]), e.md.inline.tokenize(e), d = e.push("link_close", "a", -1)), e.pos = c, e.posMax = m, !0;};}, function (e, t, n) {"use strict";var r = n(0).isSpace;e.exports = function (e, t) {var n,o,i = e.pos;if (10 !== e.src.charCodeAt(i)) return !1;for (n = e.pending.length - 1, o = e.posMax, t || (n >= 0 && 32 === e.pending.charCodeAt(n) ? n >= 1 && 32 === e.pending.charCodeAt(n - 1) ? (e.pending = e.pending.replace(/ +$/, ""), e.push("hardbreak", "br", 0)) : (e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0)) : e.push("softbreak", "br", 0)), i++; i < o && r(e.src.charCodeAt(i));) {i++;}return e.pos = i, !0;};}, function (e, t, n) {"use strict";function r(e, t, n, r) {this.src = e, this.env = n, this.md = t, this.tokens = r, this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [];}var o = n(32),i = n(0).isWhiteSpace,a = n(0).isPunctChar,s = n(0).isMdAsciiPunct;r.prototype.pushPending = function () {var e = new o("text", "", 0);return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;}, r.prototype.push = function (e, t, n) {this.pending && this.pushPending();var r = new o(e, t, n);return n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.pendingLevel = this.level, this.tokens.push(r), r;}, r.prototype.scanDelims = function (e, t) {var n,r,o,l,c,u,p,_,d,h = e,f = !0,m = !0,g = this.posMax,b = this.src.charCodeAt(e);for (n = e > 0 ? this.src.charCodeAt(e - 1) : 32; h < g && this.src.charCodeAt(h) === b;) {h++;}return o = h - e, r = h < g ? this.src.charCodeAt(h) : 32, p = s(n) || a(String.fromCharCode(n)), d = s(r) || a(String.fromCharCode(r)), u = i(n), _ = i(r), _ ? f = !1 : d && (u || p || (f = !1)), u ? m = !1 : p && (_ || d || (m = !1)), t ? (l = f, c = m) : (l = f && (!m || p), c = m && (!f || d)), { can_open: l, can_close: c, length: o };}, r.prototype.Token = o, e.exports = r;}, function (e, t, n) {"use strict";function r(e) {switch (e) {case 10:case 33:case 35:case 36:case 37:case 38:case 42:case 43:case 45:case 58:case 60:case 61:case 62:case 64:case 91:case 92:case 93:case 94:case 95:case 96:case 123:case 125:case 126:return !0;default:return !1;}}e.exports = function (e, t) {for (var n = e.pos; n < e.posMax && !r(e.src.charCodeAt(n));) {n++;}return n !== e.pos && (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);};}, function (e, t, n) {"use strict";e.exports = function (e) {var t,n,r = 0,o = e.tokens,i = e.tokens.length;for (t = n = 0; t < i; t++) {r += o[t].nesting, o[t].level = r, "text" === o[t].type && t + 1 < i && "text" === o[t + 1].type ? o[t + 1].content = o[t].content + o[t + 1].content : (t !== n && (o[n] = o[t]), n++);}t !== n && (o.length = n);};}, function (e, t, n) {"use strict";function r(e) {var t,n,r = i[e];if (r) return r;for (r = i[e] = [], t = 0; t < 128; t++) {n = String.fromCharCode(t), r.push(n);}for (t = 0; t < e.length; t++) {n = e.charCodeAt(t), r[n] = "%" + ("0" + n.toString(16).toUpperCase()).slice(-2);}return r;}function o(e, t) {var n;return "string" != typeof t && (t = o.defaultChars), n = r(t), e.replace(/(%[a-f0-9]{2})+/gi, function (e) {var t,r,o,i,a,s,l,c = "";for (t = 0, r = e.length; t < r; t += 3) {o = parseInt(e.slice(t + 1, t + 3), 16), o < 128 ? c += n[o] : 192 == (224 & o) && t + 3 < r && 128 == (192 & (i = parseInt(e.slice(t + 4, t + 6), 16))) ? (l = o << 6 & 1984 | 63 & i, c += l < 128 ? "��" : String.fromCharCode(l), t += 3) : 224 == (240 & o) && t + 6 < r && (i = parseInt(e.slice(t + 4, t + 6), 16), a = parseInt(e.slice(t + 7, t + 9), 16), 128 == (192 & i) && 128 == (192 & a)) ? (l = o << 12 & 61440 | i << 6 & 4032 | 63 & a, c += l < 2048 || l >= 55296 && l <= 57343 ? "���" : String.fromCharCode(l), t += 6) : 240 == (248 & o) && t + 9 < r && (i = parseInt(e.slice(t + 4, t + 6), 16), a = parseInt(e.slice(t + 7, t + 9), 16), s = parseInt(e.slice(t + 10, t + 12), 16), 128 == (192 & i) && 128 == (192 & a) && 128 == (192 & s)) ? (l = o << 18 & 1835008 | i << 12 & 258048 | a << 6 & 4032 | 63 & s, l < 65536 || l > 1114111 ? c += "����" : (l -= 65536, c += String.fromCharCode(55296 + (l >> 10), 56320 + (1023 & l))), t += 9) : c += "�";}return c;});}var i = {};o.defaultChars = ";/?:@&=+$,#", o.componentChars = "", e.exports = o;}, function (e, t, n) {"use strict";function r(e) {var t,n,r = i[e];if (r) return r;for (r = i[e] = [], t = 0; t < 128; t++) {n = String.fromCharCode(t), /^[0-9a-z]$/i.test(n) ? r.push(n) : r.push("%" + ("0" + t.toString(16).toUpperCase()).slice(-2));}for (t = 0; t < e.length; t++) {r[e.charCodeAt(t)] = e[t];}return r;}function o(e, t, n) {var i,a,s,l,c,u = "";for ("string" != typeof t && (n = t, t = o.defaultChars), void 0 === n && (n = !0), c = r(t), i = 0, a = e.length; i < a; i++) {if (s = e.charCodeAt(i), n && 37 === s && i + 2 < a && /^[0-9a-f]{2}$/i.test(e.slice(i + 1, i + 3))) u += e.slice(i, i + 3), i += 2;else if (s < 128) u += c[s];else if (s >= 55296 && s <= 57343) {if (s >= 55296 && s <= 56319 && i + 1 < a && (l = e.charCodeAt(i + 1)) >= 56320 && l <= 57343) {u += encodeURIComponent(e[i] + e[i + 1]), i++;continue;}u += "%EF%BF%BD";} else u += encodeURIComponent(e[i]);}return u;}var i = {};o.defaultChars = ";/?:@&=+$,-_.!~*'()#", o.componentChars = "-_.!~*'()", e.exports = o;}, function (e, t, n) {"use strict";e.exports = function (e) {var t = "";return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && -1 !== e.hostname.indexOf(":") ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "";};}, function (e, t, n) {"use strict";function r() {this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;}function o(e, t) {if (e && e instanceof r) return e;var n = new r();return n.parse(e, t), n;}var i = /^([a-z0-9.+-]+:)/i,a = /:[0-9]*$/,s = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,l = ["<", ">", '"', "`", " ", "\r", "\n", "\t"],c = ["{", "}", "|", "\\", "^", "`"].concat(l),u = ["'"].concat(c),p = ["%", "/", "?", ";", "#"].concat(u),_ = ["/", "?", "#"],d = /^[+a-z0-9A-Z_-]{0,63}$/,h = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,f = { javascript: !0, "javascript:": !0 },m = { http: !0, https: !0, ftp: !0, gopher: !0, file: !0, "http:": !0, "https:": !0, "ftp:": !0, "gopher:": !0, "file:": !0 };r.prototype.parse = function (e, t) {var n,r,o,a,l,c = e;if (c = c.trim(), !t && 1 === e.split("#").length) {var u = s.exec(c);if (u) return this.pathname = u[1], u[2] && (this.search = u[2]), this;}var g = i.exec(c);if (g && (g = g[0], o = g.toLowerCase(), this.protocol = g, c = c.substr(g.length)), (t || g || c.match(/^\/\/[^@\/]+@[^@\/]+/)) && (!(l = "//" === c.substr(0, 2)) || g && f[g] || (c = c.substr(2), this.slashes = !0)), !f[g] && (l || g && !m[g])) {var b = -1;for (n = 0; n < _.length; n++) {-1 !== (a = c.indexOf(_[n])) && (-1 === b || a < b) && (b = a);}var v, k;for (k = -1 === b ? c.lastIndexOf("@") : c.lastIndexOf("@", b), -1 !== k && (v = c.slice(0, k), c = c.slice(k + 1), this.auth = v), b = -1, n = 0; n < p.length; n++) {-1 !== (a = c.indexOf(p[n])) && (-1 === b || a < b) && (b = a);}-1 === b && (b = c.length), ":" === c[b - 1] && b--;var w = c.slice(0, b);c = c.slice(b), this.parseHost(w), this.hostname = this.hostname || "";var x = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];if (!x) {var y = this.hostname.split(/\./);for (n = 0, r = y.length; n < r; n++) {var C = y[n];if (C && !C.match(d)) {for (var E = "", D = 0, T = C.length; D < T; D++) {C.charCodeAt(D) > 127 ? E += "x" : E += C[D];}if (!E.match(d)) {var A = y.slice(0, n),S = y.slice(n + 1),L = C.match(h);L && (A.push(L[1]), S.unshift(L[2])), S.length && (c = S.join(".") + c), this.hostname = A.join(".");break;}}}}this.hostname.length > 255 && (this.hostname = ""), x && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));}var M = c.indexOf("#");-1 !== M && (this.hash = c.substr(M), c = c.slice(0, M));var j = c.indexOf("?");return -1 !== j && (this.search = c.substr(j), c = c.slice(0, j)), c && (this.pathname = c), m[o] && this.hostname && !this.pathname && (this.pathname = ""), this;}, r.prototype.parseHost = function (e) {var t = a.exec(e);t && (t = t[0], ":" !== t && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);}, e.exports = o;}, function (e, t, n) {(function (e, r) {var o;!function (i) {function a(e) {throw new RangeError(j[e]);}function s(e, t) {for (var n = e.length, r = []; n--;) {r[n] = t(e[n]);}return r;}function l(e, t) {var n = e.split("@"),r = "";return n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(M, "."), r + s(e.split("."), t).join(".");}function c(e) {for (var t, n, r = [], o = 0, i = e.length; o < i;) {t = e.charCodeAt(o++), t >= 55296 && t <= 56319 && o < i ? (n = e.charCodeAt(o++), 56320 == (64512 & n) ? r.push(((1023 & t) << 10) + (1023 & n) + 65536) : (r.push(t), o--)) : r.push(t);}return r;}function u(e) {return s(e, function (e) {var t = "";return e > 65535 && (e -= 65536, t += $(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t += $(e);}).join("");}function p(e) {return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : w;}function _(e, t) {return e + 22 + 75 * (e < 26) - ((0 != t) << 5);}function d(e, t, n) {var r = 0;for (e = n ? O(e / E) : e >> 1, e += O(e / t); e > q * y >> 1; r += w) {e = O(e / q);}return O(r + (q + 1) * e / (e + C));}function h(e) {var t,n,r,o,i,s,l,c,_,h,f = [],m = e.length,g = 0,b = T,v = D;for (n = e.lastIndexOf(A), n < 0 && (n = 0), r = 0; r < n; ++r) {e.charCodeAt(r) >= 128 && a("not-basic"), f.push(e.charCodeAt(r));}for (o = n > 0 ? n + 1 : 0; o < m;) {for (i = g, s = 1, l = w; o >= m && a("invalid-input"), c = p(e.charCodeAt(o++)), (c >= w || c > O((k - g) / s)) && a("overflow"), g += c * s, _ = l <= v ? x : l >= v + y ? y : l - v, !(c < _); l += w) {h = w - _, s > O(k / h) && a("overflow"), s *= h;}t = f.length + 1, v = d(g - i, t, 0 == i), O(g / t) > k - b && a("overflow"), b += O(g / t), g %= t, f.splice(g++, 0, b);}return u(f);}function f(e) {var t,n,r,o,i,s,l,u,p,h,f,m,g,b,v,C = [];for (e = c(e), m = e.length, t = T, n = 0, i = D, s = 0; s < m; ++s) {(f = e[s]) < 128 && C.push($(f));}for (r = o = C.length, o && C.push(A); r < m;) {for (l = k, s = 0; s < m; ++s) {(f = e[s]) >= t && f < l && (l = f);}for (g = r + 1, l - t > O((k - n) / g) && a("overflow"), n += (l - t) * g, t = l, s = 0; s < m; ++s) {if (f = e[s], f < t && ++n > k && a("overflow"), f == t) {for (u = n, p = w; h = p <= i ? x : p >= i + y ? y : p - i, !(u < h); p += w) {v = u - h, b = w - h, C.push($(_(h + v % b, 0))), u = O(v / b);}C.push($(_(u, 0))), i = d(n, g, r == o), n = 0, ++r;}}++n, ++t;}return C.join("");}function m(e) {return l(e, function (e) {return S.test(e) ? h(e.slice(4).toLowerCase()) : e;});}function g(e) {return l(e, function (e) {return L.test(e) ? "xn--" + f(e) : e;});}var b = ("object" == typeof t && t && t.nodeType, "object" == typeof e && e && e.nodeType, "object" == typeof r && r);var v,k = 2147483647,w = 36,x = 1,y = 26,C = 38,E = 700,D = 72,T = 128,A = "-",S = /^xn--/,L = /[^\x20-\x7E]/,M = /[\x2E\u3002\uFF0E\uFF61]/g,j = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" },q = w - x,O = Math.floor,$ = String.fromCharCode;v = { version: "1.4.1", ucs2: { decode: c, encode: u }, decode: h, encode: f, toASCII: g, toUnicode: m }, void 0 !== (o = function () {return v;}.call(t, n, t, e)) && (e.exports = o);}();}).call(t, n(199)(e), n(198));}, function (e, t) {e.exports = '@[toc](Catalog)\n\nMarkdown Handbuch\n===\n> Details: [http://commonmark.org/help/](http://commonmark.org/help/)\n\n## **Fett**\n```\n**fett**\n__fett__\n```\n## *Kursiv*\n```\n*kursiv*\n_kursiv_\n```\n## Überschriften\n```\n# h1 #\nh1\n====\n## h2 ##\nh2\n----\n### h3 ###\n#### h4 ####\n##### h5 #####\n###### h6 ######\n```\n## Trennlinien\n```\n***\n---\n```\n****\n## ^Hoch^gestellt & ~Tief~gestellt\n```\nhochgestellt x^2^\ntiefgestellt H~2~0\n```\n## ++Unterstrichen++ & ~~Durchgestrichen~~\n```\n++unterstrichen++\n~~durchgestrichen~~\n```\n## ==Markiert==\n```\n==markiert==\n```\n## Zitat\n\n```\n> zitat 1\n>> zitat 2\n>>> zitat 3\n...\n```\n\n## Liste\n```\nol\n1.\n2.\n3.\n...\n\nul\n-\n-\n...\n```\n\n## Todo Liste\n\n- [x] aufgabe 1\n- [ ] aufgabe 2\n\n```\n- [x] aufgabe 1\n- [ ] aufgabe 2\n```\n\n## Link\n```\nText Link\n[Text](www.baidu.com)\n\nLink mit Bild\n![Text](http://www.image.com)\n```\n## Code\n\\``` Typ\n\nCodeblock\n\n\\```\n\n\\` code \\`\n\n```c++\nint main()\n{\n    printf("hello world!");\n}\n```\n`code`\n\n## Tabelle\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| links | mitte | rechts |\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| links | mitte | rechts |\n| ---------------------- | ------------- | ----------------- |\n## Fußnote\n```\nhallo[^hallo]\n```\n\nSchau zum unteren Rand[^hallo]\n\n[^hallo]: fussnote\n\n## Emojis\nDetails: [https://www.webpagefx.com/tools/emoji-cheat-sheet/](https://www.webpagefx.com/tools/emoji-cheat-sheet/)\n```\n:laughing:\n:blush:\n:smiley:\n:)\n...\n```\n:laughing::blush::smiley::)\n\n## $\\KaTeX$ Mathematik\n\nFormeln lassen sich darstellen z.b. ：$x_i + y_i = z_i$ und $\\sum_{i=1}^n a_i=0$\nFormeln können auf einer eigenen Zeile gerendert werden\n$$\\sum_{i=1}^n a_i=0$$\nDetails: [katex](http://www.intmath.com/cg5/katex-mathjax-comparison.php)和[katex function](https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX)以及[latex](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)\n\n## Layout\n\n::: hljs-left\n`::: hljs-left`\n`links`\n`:::`\n:::\n\n::: hljs-center\n`::: hljs-center`\n`mitte`\n`:::`\n:::\n\n::: hljs-right\n`::: hljs-right`\n`rechts`\n`:::`\n:::\n\n## Liste von Definitionen\n\nTerm 1\n\n:   Definition 1\n\nTerm 2 mit *inline markup*\n\n:   Definition 2\n\n        { ein wenig code, teil von Definition 2 }\n\n    Dritter Absatz von Definition 2.\n\n```\nTerm 1\n\n:   Definition 1\n\nTerm 2 mit *inline markup*\n\n:   Definition 2\n\n        { ein wenig code, teil von Definition 2 }\n\n    Dritter Absatz von Definition 2.\n\n```\n\n## Abkürzungen\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nDie HTML Spezifikation\nwird gepflegt vom W3C.\n```\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nDie HTML Spezifikation\nwird gepflegt vom W3C.\n```\n';}, function (e, t) {e.exports = '@[toc](Catalog)\n\nMarkdown Guide\n===\n> Detailed: [http://commonmark.org/help/](http://commonmark.org/help/)\n\n## **Bold**\n```\n**bold**\n__bold__\n```\n## *Italic*\n```\n*italic*\n_italic_\n```\n## Header\n```\n# h1 #\nh1\n====\n## h2 ##\nh2\n----\n### h3 ###\n#### h4 ####\n##### h5 #####\n###### h6 ######\n```\n## Dividing line\n```\n***\n---\n```\n****\n## ^Super^script & ~Sub~script\n```\nsuper x^2^\nsub H~2~0\n```\n## ++Underline++ & ~~Strikethrough~~\n```\n++underline++\n~~strikethrough~~\n```\n## ==Mark==\n```\n==mark==\n```\n## Quote\n\n```\n> quote 1\n>> quote 2\n>>> quote 3\n...\n```\n\n## List\n```\nol\n1.\n2.\n3.\n...\n\nul\n-\n-\n...\n```\n\n## Todo List\n\n- [x] task 1\n- [ ] task 2\n\n```\n- [x] task 1\n- [ ] task 2\n```\n\n## Link\n```\nText Link\n[Text](www.baidu.com)\n\nImage Link\n![Text](http://www.image.com)\n```\n## Code\n\\``` type\n\ncode block\n\n\\```\n\n\\` code \\`\n\n```c++\nint main()\n{\n    printf("hello world!");\n}\n```\n`code`\n\n## Table\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| left | center | right |\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| left | center | right |\n| ---------------------- | ------------- | ----------------- |\n## Footnote\n```\nhello[^hello]\n```\n\nLook at the bottom[^hello]\n\n[^hello]: footnote\n\n## Emojis\nDetailed: [https://www.webpagefx.com/tools/emoji-cheat-sheet/](https://www.webpagefx.com/tools/emoji-cheat-sheet/)\n```\n:laughing:\n:blush:\n:smiley:\n:)\n...\n```\n:laughing::blush::smiley::)\n\n## $\\KaTeX$ Mathematics\n\nWe can render formulas for example：$x_i + y_i = z_i$ and $\\sum_{i=1}^n a_i=0$\nWe can also single-line rendering\n$$\\sum_{i=1}^n a_i=0$$\nDetailed: [katex](http://www.intmath.com/cg5/katex-mathjax-comparison.php)和[katex function](https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX)以及[latex](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)\n\n## Layout\n\n::: hljs-left\n`::: hljs-left`\n`left`\n`:::`\n:::\n\n::: hljs-center\n`::: hljs-center`\n`center`\n`:::`\n:::\n\n::: hljs-right\n`::: hljs-right`\n`right`\n`:::`\n:::\n\n## deflist\n\nTerm 1\n\n:   Definition 1\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n```\nTerm 1\n\n:   Definition 1\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n```\n\n## abbr\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nThe HTML specification\nis maintained by the W3C.\n```\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nThe HTML specification\nis maintained by the W3C.\n```\n';}, function (e, t) {e.exports = '@[toc](Catalogue)\n\nGuide Markdown\n==============\n> Détail : [http://commonmark.org/help/](http://commonmark.org/help/)\n\n## **Bold**\n```\n**bold**\n__bold__\n```\n## *Italic*\n```\n*italic*\n_italic_\n```\n## Header\n```\n# h1 #\nh1\n====\n## h2 ##\nh2\n----\n### h3 ###\n#### h4 ####\n##### h5 #####\n###### h6 ######\n```\n## Dividing line\n```\n***\n---\n```\n****\n## ^Super^script & ~Sub~script\n```\nsuper x^2^\nsub H~2~0\n```\n## ++Underline++ & ~~Strikethrough~~\n```\n++underline++\n~~strikethrough~~\n```\n## ==Mark==\n```\n==mark==\n```\n## Quote\n\n```\n> quote 1\n>> quote 2\n>>> quote 3\n...\n```\n\n## List\n```\nol\n1.\n2.\n3.\n...\n\nul\n-\n-\n...\n```\n## Link\n\n## Todo List\n\n- [x] Équipe 1\n- [ ] Équipe 2\n\n```\n- [x] Équipe 1\n- [ ] Équipe 2\n```\n\n```\nText Link\n[Text](www.baidu.com)\n\nImage Link\n![Text](http://www.image.com)\n```\n## Code\n\\``` type\n\ncode block\n\n\\```\n\n\\` code \\`\n\n```c++\nint main()\n{\n    printf("hello world!");\n}\n```\n`code`\n\n## Table\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| left | center | right |\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| left | center | right |\n| ---------------------- | ------------- | ----------------- |\n## Footnote\n```\nhello[^hello]\n```\n\nLook at the bottom[^hello]\n\n[^hello]: footnote\n\n## Emojis\nDetailed: [https://www.webpagefx.com/tools/emoji-cheat-sheet/](https://www.webpagefx.com/tools/emoji-cheat-sheet/)\n```\n:laughing:\n:blush:\n:smiley:\n:)\n...\n```\n:laughing::blush::smiley::)\n\n## $\\KaTeX$ Mathematics\n\nWe can render formulas for example：$x_i + y_i = z_i$ and $\\sum_{i=1}^n a_i=0$\nWe can also single-line rendering\n$$\\sum_{i=1}^n a_i=0$$\nDetailed: [katex](http://www.intmath.com/cg5/katex-mathjax-comparison.php)和[katex function](https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX)以及[latex](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)\n\n## Layout\n\n::: hljs-left\n`::: hljs-left`\n`left`\n`:::`\n:::\n\n::: hljs-center\n`::: hljs-center`\n`center`\n`:::`\n:::\n\n::: hljs-right\n`::: hljs-right`\n`right`\n`:::`\n:::\n\n## deflist\n\nTerm 1\n\n:   Definition 1\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n```\nTerm 1\n\n:   Definition 1\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n```\n\n## abbr\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nThe HTML specification\nis maintained by the W3C.\n```\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nThe HTML specification\nis maintained by the W3C.\n```\n';}, function (e, t) {e.exports = '@[toc](目次)\n\nMarkdown 文法ガイド\n===\n> Detailed: [http://commonmark.org/help/](http://commonmark.org/help/)\n\n## **太字**\n```\n**太字**\n__太字__\n```\n## *斜体*\n```\n*斜体*\n_斜体_\n```\n## 見出し\n```\n# h1 #\nh1\n====\n## h2 ##\nh2\n----\n### h3 ###\n#### h4 ####\n##### h5 #####\n###### h6 ######\n```\n## 横線\n```\n***\n---\n```\n****\n## ^上付き^文字 & ~下付き~文字\n```\nsuper x^2^\nsub H~2~0\n```\n## ++下線++ & ~~取り消し線~~\n```\n++underline++\n~~strikethrough~~\n```\n## ==蛍光ペン==\n```\n==mark==\n```\n## 引用\n\n```\n> quote 1\n>> quote 2\n>>> quote 3\n...\n```\n\n## リスト\n```\n番号付きリスト\n1.\n2.\n3.\n...\n\n箇条書きリスト\n-\n-\n...\n```\n\n## Todoリスト\n\n- [x] task 1\n- [ ] task 2\n\n```\n- [x] task 1\n- [ ] task 2\n```\n\n## リンク\n```\nText Link\n[Text](www.baidu.com)\n\nImage Link\n![Text](http://www.image.com)\n```\n## コード\n\\``` type\n\ncode block\n\n\\```\n\n\\` code \\`\n\n```c++\nint main()\n{\n    printf("hello world!");\n}\n```\n`code`\n\n## 表\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| left | center | right |\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| left | center | right |\n| ---------------------- | ------------- | ----------------- |\n\n## 脚注\n```\nhello[^hello]\n```\n\nLook at the bottom[^hello]\n\n[^hello]: footnote\n\n## 絵文字\n> Detailed: [https://www.webpagefx.com/tools/emoji-cheat-sheet/](https://www.webpagefx.com/tools/emoji-cheat-sheet/)\n```\n:laughing:\n:blush:\n:smiley:\n:)\n...\n```\n:laughing::blush::smiley::)\n\n## $\\KaTeX$ 数式\n> Detailed: [KaTeXマニュアル](http://www.intmath.com/cg5/katex-mathjax-comparison.php)、[KaTeX function](https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX)、[LaTeXマニュアル](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)\n\nWe can render formulas for example：$x_i + y_i = z_i$ and $\\sum_{i=1}^n a_i=0$  \nWe can also single-line rendering\n$$\\sum_{i=1}^n a_i=0$$\n\n## レイアウト\n\n::: hljs-left\n`::: hljs-left`\n`left`\n`:::`\n:::\n\n::: hljs-center\n`::: hljs-center`\n`center`\n`:::`\n:::\n\n::: hljs-right\n`::: hljs-right`\n`right`\n`:::`\n:::\n\n## 定義リスト\n\nTerm 1\n\n:   Definition 1\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n```\nTerm 1\n\n:   Definition 1\n\nTerm 2 with *inline markup*\n\n:   Definition 2\n\n        { some code, part of Definition 2 }\n\n    Third paragraph of definition 2.\n\n```\n\n## abbr\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nThe HTML specification\nis maintained by the W3C.\n```\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nThe HTML specification\nis maintained by the W3C.\n```\n';}, function (e, t) {e.exports = '@[toc](Directory)\n\nGuia Markdown\n===\n> Detalhes: [http://commonmark.org/help/](http://commonmark.org/help/)\n\n## **Negrito**\n```\n**negrito**\n__negrito__\n```\n## *Itálico*\n```\n*itálico*\n_itálico_\n```\n## Cabeçalho\n```\n# h1 #\nh1\n====\n## h2 ##\nh2\n----\n### h3 ###\n#### h4 ####\n##### h5 #####\n###### h6 ######\n```\n## Linha Divisora\n```\n***\n---\n```\n****\n## ^Sobre^scrito & ~Sub~scrito\n```\nsobre x^2^\nsub H~2~0\n```\n## ++Sublinhar++ & ~~Tachar~~\n```\n++sublinhar++\n~~tachar~~\n```\n## ==Marcador==\n```\n==marcador==\n```\n## Citação\n\n```\n> citação 1\n>> citação 2\n>>> citação 3\n...\n```\n\n## Listas\n```\nlista Numerada\n1.\n2.\n3.\n...\n\nlista com marcadores\n-\n-\n...\n```\n\n## Todo Listas\n\n- [x] Tarefa 1\n- [ ] Tarefa 2\n\n```\n- [x] Tarefa 1\n- [ ] Tarefa 2\n```\n\n## Link\n```\nLink Texto\n[Text](www.baidu.com)\n\nLink Imagem\n![Text](http://www.image.com)\n```\n## Código\n\\``` tipo\n\nbloco de código\n\n\\```\n\n\\` código \\`\n\n```c++\nint main()\n{\n    printf("hello world!");\n}\n```\n`code`\n\n## Tabela\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| esquerda | centro | direita |\n```\n| th1 | th2 | th3 |\n| :--  | :--: | ----: |\n| esquerda | centro | direita |\n| ---------------------- | ------------- | ----------------- |\n## Rodapé\n```\nolá[^olá]\n```\n\nOlhe para baixo[^olá]\n\n[^olá]: rodapé\n\n## Emojis\nDetalhes: [https://www.webpagefx.com/tools/emoji-cheat-sheet/](https://www.webpagefx.com/tools/emoji-cheat-sheet/)\n```\n:laughing:\n:blush:\n:smiley:\n:)\n...\n```\n:laughing::blush::smiley::)\n\n## $\\KaTeX$ Mathematics\n\nPodemos mostrar fórmulas por exemplo：$x_i + y_i = z_i$ and $\\sum_{i=1}^n a_i=0$\nPodemos também mostrar em uma única linha:\n$$\\sum_{i=1}^n a_i=0$$\nDetalhes: [katex](http://www.intmath.com/cg5/katex-mathjax-comparison.php)和[katex function](https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX)以及[latex](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)\n\n## Layout\n\n::: hljs-left\n`::: hljs-left`\n`esquerda`\n`:::`\n:::\n\n::: hljs-center\n`::: hljs-center`\n`centro`\n`:::`\n:::\n\n::: hljs-right\n`::: hljs-right`\n`direita`\n`:::`\n:::\n\n## Definições\n\nTermo 1\n\n:   Definição 1\n\nTermo 2 com *markup inline*\n\n:   Definição 2\n\n        { um pouco de código, parte da Definição 2 }\n\n    Terceiro parágrafo da definição 2.\n\n```\nTermo 1\n\n:   Definição 1\n\nTermo 2 com *markup inline*\n\n:   Definição 2\n\n        { um pouco de código, parte da Definição 2 }\n\n    Terceiro parágrafo da definição 2.\n\n```\n\n## Abreviações\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nA especificação HTML\né mantida pela W3C.\n```\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nThe HTML specification\né mantida pela W3C.\n```\n';}, function (e, t) {e.exports = '@[toc](Catalog)  \n  \nMarkdown помощь  \n===  \n> Подробнее: [http://commonmark.org/help/](http://commonmark.org/help/)  \n  \n## **Полужирный**  \n```  \n**Полужирный**  \n__Полужирный__  \n```  \n## *Курсив*  \n```  \n*Курсив*  \n_Курсив_  \n```  \n## Заголовок  \n```  \n# h1 #  \nh1  \n====  \n## h2 ##  \nh2  \n----  \n### h3 ###  \n#### h4 ####  \n##### h5 #####  \n###### h6 ######  \n```  \n## Разделительная линия  \n```  \n***  \n---  \n```  \n****  \n## ^Верхний^индекс & ~Нижний~индекс  \n```  \nверхний x^2^  \nнижний H~2~0  \n```  \n## ++Подчеркнутый++ & ~~Зачеркнутый~~  \n```  \n++Подчеркнутый++  \n~~Зачеркнутый~~  \n```  \n## ==Отметка==  \n```  \n==Отметка==  \n```  \n## Цитата  \n  \n```  \n> Цитата  \n>> Цитата 2  \n>>> Цитата 3  \n...  \n```  \n  \n## Список  \n```  \nol  \n1.  \n2.  \n3.  \n...  \n  \nul  \n-  \n-  \n...  \n```  \n  \n## Список задач  \n  \n- [x] Задача 1  \n- [ ] Задача 2  \n  \n```  \n- [x] Задача 1  \n- [ ] Задача 2  \n```  \n  \n## Ссылка  \n```  \nСсылка  \n[Текст](www.baidu.com)  \n  \nСсылка изображения  \n![Текст](http://www.image.com)  \n```  \n## Код  \n\\``` type  \n  \ncode block  \n  \n\\```  \n  \n\\` code \\`  \n  \n```c++  \nint main()  \n{  \n printf("hello world!");}  \n```  \n`code`  \n  \n## Таблица  \n```  \n| th1 | th2 | th3 |  \n| :--  | :--: | ----: |  \n| left | center | right |  \n```  \n| th1 | th2 | th3 |  \n| :--  | :--: | ----: |  \n| left | center | right |  \n| ---------------------- | ------------- | ----------------- |  \n## Сноска  \n```  \nПривет[^Привет]  \n```  \n  \nТут что-то непонятное[^Привет]  \n  \n[^Привет]: А тут объяснение  \n  \n## Emojis  \nПодробнее: [https://www.webpagefx.com/tools/emoji-cheat-sheet/](https://www.webpagefx.com/tools/emoji-cheat-sheet/)  \n```  \n:laughing:  \n:blush:  \n:smiley:  \n:)  \n...  \n```  \n:laughing::blush::smiley::)  \n  \n## $\\KaTeX$ Mathematics  \n  \nМожно выводить такие формулы：$x_i + y_i = z_i$ and $\\sum_{i=1}^n a_i=0$  \nА также в одну строку:\n$$\\sum_{i=1}^n a_i=0$$  \nПодробнее: \n- [katex](http://www.intmath.com/cg5/katex-mathjax-comparison.php)\n- [katex function](https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX)\n- [latex](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)  \n  \n## Разметка\n  \n::: hljs-left  \n`::: hljs-left`  \n`left`  \n`:::`  \n:::  \n  \n::: hljs-center  \n`::: hljs-center`  \n`center`  \n`:::`  \n:::  \n  \n::: hljs-right  \n`::: hljs-right`  \n`right`  \n`:::`  \n:::  \n  \n## Список определений\n  \nТермин 1  \n  \n:   Определение 1  \n  \nТермин  2 с использованием *разметки*\n  \n:   Определение 2  \n  \n { Какой-нибудь код, часть определения 2 }  \n Третий параграф определения 2.  \n```  \nТермин 1  \n  \n:   Определение 1  \n  \nТермин  2 с использованием *разметки*\n  \n:   Определение 2  \n  \n { Какой-нибудь код, часть определения 2 }  \n Третий параграф определения 2.  \n```  \n  \n## Сокращения\n*[HTML]: Hyper Text Markup Language  \n*[W3C]:  World Wide Web Consortium  \nThe HTML specification  \nis maintained by the W3C.  \n```  \n*[HTML]: Hyper Text Markup Language  \n*[W3C]:  World Wide Web Consortium  \nThe HTML specification  \nis maintained by the W3C.  \n```\n';}, function (e, t) {e.exports = '@[toc](目录)\n\nMarkdown 语法简介\n=============\n> [语法详解](http://commonmark.org/help/)\n\n## **粗体**\n```\n**粗体**\n__粗体__\n```\n## *斜体*\n```\n*斜体*\n_斜体_\n```\n## 标题\n```\n# 一级标题 #\n一级标题\n====\n## 二级标题 ##\n二级标题\n----\n### 三级标题 ###\n#### 四级标题 ####\n##### 五级标题 #####\n###### 六级标题 ######\n```\n## 分割线\n```\n***\n---\n```\n****\n## ^上^角~下~标\n```\n上角标 x^2^\n下角标 H~2~0\n```\n## ++下划线++ ~~中划线~~\n```\n++下划线++\n~~中划线~~\n```\n## ==标记==\n```\n==标记==\n```\n## 段落引用\n```\n> 一级\n>> 二级\n>>> 三级\n...\n```\n\n## 列表\n```\n有序列表\n1.\n2.\n3.\n...\n无序列表\n-\n-\n...\n```\n\n## 任务列表\n\n- [x] 已完成任务\n- [ ] 未完成任务\n\n```\n- [x] 已完成任务\n- [ ] 未完成任务\n```\n\n## 链接\n```\n[链接](www.baidu.com)\n![图片描述](http://www.image.com)\n```\n## 代码段落\n\\``` type\n\n代码段落\n\n\\```\n\n\\` 代码块 \\`\n\n```c++\nint main()\n{\n    printf("hello world!");\n}\n```\n`code`\n## 表格(table)\n```\n| 标题1 | 标题2 | 标题3 |\n| :--  | :--: | ----: |\n| 左对齐 | 居中 | 右对齐 |\n| ---------------------- | ------------- | ----------------- |\n```\n| 标题1 | 标题2 | 标题3 |\n| :--  | :--: | ----: |\n| 左对齐 | 居中 | 右对齐 |\n| ---------------------- | ------------- | ----------------- |\n## 脚注(footnote)\n```\nhello[^hello]\n```\n\n见底部脚注[^hello]\n\n[^hello]: 一个注脚\n\n## 表情(emoji)\n[参考网站: https://www.webpagefx.com/tools/emoji-cheat-sheet/](https://www.webpagefx.com/tools/emoji-cheat-sheet/)\n```\n:laughing:\n:blush:\n:smiley:\n:)\n...\n```\n:laughing::blush::smiley::)\n\n## $\\KaTeX$公式\n\n我们可以渲染公式例如：$x_i + y_i = z_i$和$\\sum_{i=1}^n a_i=0$\n我们也可以单行渲染\n$$\\sum_{i=1}^n a_i=0$$\n具体可参照[katex文档](http://www.intmath.com/cg5/katex-mathjax-comparison.php)和[katex支持的函数](https://github.com/Khan/KaTeX/wiki/Function-Support-in-KaTeX)以及[latex文档](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)\n\n## 布局\n\n::: hljs-left\n`::: hljs-left`\n`居左`\n`:::`\n:::\n\n::: hljs-center\n`::: hljs-center`\n`居中`\n`:::`\n:::\n\n::: hljs-right\n`::: hljs-right`\n`居右`\n`:::`\n:::\n\n## 定义\n\n术语一\n\n:   定义一\n\n包含有*行内标记*的术语二\n\n:   定义二\n\n        {一些定义二的文字或代码}\n\n    定义二的第三段\n\n```\n术语一\n\n:   定义一\n\n包含有*行内标记*的术语二\n\n:   定义二\n\n        {一些定义二的文字或代码}\n\n    定义二的第三段\n\n```\n\n## abbr\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nHTML 规范由 W3C 维护\n```\n*[HTML]: Hyper Text Markup Language\n*[W3C]:  World Wide Web Consortium\nHTML 规范由 W3C 维护\n```\n\n';}, function (e, t) {e.exports = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804\uDCBD|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;}, function (e, t, n) {"use strict";t.Any = n(55), t.Cc = n(53), t.Cf = n(186), t.P = n(33), t.Z = n(54);}, function (e, t, n) {function r(e) {o || n(193);}var o = !1,i = n(16)(n(58), n(190), r, null, null);i.options.__file = "C:\\Users\\LWK\\Desktop\\mavonEditor-master\\mavonEditor-master\\node_modules\\auto-textarea\\auto-textarea.vue", i.esModule && Object.keys(i.esModule).some(function (e) {return "default" !== e && "__" !== e.substr(0, 2);}) && console.error("named exports are not supported in *.vue files."), i.options.functional && console.error("[vue-loader] auto-textarea.vue: functional components are not supported with templates, they should use render functions."), e.exports = i.exports;}, function (e, t, n) {e.exports = { render: function render() {var e = this,t = e.$createElement,n = e._self._c || t;return n("div", { staticClass: "v-right-item" }, [e._t("right-toolbar-before"), e._v(" "), e.toolbars.navigation ? n("button", { directives: [{ name: "show", rawName: "v-show", value: !e.s_navigation, expression: "!s_navigation" }], staticClass: "op-icon fa fa-mavon-bars", attrs: { type: "button", "aria-hidden": "true", title: e.d_words.tl_navigation_on + " (F8)" }, on: { click: function click(t) {e.$clicks("navigation");} } }) : e._e(), e._v(" "), e.toolbars.navigation ? n("button", { directives: [{ name: "show", rawName: "v-show", value: e.s_navigation, expression: "s_navigation" }], staticClass: "op-icon fa fa-mavon-bars selected", attrs: { type: "button", "aria-hidden": "true", title: e.d_words.tl_navigation_off + " (F8)" }, on: { click: function click(t) {e.$clicks("navigation");} } }) : e._e(), e._v(" "), e.toolbars.preview ? n("button", { directives: [{ name: "show", rawName: "v-show", value: e.s_preview_switch, expression: "s_preview_switch" }], staticClass: "op-icon fa fa-mavon-eye-slash selected", attrs: { type: "button", "aria-hidden": "true", title: e.d_words.tl_edit + " (F9)" }, on: { click: function click(t) {e.$clicks("preview");} } }) : e._e(), e._v(" "), e.toolbars.preview ? n("button", { directives: [{ name: "show", rawName: "v-show", value: !e.s_preview_switch, expression: "!s_preview_switch" }], staticClass: "op-icon fa fa-mavon-eye", attrs: { type: "button", "aria-hidden": "true", title: e.d_words.tl_preview + " (F9)" }, on: { click: function click(t) {e.$clicks("preview");} } }) : e._e(), e._v(" "), e.toolbars.fullscreen ? n("button", { directives: [{ name: "show", rawName: "v-show", value: !e.s_fullScreen, expression: "!s_fullScreen" }], staticClass: "op-icon fa fa-mavon-arrows-alt", attrs: { type: "button", title: e.d_words.tl_fullscreen_on + " (F10)", "aria-hidden": "true" }, on: { click: function click(t) {e.$clicks("fullscreen");} } }) : e._e(), e._v(" "), e.toolbars.fullscreen ? n("button", { directives: [{ name: "show", rawName: "v-show", value: e.s_fullScreen, expression: "s_fullScreen" }], staticClass: "op-icon fa fa-mavon-compress selected", attrs: { type: "button", title: e.d_words.tl_fullscreen_off + " (F10)", "aria-hidden": "true" }, on: { click: function click(t) {e.$clicks("fullscreen");} } }) : e._e(), e._v(" "), e.toolbars.readmodel ? n("button", { staticClass: "op-icon fa fa-mavon-window-maximize", attrs: { type: "button", "aria-hidden": "true", title: e.d_words.tl_read + " (F11)" }, on: { click: function click(t) {e.$clicks("read");} } }) : e._e(), e._v(" "), e.toolbars.subfield ? n("button", { staticClass: "op-icon fa fa-mavon-columns", class: { selected: e.s_subfield }, attrs: { type: "button", "aria-hidden": "true", title: (e.s_subfield ? e.d_words.tl_single_column : e.d_words.tl_double_column) + " (F12)" }, on: { click: function click(t) {e.$clicks("subfield");} } }) : e._e(), e._v(" "), e.toolbars.help && e.toolbars.htmlcode && e.toolbars.readmodel && e.toolbars.fullscreen && e.toolbars.subfield && e.toolbars.navigation ? n("span", { staticClass: "op-icon-divider" }) : e._e(), e._v(" "), e.toolbars.htmlcode ? n("button", { directives: [{ name: "show", rawName: "v-show", value: !e.s_html_code, expression: "!s_html_code" }], staticClass: "op-icon fa fa-mavon-code", attrs: { type: "button", title: e.d_words.tl_html_on, "aria-hidden": "true" }, on: { click: function click(t) {e.$clicks("html");} } }) : e._e(), e._v(" "), e.toolbars.htmlcode ? n("button", { directives: [{ name: "show", rawName: "v-show", value: e.s_html_code, expression: "s_html_code" }], staticClass: "op-icon fa fa-mavon-code selected", attrs: { type: "button", title: e.d_words.tl_html_off, "aria-hidden": "true" }, on: { click: function click(t) {e.$clicks("html");} } }) : e._e(), e._v(" "), e.toolbars.help ? n("button", { staticClass: "op-icon fa fa-mavon-question-circle", staticStyle: { "font-size": "17px", padding: "5px 6px 5px 3px" }, attrs: { type: "button", title: e.d_words.tl_help, "aria-hidden": "true" }, on: { click: function click(t) {e.$clicks("help");} } }) : e._e(), e._v(" "), e._t("right-toolbar-after")], 2);}, staticRenderFns: [] }, e.exports.render._withStripped = !0;}, function (e, t, n) {e.exports = { render: function render() {var e = this,t = e.$createElement,n = e._self._c || t;return n("div", { staticClass: "auto-textarea-wrapper", style: { fontSize: e.fontSize, lineHeight: e.lineHeight, height: e.fullHeight ? "100%" : "auto" } }, [n("pre", { staticClass: "auto-textarea-block", style: { fontSize: e.fontSize, lineHeight: e.lineHeight, minHeight: e.fullHeight ? "100%" : "auto" } }, [n("br"), e._v(e._s(e.temp_value) + " ")]), e._v(" "), n("textarea", { directives: [{ name: "model", rawName: "v-model", value: e.temp_value, expression: "temp_value" }], ref: "vTextarea", staticClass: "auto-textarea-input", class: { "no-border": !e.border, "no-resize": !e.resize }, style: { fontSize: e.fontSize, lineHeight: e.lineHeight }, attrs: { autofocus: e.s_autofocus, spellcheck: "false", placeholder: e.placeholder }, domProps: { value: e.temp_value }, on: { keyup: e.change, input: function input(t) {t.target.composing || (e.temp_value = t.target.value);} } })]);}, staticRenderFns: [] }, e.exports.render._withStripped = !0;}, function (e, t, n) {e.exports = { render: function render() {var e = this,t = e.$createElement,n = e._self._c || t;return n("div", { staticClass: "v-left-item" }, [e._t("left-toolbar-before"), e._v(" "), e.toolbars.bold ? n("button", { staticClass: "op-icon fa fa-mavon-bold", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_bold + " (ctrl+b)" }, on: { click: function click(t) {e.$clicks("bold");} } }) : e._e(), e._v(" "), e.toolbars.italic ? n("button", { staticClass: "op-icon fa fa-mavon-italic", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_italic + " (ctrl+i)" }, on: { click: function click(t) {e.$clicks("italic");} } }) : e._e(), e._v(" "), e.toolbars.header ? n("div", { staticClass: "op-icon fa fa-mavon-header dropdown dropdown-wrapper", class: { selected: e.s_header_dropdown_open }, attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_header + " (ctrl+h)" }, on: { mouseleave: e.$mouseleave_header_dropdown, mouseenter: e.$mouseenter_header_dropdown } }, [n("transition", { attrs: { name: "fade" } }, [n("div", { directives: [{ name: "show", rawName: "v-show", value: e.s_header_dropdown_open, expression: "s_header_dropdown_open" }], staticClass: "op-header popup-dropdown", class: { transition: e.transition }, on: { mouseenter: e.$mouseenter_header_dropdown, mouseleave: e.$mouseleave_header_dropdown } }, [n("div", { staticClass: "dropdown-item", attrs: { title: "#" }, on: { click: function click(t) {t.stopPropagation(), e.$click_header("header1");} } }, [n("span", [e._v(e._s(e.d_words.tl_header_one))])]), e._v(" "), n("div", { staticClass: "dropdown-item", attrs: { title: "## " }, on: { click: function click(t) {t.stopPropagation(), e.$click_header("header2");} } }, [n("span", [e._v(e._s(e.d_words.tl_header_two))])]), e._v(" "), n("div", { staticClass: "dropdown-item", attrs: { title: "### " }, on: { click: function click(t) {t.stopPropagation(), e.$click_header("header3");} } }, [n("span", [e._v(e._s(e.d_words.tl_header_three))])]), e._v(" "), n("div", { staticClass: "dropdown-item", attrs: { title: "#### " }, on: { click: function click(t) {t.stopPropagation(), e.$click_header("header4");} } }, [n("span", [e._v(e._s(e.d_words.tl_header_four))])]), e._v(" "), n("div", { staticClass: "dropdown-item", attrs: { title: "##### " }, on: { click: function click(t) {t.stopPropagation(), e.$click_header("header5");} } }, [n("span", [e._v(e._s(e.d_words.tl_header_five))])]), e._v(" "), n("div", { staticClass: "dropdown-item", attrs: { title: "###### " }, on: { click: function click(t) {t.stopPropagation(), e.$click_header("header6");} } }, [n("span", [e._v(e._s(e.d_words.tl_header_six))])])])])], 1) : e._e(), e._v(" "), e.toolbars.header || e.toolbars.italic || e.toolbars.bold ? n("span", { staticClass: "op-icon-divider" }) : e._e(), e._v(" "), e.toolbars.underline ? n("button", { staticClass: "op-icon fa fa-mavon-underline", attrs: { disabled: !e.editable, type: "button", title: e.d_words.tl_underline + " (ctrl+u)", "aria-hidden": "true" }, on: { click: function click(t) {e.$clicks("underline");} } }) : e._e(), e._v(" "), e.toolbars.strikethrough ? n("button", { staticClass: "op-icon fa fa-mavon-strikethrough", attrs: { disabled: !e.editable, type: "button", title: e.d_words.tl_strikethrough + " (ctrl+shift+d)", "aria-hidden": "true" }, on: { click: function click(t) {e.$clicks("strikethrough");} } }) : e._e(), e._v(" "), e.toolbars.mark ? n("button", { staticClass: "op-icon fa fa-mavon-thumb-tack", attrs: { disabled: !e.editable, type: "button", title: e.d_words.tl_mark + " (ctrl+m)", "aria-hidden": "true" }, on: { click: function click(t) {e.$clicks("mark");} } }) : e._e(), e._v(" "), e.toolbars.superscript ? n("button", { staticClass: "op-icon fa fa-mavon-superscript", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_superscript + " (ctrl+alt+s)" }, on: { click: function click(t) {e.$clicks("superscript");} } }) : e._e(), e._v(" "), e.toolbars.subscript ? n("button", { staticClass: "op-icon fa fa-mavon-subscript", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_subscript + " (ctrl+shift+s)" }, on: { click: function click(t) {e.$clicks("subscript");} } }) : e._e(), e._v(" "), e.toolbars.alignleft ? n("button", { staticClass: "op-icon fa fa-mavon-align-left", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_alignleft + " (ctrl+l)" }, on: { click: function click(t) {e.$clicks("alignleft");} } }) : e._e(), e._v(" "), e.toolbars.aligncenter ? n("button", { staticClass: "op-icon fa fa-mavon-align-center", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_aligncenter + " (ctrl+e)" }, on: { click: function click(t) {e.$clicks("aligncenter");} } }) : e._e(), e._v(" "), e.toolbars.alignright ? n("button", { staticClass: "op-icon fa fa-mavon-align-right", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_alignright + " (ctrl+r)" }, on: { click: function click(t) {e.$clicks("alignright");} } }) : e._e(), e._v(" "), e.toolbars.superscript || e.toolbars.subscript || e.toolbars.underline || e.toolbars.strikethrough || e.toolbars.mark ? n("span", { staticClass: "op-icon-divider" }) : e._e(), e._v(" "), e.toolbars.quote ? n("button", { staticClass: "op-icon fa fa-mavon-quote-left", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_quote + " (ctrl+q)" }, on: { click: function click(t) {e.$clicks("quote");} } }) : e._e(), e._v(" "), e.toolbars.ol ? n("button", { staticClass: "op-icon fa fa-mavon-list-ol", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_ol + " (ctrl+o)" }, on: { click: function click(t) {e.$clicks("ol");} } }) : e._e(), e._v(" "), e.toolbars.ul ? n("button", { staticClass: "op-icon fa fa-mavon-list-ul", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_ul + " (ctrl+alt+u)" }, on: { click: function click(t) {e.$clicks("ul");} } }) : e._e(), e._v(" "), e.toolbars.ul || e.toolbars.ol || e.toolbars.quote ? n("span", { staticClass: "op-icon-divider" }) : e._e(), e._v(" "), e.toolbars.link ? n("button", { staticClass: "op-icon fa fa-mavon-link", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_link + " (ctrl+l)" }, on: { click: function click(t) {t.stopPropagation(), e.$toggle_imgLinkAdd("link");} } }) : e._e(), e._v(" "), e.toolbars.imagelink ? n("div", { staticClass: "op-icon fa fa-mavon-picture-o dropdown dropdown-wrapper", class: { selected: e.s_img_dropdown_open }, attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true" }, on: { mouseleave: e.$mouseleave_img_dropdown, mouseenter: e.$mouseenter_img_dropdown } }, [n("transition", { attrs: { name: "fade" } }, [n("div", { directives: [{ name: "show", rawName: "v-show", value: e.s_img_dropdown_open, expression: "s_img_dropdown_open" }], staticClass: "op-image popup-dropdown", class: { transition: e.transition }, on: { mouseleave: e.$mouseleave_img_dropdown, mouseenter: e.$mouseenter_img_dropdown } }, [n("div", { staticClass: "dropdown-item", on: { click: function click(t) {t.stopPropagation(), e.$toggle_imgLinkAdd("imagelink");} } }, [n("span", [e._v(e._s(e.d_words.tl_image))])]), e._v(" "), n("div", { staticClass: "dropdown-item", staticStyle: { overflow: "hidden" } }, [n("input", { attrs: { type: "file", accept: "image/gif,image/jpeg,image/jpg,image/png,image/svg", multiple: "multiple" }, on: { change: function change(t) {e.$imgAdd(t);} } }), e._v(e._s(e.d_words.tl_upload) + "\n                ")]), e._v(" "), e._l(e.img_file, function (t, r) {return t && t[1] ? n("div", { key: r, staticClass: "dropdown-item dropdown-images", attrs: { title: t[1].name }, on: { click: function click(t) {t.stopPropagation(), e.$imgFileListClick(r);} } }, [n("span", [e._v(e._s(t[1].name))]), e._v(" "), n("button", { staticClass: "op-icon fa fa-mavon-times", attrs: { slot: "right", type: "button", "aria-hidden": "true", title: e.d_words.tl_upload_remove }, on: { click: function click(t) {t.stopPropagation(), e.$imgDel(r);} }, slot: "right" }), e._v(" "), n("img", { staticClass: "image-show", class: { transition: e.transition }, attrs: { src: t[1].miniurl, alt: "none" } })]) : e._e();})], 2)])], 1) : e._e(), e._v(" "), e.toolbars.code ? n("button", { staticClass: "op-icon fa fa-mavon-code", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_code + " (ctrl+alt+c)" }, on: { click: function click(t) {e.$clicks("code");} } }) : e._e(), e._v(" "), e.toolbars.table ? n("button", { staticClass: "op-icon fa fa-mavon-table", attrs: { disabled: !e.editable, type: "button", "aria-hidden": "true", title: e.d_words.tl_table + " (ctrl+alt+t)" }, on: { click: function click(t) {e.$clicks("table");} } }) : e._e(), e._v(" "), e.toolbars.link || e.toolbars.imagelink || e.toolbars.code || e.toolbars.table ? n("span", { staticClass: "op-icon-divider" }) : e._e(), e._v(" "), e.toolbars.undo ? n("button", { staticClass: "op-icon fa fa-mavon-undo", attrs: { type: "button", "aria-hidden": "true", title: e.d_words.tl_undo + " (ctrl+z)" }, on: { click: function click(t) {e.$clicks("undo");} } }) : e._e(), e._v(" "), e.toolbars.redo ? n("button", { staticClass: "op-icon fa fa-mavon-repeat", attrs: { type: "button", "aria-hidden": "true", title: e.d_words.tl_redo + " (ctrl+y)" }, on: { click: function click(t) {e.$clicks("redo");} } }) : e._e(), e._v(" "), e.toolbars.trash ? n("button", { staticClass: "op-icon fa fa-mavon-trash-o", attrs: { type: "button", "aria-hidden": "true", title: e.d_words.tl_trash + " (ctrl+breakspace)" }, on: { click: function click(t) {e.$clicks("trash");} } }) : e._e(), e._v(" "), e.toolbars.save ? n("button", { staticClass: "op-icon fa fa-mavon-floppy-o", attrs: { type: "button", "aria-hidden": "true", title: e.d_words.tl_save + " (ctrl+s)" }, on: { click: function click(t) {e.$clicks("save");} } }) : e._e(), e._v(" "), e._t("left-toolbar-after"), e._v(" "), n("transition", { attrs: { name: "fade" } }, [e.s_img_link_open ? n("div", { staticClass: "add-image-link-wrapper" }, [n("div", { staticClass: "add-image-link" }, [n("i", { staticClass: "fa fa-mavon-times", attrs: { "aria-hidden": "true" }, on: { click: function click(t) {t.stopPropagation(), t.preventDefault(), e.s_img_link_open = !1;} } }), e._v(" "), n("h3", { staticClass: "title" }, [e._v(e._s("link" == e.link_type ? e.d_words.tl_popup_link_title : e.d_words.tl_popup_img_link_title))]), e._v(" "), n("div", { staticClass: "link-text input-wrapper" }, [n("input", { directives: [{ name: "model", rawName: "v-model", value: e.link_text, expression: "link_text" }], ref: "linkTextInput", attrs: { type: "text", placeholder: "link" == e.link_type ? e.d_words.tl_popup_link_text : e.d_words.tl_popup_img_link_text }, domProps: { value: e.link_text }, on: { input: function input(t) {t.target.composing || (e.link_text = t.target.value);} } })]), e._v(" "), n("div", { staticClass: "link-addr input-wrapper" }, [n("input", { directives: [{ name: "model", rawName: "v-model", value: e.link_addr, expression: "link_addr" }], attrs: { type: "text", placeholder: "link" == e.link_type ? e.d_words.tl_popup_link_addr : e.d_words.tl_popup_img_link_addr }, domProps: { value: e.link_addr }, on: { input: function input(t) {t.target.composing || (e.link_addr = t.target.value);} } })]), e._v(" "), n("div", { staticClass: "op-btn cancel", on: { click: function click(t) {t.stopPropagation(), e.s_img_link_open = !1;} } }, [e._v(e._s(e.d_words.tl_popup_link_cancel))]), e._v(" "), n("div", { staticClass: "op-btn sure", on: { click: function click(t) {t.stopPropagation(), e.$imgLinkAdd();} } }, [e._v(e._s(e.d_words.tl_popup_link_sure))])])]) : e._e()])], 2);}, staticRenderFns: [] }, e.exports.render._withStripped = !0;}, function (e, t, n) {e.exports = { render: function render() {var e = this,t = e.$createElement,n = e._self._c || t;return n("div", { staticClass: "v-note-wrapper markdown-body", class: [{ fullscreen: e.s_fullScreen, shadow: e.boxShadow }], style: { "box-shadow": e.boxShadow ? e.boxShadowStyle : "" } }, [n("div", { directives: [{ name: "show", rawName: "v-show", value: e.toolbarsFlag, expression: "toolbarsFlag" }], staticClass: "v-note-op", style: { background: e.toolbarsBackground } }, [n("v-md-toolbar-left", { ref: "toolbar_left", class: { transition: e.transition }, attrs: { editable: e.editable, transition: e.transition, d_words: e.d_words, toolbars: e.toolbars, image_filter: e.imageFilter }, on: { toolbar_left_click: e.toolbar_left_click, toolbar_left_addlink: e.toolbar_left_addlink, imgAdd: e.$imgAdd, imgDel: e.$imgDel, imgTouch: e.$imgTouch } }, [e._t("left-toolbar-before", null, { slot: "left-toolbar-before" }), e._v(" "), e._t("left-toolbar-after", null, { slot: "left-toolbar-after" })], 2), e._v(" "), n("v-md-toolbar-right", { ref: "toolbar_right", class: { transition: e.transition }, attrs: { d_words: e.d_words, toolbars: e.toolbars, s_subfield: e.s_subfield, s_preview_switch: e.s_preview_switch, s_fullScreen: e.s_fullScreen, s_html_code: e.s_html_code, s_navigation: e.s_navigation }, on: { toolbar_right_click: e.toolbar_right_click } }, [e._t("right-toolbar-before", null, { slot: "right-toolbar-before" }), e._v(" "), e._t("right-toolbar-after", null, { slot: "right-toolbar-after" })], 2)], 1), e._v(" "), n("div", { staticClass: "v-note-panel" }, [n("div", { ref: "vNoteEdit", staticClass: "v-note-edit divarea-wrapper", class: { "scroll-style": e.s_scrollStyle, "scroll-style-border-radius": e.s_scrollStyle && !e.s_preview_switch && !e.s_html_code, "single-edit": !e.s_preview_switch && !e.s_html_code, "single-show": !e.s_subfield && e.s_preview_switch || !e.s_subfield && e.s_html_code, transition: e.transition }, on: { scroll: e.$v_edit_scroll, click: e.textAreaFocus } }, [n("div", { staticClass: "content-input-wrapper", style: { "background-color": e.editorBackground } }, [n("v-autoTextarea", { ref: "vNoteTextarea", staticClass: "content-input", style: { "background-color": e.editorBackground }, attrs: { placeholder: e.placeholder ? e.placeholder : e.d_words.start_editor, fontSize: e.fontSize, lineHeight: "1.5", fullHeight: "" }, model: { value: e.d_value, callback: function callback(t) {e.d_value = t;}, expression: "d_value" } })], 1)]), e._v(" "), n("div", { directives: [{ name: "show", rawName: "v-show", value: e.s_preview_switch || e.s_html_code, expression: "s_preview_switch || s_html_code" }], staticClass: "v-note-show", class: { "single-show": !e.s_subfield && e.s_preview_switch || !e.s_subfield && e.s_html_code } }, [n("div", { directives: [{ name: "show", rawName: "v-show", value: !e.s_html_code, expression: "!s_html_code" }], ref: "vShowContent", staticClass: "v-show-content", class: { "scroll-style": e.s_scrollStyle, "scroll-style-border-radius": e.s_scrollStyle }, style: { "background-color": e.previewBackground }, domProps: { innerHTML: e._s(e.d_render) } }), e._v(" "), n("div", { directives: [{ name: "show", rawName: "v-show", value: e.s_html_code, expression: "s_html_code" }], staticClass: "v-show-content-html", class: { "scroll-style": e.s_scrollStyle, "scroll-style-border-radius": e.s_scrollStyle }, style: { "background-color": e.previewBackground } }, [e._v("\n                " + e._s(e.d_render) + "\n            ")])]), e._v(" "), n("transition", { attrs: { name: "slideTop" } }, [n("div", { directives: [{ name: "show", rawName: "v-show", value: e.s_navigation, expression: "s_navigation" }], staticClass: "v-note-navigation-wrapper", class: { transition: e.transition } }, [n("div", { staticClass: "v-note-navigation-title" }, [e._v("\n                    " + e._s(e.d_words.navigation_title)), n("i", { staticClass: "fa fa-mavon-times v-note-navigation-close", attrs: { "aria-hidden": "true" }, on: { click: function click(t) {e.toolbar_right_click("navigation");} } })]), e._v(" "), n("div", { ref: "navigationContent", staticClass: "v-note-navigation-content", class: { "scroll-style": e.s_scrollStyle } })])])], 1), e._v(" "), n("transition", { attrs: { name: "fade" } }, [n("div", { ref: "help" }, [e.s_help ? n("div", { staticClass: "v-note-help-wrapper", on: { click: function click(t) {e.toolbar_right_click("help");} } }, [n("div", { staticClass: "v-note-help-content markdown-body", class: { shadow: e.boxShadow } }, [n("i", { staticClass: "fa fa-mavon-times", attrs: { "aria-hidden": "true" }, on: { click: function click(t) {t.stopPropagation(), t.preventDefault(), e.toolbar_right_click("help");} } }), e._v(" "), n("div", { staticClass: "scroll-style v-note-help-show", domProps: { innerHTML: e._s(e.d_help) } })])]) : e._e()])]), e._v(" "), n("transition", { attrs: { name: "fade" } }, [e.d_preview_imgsrc ? n("div", { staticClass: "v-note-img-wrapper", on: { click: function click(t) {e.d_preview_imgsrc = null;} } }, [n("img", { attrs: { src: e.d_preview_imgsrc, alt: "none" } })]) : e._e()]), e._v(" "), n("div", { ref: "vReadModel", staticClass: "v-note-read-model scroll-style", class: { show: e.s_readmodel } }, [n("div", { ref: "vNoteReadContent", staticClass: "v-note-read-content", domProps: { innerHTML: e._s(e.d_render) } })])], 1);}, staticRenderFns: [] }, e.exports.render._withStripped = !0;}, function (e, t, n) {var r = n(101);"string" == typeof r && (r = [[e.i, r, ""]]), r.locals && (e.exports = r.locals);n(17)("4841649c", r, !1, {});}, function (e, t, n) {var r = n(102);"string" == typeof r && (r = [[e.i, r, ""]]), r.locals && (e.exports = r.locals);n(17)("ef3342b8", r, !1, {});}, function (e, t, n) {var r = n(103);"string" == typeof r && (r = [[e.i, r, ""]]), r.locals && (e.exports = r.locals);n(17)("22e2e43b", r, !1, {});}, function (e, t, n) {var r = n(104);"string" == typeof r && (r = [[e.i, r, ""]]), r.locals && (e.exports = r.locals);n(17)("01e1c3cc", r, !1, {});}, function (e, t) {e.exports = function (e, t) {for (var n = [], r = {}, o = 0; o < t.length; o++) {var i = t[o],a = i[0],s = i[1],l = i[2],c = i[3],u = { id: e + ":" + o, css: s, media: l, sourceMap: c };r[a] ? r[a].parts.push(u) : n.push(r[a] = { id: a, parts: [u] });}return n;};}, function (e, t) {var n;n = function () {return this;}();try {n = n || Function("return this")() || (0, eval)("this");} catch (e) {"object" == typeof window && (n = window);}e.exports = n;}, function (e, t) {e.exports = function (e) {return e.webpackPolyfill || (e.deprecate = function () {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", { enumerable: !0, get: function get() {return e.l;} }), Object.defineProperty(e, "id", { enumerable: !0, get: function get() {return e.i;} }), e.webpackPolyfill = 1), e;};}, function (e, t) {e.exports = { start_editor: "Bearbeitung beginnen...", navigation_title: "Navigation", tl_bold: "Fett", tl_italic: "Kursiv", tl_header: "Überschrift", tl_header_one: "Überschrift 1", tl_header_two: "Überschrift 2", tl_header_three: "Überschrift 3", tl_header_four: "Überschrift 4", tl_header_five: "Überschrift 5", tl_header_six: "Überschrift 6", tl_underline: "Unterstrichen", tl_strikethrough: "Durchgestrichen", tl_mark: "Markiert", tl_superscript: "Hochgestellt", tl_subscript: "Tiefgestellt", tl_quote: "Zitat", tl_ol: "Ol", tl_ul: "Ul", tl_link: "Link", tl_image: "Link mit Bild", tl_code: "Code", tl_table: "Tabelle", tl_undo: "Rückgängig", tl_redo: "Wiederherstellen", tl_trash: "Mülleimer", tl_save: "Speichern", tl_navigation_on: "Navigation AN", tl_navigation_off: "Navigation AUS", tl_preview: "Vorschau", tl_aligncenter: "Text zentrieren", tl_alignleft: "Nach links ausrichten", tl_alignright: "Nach rechts ausrichten", tl_edit: "Bearbeiten", tl_single_column: "Einspaltig", tl_double_column: "Zweispaltig", tl_fullscreen_on: "Vollbild AN", tl_fullscreen_off: "Vollbild AUS", tl_read: "Lesemodus", tl_html_on: "HTML AN", tl_html_off: "HTML AUS", tl_help: "Markdown Handbuch", tl_upload: "Bilder-Upload", tl_upload_remove: "Entfernen", tl_popup_link_title: "Link hinzufügen", tl_popup_link_text: "Text des Links", tl_popup_link_addr: "Linkziel", tl_popup_img_link_title: "Bild hinzufügen", tl_popup_img_link_text: "Text des Bildes", tl_popup_img_link_addr: "Link auf Bild", tl_popup_link_sure: "Ja", tl_popup_link_cancel: "Abbruch" };}, function (e, t) {e.exports = { start_editor: "Begin editing...", navigation_title: "Navigation", tl_bold: "Bold", tl_italic: "Italic", tl_header: "Header", tl_header_one: "Header 1", tl_header_two: "Header 2", tl_header_three: "Header 3", tl_header_four: "Header 4", tl_header_five: "Header 5", tl_header_six: "Header 6", tl_underline: "Underline", tl_strikethrough: "Strikethrough", tl_mark: "Mark", tl_superscript: "Superscript", tl_subscript: "Subscript", tl_quote: "Quote", tl_ol: "Ol", tl_ul: "Ul", tl_link: "Link", tl_image: "Image Link", tl_code: "Code", tl_table: "Table", tl_undo: "Undo", tl_redo: "Redo", tl_trash: "Trash", tl_save: "Save", tl_navigation_on: "Navigation ON", tl_navigation_off: "Navigation OFF", tl_preview: "Preview", tl_aligncenter: "Center text", tl_alignleft: "Clamp text to the left", tl_alignright: "Clamp text to the right", tl_edit: "Edit", tl_single_column: "Single Column", tl_double_column: "Double Columns", tl_fullscreen_on: "FullScreen ON", tl_fullscreen_off: "FullScreen OFF", tl_read: "Read Model", tl_html_on: "HTML ON", tl_html_off: "HTML OFF", tl_help: "Markdown Guide", tl_upload: "Upload Images", tl_upload_remove: "Remove", tl_popup_link_title: "Add Link", tl_popup_link_text: "Link text", tl_popup_link_addr: "Link address", tl_popup_img_link_title: "Add Image", tl_popup_img_link_text: "Image Text", tl_popup_img_link_addr: "Image Link", tl_popup_link_sure: "Sure", tl_popup_link_cancel: "Cancel" };}, function (e, t) {e.exports = { start_editor: "Début d'édition...", navigation_title: "Navigation", tl_bold: "Gras", tl_italic: "Italique", tl_header: "Entête", tl_header_one: "Entête 1", tl_header_two: "Entête 2", tl_header_three: "Entête 3", tl_header_four: "Entête 4", tl_header_five: "Entête 5", tl_header_six: "Entête 6", tl_underline: "Souligné", tl_strikethrough: "Barré", tl_mark: "Mark", tl_superscript: "Exposant", tl_subscript: "Sous-exposant", tl_quote: "Quote", tl_ol: "Liste ", tl_ul: "Puce", tl_link: "Lien", tl_image: "Image Lien", tl_code: "Code", tl_table: "Table", tl_undo: "Annuler", tl_redo: "Refaire", tl_trash: "Supprimer", tl_save: "Sauver", tl_navigation_on: "Activer la navigation", tl_navigation_off: "Désactiver le navigation", tl_preview: "Previsualisé", tl_aligncenter: "Center le texte", tl_alignleft: "Férer le texte à gauche", tl_alignright: "Férer le texte à droite", tl_edit: "Editer", tl_single_column: "Seule Colonne", tl_double_column: "Colonnes Doubles", tl_fullscreen_on: "Activer le mode plein écran", tl_fullscreen_off: "Désactiver le mode plein écran", tl_read: "Lire le modèle", tl_html_on: "Activer le mode HTML", tl_html_off: "Désactiver le mode HTML", tl_help: "Guide Markdown", tl_upload: "Télécharger les images", tl_upload_remove: "Supprimer", tl_popup_link_title: "Ajouter un lien", tl_popup_link_text: "Description", tl_popup_link_addr: "Link", tl_popup_img_link_title: "Ajouter une image", tl_popup_img_link_text: "Description", tl_popup_img_link_addr: "Link", tl_popup_link_sure: "sûr", tl_popup_link_cancel: "Annuler" };}, function (e, t) {e.exports = { start_editor: "編集を始めてね！", navigation_title: "ナビゲーション", tl_bold: "太字", tl_italic: "斜体", tl_header: "見出し", tl_header_one: "見出し1", tl_header_two: "見出し2", tl_header_three: "見出し3", tl_header_four: "見出し4", tl_header_five: "見出し5", tl_header_six: "見出し6", tl_underline: "下線", tl_strikethrough: "取り消し線", tl_mark: "蛍光ペン", tl_superscript: "上付き文字", tl_subscript: "下付き文字", tl_quote: "引用", tl_ol: "番号付きリスト", tl_ul: "箇条書きリスト", tl_link: "ハイパーリンク", tl_image: "画像のリンク", tl_code: "コードの挿入", tl_table: "表の挿入", tl_undo: "戻る", tl_redo: "進む", tl_trash: "削除", tl_save: "保存", tl_navigation_on: "ナビゲーションを表示", tl_navigation_off: "ナビゲーションを非表示", tl_preview: "プレビュー", tl_aligncenter: "中央揃え", tl_alignleft: "左揃え", tl_alignright: "右揃え", tl_edit: "編集", tl_single_column: "一列", tl_double_column: "二列", tl_fullscreen_on: "全画面表示", tl_fullscreen_off: "全画面表示の終了", tl_read: "モデルの読み込み", tl_html_on: "HTMLで表示", tl_html_off: "HTML表示の終了", tl_help: "ヘルプ", tl_upload: "画像をアップロード", tl_upload_remove: "画像の削除", tl_popup_link_title: "リンクの追加", tl_popup_link_text: "リンクテキスト", tl_popup_link_addr: "リンク先のURL", tl_popup_img_link_title: "画像の追加", tl_popup_img_link_text: "画像タイトル", tl_popup_img_link_addr: "画像URL", tl_popup_link_sure: "OK", tl_popup_link_cancel: "戻る" };}, function (e, t) {e.exports = { start_editor: "Começar edição...", navigation_title: "Navegação", tl_bold: "Negrito", tl_italic: "Itálico", tl_header: "Cabeçalho", tl_header_one: "Cabeçalho 1", tl_header_two: "Cabeçalho 2", tl_header_three: "Cabeçalho 3", tl_header_four: "Cabeçalho 4", tl_header_five: "Cabeçalho 5", tl_header_six: "Cabeçalho 6", tl_underline: "Sublinhar", tl_strikethrough: "Tachar", tl_mark: "Marcação", tl_superscript: "Sobrescrito", tl_subscript: "Subscrito", tl_quote: "Citação", tl_ol: "Lista Numerada", tl_ul: "Lista com marcadores", tl_link: "Link", tl_image: "Link de imagem", tl_code: "Código", tl_table: "Tabela", tl_undo: "Desfazer", tl_redo: "Refazer", tl_trash: "Lixo", tl_save: "Salvar", tl_navigation_on: "Mostrar Navegação", tl_navigation_off: "Esconder Navegação", tl_preview: "Preview", tl_aligncenter: "Alinhar no centro", tl_alignleft: "Alinhar à esquerda", tl_alignright: "Alinhar à direita", tl_edit: "Editar", tl_single_column: "Coluna Única", tl_double_column: "Duas Colunas", tl_fullscreen_on: "Ligar Tela Cheia", tl_fullscreen_off: "Desligar Tela Cheia", tl_read: "Modo de Leitura", tl_html_on: "Ligar HTML", tl_html_off: "Desligar HTML", tl_help: "Guia Markdown", tl_upload: "Upload de Imagens", tl_upload_remove: "Remover", tl_popup_link_title: "Adicionar Link", tl_popup_link_text: "Descrição", tl_popup_link_addr: "Link", tl_popup_img_link_title: "Adicionar fotos", tl_popup_img_link_text: "Descrição", tl_popup_img_link_addr: "Link", tl_popup_link_sure: "Confirmar", tl_popup_link_cancel: "Cancelar" };}, function (e, t) {e.exports = { start_editor: "Начните редактирование...", navigation_title: "Навигация", tl_bold: "Полужирный", tl_italic: "Курсив", tl_header: "Заголовки", tl_header_one: "Заголовок 1", tl_header_two: "Заголовок 2", tl_header_three: "Заголовок 3", tl_header_four: "Заголовок 4", tl_header_five: "Заголовок 5", tl_header_six: "Заголовок 6", tl_underline: "Подчеркнутый", tl_strikethrough: "Зачеркнутый", tl_mark: "Отметка", tl_superscript: "Верхний индекс", tl_subscript: "Нижний индекс", tl_quote: "Цитата", tl_ol: "Нумерованный список", tl_ul: "Список", tl_link: "Ссылка", tl_image: "Ссылка изображения", tl_code: "Код", tl_table: "Таблица", tl_undo: "Отменить", tl_redo: "Вернуть", tl_trash: "Удалить", tl_save: "Сохранить", tl_navigation_on: "Показать навигацию", tl_navigation_off: "Скрыть навигацию", tl_preview: "Предпросмотр", tl_aligncenter: "Выровнять по центру", tl_alignleft: "Выровнять по левому краю", tl_alignright: "Выровнять по правому краю", tl_edit: "Редактор", tl_single_column: "Одно поле", tl_double_column: "Два поля", tl_fullscreen_on: "Полноэкранный режим", tl_fullscreen_off: "Выключить полноэкранный режим", tl_read: "Режим чтения", tl_html_on: "Показать HTML", tl_html_off: "Убрать HTML", tl_help: "Markdown помощь", tl_upload: "Загрузить изображение", tl_upload_remove: "Удалить", tl_popup_link_title: "Добавить ссылку", tl_popup_link_text: "Текст ссылки", tl_popup_link_addr: "Адрес ссылки", tl_popup_img_link_title: "Локальное изображение", tl_popup_img_link_text: "Текст изображения", tl_popup_img_link_addr: "Ссылка изображения", tl_popup_link_sure: "Добавить", tl_popup_link_cancel: "Отменить" };}, function (e, t) {e.exports = { start_editor: "开始编辑...", navigation_title: "导航目录", tl_bold: "粗体", tl_italic: "斜体", tl_header: "标题", tl_header_one: "一级标题", tl_header_two: "二级标题", tl_header_three: "三级标题", tl_header_four: "四级标题", tl_header_five: "五级标题", tl_header_six: "六级标题", tl_underline: "下划线", tl_strikethrough: "中划线", tl_mark: "标记", tl_superscript: "上角标", tl_subscript: "下角标", tl_quote: "段落引用", tl_ol: "有序列表", tl_ul: "无序列表", tl_link: "链接", tl_image: "添加图片链接", tl_code: "代码块", tl_table: "表格", tl_undo: "上一步", tl_redo: "下一步", tl_trash: "清空", tl_save: "保存", tl_navigation_on: "开启标题导航", tl_navigation_off: "关闭标题导航", tl_preview: "预览", tl_aligncenter: "居中", tl_alignleft: "居左", tl_alignright: "居右", tl_edit: "编辑", tl_single_column: "单栏", tl_double_column: "双栏", tl_fullscreen_on: "全屏编辑", tl_fullscreen_off: "退出全屏", tl_read: "沉浸式阅读", tl_html_on: "查看html文本", tl_html_off: "返回markdown文本", tl_help: "markdown语法帮助", tl_upload: "上传图片", tl_upload_remove: "删除", tl_popup_link_title: "添加链接", tl_popup_link_text: "链接描述", tl_popup_link_addr: "链接地址", tl_popup_img_link_title: "添加图片", tl_popup_img_link_text: "图片描述", tl_popup_img_link_addr: "图片链接", tl_popup_link_sure: "确定", tl_popup_link_cancel: "取消" };}]);});

/***/ }),
/* 24 */
/*!******************************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_mavon-editor@2.7.7@mavon-editor/dist/css/index.css ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),
/* 32 */
/*!***************************************************************************!*\
  !*** ./node_modules/vue-property-decorator/lib/vue-property-decorator.js ***!
  \***************************************************************************/
/*! exports provided: Component, Vue, Mixins, Inject, Provide, Model, Prop, Watch, Emit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Inject", function() { return Inject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Provide", function() { return Provide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Model", function() { return Model; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Prop", function() { return Prop; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Watch", function() { return Watch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Emit", function() { return Emit; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ 2);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Vue", function() { return vue__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var vue_class_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-class-component */ 33);
/* harmony import */ var vue_class_component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue_class_component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return vue_class_component__WEBPACK_IMPORTED_MODULE_1___default.a; });
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Mixins", function() { return vue_class_component__WEBPACK_IMPORTED_MODULE_1__["mixins"]; });

/** vue-property-decorator verson 7.2.0 MIT LICENSE copyright 2018 kaorun343 */




/**
 * decorator of an inject
 * @param from key
 * @return PropertyDecorator
 */
function Inject(options) {
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, key) {
        if (typeof componentOptions.inject === 'undefined') {
            componentOptions.inject = {};
        }
        if (!Array.isArray(componentOptions.inject)) {
            componentOptions.inject[key] = options || key;
        }
    });
}
/**
 * decorator of a provide
 * @param key key
 * @return PropertyDecorator | void
 */
function Provide(key) {
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
        var provide = componentOptions.provide;
        if (typeof provide !== 'function' || !provide.managed) {
            var original_1 = componentOptions.provide;
            provide = componentOptions.provide = function () {
                var rv = Object.create((typeof original_1 === 'function' ? original_1.call(this) : original_1) || null);
                for (var i in provide.managed)
                    rv[provide.managed[i]] = this[i];
                return rv;
            };
            provide.managed = {};
        }
        provide.managed[k] = key || k;
    });
}
/**
 * decorator of model
 * @param  event event name
 * @param options options
 * @return PropertyDecorator
 */
function Model(event, options) {
    if (options === void 0) { options = {}; }
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
        (componentOptions.props || (componentOptions.props = {}))[k] = options;
        componentOptions.model = { prop: k, event: event || k };
    });
}
/**
 * decorator of a prop
 * @param  options the options for the prop
 * @return PropertyDecorator | void
 */
function Prop(options) {
    if (options === void 0) { options = {}; }
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, k) {
        (componentOptions.props || (componentOptions.props = {}))[k] = options;
    });
}
/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
function Watch(path, options) {
    if (options === void 0) { options = {}; }
    var _a = options.deep, deep = _a === void 0 ? false : _a, _b = options.immediate, immediate = _b === void 0 ? false : _b;
    return Object(vue_class_component__WEBPACK_IMPORTED_MODULE_1__["createDecorator"])(function (componentOptions, handler) {
        if (typeof componentOptions.watch !== 'object') {
            componentOptions.watch = Object.create(null);
        }
        componentOptions.watch[path] = { handler: handler, deep: deep, immediate: immediate };
    });
}
// Code copied from Vue/src/shared/util.js
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = function (str) { return str.replace(hyphenateRE, '-$1').toLowerCase(); };
/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
function Emit(event) {
    return function (_target, key, descriptor) {
        key = hyphenate(key);
        var original = descriptor.value;
        descriptor.value = function emitter() {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var emit = function (returnValue) {
                if (returnValue !== undefined)
                    args.unshift(returnValue);
                _this.$emit.apply(_this, [event || key].concat(args));
            };
            var returnValue = original.apply(this, args);
            if (isPromise(returnValue)) {
                returnValue.then(function (returnValue) {
                    emit(returnValue);
                });
            }
            else {
                emit(returnValue);
            }
        };
    };
}
function isPromise(obj) {
    return obj instanceof Promise || (obj && typeof obj.then === 'function');
}


/***/ }),
/* 33 */
/*!*****************************************************************************!*\
  !*** ./node_modules/vue-class-component/dist/vue-class-component.common.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
  * vue-class-component v6.3.2
  * (c) 2015-present Evan You
  * @license MIT
  */


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(__webpack_require__(/*! vue */ 2));

var reflectionIsSupported = typeof Reflect !== 'undefined' && Reflect.defineMetadata;
function copyReflectionMetadata(to, from) {
    forwardMetadata(to, from);
    Object.getOwnPropertyNames(from.prototype).forEach(function (key) {
        forwardMetadata(to.prototype, from.prototype, key);
    });
    Object.getOwnPropertyNames(from).forEach(function (key) {
        forwardMetadata(to, from, key);
    });
}
function forwardMetadata(to, from, propertyKey) {
    var metaKeys = propertyKey
        ? Reflect.getOwnMetadataKeys(from, propertyKey)
        : Reflect.getOwnMetadataKeys(from);
    metaKeys.forEach(function (metaKey) {
        var metadata = propertyKey
            ? Reflect.getOwnMetadata(metaKey, from, propertyKey)
            : Reflect.getOwnMetadata(metaKey, from);
        if (propertyKey) {
            Reflect.defineMetadata(metaKey, metadata, to, propertyKey);
        }
        else {
            Reflect.defineMetadata(metaKey, metadata, to);
        }
    });
}

var fakeArray = { __proto__: [] };
var hasProto = fakeArray instanceof Array;
function createDecorator(factory) {
    return function (target, key, index) {
        var Ctor = typeof target === 'function'
            ? target
            : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        if (typeof index !== 'number') {
            index = undefined;
        }
        Ctor.__decorators__.push(function (options) { return factory(options, key, index); });
    };
}
function mixins() {
    var Ctors = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Ctors[_i] = arguments[_i];
    }
    return Vue.extend({ mixins: Ctors });
}
function isPrimitive(value) {
    var type = typeof value;
    return value == null || (type !== 'object' && type !== 'function');
}
function warn(message) {
    if (typeof console !== 'undefined') {
        console.warn('[vue-class-component] ' + message);
    }
}

function collectDataFromConstructor(vm, Component) {
    // override _init to prevent to init as Vue instance
    var originalInit = Component.prototype._init;
    Component.prototype._init = function () {
        var _this = this;
        // proxy to actual vm
        var keys = Object.getOwnPropertyNames(vm);
        // 2.2.0 compat (props are no longer exposed as self properties)
        if (vm.$options.props) {
            for (var key in vm.$options.props) {
                if (!vm.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }
        }
        keys.forEach(function (key) {
            if (key.charAt(0) !== '_') {
                Object.defineProperty(_this, key, {
                    get: function () { return vm[key]; },
                    set: function (value) { vm[key] = value; },
                    configurable: true
                });
            }
        });
    };
    // should be acquired class property values
    var data = new Component();
    // restore original _init to avoid memory leak (#209)
    Component.prototype._init = originalInit;
    // create plain data object
    var plainData = {};
    Object.keys(data).forEach(function (key) {
        if (data[key] !== undefined) {
            plainData[key] = data[key];
        }
    });
    if (true) {
        if (!(Component.prototype instanceof Vue) && Object.keys(plainData).length > 0) {
            warn('Component class must inherit Vue or its descendant class ' +
                'when class property is used.');
        }
    }
    return plainData;
}

var $internalHooks = [
    'data',
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeDestroy',
    'destroyed',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'render',
    'errorCaptured' // 2.5
];
function componentFactory(Component, options) {
    if (options === void 0) { options = {}; }
    options.name = options.name || Component._componentTag || Component.name;
    // prototype props.
    var proto = Component.prototype;
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        if (key === 'constructor') {
            return;
        }
        // hooks
        if ($internalHooks.indexOf(key) > -1) {
            options[key] = proto[key];
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor.value !== void 0) {
            // methods
            if (typeof descriptor.value === 'function') {
                (options.methods || (options.methods = {}))[key] = descriptor.value;
            }
            else {
                // typescript decorated data
                (options.mixins || (options.mixins = [])).push({
                    data: function () {
                        var _a;
                        return _a = {}, _a[key] = descriptor.value, _a;
                    }
                });
            }
        }
        else if (descriptor.get || descriptor.set) {
            // computed properties
            (options.computed || (options.computed = {}))[key] = {
                get: descriptor.get,
                set: descriptor.set
            };
        }
    });
    (options.mixins || (options.mixins = [])).push({
        data: function () {
            return collectDataFromConstructor(this, Component);
        }
    });
    // decorate options
    var decorators = Component.__decorators__;
    if (decorators) {
        decorators.forEach(function (fn) { return fn(options); });
        delete Component.__decorators__;
    }
    // find super
    var superProto = Object.getPrototypeOf(Component.prototype);
    var Super = superProto instanceof Vue
        ? superProto.constructor
        : Vue;
    var Extended = Super.extend(options);
    forwardStaticMembers(Extended, Component, Super);
    if (reflectionIsSupported) {
        copyReflectionMetadata(Extended, Component);
    }
    return Extended;
}
var reservedPropertyNames = [
    // Unique id
    'cid',
    // Super Vue constructor
    'super',
    // Component options that will be used by the component
    'options',
    'superOptions',
    'extendOptions',
    'sealedOptions',
    // Private assets
    'component',
    'directive',
    'filter'
];
function forwardStaticMembers(Extended, Original, Super) {
    // We have to use getOwnPropertyNames since Babel registers methods as non-enumerable
    Object.getOwnPropertyNames(Original).forEach(function (key) {
        // `prototype` should not be overwritten
        if (key === 'prototype') {
            return;
        }
        // Some browsers does not allow reconfigure built-in properties
        var extendedDescriptor = Object.getOwnPropertyDescriptor(Extended, key);
        if (extendedDescriptor && !extendedDescriptor.configurable) {
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(Original, key);
        // If the user agent does not support `__proto__` or its family (IE <= 10),
        // the sub class properties may be inherited properties from the super class in TypeScript.
        // We need to exclude such properties to prevent to overwrite
        // the component options object which stored on the extended constructor (See #192).
        // If the value is a referenced value (object or function),
        // we can check equality of them and exclude it if they have the same reference.
        // If it is a primitive value, it will be forwarded for safety.
        if (!hasProto) {
            // Only `cid` is explicitly exluded from property forwarding
            // because we cannot detect whether it is a inherited property or not
            // on the no `__proto__` environment even though the property is reserved.
            if (key === 'cid') {
                return;
            }
            var superDescriptor = Object.getOwnPropertyDescriptor(Super, key);
            if (!isPrimitive(descriptor.value) &&
                superDescriptor &&
                superDescriptor.value === descriptor.value) {
                return;
            }
        }
        // Warn if the users manually declare reserved properties
        if ( true &&
            reservedPropertyNames.indexOf(key) >= 0) {
            warn("Static property name '" + key + "' declared on class '" + Original.name + "' " +
                'conflicts with reserved property name of Vue internal. ' +
                'It may cause unexpected behavior of the component. Consider renaming the property.');
        }
        Object.defineProperty(Extended, key, descriptor);
    });
}

function Component(options) {
    if (typeof options === 'function') {
        return componentFactory(options);
    }
    return function (Component) {
        return componentFactory(Component, options);
    };
}
Component.registerHooks = function registerHooks(keys) {
    $internalHooks.push.apply($internalHooks, keys);
};

exports.default = Component;
exports.createDecorator = createDecorator;
exports.mixins = mixins;


/***/ }),
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */
/*!*************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/marked.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var Lexer = __webpack_require__(/*! ./Lexer.js */ 43);
var Parser = __webpack_require__(/*! ./Parser.js */ 47);
var Renderer = __webpack_require__(/*! ./Renderer.js */ 48);
var TextRenderer = __webpack_require__(/*! ./TextRenderer.js */ 51);
var InlineLexer = __webpack_require__(/*! ./InlineLexer.js */ 50);
var Slugger = __webpack_require__(/*! ./Slugger.js */ 49);var _require =




__webpack_require__(/*! ./helpers.js */ 46),merge = _require.merge,checkSanitizeDeprecation = _require.checkSanitizeDeprecation,escape = _require.escape;var _require2 =




__webpack_require__(/*! ./defaults.js */ 44),getDefaults = _require2.getDefaults,changeDefaults = _require2.changeDefaults,defaults = _require2.defaults;

/**
                                                                                                                                       * Marked
                                                                                                                                       */
function marked(src, opt, callback) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null');
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type ' +
    Object.prototype.toString.call(src) + ', string expected');
  }

  if (callback || typeof opt === 'function') {var _ret = function () {
      if (!callback) {
        callback = opt;
        opt = null;
      }

      opt = merge({}, marked.defaults, opt || {});
      checkSanitizeDeprecation(opt);
      var highlight = opt.highlight;
      var tokens,
      pending,
      i = 0;

      try {
        tokens = Lexer.lex(src, opt);
      } catch (e) {
        return { v: callback(e) };
      }

      pending = tokens.length;

      var done = function done(err) {
        if (err) {
          opt.highlight = highlight;
          return callback(err);
        }

        var out;

        try {
          out = Parser.parse(tokens, opt);
        } catch (e) {
          err = e;
        }

        opt.highlight = highlight;

        return err ?
        callback(err) :
        callback(null, out);
      };

      if (!highlight || highlight.length < 3) {
        return { v: done() };
      }

      delete opt.highlight;

      if (!pending) return { v: done() };

      for (; i < tokens.length; i++) {
        (function (token) {
          if (token.type !== 'code') {
            return --pending || done();
          }
          return highlight(token.text, token.lang, function (err, code) {
            if (err) return done(err);
            if (code == null || code === token.text) {
              return --pending || done();
            }
            token.text = code;
            token.escaped = true;
            --pending || done();
          });
        })(tokens[i]);
      }

      return { v: void 0 };}();if (typeof _ret === "object") return _ret.v;
  }
  try {
    opt = merge({}, marked.defaults, opt || {});
    checkSanitizeDeprecation(opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/markedjs/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occurred:</p><pre>' +
      escape(e.message + '', true) +
      '</pre>';
    }
    throw e;
  }
}

/**
   * Options
   */

marked.options =
marked.setOptions = function (opt) {
  merge(marked.defaults, opt);
  changeDefaults(marked.defaults);
  return marked;
};

marked.getDefaults = getDefaults;

marked.defaults = defaults;

/**
                             * Expose
                             */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.Slugger = Slugger;

marked.parse = marked;

module.exports = marked;

/***/ }),
/* 43 */
/*!************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/Lexer.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var _require = __webpack_require__(/*! ./defaults.js */ 44),defaults = _require.defaults;var _require2 =
__webpack_require__(/*! ./rules.js */ 45),block = _require2.block;var _require3 =




__webpack_require__(/*! ./helpers.js */ 46),rtrim = _require3.rtrim,splitCells = _require3.splitCells,escape = _require3.escape;

/**
                                                                                                              * Block Lexer
                                                                                                              */
module.exports = /*#__PURE__*/function () {
  function Lexer(options) {_classCallCheck(this, Lexer);
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options || defaults;
    this.rules = block.normal;

    if (this.options.pedantic) {
      this.rules = block.pedantic;
    } else if (this.options.gfm) {
      this.rules = block.gfm;
    }
  }

  /**
     * Expose Block Rules
     */_createClass(Lexer, [{ key: "lex",












    /**
                                           * Preprocessing
                                           */value: function lex(
    src) {
      src = src.
      replace(/\r\n|\r/g, '\n').
      replace(/\t/g, '    ');

      return this.token(src, true);
    } }, { key: "token",

    /**
                          * Lexing
                          */value: function token(
    src, top) {
      src = src.replace(/^ +$/gm, '');
      var next,
      loose,
      cap,
      bull,
      b,
      item,
      listStart,
      listItems,
      t,
      space,
      i,
      tag,
      l,
      isordered,
      istask,
      ischecked;

      while (src) {
        // newline
        if (cap = this.rules.newline.exec(src)) {
          src = src.substring(cap[0].length);
          if (cap[0].length > 1) {
            this.tokens.push({
              type: 'space' });

          }
        }

        // code
        if (cap = this.rules.code.exec(src)) {
          var lastToken = this.tokens[this.tokens.length - 1];
          src = src.substring(cap[0].length);
          // An indented code block cannot interrupt a paragraph.
          if (lastToken && lastToken.type === 'paragraph') {
            lastToken.text += '\n' + cap[0].trimRight();
          } else {
            cap = cap[0].replace(/^ {4}/gm, '');
            this.tokens.push({
              type: 'code',
              codeBlockStyle: 'indented',
              text: !this.options.pedantic ?
              rtrim(cap, '\n') :
              cap });

          }
          continue;
        }

        // fences
        if (cap = this.rules.fences.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: 'code',
            lang: cap[2] ? cap[2].trim() : cap[2],
            text: cap[3] || '' });

          continue;
        }

        // heading
        if (cap = this.rules.heading.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: 'heading',
            depth: cap[1].length,
            text: cap[2] });

          continue;
        }

        // table no leading pipe (gfm)
        if (cap = this.rules.nptable.exec(src)) {
          item = {
            type: 'table',
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [] };


          if (item.header.length === item.align.length) {
            src = src.substring(cap[0].length);

            for (i = 0; i < item.align.length; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            for (i = 0; i < item.cells.length; i++) {
              item.cells[i] = splitCells(item.cells[i], item.header.length);
            }

            this.tokens.push(item);

            continue;
          }
        }

        // hr
        if (cap = this.rules.hr.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: 'hr' });

          continue;
        }

        // blockquote
        if (cap = this.rules.blockquote.exec(src)) {
          src = src.substring(cap[0].length);

          this.tokens.push({
            type: 'blockquote_start' });


          cap = cap[0].replace(/^ *> ?/gm, '');

          // Pass `top` to keep the current
          // "toplevel" state. This is exactly
          // how markdown.pl works.
          this.token(cap, top);

          this.tokens.push({
            type: 'blockquote_end' });


          continue;
        }

        // list
        if (cap = this.rules.list.exec(src)) {
          src = src.substring(cap[0].length);
          bull = cap[2];
          isordered = bull.length > 1;

          listStart = {
            type: 'list_start',
            ordered: isordered,
            start: isordered ? +bull : '',
            loose: false };


          this.tokens.push(listStart);

          // Get each top-level item.
          cap = cap[0].match(this.rules.item);

          listItems = [];
          next = false;
          l = cap.length;
          i = 0;

          for (; i < l; i++) {
            item = cap[i];

            // Remove the list item's bullet
            // so it is seen as the next token.
            space = item.length;
            item = item.replace(/^ *([*+-]|\d+\.) */, '');

            // Outdent whatever the
            // list item contains. Hacky.
            if (~item.indexOf('\n ')) {
              space -= item.length;
              item = !this.options.pedantic ?
              item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') :
              item.replace(/^ {1,4}/gm, '');
            }

            // Determine whether the next list item belongs here.
            // Backpedal if it does not belong in this list.
            if (i !== l - 1) {
              b = block.bullet.exec(cap[i + 1])[0];
              if (bull.length > 1 ? b.length === 1 :
              b.length > 1 || this.options.smartLists && b !== bull) {
                src = cap.slice(i + 1).join('\n') + src;
                i = l - 1;
              }
            }

            // Determine whether item is loose or not.
            // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
            // for discount behavior.
            loose = next || /\n\n(?!\s*$)/.test(item);
            if (i !== l - 1) {
              next = item.charAt(item.length - 1) === '\n';
              if (!loose) loose = next;
            }

            if (loose) {
              listStart.loose = true;
            }

            // Check for task list items
            istask = /^\[[ xX]\] /.test(item);
            ischecked = undefined;
            if (istask) {
              ischecked = item[1] !== ' ';
              item = item.replace(/^\[[ xX]\] +/, '');
            }

            t = {
              type: 'list_item_start',
              task: istask,
              checked: ischecked,
              loose: loose };


            listItems.push(t);
            this.tokens.push(t);

            // Recurse.
            this.token(item, false);

            this.tokens.push({
              type: 'list_item_end' });

          }

          if (listStart.loose) {
            l = listItems.length;
            i = 0;
            for (; i < l; i++) {
              listItems[i].loose = true;
            }
          }

          this.tokens.push({
            type: 'list_end' });


          continue;
        }

        // html
        if (cap = this.rules.html.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: this.options.sanitize ?
            'paragraph' :
            'html',
            pre: !this.options.sanitizer && (
            cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
            text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0] });

          continue;
        }

        // def
        if (top && (cap = this.rules.def.exec(src))) {
          src = src.substring(cap[0].length);
          if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
          tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
          if (!this.tokens.links[tag]) {
            this.tokens.links[tag] = {
              href: cap[2],
              title: cap[3] };

          }
          continue;
        }

        // table (gfm)
        if (cap = this.rules.table.exec(src)) {
          item = {
            type: 'table',
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [] };


          if (item.header.length === item.align.length) {
            src = src.substring(cap[0].length);

            for (i = 0; i < item.align.length; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right';
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center';
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left';
              } else {
                item.align[i] = null;
              }
            }

            for (i = 0; i < item.cells.length; i++) {
              item.cells[i] = splitCells(
              item.cells[i].replace(/^ *\| *| *\| *$/g, ''),
              item.header.length);
            }

            this.tokens.push(item);

            continue;
          }
        }

        // lheading
        if (cap = this.rules.lheading.exec(src)) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: 'heading',
            depth: cap[2].charAt(0) === '=' ? 1 : 2,
            text: cap[1] });

          continue;
        }

        // top-level paragraph
        if (top && (cap = this.rules.paragraph.exec(src))) {
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: 'paragraph',
            text: cap[1].charAt(cap[1].length - 1) === '\n' ?
            cap[1].slice(0, -1) :
            cap[1] });

          continue;
        }

        // text
        if (cap = this.rules.text.exec(src)) {
          // Top-level should never reach here.
          src = src.substring(cap[0].length);
          this.tokens.push({
            type: 'text',
            text: cap[0] });

          continue;
        }

        if (src) {
          throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
        }
      }

      return this.tokens;
    } }], [{ key: "lex", /**
                          * Static Lex Method
                          */value: function lex(src, options) {var lexer = new Lexer(options);return lexer.lex(src);} }, { key: "rules", get: function get() {return block;} }]);return Lexer;}();

/***/ }),
/* 44 */
/*!***************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/defaults.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function getDefaults() {
  return {
    baseUrl: null,
    breaks: false,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartLists: false,
    smartypants: false,
    xhtml: false };

}

function changeDefaults(newDefaults) {
  module.exports.defaults = newDefaults;
}

module.exports = {
  defaults: getDefaults(),
  getDefaults: getDefaults,
  changeDefaults: changeDefaults };

/***/ }),
/* 45 */
/*!************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/rules.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _require =



__webpack_require__(/*! ./helpers.js */ 46),noopTest = _require.noopTest,edit = _require.edit,merge = _require.merge;

/**
                                                                                                   * Block-Level Grammar
                                                                                                   */
var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: /^ {0,3}(`{3,}|~{3,})([^`~\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
  hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
  heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
  list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: '^ {0,3}(?:' // optional indentation
  + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
  + '|comment[^\\n]*(\\n+|$)' // (2)
  + '|<\\?[\\s\\S]*?\\?>\\n*' // (3)
  + '|<![A-Z][\\s\\S]*?>\\n*' // (4)
  + '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' // (5)
  + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
  + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
  + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
  + ')',
  def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
  nptable: noopTest,
  table: noopTest,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
  text: /^[^\n]+/ };


block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block.def = edit(block.def).
replace('label', block._label).
replace('title', block._title).
getRegex();

block.bullet = /(?:[*+-]|\d{1,9}\.)/;
block.item = /^( *)(bull) ?[^\n]*(?:\n(?!\1bull ?)[^\n]*)*/;
block.item = edit(block.item, 'gm').
replace(/bull/g, block.bullet).
getRegex();

block.list = edit(block.list).
replace(/bull/g, block.bullet).
replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').
replace('def', '\\n+(?=' + block.def.source + ')').
getRegex();

block._tag = 'address|article|aside|base|basefont|blockquote|body|caption' +
'|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' +
'|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' +
'|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' +
'|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' +
'|track|ul';
block._comment = /<!--(?!-?>)[\s\S]*?-->/;
block.html = edit(block.html, 'i').
replace('comment', block._comment).
replace('tag', block._tag).
replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).
getRegex();

block.paragraph = edit(block._paragraph).
replace('hr', block.hr).
replace('heading', ' {0,3}#{1,6} +').
replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
.replace('blockquote', ' {0,3}>').
replace('fences', ' {0,3}(?:`{3,}|~{3,})[^`\\n]*\\n').
replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
.replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').
replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
.getRegex();

block.blockquote = edit(block.blockquote).
replace('paragraph', block.paragraph).
getRegex();

/**
             * Normal Block Grammar
             */

block.normal = merge({}, block);

/**
                                  * GFM Block Grammar
                                  */

block.gfm = merge({}, block.normal, {
  nptable: /^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,
  table: /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/ });


/**
                                                                                      * Pedantic grammar (original John Gruber's loose markdown specification)
                                                                                      */

block.pedantic = merge({}, block.normal, {
  html: edit(
  '^ *(?:comment *(?:\\n|\\s*$)' +
  '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
  + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))').
  replace('comment', block._comment).
  replace(/tag/g, '(?!(?:' +
  'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub' +
  '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)' +
  '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b').
  getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
  fences: noopTest, // fences not supported
  paragraph: edit(block.normal._paragraph).
  replace('hr', block.hr).
  replace('heading', ' *#{1,6} *[^\n]').
  replace('lheading', block.lheading).
  replace('blockquote', ' {0,3}>').
  replace('|fences', '').
  replace('|list', '').
  replace('|html', '').
  getRegex() });


/**
                  * Inline-Level Grammar
                  */
var inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noopTest,
  tag: '^comment' +
  '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
  + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
  + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
  + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
  + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
  em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noopTest,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/ };


// list of punctuation marks from common mark spec
// without ` and ] to workaround Rule 17 (inline code blocks/links)
inline._punctuation = '!"#$%&\'()*+,\\-./:;<=>?@\\[^_{|}~';
inline.em = edit(inline.em).replace(/punctuation/g, inline._punctuation).getRegex();

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink).
replace('scheme', inline._scheme).
replace('email', inline._email).
getRegex();

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;

inline.tag = edit(inline.tag).
replace('comment', block._comment).
replace('attribute', inline._attribute).
getRegex();

inline._label = /(?:\[[^\[\]]*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;

inline.link = edit(inline.link).
replace('label', inline._label).
replace('href', inline._href).
replace('title', inline._title).
getRegex();

inline.reflink = edit(inline.reflink).
replace('label', inline._label).
getRegex();

/**
             * Normal Inline Grammar
             */

inline.normal = merge({}, inline);

/**
                                    * Pedantic Inline Grammar
                                    */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
  link: edit(/^!?\[(label)\]\((.*?)\)/).
  replace('label', inline._label).
  getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).
  replace('label', inline._label).
  getRegex() });


/**
                  * GFM Inline Grammar
                  */

inline.gfm = merge({}, inline.normal, {
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^~+(?=\S)([\s\S]*?\S)~+/,
  text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/ });


inline.gfm.url = edit(inline.gfm.url, 'i').
replace('email', inline.gfm._extended_email).
getRegex();
/**
             * GFM + Line Breaks Inline Grammar
             */

inline.breaks = merge({}, inline.gfm, {
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text).
  replace('\\b_', '\\b_| {2,}\\n').
  replace(/\{2,\}/g, '*').
  getRegex() });


module.exports = {
  block: block,
  inline: inline };

/***/ }),
/* 46 */
/*!**************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/helpers.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /**
               * Helpers
               */
var escapeTest = /[&<>"']/;
var escapeReplace = /[&<>"']/g;
var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
var escapeReplacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;' };

var getEscapeReplacement = function getEscapeReplacement(ch) {return escapeReplacements[ch];};
function escape(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(unescapeTest, function (_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x' ?
      String.fromCharCode(parseInt(n.substring(2), 16)) :
      String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

var caret = /(^|[^\[])\^/g;
function edit(regex, opt) {
  regex = regex.source || regex;
  opt = opt || '';
  var obj = {
    replace: function replace(name, val) {
      val = val.source || val;
      val = val.replace(caret, '$1');
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: function getRegex() {
      return new RegExp(regex, opt);
    } };

  return obj;
}

var nonWordAndColonTest = /[^\w:]/g;
var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    var prot;
    try {
      prot = decodeURIComponent(unescape(href)).
      replace(nonWordAndColonTest, '').
      toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

var baseUrls = {};
var justDomain = /^[^:]+:\/*[^/]*$/;
var protocol = /^([^:]+:)[\s\S]*$/;
var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (justDomain.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];
  var relativeBase = base.indexOf(':') === -1;

  if (href.substring(0, 2) === '//') {
    if (relativeBase) {
      return href;
    }
    return base.replace(protocol, '$1') + href;
  } else if (href.charAt(0) === '/') {
    if (relativeBase) {
      return href;
    }
    return base.replace(domain, '$1') + href;
  } else {
    return base + href;
  }
}

var noopTest = { exec: function noopTest() {} };

function merge(obj) {
  var i = 1,
  target,
  key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

function splitCells(tableRow, count) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  var row = tableRow.replace(/\|/g, function (match, offset, str) {
    var escaped = false,
    curr = offset;
    while (--curr >= 0 && str[curr] === '\\') {escaped = !escaped;}
    if (escaped) {
      // odd number of slashes means | is escaped
      // so we leave it alone
      return '|';
    } else {
      // add space before unescaped |
      return ' |';
    }
  }),
  cells = row.split(/ \|/);
  var i = 0;

  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count) {cells.push('');}
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\|/g, '|');
  }
  return cells;
}

// Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
// /c*$/ is vulnerable to REDOS.
// invert: Remove suffix of non-c chars instead. Default falsey.
function rtrim(str, c, invert) {
  var l = str.length;
  if (l === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  var suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < l) {
    var currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.substr(0, l - suffLen);
}

function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  var l = str.length;
  var level = 0,
  i = 0;
  for (; i < l; i++) {
    if (str[i] === '\\') {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}

function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
  }
}

module.exports = {
  escape: escape,
  unescape: unescape,
  edit: edit,
  cleanUrl: cleanUrl,
  resolveUrl: resolveUrl,
  noopTest: noopTest,
  merge: merge,
  splitCells: splitCells,
  rtrim: rtrim,
  findClosingBracket: findClosingBracket,
  checkSanitizeDeprecation: checkSanitizeDeprecation };

/***/ }),
/* 47 */
/*!*************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/Parser.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var Renderer = __webpack_require__(/*! ./Renderer.js */ 48);
var Slugger = __webpack_require__(/*! ./Slugger.js */ 49);
var InlineLexer = __webpack_require__(/*! ./InlineLexer.js */ 50);
var TextRenderer = __webpack_require__(/*! ./TextRenderer.js */ 51);var _require =
__webpack_require__(/*! ./defaults.js */ 44),defaults = _require.defaults;var _require2 =



__webpack_require__(/*! ./helpers.js */ 46),merge = _require2.merge,unescape = _require2.unescape;

/**
                                                                                * Parsing & Compiling
                                                                                */
module.exports = /*#__PURE__*/function () {
  function Parser(options) {_classCallCheck(this, Parser);
    this.tokens = [];
    this.token = null;
    this.options = options || defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.slugger = new Slugger();
  }

  /**
     * Static Parse Method
     */_createClass(Parser, [{ key: "parse",





    /**
                                              * Parse Loop
                                              */value: function parse(
    tokens) {
      this.inline = new InlineLexer(tokens.links, this.options);
      // use an InlineLexer with a TextRenderer to extract pure text
      this.inlineText = new InlineLexer(
      tokens.links,
      merge({}, this.options, { renderer: new TextRenderer() }));

      this.tokens = tokens.reverse();

      var out = '';
      while (this.next()) {
        out += this.tok();
      }

      return out;
    } }, { key: "next",

    /**
                         * Next Token
                         */value: function next()
    {
      this.token = this.tokens.pop();
      return this.token;
    } }, { key: "peek",

    /**
                         * Preview Next Token
                         */value: function peek()
    {
      return this.tokens[this.tokens.length - 1] || 0;
    } }, { key: "parseText",

    /**
                              * Parse Text Tokens
                              */value: function parseText()
    {
      var body = this.token.text;

      while (this.peek().type === 'text') {
        body += '\n' + this.next().text;
      }

      return this.inline.output(body);
    } }, { key: "tok",

    /**
                        * Parse Current Token
                        */value: function tok()
    {
      var body = '';
      switch (this.token.type) {
        case 'space':{
            return '';
          }
        case 'hr':{
            return this.renderer.hr();
          }
        case 'heading':{
            return this.renderer.heading(
            this.inline.output(this.token.text),
            this.token.depth,
            unescape(this.inlineText.output(this.token.text)),
            this.slugger);
          }
        case 'code':{
            return this.renderer.code(this.token.text,
            this.token.lang,
            this.token.escaped);
          }
        case 'table':{
            var header = '',
            i,
            row,
            cell,
            j;

            // header
            cell = '';
            for (i = 0; i < this.token.header.length; i++) {
              cell += this.renderer.tablecell(
              this.inline.output(this.token.header[i]),
              { header: true, align: this.token.align[i] });

            }
            header += this.renderer.tablerow(cell);

            for (i = 0; i < this.token.cells.length; i++) {
              row = this.token.cells[i];

              cell = '';
              for (j = 0; j < row.length; j++) {
                cell += this.renderer.tablecell(
                this.inline.output(row[j]),
                { header: false, align: this.token.align[j] });

              }

              body += this.renderer.tablerow(cell);
            }
            return this.renderer.table(header, body);
          }
        case 'blockquote_start':{
            body = '';

            while (this.next().type !== 'blockquote_end') {
              body += this.tok();
            }

            return this.renderer.blockquote(body);
          }
        case 'list_start':{
            body = '';
            var ordered = this.token.ordered,
            start = this.token.start;

            while (this.next().type !== 'list_end') {
              body += this.tok();
            }

            return this.renderer.list(body, ordered, start);
          }
        case 'list_item_start':{
            body = '';
            var loose = this.token.loose;
            var checked = this.token.checked;
            var task = this.token.task;

            if (this.token.task) {
              if (loose) {
                if (this.peek().type === 'text') {
                  var nextToken = this.peek();
                  nextToken.text = this.renderer.checkbox(checked) + ' ' + nextToken.text;
                } else {
                  this.tokens.push({
                    type: 'text',
                    text: this.renderer.checkbox(checked) });

                }
              } else {
                body += this.renderer.checkbox(checked);
              }
            }

            while (this.next().type !== 'list_item_end') {
              body += !loose && this.token.type === 'text' ?
              this.parseText() :
              this.tok();
            }
            return this.renderer.listitem(body, task, checked);
          }
        case 'html':{
            // TODO parse inline content if parameter markdown=1
            return this.renderer.html(this.token.text);
          }
        case 'paragraph':{
            return this.renderer.paragraph(this.inline.output(this.token.text));
          }
        case 'text':{
            return this.renderer.paragraph(this.parseText());
          }
        default:{
            var errMsg = 'Token with "' + this.token.type + '" type was not found.';
            if (this.options.silent) {
              console.log(errMsg);
            } else {
              throw new Error(errMsg);
            }
          }}

    } }], [{ key: "parse", value: function parse(tokens, options) {var parser = new Parser(options);return parser.parse(tokens);} }]);return Parser;}();

/***/ }),
/* 48 */
/*!***************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/Renderer.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var _require = __webpack_require__(/*! ./defaults.js */ 44),defaults = _require.defaults;var _require2 =



__webpack_require__(/*! ./helpers.js */ 46),cleanUrl = _require2.cleanUrl,escape = _require2.escape;

/**
                                                                                  * Renderer
                                                                                  */
module.exports = /*#__PURE__*/function () {
  function Renderer(options) {_classCallCheck(this, Renderer);
    this.options = options || defaults;
  }_createClass(Renderer, [{ key: "code", value: function code(

    _code, infostring, escaped) {
      var lang = (infostring || '').match(/\S*/)[0];
      if (this.options.highlight) {
        var out = this.options.highlight(_code, lang);
        if (out != null && out !== _code) {
          escaped = true;
          _code = out;
        }
      }

      if (!lang) {
        return '<pre><code>' + (
        escaped ? _code : escape(_code, true)) +
        '</code></pre>';
      }

      return '<pre><code class="' +
      this.options.langPrefix +
      escape(lang, true) +
      '">' + (
      escaped ? _code : escape(_code, true)) +
      '</code></pre>\n';
    } }, { key: "blockquote", value: function blockquote(

    quote) {
      return '<blockquote>\n' + quote + '</blockquote>\n';
    } }, { key: "html", value: function html(

    _html) {
      return _html;
    } }, { key: "heading", value: function heading(

    text, level, raw, slugger) {
      if (this.options.headerIds) {
        return '<h' +
        level +
        ' id="' +
        this.options.headerPrefix +
        slugger.slug(raw) +
        '">' +
        text +
        '</h' +
        level +
        '>\n';
      }
      // ignore IDs
      return '<h' + level + '>' + text + '</h' + level + '>\n';
    } }, { key: "hr", value: function hr()

    {
      return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
    } }, { key: "list", value: function list(

    body, ordered, start) {
      var type = ordered ? 'ol' : 'ul',
      startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
      return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
    } }, { key: "listitem", value: function listitem(

    text) {
      return '<li>' + text + '</li>\n';
    } }, { key: "checkbox", value: function checkbox(

    checked) {
      return '<input ' + (
      checked ? 'checked="" ' : '') +
      'disabled="" type="checkbox"' + (
      this.options.xhtml ? ' /' : '') +
      '> ';
    } }, { key: "paragraph", value: function paragraph(

    text) {
      return '<p>' + text + '</p>\n';
    } }, { key: "table", value: function table(

    header, body) {
      if (body) body = '<tbody>' + body + '</tbody>';

      return '<table>\n' +
      '<thead>\n' +
      header +
      '</thead>\n' +
      body +
      '</table>\n';
    } }, { key: "tablerow", value: function tablerow(

    content) {
      return '<tr>\n' + content + '</tr>\n';
    } }, { key: "tablecell", value: function tablecell(

    content, flags) {
      var type = flags.header ? 'th' : 'td';
      var tag = flags.align ?
      '<' + type + ' align="' + flags.align + '">' :
      '<' + type + '>';
      return tag + content + '</' + type + '>\n';
    } }, { key: "strong",

    // span level renderer
    value: function strong(text) {
      return '<strong>' + text + '</strong>';
    } }, { key: "em", value: function em(

    text) {
      return '<em>' + text + '</em>';
    } }, { key: "codespan", value: function codespan(

    text) {
      return '<code>' + text + '</code>';
    } }, { key: "br", value: function br()

    {
      return this.options.xhtml ? '<br/>' : '<br>';
    } }, { key: "del", value: function del(

    text) {
      return '<del>' + text + '</del>';
    } }, { key: "link", value: function link(

    href, title, text) {
      href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
      if (href === null) {
        return text;
      }
      var out = '<a href="' + escape(href) + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += '>' + text + '</a>';
      return out;
    } }, { key: "image", value: function image(

    href, title, text) {
      href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
      if (href === null) {
        return text;
      }

      var out = '<img src="' + href + '" alt="' + text + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += this.options.xhtml ? '/>' : '>';
      return out;
    } }, { key: "text", value: function text(

    _text) {
      return _text;
    } }]);return Renderer;}();

/***/ }),
/* 49 */
/*!**************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/Slugger.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * Slugger generates header id
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
module.exports = /*#__PURE__*/function () {
  function Slugger() {_classCallCheck(this, Slugger);
    this.seen = {};
  }

  /**
     * Convert string to unique id
     */_createClass(Slugger, [{ key: "slug", value: function slug(
    value) {
      var slug = value.
      toLowerCase().
      trim().
      replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '').
      replace(/\s/g, '-');

      if (this.seen.hasOwnProperty(slug)) {
        var originalSlug = slug;
        do {
          this.seen[originalSlug]++;
          slug = originalSlug + '-' + this.seen[originalSlug];
        } while (this.seen.hasOwnProperty(slug));
      }
      this.seen[slug] = 0;

      return slug;
    } }]);return Slugger;}();

/***/ }),
/* 50 */
/*!******************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/InlineLexer.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var Renderer = __webpack_require__(/*! ./Renderer.js */ 48);var _require =
__webpack_require__(/*! ./defaults.js */ 44),defaults = _require.defaults;var _require2 =
__webpack_require__(/*! ./rules.js */ 45),inline = _require2.inline;var _require3 =



__webpack_require__(/*! ./helpers.js */ 46),findClosingBracket = _require3.findClosingBracket,escape = _require3.escape;

/**
                                                                                                      * Inline Lexer & Compiler
                                                                                                      */
module.exports = /*#__PURE__*/function () {
  function InlineLexer(links, options) {_classCallCheck(this, InlineLexer);
    this.options = options || defaults;
    this.links = links;
    this.rules = inline.normal;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;

    if (!this.links) {
      throw new Error('Tokens array requires a `links` property.');
    }

    if (this.options.pedantic) {
      this.rules = inline.pedantic;
    } else if (this.options.gfm) {
      if (this.options.breaks) {
        this.rules = inline.breaks;
      } else {
        this.rules = inline.gfm;
      }
    }
  }

  /**
     * Expose Inline Rules
     */_createClass(InlineLexer, [{ key: "output",












    /**
                                                    * Lexing/Compiling
                                                    */value: function output(
    src) {
      var out = '',
      link,
      text,
      href,
      title,
      cap,
      prevCapZero;

      while (src) {
        // escape
        if (cap = this.rules.escape.exec(src)) {
          src = src.substring(cap[0].length);
          out += escape(cap[1]);
          continue;
        }

        // tag
        if (cap = this.rules.tag.exec(src)) {
          if (!this.inLink && /^<a /i.test(cap[0])) {
            this.inLink = true;
          } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
            this.inLink = false;
          }
          if (!this.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.inRawBlock = true;
          } else if (this.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            this.inRawBlock = false;
          }

          src = src.substring(cap[0].length);
          out += this.options.sanitize ?
          this.options.sanitizer ?
          this.options.sanitizer(cap[0]) :
          escape(cap[0]) :
          cap[0];
          continue;
        }

        // link
        if (cap = this.rules.link.exec(src)) {
          var lastParenIndex = findClosingBracket(cap[2], '()');
          if (lastParenIndex > -1) {
            var start = cap[0].indexOf('!') === 0 ? 5 : 4;
            var linkLen = start + cap[1].length + lastParenIndex;
            cap[2] = cap[2].substring(0, lastParenIndex);
            cap[0] = cap[0].substring(0, linkLen).trim();
            cap[3] = '';
          }
          src = src.substring(cap[0].length);
          this.inLink = true;
          href = cap[2];
          if (this.options.pedantic) {
            link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

            if (link) {
              href = link[1];
              title = link[3];
            } else {
              title = '';
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : '';
          }
          href = href.trim().replace(/^<([\s\S]*)>$/, '$1');
          out += this.outputLink(cap, {
            href: InlineLexer.escapes(href),
            title: InlineLexer.escapes(title) });

          this.inLink = false;
          continue;
        }

        // reflink, nolink
        if ((cap = this.rules.reflink.exec(src)) || (
        cap = this.rules.nolink.exec(src))) {
          src = src.substring(cap[0].length);
          link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
          link = this.links[link.toLowerCase()];
          if (!link || !link.href) {
            out += cap[0].charAt(0);
            src = cap[0].substring(1) + src;
            continue;
          }
          this.inLink = true;
          out += this.outputLink(cap, link);
          this.inLink = false;
          continue;
        }

        // strong
        if (cap = this.rules.strong.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.strong(this.output(cap[4] || cap[3] || cap[2] || cap[1]));
          continue;
        }

        // em
        if (cap = this.rules.em.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.em(this.output(cap[6] || cap[5] || cap[4] || cap[3] || cap[2] || cap[1]));
          continue;
        }

        // code
        if (cap = this.rules.code.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.codespan(escape(cap[2].trim(), true));
          continue;
        }

        // br
        if (cap = this.rules.br.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.br();
          continue;
        }

        // del (gfm)
        if (cap = this.rules.del.exec(src)) {
          src = src.substring(cap[0].length);
          out += this.renderer.del(this.output(cap[1]));
          continue;
        }

        // autolink
        if (cap = this.rules.autolink.exec(src)) {
          src = src.substring(cap[0].length);
          if (cap[2] === '@') {
            text = escape(this.mangle(cap[1]));
            href = 'mailto:' + text;
          } else {
            text = escape(cap[1]);
            href = text;
          }
          out += this.renderer.link(href, null, text);
          continue;
        }

        // url (gfm)
        if (!this.inLink && (cap = this.rules.url.exec(src))) {
          if (cap[2] === '@') {
            text = escape(cap[0]);
            href = 'mailto:' + text;
          } else {
            // do extended autolink path validation
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = escape(cap[0]);
            if (cap[1] === 'www.') {
              href = 'http://' + text;
            } else {
              href = text;
            }
          }
          src = src.substring(cap[0].length);
          out += this.renderer.link(href, null, text);
          continue;
        }

        // text
        if (cap = this.rules.text.exec(src)) {
          src = src.substring(cap[0].length);
          if (this.inRawBlock) {
            out += this.renderer.text(this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0]);
          } else {
            out += this.renderer.text(escape(this.smartypants(cap[0])));
          }
          continue;
        }

        if (src) {
          throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
        }
      }

      return out;
    } }, { key: "outputLink",





    /**
                               * Compile Link
                               */value: function outputLink(
    cap, link) {
      var href = link.href,
      title = link.title ? escape(link.title) : null;

      return cap[0].charAt(0) !== '!' ?
      this.renderer.link(href, title, this.output(cap[1])) :
      this.renderer.image(href, title, escape(cap[1]));
    }

    /**
       * Smartypants Transformations
       */ }, { key: "smartypants", value: function smartypants(
    text) {
      if (!this.options.smartypants) return text;
      return text
      // em-dashes
      .replace(/---/g, "\u2014")
      // en-dashes
      .replace(/--/g, "\u2013")
      // opening singles
      .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018")
      // closing singles & apostrophes
      .replace(/'/g, "\u2019")
      // opening doubles
      .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C")
      // closing doubles
      .replace(/"/g, "\u201D")
      // ellipses
      .replace(/\.{3}/g, "\u2026");
    }

    /**
       * Mangle Links
       */ }, { key: "mangle", value: function mangle(
    text) {
      if (!this.options.mangle) return text;
      var l = text.length;
      var out = '',
      i = 0,
      ch;

      for (; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = 'x' + ch.toString(16);
        }
        out += '&#' + ch + ';';
      }

      return out;
    } }], [{ key: "output", /**
                             * Static Lexing/Compiling Method
                             */value: function output(src, links, options) {var inline = new InlineLexer(links, options);return inline.output(src);} }, { key: "escapes", value: function escapes(text) {return text ? text.replace(InlineLexer.rules._escapes, '$1') : text;} }, { key: "rules", get: function get() {return inline;} }]);return InlineLexer;}();

/***/ }),
/* 51 */
/*!*******************************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/node_modules/_marked@0.8.0@marked/src/TextRenderer.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * TextRenderer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * returns only the textual part of the token
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */
module.exports = /*#__PURE__*/function () {function TextRenderer() {_classCallCheck(this, TextRenderer);}_createClass(TextRenderer, [{ key: "strong",
    // no need for block level renderers
    value: function strong(text) {
      return text;
    } }, { key: "em", value: function em(

    text) {
      return text;
    } }, { key: "codespan", value: function codespan(

    text) {
      return text;
    } }, { key: "del", value: function del(

    text) {
      return text;
    } }, { key: "text", value: function text(

    _text) {
      return _text;
    } }, { key: "link", value: function link(

    href, title, text) {
      return '' + text;
    } }, { key: "image", value: function image(

    href, title, text) {
      return '' + text;
    } }, { key: "br", value: function br()

    {
      return '';
    } }]);return TextRenderer;}();

/***/ }),
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */
/*!*******************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/common/js/tool.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var Tool = /*#__PURE__*/function () {function Tool() {_classCallCheck(this, Tool);}_createClass(Tool, null, [{ key: "delHtmlTag", value: function delHtmlTag(
    str) {
      return str.replace(/<[^>]+>/g, ''); //正则去掉所有的html标记
    } }, { key: "typeOf", value: function typeOf(
    any) {
      var type = Object.prototype.toString.call(any);
      return type.slice(8, -1);
    } }]);return Tool;}();exports.default = Tool;

/***/ }),
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */
/*!***********************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/assets/img/hanbao.jpg ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAFeAQYDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9O6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKo61ruieG9Nm1nxDq9lplhbKXmurydYYox6szEAV8XfH3/AIKwfAP4XifR/hqk3xC1tMqGsn8nT42/2rhh8/8AwBSPcUAfb9Ffh/45/wCCtP7WPim5lPh7UtA8K2rk7IdP01JXUe8k+8k/gK8p1v8Abx/a918k33x68TRhv4bWVLYflEq0Af0LUV/OO/7Wf7TkjFn+PnjvJ9NcuB/7NTf+Gr/2mv8Aovfjz/we3H/xVAH9HVFfzi/8NX/tNf8ARe/Hn/g9uP8A4qpbX9rn9qCzuEurf4++OhJGdyltbnYZ9wWIP40Af0a0V+FXgz/gqh+2D4RtEsrvxjpXiKNGzv1jS45JSPQvHsJ/HJr6C8Gf8FrdSt9MtLfx/wDBCG9vkAW6utK1byI5D/eWKSNtv03n60AfqnRXxv8ADL/gq1+yl49+z2viDWtV8F303DR6xZkwqfTzoty49zivqTwb8Sfh98RLMX/gTxtofiCAqG36dfxXGB7hCSPxoA6SiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiis/xB4g0Xwpod94k8R6nb6dpemQPc3d1cOEjhiUZZmJ6ACgC3dXVrY20t5e3MVvbwIZJZZXCIigZLMx4AA7mvz3/at/4KyeEfh3eXXgn9n6xsvFmtQForjW7hidNt3HBEQUgzkeoIT3avj39uH9v7xr+0d4hvvBngjUrvRfhvaStFb2sTGOXVdpx51wRyVPVY+gGM5NfOXwv+D/AI8+L2tLo/g3RpJ1VgLi7kBW3tl9XfoPoMk9hWGKxVDBUpV8RNRhHVtuyRrRoVMRUVKjFyk9ktWavxi/aN+NPx61RtT+KXj7UtYXcWiszJ5dpB7RwLhF+uM+9Znw9+C/xM+KNykHg3wne3cLNhrt08u2T3aVsL+WTX3T8Kf2I/hd4FS31HxZEfFWroAzG6XFoj/7MX8Q93J+gr6GtbS1sbeOzsraK3giULHFEgRFHoAOBX43n3jDhqDdLJ6XO/55aR+Ud38+U/Qcr8P61W1TMJ8q/ljq/m9l8rnxv4J/4J3WAtY7j4h+OZ2uGALW2lRKET28yQEn8FFej6b+wl8BLHBurLWr8j/nvqJUH8EC19DVqeF7eO68R6bbzKGR7mMMD0IzX5ZieO+I8wq+9i5Ru9o+6l/4DY+1p8M5RgqbaoJ2XXV/ieAf8MWfs9QqvmeA58HoX1C5Gf8Ax+k/4Yz/AGdf+hEf/wAGNx/8XX1/8YL6KOxsdMWJC8kjS7scqqjHH1z+leWVzYziLPMLWdJY6q7f35f5lYDLctxlBVnhYK/92L/Q8T/4Yz/Z1/6ER/8AwY3H/wAXR/wxn+zr/wBCI/8A4Mbj/wCLr2yiuT/WrPf+gyr/AODJf5nZ/YeWf9A8P/AY/wCR4Rq37E37P2oabcWVl4YutOnlQrHdQX8zPE3ZgHYqfoRXz98Qv+CffjbRx9q+HXiK11+HHzW92Bazj6HJRvzFffFFetlfiDxDlU+aOIc11U/fT+/VfJo4cbwrlOOjaVJRfePuv8NH80z8kPGPwK+LvgIF/FHgHVrWEf8ALdIfOi/77jyo/E1zfhnxZ4r8D6xFrvhHxDqWianbNmO5sbl4JUI91IP4V+yZAYFWAIPUHvXknxf/AGYvhh8X7V5b/Sk0nWAp8rU7CNY5M9vMUcSD68+hFfpGT+MsKs1Szahyp7yg20v+3XrbvZv0PkMw8PZQi54Crd9pf/JL/L5nAfs2/wDBWHx74bktfDnxvl/tizXbGuq+XukA6fvQOf8AgS5/3TX6gfCH45/Dj42aKur+BfEljfsqBpoIbhZHjz3OD0/yQK/A34vfsvfFH4R3Ty3mkyavo5J8rU9PjaSPH/TRR80Z+vHoTXGfDX4p/ED4PeK7Xxn8OfE97oerWbhllt3wHHdJEPyup6FWBBr9Ryv2GKtjcpxPPRlvG/NH/t37UH/d+Hpyp6nxWN9pQvh8dR5ai2laz+fSS89/Nn9MtFfH/wCwv+374d/aks/+EI8WWsOifELT7bzZrZDi31KNcBprfPII6tGeRnIJHT7Ar6M8gKKKKACiiigAooooAKKKKACiiigAooooAKKKKAI554LWCS6uZkhhhQySSOwVUUDJJJ4AA71+L/8AwUe/btuPjlr9x8Hvhbqzp4B0efbeXULEf21cofvZ7wKR8o/iPzHtXu//AAVl/a61PwrbRfs1fD/U3trzVLVbrxNdQvh0tn/1doCOm8Dc/wDs7R/Ea/NH4RfCjxL8Y/GVt4S8OQ43fvLu6YHy7WAH5pGP8h3OBWGKxVHBUZYjESUYRV23skjWhQqYmpGjSV5Sdkkb/wCz58B9e+OPi5NOt1ktdDsmWTVL/bxEn9xfWRuw7dTX6e+EPB3hvwHoFr4Z8KaVBp+n2iBUjiXBY92Y9WY9STyaz/hp8N/DXwq8I2Xg7wvaiO2tVzJKQPMuJT96Vz3Yn8hgdq6mv5Q444zr8VYvlp3jh4P3Y9/70vN/gtO7f7nw3w7TyOheWtWXxPt5LyX4/cFFdR8OdFtta8RpHeRiSG3jM7IejEEAA+2T+lbnxesdPtp9Ontoo4ppFdXVFAyoxgnH1Ir5KOClLDPE30T2PWnj4QxccJbVq9+x53U9leT6fdw3tq+2aBxIhxnBBqCiuNNxd0d7SkrM1PEHiLUvEt4t7qTJvRAiqi4VRWXRVm303ULu3murWymlhgGZZEQlU+pqpSnWk5PVszjGnQgoxskitXZ/CqxtL3xDL9rt45hFbM6h1DAHcBnB+prjKuaXq+o6LdC90y5aCYKV3AA5B7EGtMLVjRrRqTV0mZ4ylKvQnSg7No0fHFra2XirULaziWOJZAQi9ASoJx+JNYVS3NzPeXEl1dStJLKxd3bqxPeoqitNVKkpxVk2zSjB06UYSd2kkFFFX9CsF1TWbLT3YKs86IxPoTzUxi5yUV1KnJQi5PZFSW2nijVp7d0SUfKXQgOPbPWvlz9p/wDZL8N+M9F1Hx34B06PTPElnE9zNbW6BYdQCjLAqOFkxnBHU8H1r7x+L89vDpunacka7zIXXjlUUYwPzH5V5bXv4HM8XwtmKr4Go7xtfs1u4tdV/S1PHlh6HEOBtioaSvbuul0+/wDWx+PXw38f+JPhT490P4g+FbyS01bQL2O8gZWK5Kt8yN/ssMqR3BNf0YfA74v+Gfjv8LdA+KXhOYGy1q2EjxE5a2nHEsLf7SOCPwz3r8IP2xfhTH8NPizcXmlWIt9G8RIdQtAg+RJCcTIPTD849GFfZP8AwRq+O0kV94m/Z51eVminRvEOjknhXXalzH+I8tx/utX9fZTmVHOMDSx9D4aiT9O6fmno/NH4Pj8HUy/EzwtXeLt/wfnufqjRRRXonIFFFFABRRRQAUUUUAFFFFABRRRQAVj+MPFWjeBvCmr+M/EV0ttpmiWU1/dysfuxRoWb8cDj3rYr4r/4KzfFFvAn7LsvhOzuTFe+ONTh0sAHBNsn76b8CERT/v0Afj18bvijqvxp+LPin4o6wCs/iHUZbtYyc+TFnEUY9lQKv4V9+/sb/C+H4e/B+w1O7shFrHiQDUbt2XDiM/6lD6AJg49WNfBPwG8CL8Sfi34b8JTxF7W5vFluwP8An3j+eTP1CkfjX61RRRwRJDDGqRxqERVGAqgYAFfh/jHnjpUaOT0n8Xvy9FpFfN3fyR+k+H2WKdSpmE18Pux9Xq391l82OorQ0TQ9Q8QXy6fpsQeQgsSxwqgdyah1PTbvR76XTr6PZNCcMAcj2IPpX4F7OfJ7S2m1z9R9rBz9nf3t7dbFnw/4gv8Aw3f/ANoafsLlSjK4yrKex/Km65ruo+Ib5tQ1GQM5G1VUYVF9AKzqKftqnJ7K/u72J9hT9p7blXNtfqFFFFZmooGTgV7JdW//AAiHw4kii8tZ/s4Dtj70khwfqef0rxsHByK3te8a6z4hsLfTr0xrFBgny1x5jAYBau/BYmnho1G/iasjzcwwlTFzpRj8Cd38tv1MCiiiuA9IKkggnuplt7aJ5ZHOFRBkk+wqOuw+Fdu03iyOUDiCGRz+Ix/WtsPS9vVjT7swxVb6vRlV7K5yc8E9rM1vcxPFIhwyOMEH3FPsbyXT72C+gAMlvIsi5HGQc811vxYaA+KFWJVDrbp5hA6nJxn8MVxdOvT+rVpQi9nuLDVfrVCNSStzLY2/FXim78VXkV1cwRwiGPy0RCT3yTk1iUUVnUqSqyc5u7ZrSpQowVOmrJHz5+278Oz40+Dc+uWke698LTDUUwMloSNsq/kQ3/Aa+Jv2Zvivd/BL47eDPiTbXDxQ6VqkX20K2PMtHOydD6gxs36V+qOsaVZ67pN7ouoRiS2v7eS2mQ9CjqVI/I1+O/jDw9ceE/FeseGbpWEul3s1o24YJ2OVB/EDNf0N4N5u6+BrZZN603zR9Jbr5NX+Z+U+IWAVLE08ZFfGrP1W34P8D+nO0ure+tYb20lWWC4jWWKRTkOjDII9iDU1fPf7A3xNHxV/ZR8Ba7NdNPe6dYf2NeszZbzrU+Vz9VVG/GvoSv2c/OwooooAKKKKACiiigAooooAKKKKACvyQ/4LTeNvt3xI8AfD+GYlNJ0i41OZM8B7iUIv/jsJ/OvtL9tz9trw7+yN4a0+G20iLX/GGvBzpumPN5ccUS8NcTEfMEBwAByxzyME1+NX7Sfxd+LH7QvjJfjL8T9Ai0972CPTrRrWzeC28uMFlVN5JY4YknPNS5xi0m9y405zTcU2lv5ep6n/AME8fDS33xB8Q+KZYsrpWmLbxsR0eZ+3/AUb86++a/Nz9lb9pTwz8CYNW0rxF4avr2LWbmKV7y0kXfCqKQB5bY3dSfvCvsTwz+1p8AfE8PmQ/EC105+8WpRvbMPxYbT+Br+avEvI85xmeVcZHDzlStFRcVzKyS7Xtrfex+wcHZll2Hy2GHdWKndtpu2rfna+ltj6X+F2t6Ro97ff2pdJbmaJQjv04JyM/l+VYvjjVrXWvEt1fWT74DtRGxjcFUDNcFofxB8B+JnEXh7xpoepSNyEtb+KRj/wENmt+vzSvVr0qKwlWHLZ31TT/E+ro4ajLESxlOV21bdNdP8AIKKKK4TvCvRrbwhotj8PptZ1K0eW7mg85XGcxk/cA9uhNec17pPd2Nz4AknSVGgOmlc54BCYx9c8V62V0YVfaOVrqOl/zPGzivUo+yUG0nJXt+XzPC6KKK8k9kKKK6/wZ4Ck8T209/dXTWtsmUjYLku3fr2Fa0aE8RP2dNXZjiMRTwsHUquyOQrd8IeJm8K6o1/9l89JIzE6btpwSDkH8KxriIQzyQrIJBG5UOOjYPUVHSp1J0ZqcHZoqrThXpuE1dM0fEGsy6/q9xqs0YjMzDCA52qBgD8hWdRRUzm6knKW7KhCNOKhHZaBRRRUlBX5sfty+FbHw38dLq+sSR/btjBqMyY4WU7o2x9fLB+pNfpPX55/8FBv+Sy6Z/2AYP8A0bLX6f4R1Zw4h5IvSUJX89n+aPi+PIRllPM1qpK34o+v/wDgihrupz+F/id4bmunews77T7yCInISWVJVcj0yI0z9K/TOvy8/wCCJX/Hp8V/+umk/wArmv1Dr+oT8WCiiigAooooAKKKKACiiigAooooA/EH9ri5uPip/wAFF9e0DxZK1zYaXqEOnW8BJ2rbW9sJBHjsC24n13GvZLzTdN1CBLW/0+2uYYyGSOaJXVSOhAIwMV5t/wAFQvgh4i+C/wAfpPjno/jW0Efj27a5tLaCcx6hZyxwokpK94z2cH+LBHrzngv9m39v74i+CdO1nw7qs83h3xLZpdQTP4gtkEkEi5BPzbxweR1FfHcS5XLGVoVpV404pWXM7a3u7fK33H6PwZxdheHsHVw88O6k5yu2rbWSSd+zv956brHgX4deNLaS21Pw9o+oJG2xmjjTfGw7b0wyn2zXnGtfsifDHUZzNpt1q2lg/wDLOGdZEH03gn9aon9hj9uj4RG+vfCOjfaoiBLOdG1WCbzyAT/qnIZyMnjbn61zmmftOfEXwJqqeG/jF4EubeeFtk7SWz2d0gHBJjcYb8MV40MuzDDpvKsSqkV0Utf/AAF3R9RT4s4azpqOdYRU5vq43X/gStL8LBrn7Gt1aRG78H+N2a7j+aNLuHy8n2kQnB/Csl/jZ+1J+z9d2+k+IddkvLWRP9Hj1LbewyKp52yZ3j6bgfavpPwx8RfBHjG0S88PeJbG6DLuMfmhZU/3kOGH4itHU9P8O+JbVtN1a10/UoH6wzKko+uDnH1rzqmbTrv6vnVCNaC6Tirr000/rU9rE8D5biKX1jIazozezjJuL9Vd/g/kyL4U/tn/AAo8ZaHYp4x1+18Oa+0eLuC4R0tvMzjMcpBGDwcE8ZxXu+laxpOuWaahouqWl/ayDKzWsyyof+BKSK+OfEv7J/wt1svLpkN9oszZI+yzbowf9x88ewIrzeb4EfHL4RX5134T+Lri5CHOLKYwTEejRMdjj2yfpXyOO4DyLM5SnlmJdGT1UaivH0UlsvXmZwz/ANZMoivrmGVaC3lTd5eri9W/RJH6M1KLm4EJthPIIicmPcdpPrjpXwNon7cvxn8DONK+JngW21KSP5TJNC9jOfrgFD+CivV/B/7ffwq1zy4vE2lanoEzcMWUTxA/7yjOPqBXyeN8N+I8EnKNH2ke8JKV/RXUvwDC8UZXipezlU5Jdprla+b0/E+naK4Lw38dvhR4s2DQ/Gmn3DSDKoJRvP8AwHOf0rsbbWdJvBm21G3f/gYB/Wvk8TleOwb5cRRlH1i1+h9HD97Hnp6rutV96LlfQfhm3hi8NadBGgVDaxkge6gn9Sa+fAQw3KQQe4NdZovxJ1/RdPGnIsFxHGu2Iyqd0Y9ODyPrW2VYung6knV6o8bOcDWxtKMaO6Zzeowrb6hc26/dimdB9AxFV6fNLJPK88rbnkYux9STk0yvLk022j14ppJMKKKu6NY/2nq1np5OBcTJGT6AnmiMXJqK6hKShFyeyNSbwPrUHh5PEh8lrdkEhQN86oehI6Vz1ezfExk0/wAG/Y7YeWjSRQqq8fKOcf8AjteM13ZjhoYWqqcOyv6nnZVi6mNourU7u3oFfnn/AMFBv+Sy6Z/2AYP/AEbLX6GV+Yv7Zvip/E/x912INmHRkh0yIf7i5b/x9mr9D8IsPOrxA6kdo05N/NpfqfOce1YwypQe8pK34s+3f+CJX/Hp8V/+umk/yua/UOvzy/4IyeAZ9G+DHjD4g3KFR4k1tLS3PrFax4J/77lcfhX6G1/Tx+LhRRRQAUUUUAFFFFABRRRQAUUVz3xC8Z6Z8OvAniDx7rLhbLw/ptxqU+T1WKMvj6nGPxoA/I7/AIKzavbfEz9q7wv8OfB0n9oaxpmj2ukTQxsCEvLid3SPPY7ZIyfTNRfssftveMf2V75PgD+0T4c1FdA0qUwW1x5X+l6SpYnG3/ltBkkjByAflyMCsz9hnw3qvxy+P3jH9o3xyoup7O6lu0Z1yp1C6ZiCvp5ce7Hpla+yvjL8A/hr8ddE/snx1oiyXESkWmowYS7tSe6Pjkf7Jyp9K87MMPQxsHQxEbr8U+6PHrZ//Z2MVNLRb/11PofwZ438I/ETw9a+LPA/iKx1rSL1d0N1Zyh0Psccqw7qcEdxWJ8Wvgt8NPjh4Zl8KfEzwvbatZv80UjDZPbvjh4pR8yMPY4PcGvyyvfAH7Vn7BXia+8YfCnVrjWPB7kPczRw+dayxA8C7ts5jYdN6/gw6V9lfs3/APBR/wCDnxkgs9A8dXcHgjxZIAjwXsuLG5k9YZzwuf7r4PYFq/Psw4fxeWy9vhW5RWzXxL1S/NfgfZ4LNcNmFO6a1+7+vJnjfjj/AII+6dPqX2j4a/GOaxs3JJt9ZsPOePngCSJl3D6qK5K+/wCCRHxZsIvP0D41eHp7kfwyW1zbj/vpd38q/UeGeG5hS4tpo5YpFDJJGwZWHqCOCKfWEeJszguVzv6pf5HV9RoXulb5s/Gfxr8Df22f2XPM1TUNOvNf8PwgPLd2cjanZBf9sH95EPchR71P4L/a98HapElt400640W7HDSxKZoGPrx8y/TB+tfsiQCCpAIIwQehFeEfFX9h/wDZn+L9zLqXiT4cWthqcx3Pf6O5sZnb1YR/Ix92UmtHmmBx6tmFG0v5oaP5rZnu5Zn+cZK7YStzQ/ln7y+XVfJo+PNJ8Z/Drx3bhNN13RtWRx/qXdGb6GNuR+Vc14m/Zx+EviZnmk8NDTp3OTLp8hh5/wB3lf0r0D4hf8EgrMCa/wDhJ8XLiCZTvgs9ctQRn08+HBH12GvHdQ/ZG/4KF/DvdaaNZ32s2sH3H0/V7e6RlHosrB/w21rQwVBPny3G8r7SvH/gP7j6V8eYbHQ9nneAU/ONpfhLVf8AgRymufsYwLmbwp42mikDZVL2DOP+BoQf0rCf4D/tFeDW+1eFvFrXW0Z22mpuhP8AwGTANb1541/bM8GMLTxP8JNbZx8ga68NXAJI/wBqMAGsa6/aM+P3hy4Nz4n8AC3tm+YR3WkXFsAPZiQfzzXsU4Z61yynTqrzs7/gjz6mM4JnLnoxrUJPrG6t57yX3FvTvFv7b2jAxWLa0i42kG2tXBx35B/Oprr4q/ty2SiSeTWyP9jTLaT9FQ1jH9s/xlk48I6MB2+eX/GpbX9tDxSs6G88G6VJDn51jmkRiPYnI/Suepk1erJ1KuW0JP8Awxv+JEsZw9N/8jTE37vmf6G14S/bf+N3gq/aL4kaCmt2p+Qx3Fr9hmjIPJV1UA/Qqa9z8K/t7fBbXMR6/BrPh+XGSbi28+PPoGiJP5qK8ug/ar+EHiDT1t/E2kX8Xm/LLb3FmlxGPxB5H4VtR/Bv4B/E7TbfXdD0e1ENyu9JNOlaAkZ5DIOhz2IzXy+a8M5DiXz5hgJYdvTmpuy+74fwPbwGDx9X3clzKniLa8tTSVvleX32PeNE/af+AuvusVj8StLjdzgLdFrc/wDkQCvSdG8S6ZdSwX+ha3Z3DIVlikt51fkcgjB5r4f1j9jjwHdqzaNr+r2DkfKJCkyA/QgH9a4yb9kr4laO5fw148syFOVxLNbN/wCO5H6189V8P+H8Rrg8bOm/78b/AIrlPQnPiPCaYnAqou9Oa/J3Z+mviDxbrfiRYo9UmQpDyqIm0Z9T71i1+d1nb/tseDV/s7SPEetXNvHwpTUIblMe3mkmn6r8Yf23bawaK7bXIUTGZYdJhL8f7SoTXnVvC/HYipzUsbRnfq5NP7rP8ziXEDwUOSeBrQS6cmn33P0Hv7620uwudTvJAlvaQvPKx/hRVLE/kK/Hrx74mk8Z+Ntd8VyAg6tqE92Aeyu5IH4DFes69+1l+0A/g/UfAXiy5Rl1WBoJLq70/wAm7ELDDKpG0YIyMlSeTzXF/s+/CTW/jj8YvC/wz0K1eaTV7+NblguRDaqwaaVvRVQMfyHev0rw64LxPCzxFbGuLlOyi4u65Vq3qlu/yPguL+IaWc+ypUE0o3bUlZ3f+S/M/cH/AIJ7eA7v4efsifD/AEnULdobu/sn1eZGGCpuZWlXPvsZK+jKrabp9rpOnWul2MSxW1nClvCijAVEUKoH0AFWa/UD4oKKKKACiiigAooooAKKKKACvlD/AIKg+K7zwt+xv4uSyyH1q4sdJdgcYjknUv8AmqEfjX1fXx5/wVe0291D9jnXJLO3eVbLV9NuZ9ozsjE20sfbLr+dAHh//BPLwzb6F+zdp2pxqvna9qN5fSsBydr+UoP0EX619MV85/sA67pWrfs0aBYWF5HLc6TcXlreRBvmhkM7yKGHbKupHrX0ZXn1PiZ+cZg28XU5u7GyRxyxtFKiujgqysMhgeoI7ivmD41f8E//AIR/E2ebWvCTN4M1mUlnayhD2czHu0GQFPuhH0Ne+6t8Svh9oPiay8F614z0ex13UQDa6dPdok82eFwpOee3r2rpKSlKGqIo16+Ekp0243/H/M/NnSPGP7WH/BPTxRZw6leSeIPAtxNt+ytM82m3SZ5VCRutpccjgfRhX6M/s5ftbfCT9pbRxN4P1X7DrsKbrzQb51W8gx1ZQOJU/wBtfxAPFGs6Jo/iPTLjRdf0u11Gwu0Mc9tcxCSORT2Knivg/wCPn7DHiX4c6k3xb/Zl1TUbWbTGN42lQXDLd2pHJa1kHLgD+A846FuleTmWS4XNFzP3KnddfVfrufa5NxU1alif+B/wPyP1aor4h/Yf/b8s/i2tt8KPjNewad44h/cWV9KBFFq2ONpHASfj7vAbtzxX29X53j8BWy6s6Nda/g13R99h68MRDngFFFFcRuKGYdGP51Hc29veRNBeQRzxsMMkqB1I9CDxT6KAPMPFP7L/AOzt41ZpPEvwX8JXUr9ZU02OGT/vqMKf1rx7xd/wTF/ZR8TRyHTPDeseHJ3B2yaZqkhCn/cm3rX1hRXbRzLGUP4dWS+b/IylQpT+KK+4/Mbx7/wR91+CSSf4ZfFyxu4uSltrdm0L+w82LcD/AN8ivLtQ/wCCZf7XvgeJdd8MNoeoXcB3rHpGteXOMc5HmLGD9M1+xVFetT4qzGEeWbUl5r/Kxz/UKUZc0Lxfkz8Udd8Y/tg/BnZN8UfhvqqWMeVaXUdJZI2x1/fxAL+OTXT+Ff2uvh5q1ui+JbW+0W64DDyzPET3IZecfUV+wdxb295byWl3bxzwTKUkilQOjqeoKngj2NfPnxF/YD/ZY+JN1dalqPw2i0i/ulw1zok72W1v74jQ+Vu+qc0vr+VYzTF4fkfenp+D0/M+lwPFGfZY/wB1X9pHtU978d/xPkCD4z/Ci4iWaP4gaKFYZAe6VT+IOCKuWnxS+G99cx2dn460OWeU4RFvY8sfQc16Tc/8Eg/gpJO8lt8TfGcMTMSkZW1cqPTPljNYfiv/AII++CW0O5/4Qb4ta5HrKqWtv7VtYntmb+6/lgMoPqM49DUrBZHJ2WImvWP/AAD314lZsrOWGg/Rv/M4j4pfDrQfiX4VudK1WKMTxxtLZ3gA328gGQwP909x0IroP+CLF7pq+OfiToVxollJfxada3UGpeSpnjjErJJEH6hGJRsDjK18keHvh5+0B4o+Lq/sl6P40il1VdQm0zy11YGxzGhZz5w5KBVJ2jPTG3PFfr3+w1+xXpf7IvhLU/7R1qDXPF3iJozqd/DGUhjijzsgiDfMVBZiWOCxPQYFfccP5ZWyylKE6inF6xt08/npofF8ZcR4TiSvTr0KDpzStJu2u1lp21s3q77Kx9PUUUV9AfGBRRRQAUUUUAFFFFABRRRQAVxXxstfCN58IPGkPj3SV1Tw6uhXsupWZOPOgSFnZQezfLwexwe1drXk/wC1lrcPh39mX4o6tPjZF4V1FME4yXgZB+rCgD8LvgL44+O/w81XWvGHwH0TU7nT2cW97araG+hCElollUDlgAcOAD19cV7Je/tS/t3eMIP+Ef0rwbd6ZcXRCrcWXhuSGVfo8uVX68fWup/4J1WEsXgTxZqbcJcarDCv1SHJ/wDQxX1vuY9Sa/E+J/FDE5JmtfL6WHhNQaSk2/5U9V5N+R97lXh7gM4wlLHV5WlJa6J9Wt/T1Pzh+Iv7L/x70nwRqvx48e679q1ixuoJ7yA3bXF9HETj7Q0g4GxtgwCcA54xX33+yL8c4fjn8JNP1O/vI5PEekAWGsxAjeZVHyzY9JFw2fXcO1b11bWt/ZXOm6haxXNnewPbXMEq7kmicYZGHcEGvirxT+wx8RfC+v3Ou/BP4gpaQySl7eCS6ltLiBCeE81Mh8Zxniu7hjxPwGaYf2WczVKsm9bPka6WetrbO787nj8VeHGKnK2AXPTVnHbmjpZprS6e6a9Laa/op4h8QaH4T0a68ReJdVttM0yxjMtxdXMgSONR3JP8upr89/2gP28vHfjzWpvCf7Oh1DT9KsUknn1WG3zd3SRgs7qCD5UIAJyRuPfHSuen/ZD/AGpPGjw6R4++JaTaT5oeT7XrdxeKmP4hERgsO3T619RfDP8AZ5+HPwv8I3fhfRNME02qWj2upajOoNxdK6lWBP8ACvJwo4Huea7878SMkyimnhpqvN9IvRLq2/yWr9Nzy+HvC7GVqjnjVypfzL8l19XovU+Q9B+EetftQ/CfUfi94LgC/EvwvqHlaxBaAQ/2whUSR3KKuAlyOc7cByufvdfqr9jj/goompXFl8GP2j5DpOv2pWws9eugY1uJF+URXgb/AFcvbf0J+9g8n53/AGPPiBa/s2ftAeKPhb8Q9Tj0vStTL2T3V0+yGK4hYtBKzHgK6Mwz/tLX0l+0v+y18K/2hLP/AISzw14m0TRfFnlhotSiuI2t79ccLOFPPtIOR7jivtMZhcLnFCPPrGSTjJdLrdeR84szrZHjpYasmo3+7un6O/p6H32rK6h0YMrDIIOQR6ilr8WPh3+15+0R+yL43l8Aaj4vs/GGiaLMLe60mW+F7alAOVguBloiBxgcAjBXtX6ffs//ALXXwX/aJ0u2bwj4kgsteeMG40C/kWO9hfHzBVPEqj+8mRjrjpX5/mmQYrLPf+KHdfqun5eZ9phMdTxUU1o3/Wh7TRRRXhHcFFFecfF/9on4N/ArT3vPiX45sNMn8syRaer+bezjtsgXLnPqQB71pSpTrSUKabb6LUUpKCvJ2R6PXlHxn/am+BnwDCw/EnxzbWmoSLuj0y1U3N4w9TEmSo92wK+Bfi3/AMFD/jr8fvEX/Cu/2X/Dmp6DZ3DFBcwosmpTp3dn5S2TuSDkd2FUvgL+wxpPxC1O98bfG74lWnim+W4JvNO0jVxdyeceSLq5Uk7v9lT/AMCr6/AcJTklUx0uVdlv83svxPn8fxDh8HFvr/XT/Ox7Br//AAWA+F9nqMlv4d+E/iTUrNCQlzcXkNsz+4QB8D6ms7/h8T4N/wCiIa1/4OIv/jde1+Hf2cPgR4V09dM0f4T+GhCvJa4sEuZGPqXlDMfzrU/4Ut8Hv+iV+Ef/AAS23/xFe2uHsrSt7Nv/ALef+Z8zLjWd9Iv8DwD/AIfE+Df+iIa1/wCDiL/43XkvxJ/b6/ab/aXgn+H3wa8A3Hh+w1OQ27PpCy3F68Z42Pc4CRgg8kBcetfbP/Clvg9/0Svwj/4Jbb/4iun0jRdH0CyXTdC0mz060T7sFpAsMY+iqAK3w+T5dhZqpTparu2/zOfEcYVatNwUd/T9Eflj8Uv2U/ih+zL4I8L/ABuXxOV8QWuppJeiyY50uckNAwlH3zuUhj0yQBkHNfs9+yz8a7b9oP4EeFPilH5a3mpWnlalEnSK9iJjnXHYb1JHswr5z/aP8KxeNPgT448PyWwneXRbiaBMZPnRL5kZHuGQVw//AARa8ZG/+Fnj3wLNdFn0fW4NQhiJ+5HcQ7SR/wACgP5171GbmtToyfHTxtKTq7p/gz9G6KKK1PXCiiigAooooAKKKKACiiigAr54/wCCg7Mn7GvxRKkgnSYxx6G5izX0PXkf7W3w4134t/s3fED4e+F4xJq+r6Q62UROPNmjZZVjz6sU2j3NAH5v/sAKo+CN4wAy2u3OT6/u4q+lq+Cv2W/2jNF+BNtqHwl+Kmhaho5TUpZnumhbfazEKrRzREbhgp1GTz0719leGfix8M/GUav4Y8eaJqBfpHHeIJPxRiGH5V/J/iBkeY4bO8TiqlGXs5ybUrXi0/NafJ6n7pwrmWErZbRowqLnirNXs7+h1dFAIIDA5B6Ed6K/Pz6kKKKKAPFvjj+yr4C+N18viC9urvR9dSEQ/brUKyyqPuiVD97HTIIOOM9K8Hf/AIJz+IAxEPxXsdmflzpsgOPwevuGivr8r474gyfDrC4XENQWyajK3kuZNpeWx4ON4YyrMKrrV6XvPdptX9bNHzp8G/2Kvh/8ORdX3i+WHxdqN3C1v/pNsFtoY2GG2RkkliP4icjtivlj40fCpfCX7ScPw7+CtvfWV/LJaNpqC9Kul3Ku8COUkFBkgDJyPWv0yr5a/az/AGbvFPjTW7X4u/C2WX/hJdOSNZ7WKTy5ZREcxywtkYkXgYzyAMcjB+t4G42rzz+VbO8S+WrFx1doKV1y3StFK11e2713bPA4o4bhHKlTyuiuaDvteVrO+u71s7X6HnVx+3f+218HNe07wf8AEPW5Y5tGeFrmz1XSoDPdQDs8u3c4ZcjeGz3zX0nf/wDBYP4WxwK2l/CLxTPMT8yz3dvEoGOxBYnn2r5a1n9rP4wXmnW/hv4x/Afwz4tvbBPLS517QJRc4HGTjAz6kAZpf2b/ANnTX/il4/PxU+InhG10fwzFcG6i04WQtobuX+COODHEK8Ek9cY5yTX6/nyyHL8HLMMYoqMU7crS5n0Stu30/wAj8yyWlm2PxCwig1J7vdLz11S9Tt/H3/BRz9pH4/6xafDj4JeHYvCU2rSmCBNOl8/UJ+Ccee4CxjAJJVVIx1rZ+G3/AATr8U+K9Xk8YftIeOrq7urkiSWzs7xri5mb/ptcuDj0wufqK86+JA0/4KftyeGvFYs4NP0aa80+8URRiOKOB18iUgAAADDk4r9Ogyld4cFSMhs8Y9a9LJauFrZfRxeCpqEakVLu9VezfW2x8zxdisblmMlg+bZtX9HbTsfGX7Yeo+Cf2YfgTD8OfhHoVn4fv/GMhsnltVxcNaIAZneU/OxbKpkn+M184/sg+LfEvwE/aG8P6H4mV7Gw8ZW1ta3cMjYVorpA9tKfcOV+mWFdF8dfEjftZftbaZ4O8Ms1z4e0KVdNWZeUMETl7qf6McqD3wvrXf8A7bvwR1DW9G034qeCbR/7Q8MwrBdxW4/efZEO6ORcc5jOen8Jz2rz8z4pwuU5vhsprtL2yk239l6KF/8AE7r1se1kfClbH5DXxUk3JWv1bvv84qz+8+++lFfK37M37b/w98f+DrbSfih4msPDvinS4Viupb+ZYYL8AYE0btxuP8SHnOSMjp6H4t/bE/Zw8H2ktzefFDS9QkjHFtpZN3K59AEBH5kCvo3CSdrH5jUwGJp1HScHfyR7NRXzX8Hv28PhV8YPiBF8PrLR9X0W5viy6bcX5j8u6cDOz5SdjEA4BznpnNfSlKUXHRmNfD1cNLkqxszI8YyxQeENdnnkWOOPTLpnZjgKBE2STXy5/wAES0f+2vitJtOz7NpS7scZ33HFb/7e/wAbNP8Aht8HrzwXZ3SnxB4yiaxgiU/NFaHieU+gx8g9S3sa9p/4JV/BC++FH7NsfifXrD7Nq/j27/thldcSLZhQlsrd+VDSAekldOHVk2fV8O0ZQoyqPaT0+R9m0UUV0H0QUUUUAFFFFABRRRQAUUUUAFFFFAHiXx8/Y2/Z/wD2kALv4j+C4/7XRdkesae/2W+UdgZF4kA9HDAV8a+Of+CKugyvJc/DP4231kckx2+s6cswHoPNiZD+Oyv03ooA/GfW/wBhf/goX8CHef4ea3L4l0+E5VdF1YShgPW2uNp/AKa5Sz/bE+PHwl1hPDvx8+F9yrqdr/aLGTTbvA6kBhsf8AB71+4dc/4z+H/gb4jaQ+g+PfCOkeINPfObfUbNJ0HuAwOD7jmvn8z4VybOE/rmGjJvra0v/AlZ/iergs8zHL2vq9aSS6Xuvud0flhoX7d/wK1a4jt7+fWtI8xQTJdWO6NWPUExsx49cYr1fw/8ZvhP4qh8/QfiJoF0u4Lj7ckbgnttchv0r2DXv+CWH7G+u6pPqi+BdU03zzuNvYaxPFAh/wBlCTt+nSvHfHv/AARd+FupGa4+HPxW8Q6HIzlo4NSt4r6FVxwuV8t+vck18DjvBzKK2uFqzpvztJfkn+J9RhvEHH09K9OMl80/1X4HZRSxXEYlgkSVDyGRgwP4inV8yap/wSq/bF8Bzn/hWfxW0a/gH3fs2sXOnufqjLt/8eNc7efAv/gqV8Pnazh0TxDq8MPSSC7s9RVh7FmLn6Yr5XFeC+Pg/wDZcTCX+JOP5cx7lDxEwsv41GS9Gn+dj69or4lu/jh+3V8P5DaeNfg3qkhTgte+FrlM/wDA4sKajs/+ChPjHSZfsnjD4T2qzKcOIrmW2YevySK2Pzr5/E+FPElD4KcZ/wCGa/8AbuU9Wjxzk9X4pSj6xf6XPt4gN94A/Wivm3wp+3t8F9caKDXrfWfD8r8M1xbiaFT/AL0ZJx77a9t8J/Ez4feO4vN8IeMtJ1XjJS3uVMg+qH5h+Ir5HMeHM2yjXG4ecF3advvWn4nvYTN8Bj/92qxk+19fu3PK/wBrb9n+8+NfhSz1Lw00a+I/Dwle1jYAC8ifBaHd/CcqCpPGSRxnNeBL4u/4KA6l4Ti+GI07xNHp7QDT/OawjjmMI42tdEBsY4LbunevvfB9DSV9Xw/4l5pkOCWBjCNSEfh5r3j5aNXX/DXsfO5xwNluc4n61VupN3drNN99U7M8H/ZX/Zw/4Uhot3qviKa3uvE+rqq3DxfMlrCORCjdznlj0JA9Mn3hlVlKsoKkYIIyCKKK+LzXNcVnWMnjsZK85b/okuiS2PqMDgaGXYeOGw6tGP8AV35s+dPiH+w18JvHGuT6/pd5qPhua6YvNBYBGt2c9WVGHyZ9Ace1Zugf8E/fhBpk6Ta1rfiDWAhyYnmjgjb2Oxd2Po1fTtFezT434hpUFh4YuailZa62/wAVub8Tz5cN5TOq60qEbv7vu2/A+M/2nf2VU8N2OnfEn4FaK+n3GgKhurGwLGXCHclzHyWLqfvdyAD2NULP/gpj8XtJ0e20zVfh7oVzqMMCxPeXBnjaaQDBkaMEDJ6kDAzX23Xw3/wUT+ynxL4HtbdIxcm1umYIAGw0iBc49w361+m+G/HOMx2IpZHjY+0vzNVG3zJJOVnvzbWTureZ8FxxwbgJUpZlFJWt7ttLtpaWat6anoP7K/7Kfxd/bQ+Mi/Hn9ojTb2y8G2U6TiG6geBdSCHMdpbRtyLcfxN0IyMksSP2FgggtYI7a2hSKGFBHHGihVRQMAADoAO1cl8HLe4tPhR4QtrtGWaPRrQOG6g+UvWuxr9xwdZ4jD06zVuaKdu11ex+e1aEcNOVGG0W0vloFFFFdBAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVi654J8G+Jo5IfEfhPRtVSVSjre2MUwZT1B3qcitqigD5l+In/BOH9kL4iQyed8K7bQLqQlvtWgzvZOCe+xSYz9ClfPesf8EX/h3FLJeeEPjP4ospQ5aFLm3hbYOw3oFOffFfo9RWdWmqsHBtq/bcuE/ZyUl0Pyk8T/8ABOn9qnwQGbwB8dvEFykY+RJJpmQgdOUdiP8AvivOdc1L/goL8H4GXXvDFv4otLfg3AsRcPgeoTZJ+a1+0NRXFrbXcZhureKaM9VkQMD+Br43FcHQxD99wqrtVpQb+Uoeza9Xc+gocQSpL3VKD7wnJL7pcy/I/GDQP+CgVlp0UVh8Sfhnq9hqEYCTvaMNpYfePly7WXntk/WvYPCX7WPwF8XpELbx3babcS8fZ9URrZ1PoWb5Pyav0A8e/s7/AAN+KFmtj49+FfhzWYo9xjM9igeMsMEq64ZT7givlj4gf8Eff2avE7S3Pg3WfFHhCeRiypBdLd26ewSYFsf8DrwcX4TZLjYc0U6M/wC5Jyj901+Gh6lDjrMcPKzaqR/vKz/8lZBpms6PrUC3WjatZ38LjKyW06SqfoVJq7g+lfO/if8A4I6/G3wrJLqPwo+Nej30kTboI7hbjTZiO3zoXUH8RXOf8MNf8FNLb9xD4muHROFZfGCYI/Fs/nXyeJ8FsQpf7Ni4tf3otP8ABv8AQ92j4i0Wv31Bp+TT/NI+p7i4gtIJLq7njhhiUvJJIwVUUdSSeAK+HpLe1/a0/bu8JeE/DQGqaDaX9pbSyo2YnsrVjNdSA/3ThwD349a7+z/4Jnft1/Eu5+yfEzx9p+nWSLjfqXiCS8DAnkCOIMD+OK++v2Qf2Hfhr+ybpU17pk76/wCL9RhEV/rtzEEbZnJigTnyo8gZ5LNgZPQD7Dgnw5XC+JljcTVVSo4uKSVkk93rq27W2XXc+f4j4uedUVhqNPkindtu7dtvT8T6OiijgiSGFAkcahVVRgKBwAKfRRX6ekkrI+LbvqwooopgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//2Q=="

/***/ }),
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */
/*!*******************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/components/gaoyia-parse/libs/html2json.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;













var _wxDiscode = _interopRequireDefault(__webpack_require__(/*! ./wxDiscode */ 118));
var _htmlparser = _interopRequireDefault(__webpack_require__(/*! ./htmlparser */ 119));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                 * html2Json 改造来自: https://github.com/Jxck/html2json
                                                                                                                                                                 *
                                                                                                                                                                 *
                                                                                                                                                                 * author: Di (微信小程序开发工程师)
                                                                                                                                                                 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                                                                                 *               垂直微信小程序开发交流社区
                                                                                                                                                                 *
                                                                                                                                                                 * github地址: https://github.com/icindy/wxParse
                                                                                                                                                                 *
                                                                                                                                                                 * for: 微信小程序富文本解析
                                                                                                                                                                 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                                                                                 */function makeMap(str) {var obj = {};var items = str.split(',');for (var i = 0; i < items.length; i += 1) {obj[items[i]] = true;}return obj;} // Block Elements - HTML 5
var block = makeMap('br,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video'); // Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');
// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

function removeDOCTYPE(html) {
  var isDocument = /<body.*>([^]*)<\/body>/.test(html);
  return isDocument ? RegExp.$1 : html;
}

function trimHtml(html) {
  return html.
  replace(/<!--.*?-->/gi, '').
  replace(/\/\*.*?\*\//gi, '').
  replace(/[ ]+</gi, '<').
  replace(/<script[^]*<\/script>/gi, '').
  replace(/<style[^]*<\/style>/gi, '');
}

function getScreenInfo() {
  var screen = {};
  wx.getSystemInfo({
    success: function success(res) {
      screen.width = res.windowWidth;
      screen.height = res.windowHeight;
    } });

  return screen;
}

function html2json(html, customHandler, imageProp, host) {
  // 处理字符串
  html = removeDOCTYPE(html);
  html = trimHtml(html);
  html = _wxDiscode.default.strDiscode(html);
  // 生成node节点
  var bufArray = [];
  var results = {
    nodes: [],
    imageUrls: [] };


  var screen = getScreenInfo();
  function Node(tag) {
    this.node = 'element';
    this.tag = tag;

    this.$screen = screen;
  }

  (0, _htmlparser.default)(html, {
    start: function start(tag, attrs, unary) {
      // node for this element
      var node = new Node(tag);

      if (bufArray.length !== 0) {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
      }

      if (block[tag]) {
        node.tagType = 'block';
      } else if (inline[tag]) {
        node.tagType = 'inline';
      } else if (closeSelf[tag]) {
        node.tagType = 'closeSelf';
      }

      node.attr = attrs.reduce(function (pre, attr) {var
        name = attr.name;var
        value = attr.value;
        if (name === 'class') {
          node.classStr = value;
        }
        // has multi attibutes
        // make it array of attribute
        if (name === 'style') {
          node.styleStr = value;
        }
        if (value.match(/ /)) {
          value = value.split(' ');
        }

        // if attr already exists
        // merge it
        if (pre[name]) {
          if (Array.isArray(pre[name])) {
            // already array, push to last
            pre[name].push(value);
          } else {
            // single value, make it array
            pre[name] = [pre[name], value];
          }
        } else {
          // not exist, put it
          pre[name] = value;
        }

        return pre;
      }, {});

      // 优化样式相关属性
      if (node.classStr) {
        node.classStr += " ".concat(node.tag);
      } else {
        node.classStr = node.tag;
      }
      if (node.tagType === 'inline') {
        node.classStr += ' inline';
      }

      // 对img添加额外数据
      if (node.tag === 'img') {
        var imgUrl = node.attr.src;
        imgUrl = _wxDiscode.default.urlToHttpUrl(imgUrl, imageProp.domain);
        Object.assign(node.attr, imageProp, {
          src: imgUrl || '' });

        if (imgUrl) {
          results.imageUrls.push(imgUrl);
        }
      }

      // 处理a标签属性
      if (node.tag === 'a') {
        node.attr.href = node.attr.href || '';
      }

      // 处理font标签样式属性
      if (node.tag === 'font') {
        var fontSize = [
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        'xx-large',
        '-webkit-xxx-large'];

        var styleAttrs = {
          color: 'color',
          face: 'font-family',
          size: 'font-size' };

        if (!node.styleStr) node.styleStr = '';
        Object.keys(styleAttrs).forEach(function (key) {
          if (node.attr[key]) {
            var value = key === 'size' ? fontSize[node.attr[key] - 1] : node.attr[key];
            node.styleStr += "".concat(styleAttrs[key], ": ").concat(value, ";");
          }
        });
      }

      // 临时记录source资源
      if (node.tag === 'source') {
        results.source = node.attr.src;
      }

      if (customHandler.start) {
        customHandler.start(node, results);
      }

      if (unary) {
        // if this tag doesn't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        var _parent = bufArray[0] || results;
        if (_parent.nodes === undefined) {
          _parent.nodes = [];
        }
        _parent.nodes.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function end(tag) {
      // merge into parent tag
      var node = bufArray.shift();
      if (node.tag !== tag) {
        console.error('invalid state: mismatch end tag');
      }

      // 当有缓存source资源时于于video补上src资源
      if (node.tag === 'video' && results.source) {
        node.attr.src = results.source;
        delete results.source;
      }

      if (customHandler.end) {
        customHandler.end(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (!parent.nodes) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    },
    chars: function chars(text) {
      if (!text.trim()) return;

      var node = {
        node: 'text',
        text: text };


      if (customHandler.chars) {
        customHandler.chars(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    } });


  return results;
}var _default =

html2json;exports.default = _default;

/***/ }),
/* 118 */
/*!*******************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/components/gaoyia-parse/libs/wxDiscode.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; // HTML 支持的数学符号
function strNumDiscode(str) {
  str = str.replace(/&forall;|&#8704;|&#x2200;/g, '∀');
  str = str.replace(/&part;|&#8706;|&#x2202;/g, '∂');
  str = str.replace(/&exist;|&#8707;|&#x2203;/g, '∃');
  str = str.replace(/&empty;|&#8709;|&#x2205;/g, '∅');
  str = str.replace(/&nabla;|&#8711;|&#x2207;/g, '∇');
  str = str.replace(/&isin;|&#8712;|&#x2208;/g, '∈');
  str = str.replace(/&notin;|&#8713;|&#x2209;/g, '∉');
  str = str.replace(/&ni;|&#8715;|&#x220b;/g, '∋');
  str = str.replace(/&prod;|&#8719;|&#x220f;/g, '∏');
  str = str.replace(/&sum;|&#8721;|&#x2211;/g, '∑');
  str = str.replace(/&minus;|&#8722;|&#x2212;/g, '−');
  str = str.replace(/&lowast;|&#8727;|&#x2217;/g, '∗');
  str = str.replace(/&radic;|&#8730;|&#x221a;/g, '√');
  str = str.replace(/&prop;|&#8733;|&#x221d;/g, '∝');
  str = str.replace(/&infin;|&#8734;|&#x221e;/g, '∞');
  str = str.replace(/&ang;|&#8736;|&#x2220;/g, '∠');
  str = str.replace(/&and;|&#8743;|&#x2227;/g, '∧');
  str = str.replace(/&or;|&#8744;|&#x2228;/g, '∨');
  str = str.replace(/&cap;|&#8745;|&#x2229;/g, '∩');
  str = str.replace(/&cup;|&#8746;|&#x222a;/g, '∪');
  str = str.replace(/&int;|&#8747;|&#x222b;/g, '∫');
  str = str.replace(/&there4;|&#8756;|&#x2234;/g, '∴');
  str = str.replace(/&sim;|&#8764;|&#x223c;/g, '∼');
  str = str.replace(/&cong;|&#8773;|&#x2245;/g, '≅');
  str = str.replace(/&asymp;|&#8776;|&#x2248;/g, '≈');
  str = str.replace(/&ne;|&#8800;|&#x2260;/g, '≠');
  str = str.replace(/&le;|&#8804;|&#x2264;/g, '≤');
  str = str.replace(/&ge;|&#8805;|&#x2265;/g, '≥');
  str = str.replace(/&sub;|&#8834;|&#x2282;/g, '⊂');
  str = str.replace(/&sup;|&#8835;|&#x2283;/g, '⊃');
  str = str.replace(/&nsub;|&#8836;|&#x2284;/g, '⊄');
  str = str.replace(/&sube;|&#8838;|&#x2286;/g, '⊆');
  str = str.replace(/&supe;|&#8839;|&#x2287;/g, '⊇');
  str = str.replace(/&oplus;|&#8853;|&#x2295;/g, '⊕');
  str = str.replace(/&otimes;|&#8855;|&#x2297;/g, '⊗');
  str = str.replace(/&perp;|&#8869;|&#x22a5;/g, '⊥');
  str = str.replace(/&sdot;|&#8901;|&#x22c5;/g, '⋅');
  return str;
}

// HTML 支持的希腊字母
function strGreeceDiscode(str) {
  str = str.replace(/&Alpha;|&#913;|&#x391;/g, 'Α');
  str = str.replace(/&Beta;|&#914;|&#x392;/g, 'Β');
  str = str.replace(/&Gamma;|&#915;|&#x393;/g, 'Γ');
  str = str.replace(/&Delta;|&#916;|&#x394;/g, 'Δ');
  str = str.replace(/&Epsilon;|&#917;|&#x395;/g, 'Ε');
  str = str.replace(/&Zeta;|&#918;|&#x396;/g, 'Ζ');
  str = str.replace(/&Eta;|&#919;|&#x397;/g, 'Η');
  str = str.replace(/&Theta;|&#920;|&#x398;/g, 'Θ');
  str = str.replace(/&Iota;|&#921;|&#x399;/g, 'Ι');
  str = str.replace(/&Kappa;|&#922;|&#x39a;/g, 'Κ');
  str = str.replace(/&Lambda;|&#923;|&#x39b;/g, 'Λ');
  str = str.replace(/&Mu;|&#924;|&#x39c;/g, 'Μ');
  str = str.replace(/&Nu;|&#925;|&#x39d;/g, 'Ν');
  str = str.replace(/&Xi;|&#925;|&#x39d;/g, 'Ν');
  str = str.replace(/&Omicron;|&#927;|&#x39f;/g, 'Ο');
  str = str.replace(/&Pi;|&#928;|&#x3a0;/g, 'Π');
  str = str.replace(/&Rho;|&#929;|&#x3a1;/g, 'Ρ');
  str = str.replace(/&Sigma;|&#931;|&#x3a3;/g, 'Σ');
  str = str.replace(/&Tau;|&#932;|&#x3a4;/g, 'Τ');
  str = str.replace(/&Upsilon;|&#933;|&#x3a5;/g, 'Υ');
  str = str.replace(/&Phi;|&#934;|&#x3a6;/g, 'Φ');
  str = str.replace(/&Chi;|&#935;|&#x3a7;/g, 'Χ');
  str = str.replace(/&Psi;|&#936;|&#x3a8;/g, 'Ψ');
  str = str.replace(/&Omega;|&#937;|&#x3a9;/g, 'Ω');

  str = str.replace(/&alpha;|&#945;|&#x3b1;/g, 'α');
  str = str.replace(/&beta;|&#946;|&#x3b2;/g, 'β');
  str = str.replace(/&gamma;|&#947;|&#x3b3;/g, 'γ');
  str = str.replace(/&delta;|&#948;|&#x3b4;/g, 'δ');
  str = str.replace(/&epsilon;|&#949;|&#x3b5;/g, 'ε');
  str = str.replace(/&zeta;|&#950;|&#x3b6;/g, 'ζ');
  str = str.replace(/&eta;|&#951;|&#x3b7;/g, 'η');
  str = str.replace(/&theta;|&#952;|&#x3b8;/g, 'θ');
  str = str.replace(/&iota;|&#953;|&#x3b9;/g, 'ι');
  str = str.replace(/&kappa;|&#954;|&#x3ba;/g, 'κ');
  str = str.replace(/&lambda;|&#955;|&#x3bb;/g, 'λ');
  str = str.replace(/&mu;|&#956;|&#x3bc;/g, 'μ');
  str = str.replace(/&nu;|&#957;|&#x3bd;/g, 'ν');
  str = str.replace(/&xi;|&#958;|&#x3be;/g, 'ξ');
  str = str.replace(/&omicron;|&#959;|&#x3bf;/g, 'ο');
  str = str.replace(/&pi;|&#960;|&#x3c0;/g, 'π');
  str = str.replace(/&rho;|&#961;|&#x3c1;/g, 'ρ');
  str = str.replace(/&sigmaf;|&#962;|&#x3c2;/g, 'ς');
  str = str.replace(/&sigma;|&#963;|&#x3c3;/g, 'σ');
  str = str.replace(/&tau;|&#964;|&#x3c4;/g, 'τ');
  str = str.replace(/&upsilon;|&#965;|&#x3c5;/g, 'υ');
  str = str.replace(/&phi;|&#966;|&#x3c6;/g, 'φ');
  str = str.replace(/&chi;|&#967;|&#x3c7;/g, 'χ');
  str = str.replace(/&psi;|&#968;|&#x3c8;/g, 'ψ');
  str = str.replace(/&omega;|&#969;|&#x3c9;/g, 'ω');
  str = str.replace(/&thetasym;|&#977;|&#x3d1;/g, 'ϑ');
  str = str.replace(/&upsih;|&#978;|&#x3d2;/g, 'ϒ');
  str = str.replace(/&piv;|&#982;|&#x3d6;/g, 'ϖ');
  str = str.replace(/&middot;|&#183;|&#xb7;/g, '·');
  return str;
}

function strcharacterDiscode(str) {
  // 加入常用解析

  // str = str.replace(/&nbsp;|&#32;|&#x20;/g, "&nbsp;");
  // str = str.replace(/&ensp;|&#8194;|&#x2002;/g, '&ensp;');
  // str = str.replace(/&#12288;|&#x3000;/g, '<span class=\'spaceshow\'>　</span>');
  // str = str.replace(/&emsp;|&#8195;|&#x2003;/g, '&emsp;');
  // str = str.replace(/&quot;|&#34;|&#x22;/g, "\"");
  // str = str.replace(/&apos;|&#39;|&#x27;/g, "&apos;");
  // str = str.replace(/&acute;|&#180;|&#xB4;/g, "´");
  // str = str.replace(/&times;|&#215;|&#xD7;/g, "×");
  // str = str.replace(/&divide;|&#247;|&#xF7;/g, "÷");
  // str = str.replace(/&amp;|&#38;|&#x26;/g, '&amp;');
  // str = str.replace(/&lt;|&#60;|&#x3c;/g, '&lt;');
  // str = str.replace(/&gt;|&#62;|&#x3e;/g, '&gt;');




  str = str.replace(/&nbsp;|&#32;|&#x20;/g, "<span class='spaceshow'> </span>");
  str = str.replace(/&ensp;|&#8194;|&#x2002;/g, '<span class=\'spaceshow\'> </span>');
  str = str.replace(/&#12288;|&#x3000;/g, '<span class=\'spaceshow\'>　</span>');
  str = str.replace(/&emsp;|&#8195;|&#x2003;/g, '<span class=\'spaceshow\'> </span>');
  str = str.replace(/&quot;|&#34;|&#x22;/g, "\"");
  str = str.replace(/&quot;|&#39;|&#x27;/g, "'");
  str = str.replace(/&acute;|&#180;|&#xB4;/g, "´");
  str = str.replace(/&times;|&#215;|&#xD7;/g, "×");
  str = str.replace(/&divide;|&#247;|&#xF7;/g, "÷");
  str = str.replace(/&amp;|&#38;|&#x26;/g, '&');
  str = str.replace(/&lt;|&#60;|&#x3c;/g, '<');
  str = str.replace(/&gt;|&#62;|&#x3e;/g, '>');
  return str;
}

// HTML 支持的其他实体
function strOtherDiscode(str) {
  str = str.replace(/&OElig;|&#338;|&#x152;/g, 'Œ');
  str = str.replace(/&oelig;|&#339;|&#x153;/g, 'œ');
  str = str.replace(/&Scaron;|&#352;|&#x160;/g, 'Š');
  str = str.replace(/&scaron;|&#353;|&#x161;/g, 'š');
  str = str.replace(/&Yuml;|&#376;|&#x178;/g, 'Ÿ');
  str = str.replace(/&fnof;|&#402;|&#x192;/g, 'ƒ');
  str = str.replace(/&circ;|&#710;|&#x2c6;/g, 'ˆ');
  str = str.replace(/&tilde;|&#732;|&#x2dc;/g, '˜');
  str = str.replace(/&thinsp;|$#8201;|&#x2009;/g, '<span class=\'spaceshow\'> </span>');
  str = str.replace(/&zwnj;|&#8204;|&#x200C;/g, '<span class=\'spaceshow\'>‌</span>');
  str = str.replace(/&zwj;|$#8205;|&#x200D;/g, '<span class=\'spaceshow\'>‍</span>');
  str = str.replace(/&lrm;|$#8206;|&#x200E;/g, '<span class=\'spaceshow\'>‎</span>');
  str = str.replace(/&rlm;|&#8207;|&#x200F;/g, '<span class=\'spaceshow\'>‏</span>');
  str = str.replace(/&ndash;|&#8211;|&#x2013;/g, '–');
  str = str.replace(/&mdash;|&#8212;|&#x2014;/g, '—');
  str = str.replace(/&lsquo;|&#8216;|&#x2018;/g, '‘');
  str = str.replace(/&rsquo;|&#8217;|&#x2019;/g, '’');
  str = str.replace(/&sbquo;|&#8218;|&#x201a;/g, '‚');
  str = str.replace(/&ldquo;|&#8220;|&#x201c;/g, '“');
  str = str.replace(/&rdquo;|&#8221;|&#x201d;/g, '”');
  str = str.replace(/&bdquo;|&#8222;|&#x201e;/g, '„');
  str = str.replace(/&dagger;|&#8224;|&#x2020;/g, '†');
  str = str.replace(/&Dagger;|&#8225;|&#x2021;/g, '‡');
  str = str.replace(/&bull;|&#8226;|&#x2022;/g, '•');
  str = str.replace(/&hellip;|&#8230;|&#x2026;/g, '…');
  str = str.replace(/&permil;|&#8240;|&#x2030;/g, '‰');
  str = str.replace(/&prime;|&#8242;|&#x2032;/g, '′');
  str = str.replace(/&Prime;|&#8243;|&#x2033;/g, '″');
  str = str.replace(/&lsaquo;|&#8249;|&#x2039;/g, '‹');
  str = str.replace(/&rsaquo;|&#8250;|&#x203a;/g, '›');
  str = str.replace(/&oline;|&#8254;|&#x203e;/g, '‾');
  str = str.replace(/&euro;|&#8364;|&#x20ac;/g, '€');
  str = str.replace(/&trade;|&#8482;|&#x2122;/g, '™');
  str = str.replace(/&larr;|&#8592;|&#x2190;/g, '←');
  str = str.replace(/&uarr;|&#8593;|&#x2191;/g, '↑');
  str = str.replace(/&rarr;|&#8594;|&#x2192;/g, '→');
  str = str.replace(/&darr;|&#8595;|&#x2193;/g, '↓');
  str = str.replace(/&harr;|&#8596;|&#x2194;/g, '↔');
  str = str.replace(/&crarr;|&#8629;|&#x21b5;/g, '↵');
  str = str.replace(/&lceil;|&#8968;|&#x2308;/g, '⌈');
  str = str.replace(/&rceil;|&#8969;|&#x2309;/g, '⌉');
  str = str.replace(/&lfloor;|&#8970;|&#x230a;/g, '⌊');
  str = str.replace(/&rfloor;|&#8971;|&#x230b;/g, '⌋');
  str = str.replace(/&loz;|&#9674;|&#x25ca;/g, '◊');
  str = str.replace(/&spades;|&#9824;|&#x2660;/g, '♠');
  str = str.replace(/&clubs;|&#9827;|&#x2663;/g, '♣');
  str = str.replace(/&hearts;|&#9829;|&#x2665;/g, '♥');
  str = str.replace(/&diams;|&#9830;|&#x2666;/g, '♦');
  return str;
}

function strDiscode(str) {
  str = strNumDiscode(str);
  str = strGreeceDiscode(str);
  str = strcharacterDiscode(str);
  str = strOtherDiscode(str);
  return str;
}

function urlToHttpUrl(url, domain) {
  if (/^\/\//.test(url)) {
    return "https:".concat(url);
  } else if (/^\//.test(url)) {
    return "https://".concat(domain).concat(url);
  }
  return url;
}var _default =

{
  strDiscode: strDiscode,
  urlToHttpUrl: urlToHttpUrl };exports.default = _default;

/***/ }),
/* 119 */
/*!********************************************************************************!*\
  !*** D:/项目/uniapp-blog/uniapp-blog/components/gaoyia-parse/libs/htmlparser.js ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /**
                                                                                                      *
                                                                                                      * htmlParser改造自: https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
                                                                                                      *
                                                                                                      * author: Di (微信小程序开发工程师)
                                                                                                      * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
                                                                                                      *               垂直微信小程序开发交流社区
                                                                                                      *
                                                                                                      * github地址: https://github.com/icindy/wxParse
                                                                                                      *
                                                                                                      * for: 微信小程序富文本解析
                                                                                                      * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
                                                                                                      */
// Regular Expressions for parsing tags and attributes

var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z0-9_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
var attr = /([a-zA-Z0-9_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

function makeMap(str) {
  var obj = {};
  var items = str.split(',');
  for (var i = 0; i < items.length; i += 1) {obj[items[i]] = true;}
  return obj;
}

// Empty Elements - HTML 5
var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');

// Block Elements - HTML 5
var block = makeMap('address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

function HTMLParser(html, handler) {
  var index;
  var chars;
  var match;
  var last = html;
  var stack = [];

  stack.last = function () {return stack[stack.length - 1];};

  function parseEndTag(tag, tagName) {
    // If no tag name is provided, clean shop
    var pos;
    if (!tagName) {
      pos = 0;
    } else {
      // Find the closest opened tag of the same type
      tagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos -= 1) {
        if (stack[pos] === tagName) break;
      }
    }
    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i -= 1) {
        if (handler.end) handler.end(stack[i]);
      }

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }

  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();

    if (block[tagName]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag('', stack.last());
      }
    }

    if (closeSelf[tagName] && stack.last() === tagName) {
      parseEndTag('', tagName);
    }

    unary = empty[tagName] || !!unary;

    if (!unary) stack.push(tagName);

    if (handler.start) {
      var attrs = [];

      rest.replace(attr, function genAttr(matches, name) {
        var value = arguments[2] || arguments[3] || arguments[4] || (fillAttrs[name] ? name : '');

        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\"') // "
        });
      });

      if (handler.start) {
        handler.start(tagName, attrs, unary);
      }
    }
  }

  while (html) {
    chars = true;

    if (html.indexOf('</') === 0) {
      match = html.match(endTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(endTag, parseEndTag);
        chars = false;
      }

      // start tag
    } else if (html.indexOf('<') === 0) {
      match = html.match(startTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(startTag, parseStartTag);
        chars = false;
      }
    }

    if (chars) {
      index = html.indexOf('<');
      var text = '';
      while (index === 0) {
        text += '<';
        html = html.substring(1);
        index = html.indexOf('<');
      }
      text += index < 0 ? html : html.substring(0, index);
      html = index < 0 ? '' : html.substring(index);

      if (handler.chars) handler.chars(text);
    }

    if (html === last) throw new Error("Parse Error: ".concat(html));
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();
}var _default =

HTMLParser;exports.default = _default;

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map