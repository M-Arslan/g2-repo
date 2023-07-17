export class FormFormatter {
    constructor(fn) {
        this.fn = (typeof fn === 'function' ? fn : (value) => value);
    }

    format(value) {
        return this.fn(value);
    }
}