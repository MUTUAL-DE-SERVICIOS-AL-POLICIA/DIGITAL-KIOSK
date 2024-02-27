
export const isFile = (accept: string, file: File | null): boolean => {
    if (!file) {
        return false;
    }

    return accept.split(', ').includes(file.type);
}

export const round = ( num: number, prec?: any) => {
    if (prec === void 0) { prec = 2; }
    var f = Math.pow(10, prec)
    return Math.floor(num * f) / f

}
