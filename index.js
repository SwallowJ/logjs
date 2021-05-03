"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("util"));
var path_1 = __importDefault(require("path"));
var dayjs_1 = __importDefault(require("dayjs"));
var figures_1 = __importDefault(require("figures"));
var log_level;
(function (log_level) {
    log_level[log_level["DEBUG"] = 0] = "DEBUG";
    log_level[log_level["INFO"] = 1] = "INFO";
    log_level[log_level["WARN"] = 2] = "WARN";
    log_level[log_level["ERROR"] = 3] = "ERROR";
    log_level[log_level["FATAL"] = 4] = "FATAL";
    log_level[log_level["SUCCESS"] = 5] = "SUCCESS";
    log_level[log_level["ALERT"] = 6] = "ALERT";
    log_level[log_level["FAILD"] = 7] = "FAILD";
})(log_level || (log_level = {}));
var logEvent = new Map([
    [log_level.DEBUG, { color: "\x1b[90m", type: "Debug" }],
    [log_level.INFO, { color: "\x1b[32m", type: "Info" }],
    [log_level.WARN, { color: "\x1b[33m", type: "Warning" }],
    [log_level.ERROR, { color: "\x1b[31m\x1b[4m", type: "Error" }],
    [log_level.FATAL, { color: "\x1b[47m\x1b[31m\x1b[4m", type: "Fatal" }],
    [log_level.SUCCESS, { color: "\x1b[32m", type: "SUCCESS", prefix: figures_1.default.tick }],
    [log_level.ALERT, { color: "\x1b[33m", type: "Alert", prefix: figures_1.default.warning }],
    [log_level.FAILD, { color: "\x1b[31m\x1b[4m", type: "Faild", prefix: figures_1.default.cross }],
]);
var Logger = /** @class */ (function () {
    function Logger(options) {
        this.name = "main";
        this.level = log_level.INFO;
        var _a = options || {}, _b = _a.filePath, filePath = _b === void 0 ? Logger.defaultFilePath : _b, name = _a.name, _c = _a.stack, stack = _c === void 0 ? true : _c, _d = _a.timeformat, timeformat = _d === void 0 ? "DD-MM-YYYY" : _d;
        this.stack = stack;
        if (filePath) {
            var dir = path_1.default.resolve(process.cwd(), filePath);
            fs_1.default.existsSync(dir) || fs_1.default.mkdirSync(dir);
            var deepDir = path_1.default.resolve(dir, dayjs_1.default().format(timeformat));
            fs_1.default.existsSync(deepDir) || fs_1.default.mkdirSync(deepDir);
            var aft = "";
            name && ((aft = "-" + name), (this.name = name));
            var logPath = path_1.default.resolve(deepDir, name + ".log");
            this.writeStream = fs_1.default.createWriteStream(logPath, { flags: "a" });
        }
    }
    Logger.prototype.__formateAsTime = function (type) {
        var now = dayjs_1.default().format("YYYY-MM-DD HH:mm:ss.SSS");
        var res = "[" + now + "][" + type + "]";
        if (this.stack) {
            res += "[" + this.getStack() + "]";
        }
        return res;
    };
    /**
     * 输出到控制台
     */
    Logger.prototype.__outConsole = function (event) {
        if ((event.level || 0) >= this.level) {
            var res = "";
            if (event.level && event.level > log_level.FATAL) {
                res = "" + event.color + event.prefix + "  " + event.content + "\u001B[0m\n";
            }
            else {
                res = "" + event.color + event.prefix + "\u001B[0m " + event.content + "\n";
            }
            process.stdout.write(res);
        }
    };
    /**
     * 输出到文件
     */
    Logger.prototype.__outFile = function (event) {
        var _a;
        (_a = this.writeStream) === null || _a === void 0 ? void 0 : _a.write(event.prefix + "  " + event.content + "\n");
    };
    Logger.prototype.__buildEvent = function (level, message) {
        var event = logEvent.get(level) || { type: "", color: "" };
        event.content = util_1.default.format.apply(util_1.default, message);
        event.level = level;
        if (level <= log_level.FATAL) {
            event.prefix = this.__formateAsTime(event.type);
        }
        this.__outConsole(event);
        this.__outFile(event);
    };
    Logger.prototype.Debug = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__buildEvent(log_level.DEBUG, message);
    };
    Logger.prototype.Info = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__buildEvent(log_level.INFO, message);
    };
    Logger.prototype.Warn = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__buildEvent(log_level.WARN, message);
    };
    Logger.prototype.Error = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__buildEvent(log_level.ERROR, message);
    };
    Logger.prototype.Fatal = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__buildEvent(log_level.FATAL, message);
        process.exitCode = 1;
    };
    Logger.prototype.Success = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__buildEvent(log_level.SUCCESS, message);
    };
    Logger.prototype.SuccessLine = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__writeLine(log_level.SUCCESS, message);
    };
    Logger.prototype.CommonLine = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__writeLine(log_level.INFO, message);
    };
    Logger.prototype.__writeLine = function (level, message) {
        var str = util_1.default.format.apply(util_1.default, message);
        var _a = logEvent.get(level) || {}, color = _a.color, _b = _a.prefix, prefix = _b === void 0 ? "" : _b;
        this.lineOver();
        process.stdout.write("" + color + prefix + " " + str + "\u001B[0m");
    };
    Logger.prototype.lineOver = function () {
        process.stdout.clearLine(0);
        process.stdout.write("\r");
    };
    Logger.prototype.Alert = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__buildEvent(log_level.ALERT, message);
    };
    Logger.prototype.Faild = function () {
        var message = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            message[_i] = arguments[_i];
        }
        this.__buildEvent(log_level.FAILD, message);
    };
    Logger.prototype.getStack = function () {
        var _a;
        try {
            var obj = Object.create(null);
            Error.captureStackTrace(obj);
            var res = (_a = obj.stack) === null || _a === void 0 ? void 0 : _a.split("\n")[5];
            return res.slice(res.lastIndexOf("/") + 1, -1);
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
        process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
    };
    Logger.New = function (options) {
        if (options === void 0) { options = {}; }
        options.name = options.name || "main";
        var logger = Logger.objArr.find(function (obj) { return obj.name === (options === null || options === void 0 ? void 0 : options.name); }) || new Logger(options);
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
    Logger.defaultFilePath = "./log";
    Logger.objArr = [];
    Logger.levelType = log_level;
    return Logger;
}());
exports.default = Logger;
