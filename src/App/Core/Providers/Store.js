
export class Store {
    constructor(state = { loading: false }, dispatch = (() => {})) {
        this.state = state;
        this.dispatch = dispatch;
    }
}