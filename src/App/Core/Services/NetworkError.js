
export class NetworkError extends Error {
    constructor(statusCode, statusText, requestedUri) {
        super('The application has encountered a network error');
        this.status = {
            code: statusCode,
            text: statusText
        };
        this.uri = requestedUri;
    }
}