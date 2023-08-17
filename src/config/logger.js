// Logger Config
const { createLogger, transports, format } = require('winston')

module.exports = createLogger({
    format: format.combine(
        format.json(),
        format.splat(),
        format.errors({ stack: true }),
        format.timestamp({ format: 'ddd , MM YYYY HH:mm:ss' }),
        format.printf(({ level, timestamp, message }) => {
            return `[${timestamp}] - [${level.toUpperCase()}] - ${message}`
        })
    ),

    transports: [
        new transports.Console(
            format.combine(format.colorize(), format.simple())
        ),
        new transports.File({ filename: 'appDevelopment.log' }),
    ],

    exceptionHandlers: [
        new transports.File({ filename: 'exceptionHandlers.log' }),
    ],

    exitOnError: false,
})
