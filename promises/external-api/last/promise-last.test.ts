import { rejectPromise, resolvePromise } from '../../utils';
import './promise-last';

describe('Promise Last', () => {
    const resolvingReasons = [1, 2, 3];
    const timeouts = [500, 1000, 400];

    test('main promise should be fulfulled with last value', async () => {
        const promises = resolvingReasons.map((reason, index) => {
            const timeout = timeouts[index];
            return resolvePromise(reason, timeout);
        });

        const result = await Promise.last(promises);

        expect(result).toBe(2);

        const result2 = await Promise.last([
            resolvePromise(1000, 300),
            resolvePromise(9999, 50),
            resolvePromise(22, 200)
        ]);

        expect(result2).toBe(1000);

        const result3 = await Promise.last<number | string | boolean>([
            resolvePromise('bar', 900),
            rejectPromise(12345, 100),
            rejectPromise(1, 200),
            resolvePromise('foo', 300),
            rejectPromise('baz', 300),
            rejectPromise(false, 600)
        ]);

        expect(result3).toBe('bar');
    });

    test('main promise should be rejected with an array of reasons', async () => {
        const promise = Promise.last([
            rejectPromise(12345, 50)
        ]);

        try {
            await promise;
        } catch (e) {
            expect(e).toEqual([12345]);
        }

        const promises = Promise.last<number | string | boolean>([
            rejectPromise(12345, 100),
            rejectPromise(1, 200),
            rejectPromise('foo', 300),
            rejectPromise(true, 400)
        ]);

        try {
            await promises;
        } catch (e) {
            expect(e).toEqual([12345, 1, 'foo', true]);
        }
    });
});