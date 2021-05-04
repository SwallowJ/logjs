export namespace LOGGER {
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

        timeformat?: string;

        level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    }

    interface levelType {
        style: string;
        name: string;
    }

    interface Event {
        content?: string;
        prefix?: string;
        type: string;
        color: string;
        level?: number;
    }

    interface logger {
        Debug(...message: any): void;
        Info(...message: any): void;
        Warn(...message: any): void;
        Error(...message: any): void;
        Fatal(...message: any): void;

        /**
         * close the writeStream
         */
        close(): void;

        /**
         * @param level log level
         */
        setLevel(level: log_level): void;
    }
}
