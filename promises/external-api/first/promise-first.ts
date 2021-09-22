export { };

/**
 * Реализация Promise.first
 * (аналог https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Promise/any) 
 * 
 * Принимает на вход массив промисов
 * Если хотя бы один завершается успешно, возвращает fulfilled-промис, содержащий значение первого разрешенного промиса
 * Если ни одного не завершается успешно, вовзвращает rejected-промис, содержащий массив причин?
 */

declare global {
    interface PromiseConstructor {
        first<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<T>;
        firstAsyncAwait<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<T>;
    }
}

if (!Promise.first) {
    Promise.first = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        return new Promise<T>((resolve, reject) => {

            const reasonsReducePromise = promises.reduce(
                (acc: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    // Promise.resolve нужен для того, чтобы переданное значение точно было промисом, 
                    // а не простым значением или thenable
                    return Promise.resolve(promise)
                        // Первый промис, который зарезолвится,
                        // зарезолвит главный промис своим значением
                        .then(value => {
                            resolve(value);
                        })
                        // Иначе - в аккумулятор добавляется новая причина отклонения промиса
                        .catch(reason => {
                            return acc.then(previousReasons => {
                                return [...previousReasons, reason];
                            });
                        })
                },
                Promise.resolve(<any>[])
            );

            reasonsReducePromise.then(reasons => {
                // Получаем от промиса-аккумулятора причины и реджектим ГЛАВНЫЙ промис
                // значениями причин
                reject(reasons);
            });
        })
    }
}

if (!Promise.firstAsyncAwait) {
    Promise.firstAsyncAwait = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        return new Promise<T>((resolve, reject) => {

            const reasonsReducePromise = promises.reduce(
                async (acc: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    // Promise.resolve нужен для того, чтобы переданное значение точно было промисом, 
                    // а не простым значением или thenable
                    try {
                        const value = await Promise.resolve(promise);
                        resolve(value);
                    } catch (reason) {
                        const previousReasons = await acc;
                        return [...previousReasons, reason];
                    }
                },
                Promise.resolve(<any>[])
            );

            reasonsReducePromise.then(reasons => {
                // Получаем от промиса-аккумулятора причины и реджектим ГЛАВНЫЙ промис
                // значениями причин
                reject(reasons);
            });
        })
    }
}
