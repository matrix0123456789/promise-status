"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _enumifyFork = require("enumify-fork");

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

require("@babel/polyfill");

var ReactivePromiseStatus = /*#__PURE__*/function () {
  function ReactivePromiseStatus() {
    var promise = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var keepOld = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, ReactivePromiseStatus);

    this.promise = promise;
    this.keepOld = keepOld;
    this._onResolve = [];
    this._onReject = [];
  }

  _createClass(ReactivePromiseStatus, [{
    key: "promise",
    get: function get() {
      return this._promise;
    },
    set: function set(promise) {
      var _this = this;

      if (!this.keepOld) {
        this.data = null;
        this.error = null;
        this.status = ReactivePromiseStatus.Status.noPromise;
      }

      this._promise = null;

      if (promise) {
        this._promise = promise;

        if (!this.keepOld) {
          this.status = ReactivePromiseStatus.Status.pending;
        }

        promise.then(function (data) {
          if (_this._promise === promise) {
            _this.data = data;
            _this.status = ReactivePromiseStatus.Status.resolved;

            while (_this._onResolve.length) {
              _this._onResolve.pop()(data);
            }

            _this._onReject = [];
          }
        }, function (error) {
          if (_this._promise === promise) {
            _this.error = error;
            _this.status = ReactivePromiseStatus.Status.rejected;

            while (_this._onReject.length) {
              _this._onReject.pop()(error);
            }

            _this._onResolve = [];
          }
        });
      }
    }
  }, {
    key: "then",
    value: function then(onResolve, onReject) {
      var _this2 = this;

      return new Promise( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(res, rej) {
          var data2, _data;

          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(_this2.status.name == ReactivePromiseStatus.Status.resolved.name)) {
                    _context3.next = 19;
                    break;
                  }

                  if (!onResolve) {
                    _context3.next = 16;
                    break;
                  }

                  _context3.prev = 2;
                  data2 = onResolve(_this2.data);

                  if (!(data2 && data2.then)) {
                    _context3.next = 8;
                    break;
                  }

                  _context3.next = 7;
                  return data2;

                case 7:
                  data2 = _context3.sent;

                case 8:
                  res(data2);
                  _context3.next = 14;
                  break;

                case 11:
                  _context3.prev = 11;
                  _context3.t0 = _context3["catch"](2);
                  rej(_context3.t0);

                case 14:
                  _context3.next = 17;
                  break;

                case 16:
                  res(_this2.data);

                case 17:
                  _context3.next = 40;
                  break;

                case 19:
                  if (!(_this2.status.name == ReactivePromiseStatus.Status.rejected.name)) {
                    _context3.next = 38;
                    break;
                  }

                  if (!onReject) {
                    _context3.next = 35;
                    break;
                  }

                  _context3.prev = 21;
                  _data = onReject(_this2.error);

                  if (!(_data && _data.then)) {
                    _context3.next = 27;
                    break;
                  }

                  _context3.next = 26;
                  return _data;

                case 26:
                  _data = _context3.sent;

                case 27:
                  res(_data);
                  _context3.next = 33;
                  break;

                case 30:
                  _context3.prev = 30;
                  _context3.t1 = _context3["catch"](21);
                  rej(_context3.t1);

                case 33:
                  _context3.next = 36;
                  break;

                case 35:
                  rej(_this2.error);

                case 36:
                  _context3.next = 40;
                  break;

                case 38:
                  if (onResolve) _this2._onResolve.push( /*#__PURE__*/function () {
                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
                      var _data2;

                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              _context.prev = 0;
                              _context.next = 3;
                              return onResolve(_this2.data);

                            case 3:
                              _data2 = _context.sent;
                              res(_data2);
                              _context.next = 10;
                              break;

                            case 7:
                              _context.prev = 7;
                              _context.t0 = _context["catch"](0);
                              rej(_context.t0);

                            case 10:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee, null, [[0, 7]]);
                    }));

                    return function (_x3) {
                      return _ref2.apply(this, arguments);
                    };
                  }());else _this2._onResolve.push(res);
                  if (onReject) _this2._onReject.push( /*#__PURE__*/function () {
                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(error) {
                      var _data3;

                      return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                          switch (_context2.prev = _context2.next) {
                            case 0:
                              _context2.prev = 0;
                              _context2.next = 3;
                              return onReject(_this2.error);

                            case 3:
                              _data3 = _context2.sent;
                              res(_data3);
                              _context2.next = 10;
                              break;

                            case 7:
                              _context2.prev = 7;
                              _context2.t0 = _context2["catch"](0);
                              rej(_context2.t0);

                            case 10:
                            case "end":
                              return _context2.stop();
                          }
                        }
                      }, _callee2, null, [[0, 7]]);
                    }));

                    return function (_x4) {
                      return _ref3.apply(this, arguments);
                    };
                  }());else _this2._onReject.push(rej);

                case 40:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, null, [[2, 11], [21, 30]]);
        }));

        return function (_x, _x2) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }]);

  return ReactivePromiseStatus;
}();

exports["default"] = ReactivePromiseStatus;

ReactivePromiseStatus.Status = /*#__PURE__*/function (_Enum) {
  _inherits(_class, _Enum);

  var _super = _createSuper(_class);

  function _class() {
    _classCallCheck(this, _class);

    return _super.apply(this, arguments);
  }

  return _createClass(_class);
}(_enumifyFork.Enum);

ReactivePromiseStatus.Status.initEnum(['noPromise', 'pending', 'resolved', 'rejected']);