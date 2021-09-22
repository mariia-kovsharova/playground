const resolvePromise = <T>(value: T, timeout?: number | null): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, timeout ?? 100);
    })
};

const rejectPromise = <T>(reason: T, timeout?: number | null): Promise<T> => {
    return new Promise((_resolve, reject) => {
        setTimeout(() => {
            reject(reason);
        }, timeout ?? 100);
    })
};

export {
    resolvePromise,
    rejectPromise
}