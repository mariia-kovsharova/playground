const resolvePromise = <T>(value: T, timeout = 3000): Promise<T> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value);
        }, timeout);
    })
};

const rejectPromise = <T>(reason: T, timeout = 3000): Promise<T> => {
    return new Promise((_resolve, reject) => {
        setTimeout(() => {
            reject(reason);
        }, timeout);
    })
};

export {
    resolvePromise,
    rejectPromise
}