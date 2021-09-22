import assert from 'assert';
import { rejectPromise, resolvePromise } from '../../utils';

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

const test = () => {
    const resolvingReasons = [1, 2, 3];
    const timeouts = [null, 5000, 400];

    const resolvedPromises = resolvingReasons.map((reason, index) => {
        const timeout = timeouts[index];
        if (timeout) {
            return resolvePromise(reason, timeout);
        }
        return resolvePromise(reason);
    })

    const one = Promise.first(resolvedPromises);

    one
        .then(value => {
            console.log('ONE PROMISE FULFILLED');
            console.log(value);
            assert(value === 3);

        }).catch(error => {
            console.log('ONE PROMISE REJECTED');
            console.log(error);
        });

    const two = Promise.first([
        ...resolvedPromises,
        resolvePromise(9999, 100)
    ]);

    two
        .then(value => {
            console.log('TWO PROMISE FULFILLED');
            console.log(value);

            assert(value === 9999);
        }).catch(error => {
            console.log('TWO PROMISE REJECTED');
            console.log(error);
        });

    const three = Promise.first([
        rejectPromise(12345)
    ]);

    three
        .then(reasons => {
            console.log('THREE PROMISE FULFILLED');
            console.log(reasons);
        }).catch(errors => {
            console.log('THREE PROMISE REJECTED');
            console.log(errors);
        });

    const four = Promise.first<number | string | boolean>([
        rejectPromise(12345),
        rejectPromise(1),
        rejectPromise('foo'),
        rejectPromise(true)
    ]);

    four
        .then(reasons => {
            console.log('FOUR PROMISE FULFILLED');
            console.log(reasons);
        }).catch(errors => {
            console.log('FOUR PROMISE REJECTED');
            console.log(errors);
        });
}

test();

export { };