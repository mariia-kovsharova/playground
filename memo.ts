// Мемоизация - техника для оптимизации вычислений функций.
// При повторном вычислении функции возвращается закэшированный результат

import { Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

const sum = (a: number, b: number): number => a + b;

// Мемоизация конкретной функции
const memoizedSum = (): (x: number, y: number) => number => {
    const cache = new Map<string, number>();

    return (a: number, b: number): number => {
        // Для данной операции не важно, в каком порядке поступили параметры
        const params = [a, b].sort().join(':');

        if (!cache.has(params)) {
            console.log('execute and cache result for params: ', a, b);
            const result = sum(a, b);
            cache.set(params, result);
        }
        return cache.get(params) as number;
    }
}

const memo = memoizedSum();

console.log(memo(1, 2));
console.log(memo(2, 1));
console.log(memo(1, 3));
console.log(memo(1, 2));

// Мемоизация любой функции
const memoFunction = (fn: Function): (...params: any[]) => any => {
    const cache = new Map<any, any>();

    return (...params: any[]): any => {
        // Т.к. неизвестно, играет ли роль порядок параметров,
        // кэшируем их "как есть". Подходит для примитивов, возможно массивов,
        // но не для объектов без переопределения метода toString
        const key = params.join(':');

        if (!cache.has(key)) {
            console.log('execute and cache result for params: ', params);
            const result = fn.apply(null, params);
            cache.set(key, result);
        }

        return cache.get(key);
    }
}

const multiply = (...nums: number[]): number => nums.reduce((acc, n) => acc * n);
const joinArrays = (arr1: any[], arr2: any[]): any[] => arr1.concat(arr2);

const memoizedMultiply = memoFunction(multiply);

console.log(memoizedMultiply(1, 2, 3, 4, 5));
console.log(memoizedMultiply(1, 2, 3, 4, 5));
console.log(memoizedMultiply(1, 3, 2, 4, 5));

const memoizedJoinArrays = memoFunction(joinArrays);

console.log(memoizedJoinArrays([1, 2, 3], [4, 5, 6]));
console.log(memoizedJoinArrays(['foo'], ['baz', 'bar']));
console.log(memoizedJoinArrays([1, 2, 3], [4, 5, 6]));

// Мемоизация потоков
type MemoObs = (...params: any[]) => Observable<any>;

const memoObservable = (observableFn: MemoObs) => {
    const cache = new Map();

    return (...params: any[]): Observable<any> => {
        const key = params.join(':');

        if (!cache.has(key)) {
            const obs = observableFn.apply(null, params);
            const sharedObs = obs.pipe(
                tap(() => {
                    console.log('cache result for params: ', params);
                }),
                shareReplay(1)
            );

            cache.set(key, sharedObs);
        }

        return cache.get(key);
    }
}

const toUpperCaseObs = (str: string) => {
    return of(str).pipe(
        tap(() => {
            console.log('directly in observable, str: ', str);
        }),
        map(s => s.toUpperCase())
    )
}

const memoizedObs = memoObservable(toUpperCaseObs);

const nonMemoizedObs = toUpperCaseObs;

console.log('\n*** NON MEMOIZED OBSERVABLE ***\n');

nonMemoizedObs('foooo').subscribe((result) => {
    console.log('nonMemoizedObs first subscription for "foooo"');
    console.log(result);
});

nonMemoizedObs('foooo').subscribe((result) => {
    console.log('nonMemoizedObs second subscription for "foooo"');
    console.log(result);
});

nonMemoizedObs('foooo').subscribe((result) => {
    console.log('nonMemoizedObs third subscription for "foooo"');
    console.log(result);
});

console.log('\n*** MEMOIZED OBSERVABLE *** \n');

memoizedObs('foooo').subscribe((result) => {
    console.log('memoizedObs first subscription for "foooo"');
    console.log(result);
});

memoizedObs('foooo').subscribe((result) => {
    console.log('memoizedObs second subscription for "foooo"');
    console.log(result);
});

memoizedObs('foooo').subscribe((result) => {
    console.log('memoizedObs third subscription for "foooo"');
    console.log(result);
});

memoizedObs('baz').subscribe((result) => {
    console.log('memoizedObs first subscription for "baz"');
    console.log(result);
});