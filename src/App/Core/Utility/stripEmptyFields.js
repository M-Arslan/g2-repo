/**
 * stripEmptyFields sets string properties with a value of empty string to null and 
 * returns a new object.
 * @param {object} obj - object to be modified
 * @returns {object} - returns a shallow copy of the object
 */
export function stripEmptyFields(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    return Object.keys(obj).reduce((rtn, k) => {
        return ({ ...rtn, [k]: (typeof obj[k] === 'string' && obj[k] === '' ? null : obj[k]) })
    }, {});
}

/**
 * deepStripEmptyFields sets string properties with a value of empty string to null in 
 * the supplied object and any child objects and returns a new object
 * @param {object} obj - object to be modified
 * @returns {object} - returns a deep copy of the object
 */
export function deepStripEmptyFields(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    return Object.keys(obj).reduce((rtn, k) => {
        const val = obj[k];
        let value = val;

        if (typeof val === 'object' || val !== null) {
            if (Object.keys(val).length < 1) {
                value = null;
            }
            else {
                value = deepStripEmptyFields(val);
            }
        }
        else if (typeof val === 'string' && val === '') {
            value = null;
        }

        return { ...rtn, [k]: value };
    }, {});
}