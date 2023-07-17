
export class ReducerAction {
    constructor(type, arg = null) {
        this.type = type;
        this.arg = arg;
    }
}

export class SideEffect {
    constructor(listenFor, completeWith, effect) {
        this.listenFor = listenFor;
        this.completeWith = completeWith;
        this.effect = effect;
    }

    execute(state, action) {
        if (typeof this.effect !== 'function') {
            return Promise.resolve(state);
        }
        else {

        }
    }
}

export const withSideEffects = (reducer, sideEffects = []) => {
    const efx = new Map(sideEffects.map(s => [s.listenFor, s]));
    return (state, action) => {
        if (efx.has(action.type) === true) {

        }
    }
};