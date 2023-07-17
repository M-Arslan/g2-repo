import { ensureNonEmptyArray, ensureNonEmptyString } from "../../Utility/rules";

export const formatDate = (dateString) => {
    try {

        const date = `${dateString}`; // string cast in case of Date object

        if (ensureNonEmptyString(date) && date) {
            if (date.includes('/')) {
                return date;
            } else {
                const segs = date.split('T')[0].split('-');
                if (ensureNonEmptyArray(segs) && segs.length >= 3) {
                    if (segs[0].length === 4) {
                        return `${segs[1]}/${segs[2]}/${segs[0]}`;
                    }
                    else {
                        return `${segs[0]}/${segs[1]}/${segs[2]}`;
                    }
                }
            }
        }
    } catch (e) {

    }
    return dateString;
}