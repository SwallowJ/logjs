import { LOGGER } from './lib/typing';
declare enum log_level {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4,
}
export default class Logger implements LOGGER.logger {
    private static defaultFilePath;
    private static objArr;
    static levelType: typeof log_level;
    private stack;
    private name;
    private writeStream?;
    private level;
    constructor(options?: LOGGER.optionsType);
    private output;
    Debug(...message: any): void;
    Info(...message: any): void;
    Warn(...message: any): void;
    Error(...message: any): void;
    Fatal(...message: any): void;
    private getException;
    private getStack;
    close(): void;
    setLevel(level: log_level): this;
    static clear(): void;
    static New(options?: LOGGER.optionsType): Logger;
    static SetDefaultPath(defaultFilePath: string): typeof Logger;
    static CloseAll(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map
