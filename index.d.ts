import { LOGGER } from "./typing";
declare enum log_level {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4,
    SUCCESS = 5,
    ALERT = 6,
    FAILD = 7,
}
export default class Logger implements LOGGER.logger {
    private static defaultFilePath;
    private static objArr;
    static levelType: typeof log_level;
    static globalLevel: log_level;
    private stack;
    private name;
    private writeStream?;
    private level;
    constructor(options?: LOGGER.optionsType);
    private __formateAsTime;
    /**
     * 输出到控制台
     */
    private __outConsole;
    /**
     * 输出到文件
     */
    private __outFile;
    private __buildEvent;
    Debug(...message: any[]): void;
    Info(...message: any[]): void;
    Warn(...message: any[]): void;
    Error(...message: any[]): void;
    Fatal(...message: any[]): void;
    Success(...message: any[]): void;
    SuccessLine(...message: string[]): void;
    FailedLine(...message: string[]): void;
    CommonLine(...message: string[]): void;
    private __writeLine;
    lineOver(): void;
    Alert(...message: any[]): void;
    Faild(...message: any[]): void;
    private getStack;
    close(): void;
    setLevel(level: log_level): this;
    static clear(): void;
    static New(options?: LOGGER.optionsType): Logger;
    static SetDefaultPath(defaultFilePath: string): typeof Logger;
    static CloseAll(): void;
    static setGlobalLevel(level: log_level): typeof Logger;
}
export {};
