interface optionsType {
    /**
     * logger name
     * default = "main"
     */
    name?: string;

    /**
     * if log the stack
     * unrealized
     */
    stack?: boolean;

    /**
     * log file path
     * is undefind? no log file
     */
    filePath?: string;
}

enum log_level {
    DEBUG = 0,
    INFO,
    WARN,
    ERROR,
    FATAL,
}

export default class Logger {
    constructor(options?: optionsType);

    Debug(...message: any): void;

    Info(...message: any): void;

    Warn(...message: any): void;

    Error(...message: any): void;

    Fatal(...message: any): void;

    close(): void;

    setLevel(level: log_level): Logger;

    static clear(): void;

    static New(options?: optionsType): Logger;

    static SetDefaultPath(defaultFilePath: string): typeof Logger;

    public static CloseAll(): void;
}
