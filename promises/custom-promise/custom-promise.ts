
/**
 * Упрощенная реализая промисов - для лучшего понимания, как они работают "под капотом".
 * 
 * Promise - это конечный автомат, который может принимать одно из состояний:
 *  PENDING - состояние "ожидание результата"
 *  FULFILLED - состояние "завершился успешно"
 *  REJECTED - состояние "завершился с ошибкой"
 * 
 * Состояния FULFILLED и REJECTED - конечные.
 * 
 * Всего возможно 2 перехода в конечное состояние:
 *  PENDING -> FULFILLED
 *  PENDING -> REJECTED
 */
enum STATES {
    PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED',
};

// Счетчик для отладки
let counter = 1;

type NonNull<T> = T extends null ? never : T;

type FulfilledHandler<T> = (value?: any) => T | undefined;
type RejectHandler<T> = (reason?: any) => T | undefined;

type ResolveFunction<T> = (value?: T) => void;
type RejectFunction<T> = (reason?: any) => void;

// Обработчик по умолчанию просто возвращает тот же самый результат
const defaultHandler = <T>(x?: T): T | undefined => x;

class CustomPromise<T = any> {
    id: number;
    PromiseState: STATES;
    PromiseResult: T | undefined | null | Error;

    PromiseFulfillReactions: ResolveFunction<T>[];
    PromiseRejectReactions: RejectFunction<T>[];

    constructor(executor: (resolve: ResolveFunction<T>, reject: RejectFunction<T>) => void) {
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

    /**
     * Обработчик then принимает 2 функции, первая - для успешного выполнения промиса, возвращает результат типа TResult1
     * вторая - для обработки отклонения промиса, возвращает результат TResult2
     */
    then<TResult1 = T, TResult2 = never>(onFulfill: FulfilledHandler<TResult1> = defaultHandler, onReject: RejectHandler<TResult2> = defaultHandler): CustomPromise<TResult1 | TResult2> {
        // Результатом выполнения будет новый промис ТИПА ПОЛУЧЕННОГО РЕЗУЛЬТАТА, связанный с текущим
        // Связь выражается в том, что новый промис проверяет СОСТОЯНИЕ текущего промиса и берет из него РЕЗУЛЬТАТ
        return new CustomPromise<TResult1 | TResult2>((nextResolve: ResolveFunction<TResult1 | TResult2>) => {

            // Если промис разрешается УСПЕШНО, этот обработчик получит РЕЗУЛЬТАТ, который надо передать в
            // функцию-коллбэк onFulfill, поступившую извне
            const onFullfillHandler = (result?: T): void => {
                const fulfilledResult = onFulfill(result);
                nextResolve(fulfilledResult);
            }

            // Если промис разрешается НЕУСПЕШНО, этот обработчик получит ПРИЧИНУ,
            //  которую надо передать в функцию-коллбэк onReject, поступившую извне
            const onRejectHander = (reason: any): void => {
                // Полученная причина передается в функцию-коллбэк onReject
                const rejectedResult = onReject(reason);
                // Затем новый промис РЕЗОЛВИТСЯ с результатом ТЕКУЩЕГО (для простоты)
                nextResolve(rejectedResult);
            }

            if (this.PromiseState === STATES.FULFILLED) {
                // Если промис уже зарезолвлен, тогда в resolve нового промиса просто поступает
                // значение текущего, обработанное обработчиком onFulfill
                setTimeout(() => nextResolve(onFulfill(this.PromiseResult as NonNull<T>)), 0);
                return;
            }

            if (this.PromiseState === STATES.REJECTED) {
                // если промис уже зареджектен, тогда новый промис РЕЗОЛВИТСЯ с текущим результатом (причиной)
                // пропущенным через обработчик ошибки (onRejectedHandler). Причина считается ОБРАБОТАННОЙ
                // и все это на следующий тик
                setTimeout(() => nextResolve(onReject(this.PromiseResult as NonNull<T>)), 0);
                return;
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

export { CustomPromise };
