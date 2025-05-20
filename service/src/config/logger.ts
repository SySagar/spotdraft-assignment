// src/utils/logger.ts
import winston from 'winston';

winston.addColors({
    info: 'white',
    warn: 'yellow',
    error: 'red'
});


export const logger = winston.createLogger({
    level: 'info',
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `{"level":"${level}" , "message":"${message}" , ${timestamp}}`;
        })
    ),
    transports: [
        new winston.transports.Console()
    ]
});
