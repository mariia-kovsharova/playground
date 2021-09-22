import { CustomPromise } from './custom-promise';

describe('Custom promise', () => {
    test('resolving promise', async () => {
        const promise = new CustomPromise((resolve) => {
            setTimeout(() => resolve('test 1'), 1000);
        });

        try {
            const result = await promise;
            expect(result).toBe('test 1');
        } catch (e) {
            throw e;
        }
    });

    test('rejecting promise', async () => {
        const promise = new CustomPromise((_resolve, reject) => {
            setTimeout(() => reject('error'), 1000);
        });

        try {
            await promise;
        } catch (e) {
            expect(e).toMatch('error');
        }
    });

    test.only('then chains', async () => {
        // const promise = new CustomPromise((resolve) => {
        //     setTimeout(() => resolve('test chains'), 1000);
        // });

        // promise
        //     .then((value: string) => `${value} then`)
        //     .then((value: string) => value.replace('chains', 'foo'))
        //     .then((value: string) => value.toUpperCase());

        // try {
        //     const result = await promise;
        //     expect(result).toBe('TEST FOO THEN');
        // } catch (e) {
        //     throw e;
        // }
    });
});

// TODO: как типизировать промис в зависимости от параметра в resolve?
const p1 = async () => {
    const promise = new CustomPromise((resolve) => {
        resolve('Hello, world!');
    });

    promise
        .then((value) => {
            console.log(value); // 'Hello, world!'
        })
        .then((value) => {
            console.log(value); // undefined
        })

    const result = await promise
        .then((value) => value?.replace('Hello', 'Goodbye'))
        .then((value) => value?.toUpperCase());

    console.log(result);
}

const p2 = async () => {
    const firstFulfillMessage = 'First Fulfilled';
    const secondFulfillMessage = 'Second Fulfilled';

    const resolveMessage = 'Resolved';

    const messages: string[] = [];
    const messages2: string[] = [];

    const resolvedPromise = new CustomPromise<string>((resolve) => {
        resolve(resolveMessage);
    });

    console.log('step 1');
    console.log(messages);
    console.log(messages2);

    // eslint-disable-next-line jest/valid-expect-in-promise
    const modifiedPromise = resolvedPromise
        .then((message?: string): void => {
            if (message) {
                messages.push(message);
            }
            messages.push(firstFulfillMessage);
        });

    const modifiedPromise2 = resolvedPromise
        .then((message?: string): void => {
            if (message) {
                messages.push(message);
            }
            messages2.push(secondFulfillMessage);
        });

    console.log('step 2');
    console.log(messages);
    console.log(messages2);

    await modifiedPromise
        .then(() => {
            messages.push('I am last');
        });

    await modifiedPromise2
        .then(() => {
            messages2.push('I am last for second');
        });

    console.log('step 3');
    console.log(messages);
    console.log(messages2);
};

const rejectTest = async () => {
    const resolveMessage = 'Resolved';
    const rejectMessage = 'Ooops!';

    const rejectedPromise = new CustomPromise<string>((resolve, reject) => {
        reject(rejectMessage);
        resolve(resolveMessage);
    });

    await rejectedPromise.then(
        (value?: string) => {
            console.log('I should have never been called');
        },
        (err: any) => {
            console.error(err);
        });
};