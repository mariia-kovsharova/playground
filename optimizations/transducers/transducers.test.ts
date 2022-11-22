import { compose, filter, map } from './transducers';

describe('Transducers', () => {
    test('map and filter transducer methods', () => {
        // initial value is [1, 2, 3, 4, 5];
        const collection = <number[]>Array.from({ length: 5 }, (_item: number, index: number) => index + 1);

        // Here is the collection of simple functions
        const increment = (x: number): number => x + 1;
        const isEven = (x: number): boolean => x % 2 === 0;
        const introduce = (x: number): string => `i am ${x}`;

        const trace = (msg: string) => <T>(x: T): T => (console.log(msg, x), x);

        // Here is the composition of them, or an equivalent of
        // const result = (value: number) => introduce(isEven(increment(value)))
        const complexComposedFunction =
            compose(
                map(introduce),
                filter(isEven),
                map(increment),
            );

        const whatToDoWithComposedResult = complexComposedFunction(
            (acc, item) => {
                console.log(acc);
                console.log(item);

                return `${acc}${item};`;
            }
        );

        const processed = collection.reduce(whatToDoWithComposedResult, '');

        const expectedResult = [2, 4, 6].map(x => `i am ${x};`).join('');

        expect(processed).toEqual(expectedResult);
    });
});