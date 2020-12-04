import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import { LOGGER } from './typing';

enum log_level {
    DEBUG = 0,
    INFO,
    WARN,
    ERROR,
    FATAL,
}

const level_map = new Map<log_level, LOGGER.levelType>([
    [log_level.DEBUG, { style: '', name: 'Debug' }],
    [log_level.INFO, { style: '\x1b[32m', name: 'Info' }],
    [log_level.WARN, { style: '\x1b[33m', name: 'Warning' }],
    [log_level.ERROR, { style: '\x1b[31m\x1b[4m', name: 'Error' }],
    [log_level.FATAL, { style: '\x1b[47m\x1b[31m\x1b[4m', name: 'Fatal' }],
]);

export default class Logger implements LOGGER.logger {
    private static defaultFilePath: string = '';
    private static objArr: Logger[] = [];
    public static levelType = log_level;

    private stack: boolean;
    private name: string = 'main';
    private writeStream?: fs.WriteStream;
    private level: log_level = log_level.INFO;

    constructor(options?: LOGGER.optionsType) {
        const { filePath = Logger.defaultFilePath, name, stack } = options || {};

        this.stack = stack || false;

        if (filePath) {
            const dir = path.resolve(process.cwd(), filePath);

            fs.existsSync(dir) || fs.mkdirSync(dir);

            let aft = '';
            name && ((aft = `-${name}`), (this.name = name));

            const logPath = path.resolve(dir, `${dayjs().format('YYYY-MM-DD')}${aft}.log`);
            this.writeStream = fs.createWriteStream(logPath, { flags: 'a' });
        }
    }

    private output = (level: log_level, message?: any) => {
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss SSS');

        const stack = this.stack ? `[${this.getStack()}]` : '';
        const { style, name } = level_map.get(level)!;

        const str = `[${now}][${name}][${this.name}]${stack} ${message}`;

        level >= this.level && process.stdout.write(`${style}${str}\x1b[0m\n`);
        this.writeStream?.write(`${str}\n`);
    };

    public Debug(...message: any) {
        this.output(log_level.DEBUG, message);
    }

    public Info(...message: any) {
        this.output(log_level.INFO, message);
    }

    public Warn(...message: any) {
        this.output(log_level.WARN, message);
    }

    public Error(...message: any) {
        this.output(log_level.ERROR, message);
    }

    public Fatal(...message: any) {
        this.output(log_level.FATAL, message);
        process.exitCode = 1;
    }

    private getException(): Error {
        try {
            throw Error();
        } catch (e) {
            return e;
        }
    }

    private getStack() {
        try {
            const err = this.getException();
            return `${err.stack?.split('\n')[5].split('/').pop()?.replace(/[()]/, '')}`;
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
        process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
    }

    public static New(options?: LOGGER.optionsType) {
        const name = options?.name || 'main';

        const logger = Logger.objArr.find((obj) => obj.name === name) || new Logger(options);
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
