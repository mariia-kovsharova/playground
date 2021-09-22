export { };

/**
 * Реализация Promise.last
 * 
 * Принимает на вход массив промисов
 * Если хотя бы один завершается успешно, возвращает fulfilled-промис, содержащий значение последнего разрешенного промиса
 * Если ни одного не завершается успешно, вовзвращает rejected-промис, содержащий массив причин
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
            const lenght = promises.length;

            let resolvedPromisesCount = 0;
            let rejectedPromisesCount = 0;

            let lastFulfilledValue: T;

            const reasonsReducePromise = promises.reduce(
                (acc: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    // Promise.resolve нужен для того, чтобы переданное значение точно было промисом, 
                    // а не простым значением или thenable
                    return Promise.resolve(promise)
                        // Последний промис, который зарезолвится,
                        // зарезолвит главный промис своим значением
                        .then(value => {
                            resolvedPromisesCount += 1;

                            const processedPromisesCount = resolvedPromisesCount + rejectedPromisesCount;

                            if (processedPromisesCount === promises.length) {
                                resolve(value);
                            } else {
                                lastFulfilledValue = value;
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
                             * от ПОСЛЕДНЕГО ПРОМИСА В МАССИВЕ promises  
                             * (со значением undefined), и именно этот несвязанный промис
                             * зареджектит ОСНОВНОЙ, что будет являться ошибкой в логике
                             */

                            return acc;
                        })
                        // Иначе - в аккумулятор добавляется новая причина отклонения промиса
                        .catch(reason => {
                            rejectedPromisesCount += 1;

                            const processedPromisesCount = resolvedPromisesCount + rejectedPromisesCount;

                            if (processedPromisesCount === lenght) {
                                resolve(lastFulfilledValue);
                            }

                            return acc.then(previousReasons => {
                                // Создается новый промис, который резолвится обновленным значением
                                return [...previousReasons, reason];
                            });
                        })
                },
                Promise.resolve(<any>[])
            );

            reasonsReducePromise.then(reasons => {
                /**
                 * Получаем от промиса-аккумулятора причины и реджектим ГЛАВНЫЙ промис 
                 * значениями причин
                 * 
                 * !!! ВАЖНО здесь тоже добавить проверку на то, что все промисы из начального
                 * массива промисов обработаны - иначе получим кейс, когда был возвращен
                 * массив с причинами зареджектенных промисов, которые были зарезолвлены
                 * раньше, чем успешно завершился хотя бы один промис !!!
                */
                if (rejectedPromisesCount === promises.length) {
                    reject(reasons);
                }
            });
        })
    }
}

if (!Promise.lastAsyncAwait) {
    //  Вариант на async/await для более простого понимания, что происходит
    Promise.lastAsyncAwait = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        return new Promise<T>((resolve, reject) => {
            const lenght = promises.length;

            let resolvedPromisesCount = 0;
            let rejectedPromisesCount = 0;

            let lastFulfilledValue: T;

            const reasonsReducePromise = promises.reduce(
                async (acc: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    // Promise.resolve нужен для того, чтобы переданное значение точно было промисом, 
                    // а не простым значением или thenable
                    try {
                        const value = await Promise.resolve(promise);
                        resolvedPromisesCount += 1;

                        const processedPromisesCount = resolvedPromisesCount + rejectedPromisesCount;

                        if (processedPromisesCount === length) {
                            resolve(value);
                        } else {
                            lastFulfilledValue = value;
                        }

                        return await acc;
                    } catch (reason) {
                        rejectedPromisesCount += 1;
                        const processedPromisesCount = resolvedPromisesCount + rejectedPromisesCount;

                        if (processedPromisesCount === lenght) {
                            resolve(lastFulfilledValue);
                        }

                        const previousReasons = await acc;
                        return [...previousReasons, reason];
                    }
                },
                Promise.resolve(<any>[])
            );

            reasonsReducePromise.then(reasons => {
                /**
                  * Получаем от промиса-аккумулятора причины и реджектим ГЛАВНЫЙ промис 
                  * значениями причин
                  * 
                  * !!! ВАЖНО здесь тоже добавить проверку на то, что все промисы из начального
                  * массива промисов обработаны - иначе получим кейс, когда был возвращен
                  * массив с причинами зареджектенных промисов, которые были зарезолвлены
                  * раньше, чем успешно завершился хотя бы один промис !!!
                 */
                if (rejectedPromisesCount === promises.length) {
                    reject(reasons);
                }
            });
        })
    }
}
