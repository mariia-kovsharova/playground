// Упрощенная реализая промисов - для лучшего понимания, как они работают "под капотом"

enum STATES {
    PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED',
};

// счетчик для отладки
let counter = 1;

type NonNull<T> = T extends null ? never : T;

type FulfilledHandler<TResult1> = (value?: TResult1) => TResult1 | undefined;
type RejectHandler<TResult2> = (reason?: any) => TResult2 | undefined;

// type ResolveFunction<T> = (value?: T) => void;
// type RejectFunction<T> = (reason?: any) => void;

// Обработчик по умолчанию просто возвращает тот же самый результат
const defaultHandler = <T>(x?: T): T | undefined => x;

class CustomPromise<T = any> {
    id: number;
    PromiseState: STATES;
    PromiseResult: T | undefined | null | Error;

    PromiseFulfillReactions: FulfilledHandler<T>[];
    PromiseRejectReactions: RejectHandler<T>[];

    constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void) {
        this.id = counter++;
        console.log(`pending promise with id: ${this.id}`);
        /**
         * Функция, которая выполняется сразу при создании промиса -
         * ему ставится начальное состояние, начальный набор обработчиков успешного 
         * или ошибочного выполнения промиса, в функцию-executor передаются методы,
         * которые будут вызываться для смены состояния промиса
         */
        this.PromiseState = STATES.PENDING;
        this.PromiseResult = null;

        this.PromiseFulfillReactions = [];
        this.PromiseRejectReactions = [];

        executor(this.resolve.bind(this), this.reject.bind(this));
    }

    resolve(value?: T): void {
        /**
         * Если промис уже в своем финальном состоянии FSM, ничего не делаем,
         * перейти в другое состояние он не может
         */
        if (this.PromiseState !== STATES.PENDING) {
            return;
        }

        console.log(`resolving for promise with id ${this.id}`);

        /**
         * Тут промис приобретает свое финальное состояние, т.е. осуществляется единственный
         * возможный переход
         */
        this.PromiseState = STATES.FULFILLED;
        this.PromiseResult = value;

        /**
         * Обходим все then от текущего промиса,
         * в каждый передается результат текущего промиса (this.Promise)
         */
        this.PromiseFulfillReactions.forEach((thenHandler) => thenHandler(this.PromiseResult as NonNull<T>));
    }

    reject(reason?: any): void {
        /**
         * Если промис уже в своем финальном состоянии FSM, ничего не делаем,
         * перейти в другое состояние он не может
         */
        if (this.PromiseState !== STATES.PENDING) {
            return;
        }

        console.log(`rejection for promise with id ${this.id}`);

        /**
        * Тут промис приобретает свое финальное состояние, т.е. осуществляется единственный
        * возможный переход
        */
        this.PromiseState = STATES.REJECTED;
        this.PromiseResult = reason;

        /**
         * Обходим все reject от текущего промиса,
         * в каждый передается результат текущего промиса (this.Promise)
         */
        this.PromiseRejectReactions.forEach((rejectHandler) => rejectHandler(this.PromiseResult as NonNull<T>));
    }

    then(onFulfill: FulfilledHandler<T> = defaultHandler, onReject: RejectHandler<T> = defaultHandler): CustomPromise<T> {
        // Результатом выполнения будет новый промис, связанный с текущим
        // Связь выражается в том, что новый промис проверяет СОСТОЯНИЕ текущего промиса и берет из него РЕЗУЛЬТАТ
        return new CustomPromise<T>(
            (
                nextResolve: (value?: T) => void,
                nextReject: (reason?: any) => void
            ) => {

                // Если промис разрешается УСПЕШНО, этот обработчик получит РЕЗУЛЬТАТ, который надо передать в
                // функцию-коллбэк onFulfill, поступившую извне
                const onFullfillHandler = (result?: T): void => {
                    const fulfilledResult = onFulfill(result);
                    nextResolve(fulfilledResult);
                }

                // Если промис разрешается НЕУСПЕШНО, этот обработчик получит ПРИЧИНУ,
                //  которую надо передать в функцию-коллбэк onReject, поступившую извне
                const onRejectHander = (reason?: any): void => {
                    // Полученная причина передается в функцию-коллбэк onReject
                    const rejectedResult = onReject(reason);
                    // Затем новый промис РЕЗОЛВИТСЯ с результатом ТЕКУШЕГО
                    nextResolve(rejectedResult);
                }

                if (this.PromiseState === STATES.FULFILLED) {
                    // если промис уже зарезолвен, тогда НОВЫЙ промис просто РЕЗОЛВИМ с текущим готовым результатом
                    // можно вызвать onFullfillHandler с текущим результатом, но так просто понятней
                    // и все это на следующий тик
                    setTimeout(() => nextResolve(onFulfill(this.PromiseResult as NonNull<T>)), 0);
                }

                if (this.PromiseState === STATES.REJECTED) {
                    // если промис уже зареджектен, тогда новый промис РЕЗОЛВИТСЯ с текущим результатом (причиной)
                    // пропущенным через обработчик ошибки (onRejectedHandler). Причина считается ОБРАБОТАННОЙ
                    // и все это на следующий тик
                    setTimeout(() => nextResolve(onReject(this.PromiseResult as NonNull<T>)), 0);
                }

                // в ТЕКУЩИЙ промис добавляем новый обработчик на успешное выполнение
                this.PromiseFulfillReactions.push(onFullfillHandler);
                // в ТЕКУЩИЙ промис добавляем новый обработчик на неуспешное выполнение
                this.PromiseRejectReactions.push(onRejectHander);

                // Основная суть в том, что промис - конечный автомат, а значит,
                // будет исполнена либо цепочка then от текущего промиса, либо цепочка catch от текущего промиса
            });
    }
}

// const test = async () => {
//     const firstFulfillMessage = 'First Fulfilled';
//     const secondFulfillMessage = 'Second Fulfilled';

//     const resolveMessage = 'Resolved';

//     const messages: string[] = [];
//     const messages2: string[] = [];

//     const resolvedPromise = new CustomPromise<string>((resolve) => {
//         resolve(resolveMessage);
//     });

//     console.log('step 1');
//     console.log(messages);
//     console.log(messages2);

//     // eslint-disable-next-line jest/valid-expect-in-promise
//     const modifiedPromise = resolvedPromise
//         .then((message?: string): void => {
//             if (message) {
//                 messages.push(message);
//             }
//             messages.push(firstFulfillMessage);
//         });

//     const modifiedPromise2 = resolvedPromise
//         .then((message?: string): void => {
//             if (message) {
//                 messages.push(message);
//             }
//             messages2.push(secondFulfillMessage);
//         });

//     console.log('step 2');
//     console.log(messages);
//     console.log(messages2);

//     await modifiedPromise
//         .then(() => {
//             messages.push('I am last');
//         });

//     await modifiedPromise2
//         .then(() => {
//             messages2.push('I am last for second');
//         });

//     console.log('step 3');
//     console.log(messages);
//     console.log(messages2);
// };

// const rejectTest = async () => {
//     const resolveMessage = 'Resolved';
//     const rejectMessage = 'Ooops!';

//     const rejectedPromise = new CustomPromise<string>((resolve, reject) => {
//         reject(rejectMessage);
//         resolve(resolveMessage);
//     });

//     await rejectedPromise.then(
//         (value?: string) => {
//             console.log('I should have never been called');
//         },
//         (err: any) => {
//             console.error(err);
//         });


// };

const test = async () => {
    const promise = new CustomPromise<string>((resolve) => {
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

test();

export { };