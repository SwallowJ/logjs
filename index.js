"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var dayjs_1 = __importDefault(require("dayjs"));
var log_level;
(function (log_level) {
    log_level[log_level["DEBUG"] = 0] = "DEBUG";
    log_level[log_level["INFO"] = 1] = "INFO";
    log_level[log_level["WARN"] = 2] = "WARN";
    log_level[log_level["ERROR"] = 3] = "ERROR";
    log_level[log_level["FATAL"] = 4] = "FATAL";
})(log_level || (log_level = {}));
var level_map = new Map([
    [log_level.DEBUG, { style: '', name: 'Debug' }],
    [log_level.INFO, { style: '\x1b[32m', name: 'Info' }],
    [log_level.WARN, { style: '\x1b[33m', name: 'Warning' }],
    [log_level.ERROR, { style: '\x1b[31m\x1b[4m', name: 'Error' }],
    [log_level.FATAL, { style: '\x1b[47m\x1b[31m\x1b[4m', name: 'Fatal' }],
]);
var Logger = /** @class */ (function () {
    function Logger(options) {
        var _this = this;
        this.name = 'main';
        this.level = log_level.INFO;
        this.output = function (level, message) {
            var _a;
            var now = dayjs_1.default().format('YYYY-MM-DD HH:mm:ss SSS');
            var stack = _this.stack ? "[" + _this.getStack() + "]" : '';
            var _b = level_map.get(level), style = _b.style, name = _b.name;
            var str = "[" + now + "][" + name + "][" + _this.name + "]" + stack + " " + message;
            level >= _this.level && process.stdout.write("" + style + str + "\u001B[0m\n");
            (_a = _this.writeStream) === null || _a === void 0 ? void 0 : _a.write(str + "\n");
        };
        var _a = options || {}, _b = _a.filePath, filePath = _b === void 0 ? Logger.defaultFilePath : _b, name = _a.name, stack = _a.stack;
        this.stack = stack || false;
        if (filePath) {
            var dir = path_1.default.resolve(process.cwd(), filePath);
            fs_1.default.existsSync(dir) || fs_1.default.mkdirSync(dir);
            var aft = '';
            name && ((aft = "-" + name), (this.name = name));
            var logPath = path_1.default.resolve(dir, "" + dayjs_1.default().format('YYYY-MM-DD') + aft + ".log");
            this.writeStream = fs_1.default.createWriteStream(logPath, { flags: 'a' });
        }
    }
    Logger.prototype.Debug = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.output(log_level.DEBUG, message);
    };
    Logger.prototype.Info = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.output(log_level.INFO, message);
    };
    Logger.prototype.Warn = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.output(log_level.WARN, message);
    };
    Logger.prototype.Error = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.output(log_level.ERROR, message);
    };
    Logger.prototype.Fatal = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.output(log_level.FATAL, message);
        process.exitCode = 1;
    };
    Logger.prototype.getException = function () {
        try {
            throw Error();
        }
        catch (e) {
            return e;
        }
    };
    Logger.prototype.getStack = function () {
        var _a, _b;
        try {
            var err = this.getException();
            return "" + ((_b = (_a = err.stack) === null || _a === void 0 ? void 0 : _a.split('\n')[5].split('/').pop()) === null || _b === void 0 ? void 0 : _b.replace(/[()]/, ''));
        }
        catch (e) {
            this.Error(e);
        }
    };
    Logger.prototype.close = function () {
        var _a;
        (_a = this.writeStream) === null || _a === void 0 ? void 0 : _a.close();
    };
    Logger.prototype.setLevel = function (level) {
        this.level = level;
        return this;
    };
    Logger.clear = function () {
        process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
    };
    Logger.New = function (options) {
        var name = (options === null || options === void 0 ? void 0 : options.name) || 'main';
        var logger = Logger.objArr.find(function (obj) { return obj.name === name; }) || new Logger(options);
        Logger.objArr.push(logger);
        return logger;
    };
    Logger.SetDefaultPath = function (defaultFilePath) {
        Logger.defaultFilePath = defaultFilePath;
        return this;
    };
    Logger.CloseAll = function () {
        Logger.objArr.map(function (obj) {
            obj.close();
        });
        Logger.objArr = [];
    };
    Logger.defaultFilePath = '';
    Logger.objArr = [];
    Logger.levelType = log_level;
    return Logger;
}());
exports.default = Logger;
