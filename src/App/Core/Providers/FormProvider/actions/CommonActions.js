import { ensureIsNumber, ensureNonEmptyString } from "../../../Utility/rules";

export const FormatMoneyString = (oldValue, newValue) => {
    const number = (ensureNonEmptyString(newValue) ? parseInt(newValue.replace(/\D/g, '')) : (ensureIsNumber(newValue) ? newValue : null));
    return (ensureIsNumber(number) ? `$${Math.floor(number)}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '');
}