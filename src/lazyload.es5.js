/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * 图片懒加载 v0.1
	 * 支持IE9+
	 * 0、参数说明:
	 * wrap: document.body,			// 滚动容器,默认body滚动
	 * attr: 'data-resources',		// 自定义属性
	 * offset: 200,					// 提前多少距离开始出现
	 * watch: false,				// 是否开启观察，开启后动态添加的图片也能懒加载
	 * error: DEFAULT_URL,			// 图片加载错误之后显示的图片
	 * loading: DEFAULT_URL, 		// 图片加载中显示的图片
	 * state:{						// 图片对应状态时拥有的属性名
	 * 		loading: 'imgloading',	// 图片加载中	
	 * 	 	loaded : 'imgloaded',	// 图片加载完毕
	 * 	 	error  : 'imgerror'		// 图片加载失败
	 * }
	 * 
	 * 1、支持自定义样式:
	 * img[imgloading]{}	加载中
	 * img[loaded]{}		加载结束
	 * img[error]{}			加载失败
	 *
	 * 2、支持异步图片的懒加载，需手动开启watch
	 * 3、支持窗口滚动和部分容器滚动加载
	 */
	'use strict';
	// 默认加载图片

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DEFAULT_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
	var opts = {};
	var _ = {
		on: function on(obj, type, listener) {
			obj.addEventListener(type, listener);
		},
		off: function off(obj, type, listener) {
			obj.removeEventListener(type, listener);
		}
	};
	// nodelist => array
	function nodelistsToArray(nodelists) {
		var arrtmp = new Array();
		for (var i = 0, j = nodelists.length; i < j; i++) {
			arrtmp.push(nodelists[i]);
		}
		return arrtmp;
	}

	var Lazyload = function () {
		/**
	  * 构造函数
	  * @param  {Object} options 配置选项
	  * @return {[type]}          [description]
	  */
		function Lazyload(options) {
			_classCallCheck(this, Lazyload);

			this._VERSIONS = '0.1';
			// 默认配置
			var defaults = {
				wrap: document.body, // 滚动容器,默认body滚动
				attr: 'data-resources', // 自定义属性
				offset: 200, // 提前多少距离开始出现
				watch: false, // 是否开启观察，开启后动态添加的图片也能懒加载
				error: DEFAULT_URL, // 图片加载错误之后显示的图片
				loading: DEFAULT_URL, // 图片加载中显示的图片
				state: { // 图片对应状态时拥有的属性名
					loading: 'imgloading', // 图片加载中	
					loaded: 'imgloaded', // 图片加载完毕
					error: 'imgerror' // 图片加载失败
				}
			};

			opts = options || {};
			for (var def in defaults) {
				if (typeof opts[def] == 'undefined') {
					opts[def] = defaults[def];
				}
			}

			// 支持css选择器
			if (typeof opts.wrap == 'string') opts.wrap = document.querySelector(opts.wrap);

			// 容器元素
			this.wrap = opts.wrap;

			// 初始化加载
			this.init();
		}

		// 存储页面上需要懒加载的但还没加载的图片


		_createClass(Lazyload, [{
			key: 'saveImages',
			value: function saveImages() {
				// 存放待加载的图片
				this.imgLists = nodelistsToArray(document.querySelectorAll('[' + opts.attr + ']:not([' + opts.state.loaded + '])')) || [];
			}

			/**
	   * 加载图片
	   * @param  { DOM } image   	  页面图片对象
	   * @param  {function} success 加载成功回调
	   * @param  {function} error   加载失败回调
	   * @return {[type]}         [description]
	   */

		}, {
			key: '_loadImage',
			value: function _loadImage(image, success, error) {
				var img = new Image();
				img.src = image.getAttribute(opts.attr);
				img.onload = function () {
					success && success(image);
				};
				img.onerror = function () {
					error && error(image);
				};
			}

			/**
	   * 位置检测
	   * 如果元素相对于容器顶部的距离比容器的高度小，是否就表示已经出现？
	   * 
	   * @param  { DOM } 	   image    定位的元素
	   * @param  { function } canshow 出现在视口后调用的回调
	   */

		}, {
			key: '_imgPosition',
			value: function _imgPosition(image, canshow) {
				var wrap = this.wrap,
				    // 容器
				clientHeight = wrap == document.body ? // 视口高度
				document.documentElement.clientHeight : wrap.clientHeight,
				    wrapTop = wrap.getBoundingClientRect().top,
				    // 容器距离顶部的距离
				imgTop = image.getBoundingClientRect().top; // 元素相对于window视口的距离

				// 分两种情况，如果以window为滚动对象，
				// 则只要判断元素相对于视口的位置<视口的高度即可 
				// 
				// opts.offset表示提前多少距离开始加载
				// 
				// 如果是页面上部分区域，以块级元素为对象
				// 则需判断元素在容器视口内的距离
				// 如果元素相对于容器顶部的距离<容器的视口高度，则表示元素可见
				if (wrap == document.body && imgTop <= clientHeight + opts.offset) {
					canshow && canshow(image);
				} else if (imgTop - wrapTop <= clientHeight + opts.offset) {
					canshow && canshow(image);
				}
			}

			// 开始加载所有图片

		}, {
			key: '_loadAllImage',
			value: function _loadAllImage() {
				var _this = this;

				// 如果开启观察模式，则每次检测所有未加载的图片
				if (opts.watch) this.saveImages();

				var imglists = this.imgLists;

				for (var i = 0, j = imglists.length; i < j; i++) {
					// 检测图片位置
					this._imgPosition(imglists[i], function (img) {
						// 图片加载中
						img.setAttribute(opts.state.loading, '');
						img.setAttribute('src', opts.loading);

						_this._loadImage(img, function (image) {
							// 图片加载完毕
							img.setAttribute('src', image.getAttribute(opts.attr));
							img.removeAttribute(opts.state.loading);
							img.setAttribute(opts.state.loaded, '');
							// 重新保存未加载的图片，(待修改)？？？
							_this.saveImages();
						}, function (image) {
							// 图片加载失败
							img.setAttribute('src', opts.error);
							img.removeAttribute(opts.state.loading);
							img.setAttribute(opts.state.error, '');
						});
					});
				}
			}

			// 初始化加载事件

		}, {
			key: 'init',
			value: function init() {
				var _self = this;
				var wrap = _self.wrap;
				if (wrap == document.body) wrap = window;
				// 初始化时先执行一次，加载可见区域的图片
				_self.saveImages();
				_self._loadAllImage();

				_.on(wrap, 'scroll', function () {
					_self._loadAllImage();
				});

				_.on(wrap, 'resize', function () {
					_self._loadAllImage();
				});
			}
			// 重新加载

		}, {
			key: 'refresh',
			value: function refresh() {
				this._loadAllImage();
			}
		}]);

		return Lazyload;
	}();

	exports.default = Lazyload;

	// 暴露全局变量

	global.Lazyload = Lazyload;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ]);