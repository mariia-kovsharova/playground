import assert from 'assert';

declare global {
    interface PromiseConstructor {
        first<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<T>;
    }
}

if (!Promise.first) {
    Promise.first = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        return new Promise<T>((resolve, reject) => {
            promises.forEach((promise: Promise<T> | PromiseLike<T>) => {
                // Promise.resolve нужен для того, чтобы переданное значение точно было промисом, 
                // а не простым значением или thenable
                Promise.resolve(promise)
                    // Первый промис, который зарезолвится,
                    // зарезолвит главный промис своим значением
                    .then(value => {
                        resolve(value);
                    });
            });

            // TODO: check is the same

            // Если все промисы отклонены, отклоняем главный промис
            Promise.none(promises)
                .then(values => {
                    reject(values);
                });
        })
    }
}

export { };