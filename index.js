"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dayjs_1 = __importDefault(require("dayjs"));
var log_level;
(function (log_level) {
    log_level[log_level["DEBUG"] = 0] = "DEBUG";
    log_level[log_level["INFO"] = 1] = "INFO";
    log_level[log_level["WARN"] = 2] = "WARN";
    log_level[log_level["ERROR"] = 3] = "ERROR";
    log_level[log_level["FATAL"] = 4] = "FATAL";
})(log_level || (log_level = {}));
const level_map = new Map([
    [log_level.DEBUG, { style: '', name: 'Debug' }],
    [log_level.INFO, { style: '\x1b[32m', name: 'Info' }],
    [log_level.WARN, { style: '\x1b[33m', name: 'Warning' }],
    [log_level.ERROR, { style: '\x1b[31m\x1b[4m', name: 'Error' }],
    [log_level.FATAL, { style: '\x1b[47m\x1b[31m\x1b[4m', name: 'Fatal' }],
]);
class Logger {
    constructor(options) {
        this.name = 'main';
        this.level = log_level.INFO;
        this.output = (level, message) => {
            const now = dayjs_1.default().format('YYYY-MM-DD HH:mm:ss SSS');
            const stack = this.stack ? `[${this.getStack()}]` : '';
            const { style, name } = level_map.get(level);
            const str = `[${now}][${name}][${this.name}]${stack} ${message}`;
            level >= this.level && process.stdout.write(`${style}${str}\x1b[0m\n`);
            this.writeStream?.write(`${str}\n`);
        };
        const { filePath = Logger.defaultFilePath, name, stack } = options || {};
        this.stack = stack || false;
        if (filePath) {
            const dir = path_1.default.resolve(process.cwd(), filePath);
            fs_1.default.existsSync(dir) || fs_1.default.mkdirSync(dir);
            let aft = '';
            name && ((aft = `-${name}`), (this.name = name));
            const logPath = path_1.default.resolve(dir, `${dayjs_1.default().format('YYYY-MM-DD')}${aft}.log`);
            this.writeStream = fs_1.default.createWriteStream(logPath, { flags: 'a' });
        }
    }
    Debug(...message) {
        this.output(log_level.DEBUG, message);
    }
    Info(...message) {
        this.output(log_level.INFO, message);
    }
    Warn(...message) {
        this.output(log_level.WARN, message);
    }
    Error(...message) {
        this.output(log_level.ERROR, message);
    }
    Fatal(...message) {
        this.output(log_level.FATAL, message);
        process.exitCode = 1;
    }
    getException() {
        try {
            throw Error();
        }
        catch (e) {
            return e;
        }
    }
    getStack() {
        try {
            const err = this.getException();
            return `${err.stack?.split('\n')[5].split('/').pop()?.replace(/[()]/, '')}`;
        }
        catch (e) {
            this.Error(e);
        }
    }
    close() {
        this.writeStream?.close();
    }
    setLevel(level) {
        this.level = level;
        return this;
    }
    static clear() {
        process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
    }
    static New(options) {
        const name = options?.name || 'main';
        const logger = Logger.objArr.find((obj) => obj.name === name) || new Logger(options);
        Logger.objArr.push(logger);
        return logger;
    }
    static SetDefaultPath(defaultFilePath) {
        Logger.defaultFilePath = defaultFilePath;
        return this;
    }
    static CloseAll() {
        Logger.objArr.map((obj) => {
            obj.close();
        });
        Logger.objArr = [];
    }
}
exports.default = Logger;
Logger.defaultFilePath = '';
Logger.objArr = [];
Logger.levelType = log_level;
