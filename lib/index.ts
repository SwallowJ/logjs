import fs from "fs";
import util from "util";
import path from "path";
import dayjs from "dayjs";
import figures from "figures";

enum log_level {
    DEBUG = 0,
    INFO,
    WARN,
    ERROR,
    FATAL,
    SUCCESS,
    ALERT,
    FAILD,
}

const logEvent = new Map<log_level, LOGGER.Event>([
    [log_level.DEBUG, { color: "\x1b[90m", type: "Debug" }],
    [log_level.INFO, { color: "\x1b[32m", type: "Info" }],
    [log_level.WARN, { color: "\x1b[33m", type: "Warning" }],
    [log_level.ERROR, { color: "\x1b[31m\x1b[4m", type: "Error" }],
    [log_level.FATAL, { color: "\x1b[47m\x1b[31m\x1b[4m", type: "Fatal" }],

    [log_level.SUCCESS, { color: "\x1b[32m", type: "SUCCESS", prefix: figures.tick }],
    [log_level.ALERT, { color: "\x1b[33m", type: "Alert", prefix: figures.warning }],
    [log_level.FAILD, { color: "\x1b[31m\x1b[4m", type: "Faild", prefix: figures.cross }],
]);

export default class Logger implements LOGGER.logger {
    private static defaultFilePath: string = "./log";
    private static objArr: Logger[] = [];
    public static levelType = log_level;

    private stack: boolean;
    private name: string = "main";
    private writeStream?: fs.WriteStream;
    private level: log_level = log_level.INFO;

    constructor(options?: LOGGER.optionsType) {
        const { filePath = Logger.defaultFilePath, name, stack = true } = options || {};

        this.stack = stack;

        if (filePath) {
            const dir = path.resolve(process.cwd(), filePath);
            fs.existsSync(dir) || fs.mkdirSync(dir);

            const deepDir = path.resolve(dir, dayjs().format("YY-MM-DD"));
            fs.existsSync(deepDir) || fs.mkdirSync(deepDir);

            let aft = "";
            name && ((aft = `-${name}`), (this.name = name));

            const logPath = path.resolve(deepDir, `${name}.log`);
            console.log(logPath);
            this.writeStream = fs.createWriteStream(logPath, { flags: "a" });
        }
    }

    private __formateAsTime(type: string) {
        const now = dayjs().format("YYYY-MM-DD HH:mm:ss.SSS");
        let res = `[${now}][${type}]`;

        if (this.stack) {
            res += `[${this.getStack()}]`;
        }
        return res;
    }

    /**
     * 输出到控制台
     */
    private __outConsole(event: LOGGER.Event) {
        if ((event.level || 0) >= this.level) {
            let res = "";

            if (event.level && event.level > log_level.FATAL) {
                res = `${event.color}${event.prefix}  ${event.content}\x1b[0m\n`;
            } else {
                res = `${event.color}${event.prefix}\x1b[0m ${event.content}\n`;
            }
            process.stdout.write(res);
        }
    }

    /**
     * 输出到文件
     */
    private __outFile(event: LOGGER.Event) {
        this.writeStream?.write(`${event.prefix}  ${event.content}\n`);
    }

    private __buildEvent(level: log_level, message: any[]) {
        const event: LOGGER.Event = logEvent.get(level) || { type: "", color: "" };
        event.content = util.format(...message);
        event.level = level;

        if (level <= log_level.FATAL) {
            event.prefix = this.__formateAsTime(event.type);
        }

        this.__outConsole(event);
        this.__outFile(event);
    }

    public Debug(...message: any[]) {
        this.__buildEvent(log_level.DEBUG, message);
    }

    public Info(...message: any[]) {
        this.__buildEvent(log_level.INFO, message);
    }

    public Warn(...message: any[]) {
        this.__buildEvent(log_level.WARN, message);
    }

    public Error(...message: any[]) {
        this.__buildEvent(log_level.ERROR, message);
    }

    public Fatal(...message: any[]) {
        this.__buildEvent(log_level.FATAL, message);
        process.exitCode = 1;
    }

    public Success(...message: any[]) {
        this.__buildEvent(log_level.SUCCESS, message);
    }

    public Alert(...message: any[]) {
        this.__buildEvent(log_level.ALERT, message);
    }

    public Faild(...message: any[]) {
        this.__buildEvent(log_level.FAILD, message);
    }

    private getStack() {
        try {
            const obj = Object.create(null);
            Error.captureStackTrace(obj);

            const res: string[] = obj.stack?.split("\n")[5];
            return res.slice(res.lastIndexOf("/") + 1, -1);
        } catch (e) {
            this.Error(e);
        }
    }

    public close() {
        this.writeStream?.close();
    }

    public setLevel(level: log_level) {
        this.level = level;
        return this;
    }

    public static clear() {
        process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
    }

    public static New(options: LOGGER.optionsType = {}) {
        options.name = options.name || "main";
        const logger = Logger.objArr.find((obj) => obj.name === options?.name) || new Logger(options);
        Logger.objArr.push(logger);
        return logger;
    }

    public static SetDefaultPath(defaultFilePath: string) {
        Logger.defaultFilePath = defaultFilePath;
        return this;
    }

    public static CloseAll() {
        Logger.objArr.map((obj) => {
            obj.close();
        });
        Logger.objArr = [];
    }
}
