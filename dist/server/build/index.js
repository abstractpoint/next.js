'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var writeBuildStats = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(buildDir, dir) {
    var dist, assetHashMap, buildStatsPath;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dist = (0, _config2.default)(dir).options.dist;
            // Here we can't use hashes in webpack chunks.
            // That's because the "app.js" is not tied to a chunk.
            // It's created by merging a few assets. (commons.js and main.js)
            // So, we need to generate the hash ourself.

            _context2.next = 3;
            return (0, _promise4.default)((0, _path.join)(buildDir, dist, 'app.js'));

          case 3:
            _context2.t0 = _context2.sent;
            _context2.t1 = {
              hash: _context2.t0
            };
            assetHashMap = {
              'app.js': _context2.t1
            };
            buildStatsPath = (0, _path.join)(buildDir, dist, 'build-stats.json');
            _context2.next = 9;
            return _fs2.default.writeFile(buildStatsPath, (0, _stringify2.default)(assetHashMap), 'utf8');

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function writeBuildStats(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var writeBuildId = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(buildDir, dir) {
    var dist, buildIdPath, buildId;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dist = (0, _config2.default)(dir).options.dist;
            buildIdPath = (0, _path.join)(buildDir, dist, 'BUILD_ID');
            buildId = _uuid2.default.v4();
            _context3.next = 5;
            return _fs2.default.writeFile(buildIdPath, buildId, 'utf8');

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function writeBuildId(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var _os = require('os');

var _path = require('path');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _webpack = require('./webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _replace = require('./replace');

var _replace2 = _interopRequireDefault(_replace);

var _promise3 = require('md5-file/promise');

var _promise4 = _interopRequireDefault(_promise3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(dir) {
    var buildDir, compiler;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            buildDir = (0, _path.join)((0, _os.tmpdir)(), _uuid2.default.v4());
            _context.next = 3;
            return (0, _webpack2.default)(dir, { buildDir: buildDir });

          case 3:
            compiler = _context.sent;
            _context.prev = 4;
            _context.next = 7;
            return runCompiler(compiler);

          case 7:
            _context.next = 9;
            return writeBuildStats(buildDir, dir);

          case 9:
            _context.next = 11;
            return writeBuildId(buildDir, dir);

          case 11:
            _context.next = 17;
            break;

          case 13:
            _context.prev = 13;
            _context.t0 = _context['catch'](4);

            console.error('> Failed to build on ' + buildDir);
            throw _context.t0;

          case 17:
            _context.next = 19;
            return (0, _replace2.default)(dir, buildDir);

          case 19:

            // no need to wait
            (0, _del2.default)(buildDir, { force: true });

          case 20:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 13]]);
  }));

  function build(_x) {
    return _ref.apply(this, arguments);
  }

  return build;
}();

function runCompiler(compiler) {
  return new _promise2.default(function (resolve, reject) {
    compiler.run(function (err, stats) {
      if (err) return reject(err);

      var jsonStats = stats.toJson();

      if (jsonStats.errors.length > 0) {
        var error = new Error(jsonStats.errors[0]);
        error.errors = jsonStats.errors;
        error.warnings = jsonStats.warnings;
        return reject(error);
      }

      resolve(jsonStats);
    });
  });
}