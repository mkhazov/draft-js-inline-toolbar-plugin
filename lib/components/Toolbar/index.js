'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO make toolbarHeight to be determined or a parameter
var toolbarHeight = 44;

var getRelativeParent = function getRelativeParent(element) {
  if (!element) {
    return null;
  }

  var position = window.getComputedStyle(element).getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

var Toolbar = function (_React$Component) {
  _inherits(Toolbar, _React$Component);

  function Toolbar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Toolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Toolbar.__proto__ || Object.getPrototypeOf(Toolbar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      isVisible: false
    }, _this.onVisibilityChanged = function (isVisible) {
      // need to wait a tick for window.getSelection() to be accurate
      // when focusing editor with already present selection
      setTimeout(function () {
        var position = void 0;
        if (isVisible) {
          var relativeParent = getRelativeParent(_this.toolbar.parentElement);
          var relativeRect = relativeParent ? relativeParent.getBoundingClientRect() : document.body.getBoundingClientRect();
          var selectionRect = (0, _draftJs.getVisibleSelectionRect)(window);

          var toolbarHalfWidth = _this.toolbar.clientWidth / 2;
          var absoluteLeft = selectionRect.left - relativeRect.left;
          var left = absoluteLeft >= _this.toolbar.clientWidth ? absoluteLeft + selectionRect.width / 2 : toolbarHalfWidth; // do not overflow the left border of the relative parent

          var overflowRight = toolbarHalfWidth - (relativeRect.width - left - selectionRect.width / 2);

          if (overflowRight > 0) {
            left -= overflowRight; // do not overflow the right border of the relative parent
          }

          position = {
            top: selectionRect.top - relativeRect.top - toolbarHeight,
            left: left,
            transform: 'translate(-50%) scale(1)',
            transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)'
          };
        } else {
          position = { transform: 'translate(-50%) scale(0)' };
        }
        _this.setState({ position: position });
      }, 0);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Toolbar, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.props.store.subscribeToItem('isVisible', this.onVisibilityChanged);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.store.unsubscribeFromItem('isVisible', this.onVisibilityChanged);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          theme = _props.theme,
          store = _props.store;

      return _react2.default.createElement(
        'div',
        {
          className: theme.toolbarStyles.toolbar,
          style: this.state.position,
          ref: function ref(toolbar) {
            _this2.toolbar = toolbar;
          }
        },
        this.props.structure.map(function (Component, index) {
          return _react2.default.createElement(Component, {
            key: index,
            theme: theme.buttonStyles,
            getEditorState: store.getItem('getEditorState'),
            setEditorState: store.getItem('setEditorState'),
            addLink: store.getItem('addLink')
          });
        })
      );
    }
  }]);

  return Toolbar;
}(_react2.default.Component);

exports.default = Toolbar;