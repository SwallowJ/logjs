## 个人 logger 日志模块

1. env typescript-4.1

### Usgae

```ts
import Logger from './index';

process.on('exit', () => {
    Logger.CloseAll();
});

Logger.SetDefaultPath('./log');
const logger = Logger.New({ name: 'translate', stack: true });

logger.Info('Test');
```

### Type of logger

```ts
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
```

### Type of options

```ts
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
```
