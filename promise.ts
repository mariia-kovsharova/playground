// Упрощенная реализая промисов - для лучшего понимания, как они работают "под капотом"

enum STATES {
    pending = 'pending',
    resolved = 'fulfilled',
    rejected = 'rejected',
};

// счетчик для отладки
let counter = 1;

type NonNull<T> = T extends null ? never : T;

type FulfilledHandler<T> = (value?: T) => void;
type ResolveType<T> = (value: T | undefined) => void;

class CustomPromise<T> {
    id: number;
    PromiseState: STATES;
    PromiseResult: T | undefined | null;
    PromiseFulfillReactions: FulfilledHandler<T>[];

    constructor(executor: (resolve: ResolveType<T>) => void) {
        this.id = counter;
        counter += 1;
        console.log(`pending promise with id: ${this.id}`);
        this.PromiseState = STATES.pending;
        this.PromiseResult = null;
        this.PromiseFulfillReactions = [];
        executor(this.resolve.bind(this));
    }

    resolve(value: T | undefined): void {
        console.log(`resolving for promise with id ${this.id}`);
        this.PromiseState = STATES.resolved;
        this.PromiseResult = value;

        // обходим все НЕЗАВИСИМЫЕ хэндлеры ТЕКУЩЕГО промиса, в каждый передаем полученный результат
        this.PromiseFulfillReactions.forEach((thenHandler) => thenHandler(this.PromiseResult!));
    }

    then(onFulfill: FulfilledHandler<T>): CustomPromise<T> {
        // вернуть новый промис, в котором поставить условие на проверку статуса текущего
        const promise = new CustomPromise<T>((newPromiseResolve: ResolveType<any>) => {
            if (this.PromiseState === STATES.resolved) {
                // если промис уже зарезолвен, тогда НОВЫЙ промис просто РЕЗОЛВИМ с текущим готовым результатом
                // можно вызвать onFullfillHandler с текущим результатом, но так просто понятней
                // и все это на следующий тик
                setTimeout(() => newPromiseResolve(onFulfill(this.PromiseResult as NonNull<T>)));
            }

            // если промис не зарезолвлен, тогда надо в текущие обработчики добавить еще один.
            // когда результат будет получен, ОБОСОБЛЕННЫЙ (НЕЗАВИСИМЫЙ) хэндлер получит этот результат
            const onFullfillHandler = (result: T | undefined): void => {
                const fulfilledResult = onFulfill(result);
                newPromiseResolve(fulfilledResult);
            }

            // в ТЕКУЩИЙ промис добавляем новый НЕЗАВИСИМЫЙ хэндлер
            this.PromiseFulfillReactions.push(onFullfillHandler);
        });

        return promise;
    }
}

export default CustomPromise;

const test = async () => {
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

test();
