import { compose, pipe } from './composition';

describe('Checking function composition', () => {
    it('Simple compose', () => {
        const fn1 = (value: string): string => `fn1(${value})`;
        const fn2 = (value: string): string => `fn2(${value})`;
        const fn3 = (value: string): string => `fn3(${value})`;

        const value = 'value';
        expect(compose(fn1, fn2, fn3)(value)).toBe('fn1(fn2(fn3(value)))');
    });

    it('Simple pipe', () => {
        const fn1 = (value: string): string => `fn1(${value})`;
        const fn2 = (value: string): string => `fn2(${value})`;
        const fn3 = (value: string): string => `fn3(${value})`;

        const value = 'value';
        expect(pipe(fn1, fn2, fn3)(value)).toBe('fn3(fn2(fn1(value)))');
    });

    it('Compose some string transform functions', () => {

        const trace = (msg: string) => <T>(x: T): T => (console.log(msg, x), x);

        const map = (transform: (s: any) => any) =>
            (values: Array<string>) => values.map(transform);

        const filter = (predicate: (s: string) => boolean) =>
            (values: Array<string>) => values.filter(predicate);

        const toLowerCase = (str: string): string => str.toLowerCase();
        const onlyLongTitle = (str: string): boolean => str.length > 3;
        const split = (separator: string) => (value: string) => value.split(separator);
        const join = (separator: string) => (values: Array<string>) => values.join(separator);

        // composed = join(onlyLongWords(split(toLowerCase(value))))
        const composed = compose(
            map(join('-')),
            trace('after filter'),
            filter(onlyLongTitle),
            trace('after split'),
            map(split(' ')),
            trace('after lowercase'),
            map(toLowerCase)
        );

        const bookTitles = [
            "JavaScript The Good Parts",
            "You Don't Know JS",
            "Eloquent JavaScript"
        ];

        const processedBookTitles = [
            "javascript-the-good-parts",
            "you-don't-know-js"
        ];

        expect(composed(bookTitles)).toEqual(processedBookTitles);
    });
});