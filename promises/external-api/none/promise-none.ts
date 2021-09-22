export { };

/**
 * Реализация Promise.none - это Promise.all наоборот - если все промисы rejected,
 * тогда промис резолвится со значениями реджектов.
 * 
 * Если же хоть один промис приобретает состояние fulfilled, основной промис реджектится
 * со значением этого промиса
 */

declare global {
    interface PromiseConstructor {
        //TODO: Promise<Array<any>>
        none<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<any>;
        noneAsyncAwait<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<any>;
    }
}
if (!Promise.none) {

    // Первый вариант реализации
    Promise.none = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        // Создаем главный промис, который и будет результатом функции
        return new Promise((resolve, reject) => {
            const lenght = promises.length;
            let rejectedPromisesCount = 0;

            // Промис-результат обхода всех промисов-параметров
            const reducePromise = promises.reduce(
                (accumulator: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    // Promise.resolve нужен для того, чтобы переданное значение точно было промисом, 
                    // а не простым значением или thenable
                    const trustedPromise = Promise.resolve(promise);

                    // Возвращаем не сам "доверенный" промис, а результат его обработки
                    return trustedPromise
                        .then(result => {
                            // Если какой-то из промисов успешно завершился,
                            // можем сразу отклонить ГЛАВНЫЙ ПРОМИС
                            reject(result);

                            // Однако, вернуть аккумулятор необходимо, чтобы не сломать
                            // УЖЕ существующий аккумулятор (т.к. вместо него иначе вернется undefined)
                            return accumulator;
                        })
                        .catch(reason => {
                            /**
                            * Иначе выполняются следующие шаги:
                            * 1) полученный аккумулятор является промисом, получаем текущие значения
                            * аккумулятора через then
                            * 2) возвращаем новый промис-аккумулятор, который резолвится новым аккумулятором,
                            * а именно "предыдущие ошибки и текущая ошибка"
                            */
                            rejectedPromisesCount += 1;
                            return accumulator.then(previousReasons => [...previousReasons, reason]);
                        });
                },
                Promise.resolve(<any>[])
            );

            reducePromise.then(reasons => {
                // Резолвим главный промис только в случае,
                // если ВСЕ промисы были отклонены
                if (rejectedPromisesCount === lenght) {
                    resolve(reasons);
                }
            });
        });
    }
}

if (!Promise.noneAsyncAwait) {
    // Или второй вариант реализации, тоже на редьюсере, с async\await для простоты
    Promise.noneAsyncAwait = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        // Создаем главный промис, который и будет результатом функции
        return new Promise((resolve, reject) => {
            // Промис-результат обхода всех промисов-параметров
            const reducePromise = promises.reduce(
                // TODO: why Promise<any>?
                async (accumulator: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    try {
                        const trustedPromise = Promise.resolve(promise);
                        const result = await trustedPromise;
                        return Promise.reject(result);
                    } catch (ex) {
                        const acc = await accumulator;
                        return [...acc, ex];
                    }
                },
                Promise.resolve(<any>[])
            );

            // Второй вариант еще отличается тем, что резолв\реджект основного промиса
            // Идет непосредственно от результата промиса-аккумулятора
            reducePromise
                // Если промис-аккумулятор завершен успешно, ГЛАВНЫЙ промис резолвится
                // с массивом значений-причин
                .then(reasons => {
                    resolve(reasons);
                })
                // Иначе промис-аккумулятор реджектится со значением успешно завершенного
                // промиса-параметра, ГЛАВНЫЙ промис реджектится с тем же значением
                .catch(fulfilledValueAsReason => {
                    reject(fulfilledValueAsReason);
                })
        });
    }
}
