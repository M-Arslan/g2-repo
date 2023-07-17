

export const validURL = (textval) => {
    var regexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return regexp.test(textval);
}

export const getValidUrl = (url = "") => {
    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, "");

    if (/^(:\/\/)/.test(newUrl)) {
        return `http${newUrl}`;
    }
    if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
        return `http://${newUrl}`;
    }

    return newUrl;
};

export const validateRequest = (request, BlankRequest) => {
    const errs = Object.keys(BlankRequest).reduce((errs, k) => ({ ...errs, [k]: false }), {});

    errs.title = (request.typeCode !== 'M' && (typeof request.title !== 'string' || request.title === '' || request.title.length > 100));
    if (request.typeCode === 'M') {
        errs.body = request.body === '';
    }
    errs.typeCode = (typeof request.typeCode !== 'string' || request.typeCode === '');
    return errs;
};


const prepareRequest = (request) => {
    return Object.keys(request).reduce((r, k) => {
        const val = request[k];
        return { ...r, [k]: (typeof val === 'string' && val === '' ? null : val) }
    }, {});
};

export const hasAnyError = (req , BlankRequest) => {
    const errs = validateRequest(prepareRequest(req), BlankRequest);
    return (Object.keys(errs).some(k => errs[k] === true) === true);
};

