import assert from 'assert';
import { resolvePromise } from '../../utils';

/**
 * Реализация Promise.any 
 * 
 * Принимает на вход массив промисов
 * Если хотя бы один завершается успешно, возвращает fulfilled-промис, содержащий массив успешно разрешенных значений
 * 
 * // TODO: сделать так
 * Если ни одного не завершается успешно, вовзвращает rejected-промис, содержащий массив причин?
 */

declare global {
    interface PromiseConstructor {
        //TODO: Promise<Array<any>>
        my_any<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<any>;
        my_anyAsyncAwait<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<any>;
    }
}

type Values<T> = Array<T>;
type Reasons = Array<any>;

type Accumulator<T> = [Values<T>, Reasons];

if (!Promise.my_any) {

    Promise.my_any = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        return new Promise((resolve, reject) => {
            // const accInit: Accumulator<T> = [<Values<T>>[], <Reasons>[]];

            const reduceResult = promises.reduce(
                // TODO: why Promise<any>?
                (acc: Promise<any>, promise: Promise<T> | PromiseLike<T>) => {
                    const trustedPromise = Promise.resolve(promise);

                    return trustedPromise
                        .then(value => {
                            return acc.then(previousValues => {
                                return [...previousValues, value];
                            })
                        })
                        .catch(reason => {
                            return acc;
                        })
                },
                Promise.resolve([])
            );

            reduceResult
                .then(values => {
                    if (values.length) {
                        resolve(values);
                    } else {
                        reject();
                    }
                })
        });
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

    const one = Promise.my_any(resolvedPromises);

    one
        .then(value => {
            console.log('ONE PROMISE FULFILLED');
            console.log(value);
            // assert(value === 2);

        }).catch(error => {
            console.log('ONE PROMISE REJECTED');
            // console.log(error);
        });
}

test();

export { }