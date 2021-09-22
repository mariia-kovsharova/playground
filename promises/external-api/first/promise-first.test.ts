import { rejectPromise, resolvePromise } from '../../utils';
import './promise-first';

describe('Promise First', () => {
    const resolvingReasons = [1, 2, 3];
    const timeouts = [500, 1000, 400];

    test('main promise should be fulfulled with first value', async () => {
        const promises = resolvingReasons.map((reason, index) => {
            const timeout = timeouts[index];
            return resolvePromise(reason, timeout);
        });

        const result = await Promise.first(promises);

        expect(result).toBe(3);

        const result2 = await Promise.first([
            resolvePromise(1000, 1000),
            resolvePromise(9999, 50),
            resolvePromise(22, 200)
        ]);

        expect(result2).toBe(9999);
    });

    test('main promise should be rejected with an array of reasons', async () => {
        const promise = Promise.first([
            rejectPromise(12345, 50)
        ]);

        try {
            await promise;
        } catch (e) {
            expect(e).toEqual([12345]);
        }

        const promises = Promise.first<number | string | boolean>([
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