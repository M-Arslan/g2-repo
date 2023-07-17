export function numberWithCommas(x) {
    if (x !== null && x !== undefined) {
        return "$" + x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    } else { return }
}

export function zipFormat(onInputChange, obj) {
    if (obj.target.value.length == 5 && obj.nativeEvent.inputType === "insertText") {
        obj.target.value = obj.target.value + "-"
    }
    if (onInputChange) {
        onInputChange(obj)
    } else {
        return obj
    }
}

export function dateTimeFormat (date){
    const entryDate = new Date(date);

    const newDate = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate(), 0, 0, 0);
    return newDate;

}

export function isObjEmpty (obj) {
    return Object.values(obj).length === 0 && obj.constructor === Object;
}