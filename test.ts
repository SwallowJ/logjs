const Logger = require('./index.js');

process.on('exit', () => {
    Logger.CloseAll();
});

Logger.SetDefaultPath('./log');
const logger = Logger.New({ name: 'translate', stack: true });

logger.Info('Test');
