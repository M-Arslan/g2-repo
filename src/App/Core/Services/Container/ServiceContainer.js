
/** @type {Map<string, any>} */
const types = new Map();

/**
 * registerType adds a type mapping to the container.
 * @param {string} name - unique name of this type
 * @param {any} ctor - class to instantiate when this name is resolved
 */
export function registerType(name, ctor) {
    types.set(name, ctor);
}

/**
 * isRegistered verifies whether or not a given name is registered.
 * @param {string} name - unique name of a type
 * @returns {boolean}
 */
export function isRegistered(name) {
    return types.has(name);
}

/**
 * resolveType gets an instance of the class registered for the supplied name
 * @param {string} name - unique name of the type
 * @returns {any}
 */
export function resolveType(name) {
    if (types.has(name) !== true) {
        return null;
    }

    const Type = types.get(name);
    const depMap = (typeof Type.inject === 'object' && Type.inject !== null ? Type.inject : {});
    return Object.keys(depMap).reduce((o, k) => {
        return Object.assign(o, { [k]: resolveType(depMap[k]) });
    }, new Type());
}

/**
 * resolve will get an instance of the supplied class
 * @param {Function} Type - Class to be instantiated
 * @returns {object}
 */
export function resolve(Type) {
    const depMap = (typeof Type.inject === 'object' && Type.inject !== null ? Type.inject : {});
    return Object.keys(depMap).reduce((o, k) => {
        return Object.assign(o, { [k]: resolveType(depMap[k]) });
    }, new Type());
}

/**
 * clear erases all registrations in the container 
 */
export function clear() {
    types.clear();
}