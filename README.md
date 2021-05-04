## 个人 logger 日志模块

1. env typescript-4.1

## Usgae

```ts
import Logger from "./index";

process.on("exit", () => {
    Logger.CloseAll();
});

const logger = Logger.New({ name: "translate" });

logger.Info("Test");
```

### Type of logger

```ts
interface logger {
    Debug(...message: any[]): void;
    Info(...message: any[]): void;
    Warn(...message: any[]): void;
    Error(...message: any[]): void;
    Fatal(...message: any[]): void;
    Success(...message: any[]): void;
    SuccessLine(...message: string[]): void;
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

## 日志级别设置

```ts
//独立设置
Logger.New({ level: 0 });

//全局设置
Logger.setGlobalLevel(0);

//环境变量
export LOGGER_LEVEL = 0;

//默认值 default=1
```
