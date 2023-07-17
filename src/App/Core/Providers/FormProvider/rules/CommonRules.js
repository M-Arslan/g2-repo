import { capitalize, sentencize } from "../../../Utility/capitalize";
import { ensureIsNumber, ensureNonEmptyArray, ensureNonEmptyString, ensureNonNullObject } from "../../../Utility/rules";
import { FormRule } from './FormRule';
import moment from 'moment';

export const Conditional = (rule, condition) => new FormRule((value, obj) => {
    if (rule instanceof FormRule && typeof condition === 'function' && condition(obj) === true) {
        return rule.fn(value, obj);
    }
    else {
        return true;
    }
}, rule.message);

export const Required = new FormRule((value) => ensureNonEmptyString(value) || ensureNonNullObject(value), 'Required');

export const RequiredNumber = new FormRule((value) => (typeof value === 'number'), 'Required');

export const Pattern = (regex, message = 'Invalid input') => new FormRule((value) => (ensureNonEmptyString(value) === false || regex.test(value)), message);

export const Email = Pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/);

export const EmailList = new FormRule((/** @type {string} */ value) => {
   if (ensureNonEmptyString(value) === false) {
        return true;
    }

    /** @type {Array<string>} */
    const ls = value.replaceAll(' ', ';').replaceAll(',', ';').split(';');
    return ls.every(em => Email.verify(em).valid === true);
}, 'Must be valid list of email addresses');

export const Phone = Pattern(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/);

export const USZip = Pattern(/^\d{5}(-\d{4})?$/);

export const Name = Pattern(/^[A-Za-z\s-'`]+$/);

export const MaxLength = (max) => new FormRule((value) => (ensureNonEmptyString(value) ? value.length <= max : true), `Must be less than ${max + 1} characters`);

export const MinLength = (min) => new FormRule((v) => (ensureNonEmptyString(v) ? v.length >= min : true), `Must be more than ${min - 1} characters`);

export const Min = (min) => new FormRule((v) => ((typeof v === 'number' && v >= min) || (typeof v === 'string' && parseInt(v) >= min) || isNaN(parseInt(v))), 'Less than minimum allowed value');

export const Max = (max) => new FormRule((v) => ((typeof v === 'number' && v <= max) || (typeof v === 'string' && parseInt(v) <= max) || isNaN(parseInt(v))), 'More than maximum allowed value');

export const isNumeric = new FormRule((v) => (v === null || (typeof v === 'string' && ensureNonEmptyString(v) === false) || ensureIsNumber(v) || (typeof v === 'string' && /^\d*$/.test(v))), 'Input must be numeric');

//export const Currency = Pattern(/^\$?\-?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$/);

export const Currency = new FormRule((v) => true);

export const NonEmptyArray = (message) => new FormRule(v => ensureNonEmptyArray(v), message);

export const DateRules = (property) => ({
    mustBeBefore: (prop, data, message) => {
        if (ensureNonNullObject(data) !== true) {
            return {};
        }

        const date1 = data[property];
        const date2 = data[prop];

        if (
            (ensureNonNullObject(date1) || ensureNonEmptyString(date1)) &&
            (ensureNonNullObject(date2) || ensureNonEmptyString(date2)) &&
            moment(date1).isAfter(date2, 'day') === true
        ) {
            const err = (ensureNonEmptyString(message) ? message : `${capitalize(sentencize(property))} must be prior to ${capitalize(sentencize(prop))}`);
            return { [property]: err };
        }
        else {
            return {};
        }
    },
    mustBeAfter: (prop, data, message) => {
        if (ensureNonNullObject(data) !== true) {
            return {};
        }

        const date1 = data[property];
        const date2 = data[prop];

        if (
            (ensureNonNullObject(date1) || ensureNonEmptyString(date1)) &&
            (ensureNonNullObject(date2) || ensureNonEmptyString(date2)) &&
            moment(date1).isBefore(date2, 'day') === true
        ) {
            const err = (ensureNonEmptyString(message) ? message : `${capitalize(sentencize(property))} must be after ${capitalize(sentencize(prop))}`);
            return { [property]: err };
        }
        else {
            return {};
        }
    },
    mustMatch: (prop, data, message) => {
        if (ensureNonNullObject(data) !== true) {
            return {};
        }

        const date1 = data[property];
        const date2 = data[prop];

        if (
            (ensureNonNullObject(date1) || ensureNonEmptyString(date1)) &&
            (ensureNonNullObject(date2) || ensureNonEmptyString(date2)) &&
            moment(date1).isBefore(date2, 'day') !== true &&
            moment(date1).isAfter(date2, 'day') !== true
        ) {
            const err = (ensureNonEmptyString(message) ? message : `${capitalize(sentencize(property))} must be the same as ${capitalize(sentencize(prop))}`);
            return { [property]: err };
        }
        else {
            return {};
        }
    }
});