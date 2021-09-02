import assert from 'assert';
import { rejectPromise, resolvePromise } from './utils';

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

        noneAlt<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<any>;
    }
}
if (!Promise.none) {

    // Первый вариант реализации
    Promise.none = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        // Создаем главный промис, который и будет результатом функции
        return new Promise((resolve, reject) => {
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
                        })
                        .catch(reason => {
                            /**
                            * Иначе выполняются следующие шаги:
                            * 1) полученный аккумулятор является промисом, получаем текущие значения
                            * аккумулятора через then
                            * 2) возвращаем новый промис, который резолвится новым аккумулятором,
                            * а именно "предыдущие ошибки и текущая ошибка"
                            */
                            return accumulator
                                .then(previousReasons => [...previousReasons, reason]);
                        });
                },
                Promise.resolve(<any>[])
            );

            reducePromise.then(reasons => {
                resolve(reasons);
            });
        });
    }
}

if (!Promise.noneAlt) {
    // Или второй вариант реализации, тоже на редьюсере
    Promise.noneAlt = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        // Создаем главный промис, который и будет результатом функции
        return new Promise((resolve, reject) => {
            // Промис-результат обхода всех промисов-параметров
            const reducePromise = promises.reduce(
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

            // Второй вариант отличается тем, что резолв\реджект основного промиса
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

const test = () => {
    const rejectionReasons = [1, 2, 3];
    const rejectionTimeouts = [null, 5000, 400];

    const rejectionPromises = rejectionReasons.map((reason, index) => {
        const timeout = rejectionTimeouts[index];
        if (timeout) {
            return rejectPromise(reason, timeout);
        }
        return rejectPromise(reason);
    })

    const one = Promise.none(rejectionPromises);

    one
        .then(reasons => {
            console.log('ONE PROMISE FULFILLED');
            console.log(reasons);
            reasons.forEach((reason, index) => {
                assert(reason === rejectionReasons[index]);
            })
        }).catch(error => {
            console.log('ONE PROMISE REJECTED');
            console.log(error);
        });

    const two = Promise.none([
        ...rejectionPromises,
        resolvePromise(9999, 100)
    ]);

    two
        .then(reasons => {
            console.log('TWO PROMISE FULFILLED');
            console.log(reasons);
        }).catch(error => {
            console.log('TWO PROMISE REJECTED');
            console.log(error);
        });

    const three = Promise.noneAlt([
        resolvePromise(12345)
    ]);

    three
        .then(reasons => {
            console.log('THREE PROMISE FULFILLED');
            console.log(reasons);
        }).catch(error => {
            console.log('THREE PROMISE REJECTED');
            console.log(error);
        });
}

test();

export { }