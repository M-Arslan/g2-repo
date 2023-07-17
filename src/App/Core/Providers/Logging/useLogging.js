export const LOG_LEVEL = {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    NONE: 'none'
};

export class Logger {

    #level;

    constructor(logLevel = LOG_LEVEL.WARNING) {
        this.#level = logLevel;
    }

    error() {

    }

    warn() {

    }

    info() {

    }
}

export const useLogging = (logLevel = LOG_LEVEL.WARNING) => {
    return new Logger(logLevel);
}