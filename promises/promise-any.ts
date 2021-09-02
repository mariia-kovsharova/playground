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
    }
}
if (!Promise.any) {

    Promise.any = function <T>(promises: Array<Promise<T> | PromiseLike<T>>) {

    }
}

const test = () => {

}

test();

export { }