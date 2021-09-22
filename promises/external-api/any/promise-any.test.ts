import { rejectPromise, resolvePromise } from '../../utils';
import './promise-any';

describe('Promise Any', () => {
    const resolvingReasons = [1, 2, 3];
    const timeouts = [500, 1000, 400];

    test('main promise should be fulfulled with the array of fulfilled values', async () => {
        const promises = resolvingReasons.map((reason, index) => {
            const timeout = timeouts[index];
            return resolvePromise(reason, timeout);
        });

        const result = await Promise.my_any(promises);

        expect(result).toEqual(resolvingReasons);

        const result2 = await Promise.my_any([
            resolvePromise(1000, 1000),
            rejectPromise(9009, 100),
            resolvePromise(9999, 50),
            rejectPromise(1, 30),
            resolvePromise(22, 200)
        ]);

        expect(result2).toEqual([1000, 9999, 22]);
    });
});