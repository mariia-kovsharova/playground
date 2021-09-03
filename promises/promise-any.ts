import assert from 'assert';
import { rejectPromise, resolvePromise } from './utils';

/**
 * Реализация Promise.any 
 * 
 * Принимает на вход массив промисов
 * Если хотя бы один завершается успешно, возвращает fulfilled-промис, содержащий массив успешно разрешенных значений
 * Если ни одного не завершается успешно, вовзвращает rejected-промис, содержащий массив причин?
 */

declare global {
    interface PromiseConstructor {
        //TODO: Promise<Array<any>>
        any<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<any>;
        anyAsyncAwait<T>(promises: Array<Promise<T> | PromiseLike<T>>): Promise<any>;
    }
}

type Values<T> = Array<T>;
type Reasons = Array<any>;

type Accumulator<T> = [Values<T>, Reasons];

if (!Promise.any) {

    Promise.any = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {
        return new Promise((resolve, reject) => {
            const accInit: Accumulator<T> = [<Values<T>>[], <Reasons>[]];

            const reduceResult = promises.reduce(
                async (acc: Promise<Accumulator<T>>, promise: Promise<T> | PromiseLike<T>) => {
                    const trustedPromise = Promise.resolve(promise);

                    try {
                        const value = await trustedPromise;

                        console.log('value', value);

                        const [values, reasons] = await acc;
                        const updatedValues = <Values<T>>[...values, value];
                        return <Accumulator<T>>[updatedValues, reasons];
                    } catch (reason) {
                        console.log('reason', reason);

                        const [values, reasons] = await acc;
                        const updatedReasons = <Reasons>[...reasons, reason];
                        return <Accumulator<T>>[values, updatedReasons];
                    }
                },
                Promise.resolve(accInit)
            );

            reduceResult.then(([values, reasons]) => {
                console.log('values', values);
                console.log('reasons', reasons);
                if (values.length) {
                    resolve(values);
                }
                reject(reasons);
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

    const one = Promise.any(resolvedPromises);

    one
        .then(value => {
            console.log('ONE PROMISE FULFILLED');
            console.log(value);
            // assert(value === 2);

        }).catch(error => {
            console.log('ONE PROMISE REJECTED');
            // console.log(error);
        });

    const two = Promise.any([
        ...resolvedPromises,
        resolvePromise(9999, 8000)
    ]);

    two
        .then(value => {
            console.log('TWO PROMISE FULFILLED');
            console.log(value);

            // assert(value === 9999);
        }).catch(error => {
            console.log('TWO PROMISE REJECTED');
            console.log(error);
        });

    const three = Promise.any([
        resolvePromise(1, 100),
        rejectPromise(12345),
        resolvePromise(0)
    ]);

    three
        .then(value => {
            console.log('THREE PROMISE FULFILLED');
            console.log(value);

            // assert(value === 0);
        }).catch(errors => {
            console.log('THREE PROMISE REJECTED');
            console.log(errors);
        });

    const four = Promise.any<number | string | boolean>([
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

export { }