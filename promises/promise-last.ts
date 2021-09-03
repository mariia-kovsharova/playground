import assert from 'assert';
import { rejectPromise, resolvePromise } from './utils';

/**
 * Реализация Promise.last
 * 
 * Принимает на вход массив промисов
 * Если хотя бы один завершается успешно, возвращает fulfilled-промис, содержащий значение последнего разрешенного промиса
 * Если ни одного не завершается успешно, вовзвращает rejected-промис, содержащий массив причин?
 */

declare global {
    interface PromiseConstructor {
        last<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<T>;
        lastAsyncAwait<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<T>;
    }
}

if (!Promise.last) {
    Promise.last = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        return new Promise<T>((resolve, reject) => {

            let resolvedPromisesCount = 0;

            const reasonsReducePromise = promises.reduce(
                (acc: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    // Promise.resolve нужен для того, чтобы переданное значение точно было промисом, 
                    // а не простым значением или thenable
                    return Promise.resolve(promise)
                        // Последний промис, который зарезолвится,
                        // зарезолвит главный промис своим значением
                        .then(value => {
                            console.log(`value: ${value}, count: ${resolvedPromisesCount}`);

                            resolvedPromisesCount += 1;
                            if (resolvedPromisesCount === promises.length) {
                                resolve(value);
                            }
                            /**
                             * ОЧЕНЬ ВАЖНО ЗДЕСЬ СВЯЗАТЬ аккумулятор
                             * Т.к. reduce - СИНХРОННЫЙ и обходит промисы СИНХРОННО
                             * 
                             * Т.е. еще ДО ТОГО, как промисы начнут резолвиться,
                             * у нас УЖЕ будет установленная цепочка того, КАК будут передаваться
                             * значения
                             * 
                             * Т.е. по сути, у нас получится ОДНА БОЛЬШАЯ ЦЕПОЧКА
                             * 
                             * new Promise( (resolve, reject) => {
                             *  // Promise #1
                             *    resolve();
                             * }).then( (result) => {
                             *   // Promise #2
                             *   return result;
                             * }).then( (result) => { 
                             *   // Promise #3
                             *   return result;
                             * }); // ... и т.д!
                             * 
                             */

                            /**
                             * Если тут не связать аккумулятор в цепочку,
                             * в качестве reasonsReducePromise вернется новый, созданный неявно
                             * от ПЕРВОГО ЖЕ ЗАРЕЗОЛВЛЕННОГО промиса  
                             * (со значением undefined), и именно этот несвязанный промис
                             * зареджектит ОСНОВНОЙ, что будет являться ошибкой в логике
                             */

                            return acc;
                        })
                        // Иначе - в аккумулятор добавляется новая причина отклонения промиса
                        .catch(reason => {
                            console.log(`reason: ${reason}, count: ${resolvedPromisesCount}`);

                            resolvedPromisesCount += 1;

                            return acc.then(previousReasons => {
                                // Создается новый промис, который резолвится обновленным значением
                                return [...previousReasons, reason];
                            });
                        })
                },
                Promise.resolve(<any>[])
            );

            reasonsReducePromise.then(reasons => {
                // Получаем от промиса-аккумулятора причины и реджектим ГЛАВНЫЙ промис
                // значениями причин

                console.log('all promises have been !');
                reject(reasons);
            });
        })
    }
}

if (!Promise.lastAsyncAwait) {
    //  Вариант на async/await для более простого понимания, что происходит
    Promise.lastAsyncAwait = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        return new Promise<T>((resolve, reject) => {

            let resolvedPromisesCount = 0;

            const reasonsReducePromise = promises.reduce(
                async (acc: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    // Promise.resolve нужен для того, чтобы переданное значение точно было промисом, 
                    // а не простым значением или thenable
                    try {
                        const value = await Promise.resolve(promise);
                        resolvedPromisesCount += 1;
                        if (resolvedPromisesCount === promises.length) {
                            resolve(value);
                        }
                        return await acc;
                    } catch (reason) {
                        resolvedPromisesCount += 1;
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

    const one = Promise.last(resolvedPromises);

    one
        .then(value => {
            console.log('ONE PROMISE FULFILLED');
            console.log(value);
            assert(value === 2);

        }).catch(error => {
            console.log('ONE PROMISE REJECTED');
            console.log(error);
        });

}

test();

export { };