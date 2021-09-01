import assert from 'assert';

declare global {
    interface PromiseConstructor {
        //TODO: Promise<Array<any>>
        none<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<any>;

        any<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<T>;

        first<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<T>;

        last<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<T>;
    }
}

if (!Promise.none) {
    // По своей сути - это Promise.all наоборот - если все промисы зареджектены,
    // тогда промис резолвится со значениями реджектов.
    Promise.none = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        return new Promise((resolve, reject) => {
            // Промис-результат обхода всех промисов-параметров
            const reducePromise = promises.reduce(
                (accumulator: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    const trustedPromise = Promise.resolve(promise);

                    return trustedPromise
                        // Возвращаем не сам "истинный" промис, а результат его обработки
                        // т.е. в случае ошибки - возвращаем увеличенный аккумулятор
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

            // Если все промисы отклонены, отклоняем главный промис
            Promise.none(promises)
                .then(values => {
                    reject(values);
                });
        })
    }
}

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

const rejectionReasons = [1, 2, 3];
const rejectionTimeouts = [null, 5000, 400];

const rejectionPromises = rejectionReasons.map((reason, index) => {
    const timeout = rejectionTimeouts[index];
    if (timeout) {
        return rejectPromise(reason, timeout);
    }
    return rejectPromise(reason);
})

const testPromiseNoneOne = Promise.none(rejectionPromises);

testPromiseNoneOne.then(reasons => {
    console.log('success');
    console.log(reasons);
    reasons.forEach((reason, index) => {
        assert(reason === rejectionReasons[index]);
    })
}).catch(error => {
    console.log('error');
    console.log(error);
});

const testPromiseNoneTwo = Promise.none([
    ...rejectionPromises,
    resolvePromise(9999, 100)
]);

testPromiseNoneTwo.then(reasons => {
    console.log('SHOULD NOT BEING HERE!!!');
    console.log(reasons);
}).catch(error => {
    console.log('error');
    console.log(error);
});

export { };