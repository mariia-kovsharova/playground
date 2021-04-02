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
type RejectHandler<T> = (error?: T | Error) => void;

type ResolveType<T> = (value?: T) => void;
type RejectType<T> = (error?: T | Error) => void;

const defaultHandler = <T>(x?: T | Error): T | Error | undefined => x;

class CustomPromise<T> {
    id: number;
    PromiseState: STATES;
    PromiseResult: T | undefined | null | Error;

    PromiseFulfillReactions: FulfilledHandler<T>[];
    PromiseRejectReactions: RejectHandler<T>[];

    constructor(executor: (resolve: ResolveType<T>, reject: RejectType<T>) => void) {
        this.id = counter;
        counter += 1;
        console.log(`pending promise with id: ${this.id}`);
        this.PromiseState = STATES.pending;
        this.PromiseResult = null;

        this.PromiseFulfillReactions = [];
        this.PromiseRejectReactions = [];

        executor(this.resolve.bind(this), this.reject.bind(this));
    }

    resolve(value?: T): void {
        if (this.PromiseState !== STATES.pending) {
            return;
        }

        console.log(`resolving for promise with id ${this.id}`);
        this.PromiseState = STATES.resolved;
        this.PromiseResult = value;

        // обходим все НЕЗАВИСИМЫЕ успешные хэндлеры ТЕКУЩЕГО промиса, в каждый передаем полученный результат
        this.PromiseFulfillReactions.forEach((nextThen) => nextThen(this.PromiseResult as NonNull<T>));
    }

    reject(error?: T | Error): void {
        if (this.PromiseState !== STATES.pending) {
            return;
        }

        console.log(`rejection for promise with id ${this.id}`);
        this.PromiseState = STATES.rejected;
        this.PromiseResult = error;

        // обходим все НЕЗАВИСИМЫЕ неуспешные хэндлеры ТЕКУЩЕГО промиса, в каждый передаем полученную ошибку
        this.PromiseRejectReactions.forEach((nextReject) => nextReject(this.PromiseResult as NonNull<T>));
    }

    then(onFulfill: FulfilledHandler<T> = defaultHandler, onReject: RejectHandler<T> = defaultHandler): CustomPromise<T> {
        // вернуть новый промис, в котором поставить условие на проверку статуса текущего
        return new CustomPromise<T>((newPromiseResolve: ResolveType<any>) => {
            // если промис не зарезолвлен, тогда надо в текущие успешные обработчики добавить еще один.
            // когда результат будет получен, ОБОСОБЛЕННЫЙ (НЕЗАВИСИМЫЙ) хэндлер получит этот результат
            const onFullfillHandler = (result: T | undefined): void => {
                const fulfilledResult = onFulfill(result);
                newPromiseResolve(fulfilledResult);
            }

            // если промис не зарезолвлен, тогда надо в текущие неуспешные обработчики добавить еще один.
            // когда результат будет получен, ОБОСОБЛЕННЫЙ (НЕЗАВИСИМЫЙ) хэндлер получит этот результат
            const onRejectHander = (result: T | undefined | Error): void => {
                const rejectedResult = onReject(result);
                newPromiseResolve(rejectedResult);
            }

            if (this.PromiseState === STATES.resolved) {
                // если промис уже зарезолвен, тогда НОВЫЙ промис просто РЕЗОЛВИМ с текущим готовым результатом
                // можно вызвать onFullfillHandler с текущим результатом, но так просто понятней
                // и все это на следующий тик
                setTimeout(() => newPromiseResolve(onFulfill(this.PromiseResult as NonNull<T>)), 0);
            }

            if (this.PromiseState === STATES.rejected) {
                // если промис уже зареджектен, тогда новый промис РЕЗОЛВИТСЯ с текущим результатом (ошибкой)
                // пропущенным через обработчик ошибки (onRejectedHandler). ошибка считается ОБРАБОТАННОЙ
                // и все это на следующий тик
                setTimeout(() => newPromiseResolve(onReject(this.PromiseResult as NonNull<T>)), 0);
            }

            // в ТЕКУЩИЙ промис добавляем новый НЕЗАВИСИМЫЙ успешный хэндлер
            this.PromiseFulfillReactions.push(onFullfillHandler);
            // в ТЕКУЩИЙ промис добавляем новый НЕЗАВИСИМЫЙ неуспешный хэндлер
            this.PromiseRejectReactions.push(onRejectHander);
        });
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


test();
rejectTest();