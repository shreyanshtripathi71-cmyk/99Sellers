const fs = require('fs');
const path = require('path');

class Logger {
    constructor() {
        this.logDir = path.join(__dirname, '..', 'logs');
        this.ensureLogDir();
    }

    ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    writeLog(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            ...meta
        };

        const logFile = path.join(this.logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
        const logLine = JSON.stringify(logEntry) + '\n';

        fs.appendFileSync(logFile, logLine);
        
        // Also log to console
        console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, meta);
    }

    info(message, meta) {
        this.writeLog('info', message, meta);
    }

    error(message, meta) {
        this.writeLog('error', message, meta);
    }

    warn(message, meta) {
        this.writeLog('warn', message, meta);
    }

    debug(message, meta) {
        if (process.env.NODE_ENV === 'development') {
            this.writeLog('debug', message, meta);
        }
    }

    api(req, res, responseTime) {
        const logData = {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: `${responseTime}ms`,
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress,
            userId: req.user?.id
        };

        if (res.statusCode >= 400) {
            this.error(`API Error: ${req.method} ${req.url}`, logData);
        } else {
            this.info(`API: ${req.method} ${req.url}`, logData);
        }
    }

    database(operation, details) {
        this.info(`Database: ${operation}`, details);
    }

    subscription(event, details) {
        this.info(`Subscription: ${event}`, details);
    }

    export(dataType, recordCount, fileSize) {
        this.info(`Export: ${dataType}`, {
            recordCount,
            fileSize: `${fileSize}MB`
        });
    }
}

module.exports = new Logger();
