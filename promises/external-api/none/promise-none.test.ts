import { rejectPromise, resolvePromise } from '../../utils';
import './promise-none';

describe('Promise None', () => {
    const rejectingReasons = [1, 2, 3];
    const timeouts = [500, 1000, 400];

    test('main promise should be fulfulled with the list of reasons', async () => {
        const promises = rejectingReasons.map((reason, index) => {
            const timeout = timeouts[index];
            return rejectPromise(reason, timeout);
        });

        const result = await Promise.none(promises);

        expect(result).toEqual(rejectingReasons);

        const result2 = await Promise.none([
            rejectPromise(1000, 300),
            rejectPromise(9999, 50),
            rejectPromise(22, 200)
        ]);

        expect(result2).toEqual([1000, 9999, 22]);
    });

    test('main promise should be rejected with the value of first fulfilled promise', async () => {
        const promises = Promise.none<number | string | boolean>([
            rejectPromise(12345, 100),
            rejectPromise(1, 200),
            resolvePromise('baz', 500),
            rejectPromise('foo', 300),
            rejectPromise(true, 400),
            resolvePromise('BOOM', 200)
        ]);

        try {
            await promises;
        } catch (e) {
            expect(e).toBe('BOOM');
        }
    });
});