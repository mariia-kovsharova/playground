/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/ban-types */

/**
 * Memoization is a process of caching the result of invoking of the function.
 * If the function invokes with previously processed args, we can just return
 * the result from the cache
 */

import { Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { VariadicFunction } from '../types';

const sum = (a: number, b: number): number => a + b;

// Here is the sample of the "sum" function memoization
const memoizedSum = (): (x: number, y: number) => number => {
    const cache = new Map<string, number>();

    return (a: number, b: number): number => {
        // For the "sum" function the order of the params does not matter
        const params = [a, b].sort().join(':');

        if (!cache.has(params)) {
            console.log('execute and cache result for params: ', a, b);
            cache.set(params, sum(a, b));
        }

        return cache.get(params)!;
    };
};

const memo = memoizedSum();

console.log(memo(1, 2));
console.log(memo(2, 1));
console.log(memo(1, 3));
console.log(memo(1, 2));

// Here is the example of any function memoization
const memoizedFunction = (fn: VariadicFunction)
    : (...params: Parameters<VariadicFunction>) => ReturnType<VariadicFunction> => {
    const cache = new Map<any, any>();

    return (...params: Parameters<VariadicFunction>): ReturnType<VariadicFunction> => {
        // The order can be important, so we cache the params 'as is'
        const key = params.join(':');

        if (!cache.has(key)) {
            console.log('execute and cache result for params: ', params);
            cache.set(key, fn.apply(null, params));
        }

        return cache.get(key);
    };
};

const multiply = (...nums: number[]): number => nums.reduce((acc, n) => acc * n);
const joinArrays = (arr1: any[], arr2: any[]): any[] => arr1.concat(arr2);

const memoizedMultiply = memoizedFunction(multiply);

console.log(memoizedMultiply(1, 2, 3, 4, 5));
console.log(memoizedMultiply(1, 2, 3, 4, 5));
console.log(memoizedMultiply(1, 3, 2, 4, 5));

const memoizedJoinArrays = memoizedFunction(joinArrays);

console.log(memoizedJoinArrays([1, 2, 3], [4, 5, 6]));
console.log(memoizedJoinArrays(['foo'], ['baz', 'bar']));
console.log(memoizedJoinArrays([1, 2, 3], [4, 5, 6]));

// Here is the expample of Observable Memoization
type ObservableCreator = (...params: any[]) => Observable<any>;

const memoizedObservable = (observableCreator: ObservableCreator): VariadicFunction => {
    // in cache we store hot Observables
    const cache = new Map<string, Observable<any>>();

    return (...params: Parameters<VariadicFunction>): Observable<any> => {
        const key = params.join(':');

        if (!cache.has(key)) {
            const obs = observableCreator.apply(null, params);
            const sharedObs = obs.pipe(
                tap(() => {
                    console.log('cache result for params: ', params);
                }),
                shareReplay(1)
            );

            cache.set(key, sharedObs);
        }

        return cache.get(key)!;
    };
};

const getInputAsObservable = (str: string): Observable<string> => {
    return of(str).pipe(
        tap(() => {
            console.log('directly in observable, str: ', str);
        }),
        map(s => s.toUpperCase())
    );
};

const memoizedObs = memoizedObservable(getInputAsObservable);

const nonMemoizedObs = getInputAsObservable;

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